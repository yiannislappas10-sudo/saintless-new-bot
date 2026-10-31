import { contextFor, dbRequest, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, sessionId, sessionDescription, tracks } = body || {};
    if (!validId(classId) || typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) {
      throw new ClassroomError("Invalid classroom session.");
    }
    if (sessionDescription?.type !== "offer" || typeof sessionDescription?.sdp !== "string" || sessionDescription.sdp.length > 100000) {
      throw new ClassroomError("A valid media offer is required.");
    }
    if (!Array.isArray(tracks) || tracks.length < 1 || tracks.length > 3) throw new ClassroomError("Choose a valid audio, camera or screen track.");
    const cleanTracks = tracks.map(track => {
      if (track?.location !== "local" || !["audio","video","screen"].includes(track.trackName) ||
          typeof track.mid !== "string" || !/^\d{1,3}$/.test(track.mid)) {
        throw new ClassroomError("Invalid media track.");
      }
      return { location:"local", mid:track.mid, trackName:track.trackName };
    });
    if (new Set(cleanTracks.map(t => t.trackName)).size !== cleanTracks.length) throw new ClassroomError("Duplicate media track.");

    const participant = await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId)+"&status=in.(joining,active)&select=session_id&limit=1");
    if (!participant?.length) throw new ClassroomError("This classroom session is not authorized.", 403);

    const result = await sfuRequest(ctx, "/sessions/"+encodeURIComponent(sessionId)+"/tracks/new", "POST", {
      sessionDescription, tracks:cleanTracks
    });
    const responseTracks = result?.tracks || [];
    if (responseTracks.length !== cleanTracks.length || responseTracks.some(track => track?.errorCode || track?.errorDescription)) {
      throw new ClassroomError("The media service could not publish every selected track.", 502);
    }

    await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId),
      "PATCH", { status:"active", last_seen_at:new Date().toISOString() }, "return=minimal");
    const publications = cleanTracks.map(track => ({
      class_id:classId, user_id:ctx.user.id, session_id:sessionId, track_name:track.trackName
    }));
    await dbRequest(ctx,
      "class_room_publications?on_conflict=class_id,user_id,track_name",
      "POST", publications, "resolution=merge-duplicates,return=minimal");
    return response({
      sessionDescription:result.sessionDescription,
      tracks:responseTracks,
      requiresImmediateRenegotiation:!!result.requiresImmediateRenegotiation
    });
  } catch (error) {
    return fail(error);
  }
}
