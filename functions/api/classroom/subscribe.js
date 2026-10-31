import { contextFor, dbRequest, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, publisherId } = body || {};
    if (!validId(classId) || !validId(publisherId) || publisherId === ctx.user.id) throw new ClassroomError("Invalid classroom participant.");
    const member = await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&status=eq.active&select=user_id&limit=1");
    if (!member?.length) throw new ClassroomError("Join the classroom before receiving media.", 403);
    const publisher = await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+publisherId+"&status=eq.active&select=session_id&limit=1");
    if (!publisher?.length) throw new ClassroomError("This participant is no longer in the classroom.", 409);
    const pubSessionId = publisher[0].session_id;
    const publications = await dbRequest(ctx,
      "class_room_publications?class_id=eq."+classId+"&user_id=eq."+publisherId+"&select=track_name,session_id");
    if (!publications?.length) throw new ClassroomError("This participant has not published media yet.", 409);
    const tracks = publications.filter(p=>["audio","video","screen"].includes(p.track_name))
      .map(p=>({location:"remote",sessionId:p.session_id||pubSessionId,trackName:p.track_name}));
    if (!tracks.length) throw new ClassroomError("No media tracks are available.", 409);

    const created = await sfuRequest(ctx, "/sessions/new", "POST");
    const sessionId = created?.sessionId;
    if (typeof sessionId !== "string" || !sessionId) throw new ClassroomError("The media service did not create a receiving session.", 502);
    const result = await sfuRequest(ctx,
      "/sessions/"+encodeURIComponent(sessionId)+"/tracks/new", "POST", {tracks});
    const receivedTracks=result?.tracks||[];
    if (!result?.sessionDescription || result.sessionDescription.type !== "offer" ||
        receivedTracks.length !== tracks.length || receivedTracks.some(track=>track?.errorCode||track?.errorDescription)) {
      throw new ClassroomError(receivedTracks.find(track=>track?.errorDescription)?.errorDescription||
        "The media service did not return a usable receiving offer.", 502);
    }
    await dbRequest(ctx,
      "class_room_subscriptions?on_conflict=class_id,subscriber_id,publisher_id",
      "POST",
      { class_id:classId, subscriber_id:ctx.user.id, publisher_id:publisherId, session_id:sessionId, status:"active" },
      "resolution=merge-duplicates,return=minimal");
    return response({
      sessionId,
      publisherId,
      sessionDescription:result.sessionDescription,
      tracks:result.tracks || [],
      requiresImmediateRenegotiation:!!result.requiresImmediateRenegotiation
    });
  } catch (error) {
    return fail(error);
  }
}
