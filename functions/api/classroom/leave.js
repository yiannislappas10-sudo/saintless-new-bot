import { contextFor, dbRequest, dbRpc, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  const cleanupErrors=[];
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, sessionId, attendanceId } = body || {};
    if (!validId(classId) || typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) throw new ClassroomError("Invalid classroom session.");
    const participant=await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId)+"&select=session_id&limit=1");
    if (!participant?.length) throw new ClassroomError("This classroom session is not authorized.",403);
    try {
      await dbRequest(ctx,
        "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId),
        "PATCH",{status:"left",left_at:new Date().toISOString()},"return=minimal");
    } catch(e) { cleanupErrors.push(e.message); }
    try {
      await dbRequest(ctx,
        "class_room_publications?class_id=eq."+classId+"&user_id=eq."+ctx.user.id,
        "DELETE",undefined,"return=minimal");
    } catch(e) { cleanupErrors.push(e.message); }
    try {
      await dbRequest(ctx,
        "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&status=eq.active",
        "PATCH",{status:"ended"},"return=minimal");
    } catch(e) { cleanupErrors.push(e.message); }
    if (validId(attendanceId)) {
      try { await dbRpc(ctx,"leave_echo_class",{target_attendance_id:attendanceId}); }
      catch(e) { cleanupErrors.push(e.message); }
    }
    return response({left:cleanupErrors.length===0,cleanupWarnings:cleanupErrors});
  } catch (error) {
    return fail(error);
  }
}
