import { contextFor, dbRequest, dbRpc, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, targetUserId } = body || {};
    const target = targetUserId || ctx.user.id;
    if (!validId(classId) || !validId(target)) throw new ClassroomError("Choose a valid classroom participant.");

    const member = await dbRpc(ctx, "is_echo_class_member", { target_class_id: classId });
    if (member !== true) throw new ClassroomError("You do not have access to this class.", 403);
    if (target !== ctx.user.id) {
      const teacher = await dbRpc(ctx, "is_echo_professor", {});
      if (teacher !== true) throw new ClassroomError("Only the professor can stop another participant's screen share.", 403);
    }

    const publications = await dbRequest(ctx,
      "class_room_publications?class_id=eq."+classId+"&user_id=eq."+target+"&track_name=eq.screen&select=session_id&limit=1");
    if (!publications?.length) return response({ stopped:false, alreadyStopped:true });

    const sessionId = publications[0].session_id;
    const inspected = await sfuRequest(ctx, "/sessions/"+encodeURIComponent(sessionId), "GET");
    const screen = (inspected?.tracks || []).find(track =>
      (track.trackName === "screen" || track.track_name === "screen") &&
      typeof track.mid === "string" && track.status !== "inactive"
    );
    if (screen) {
      await sfuRequest(ctx,
        "/sessions/"+encodeURIComponent(sessionId)+"/tracks/close",
        "PUT",
        { tracks:[{mid:screen.mid}], force:true }
      );
    }

    await dbRequest(ctx,
      "class_room_publications?class_id=eq."+classId+"&user_id=eq."+target+"&track_name=eq.screen",
      "DELETE", undefined, "return=minimal");
    return response({ stopped:true, targetUserId:target });
  } catch (error) {
    return fail(error);
  }
}