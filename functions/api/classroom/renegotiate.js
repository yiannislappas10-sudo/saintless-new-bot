import { contextFor, dbRequest, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, sessionId, sessionDescription } = body || {};
    if (!validId(classId) || typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) throw new ClassroomError("Invalid receiving session.");
    if (sessionDescription?.type !== "answer" || typeof sessionDescription?.sdp !== "string" || sessionDescription.sdp.length > 100000) {
      throw new ClassroomError("A valid media answer is required.");
    }
    const rows = await dbRequest(ctx,
      "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId)+"&status=eq.active&select=session_id&limit=1");
    if (!rows?.length) throw new ClassroomError("This receiving session is not authorized.", 403);
    const result = await sfuRequest(ctx,
      "/sessions/"+encodeURIComponent(sessionId)+"/renegotiate", "PUT", {sessionDescription});
    return response({ accepted:true, result });
  } catch (error) {
    return fail(error);
  }
}
