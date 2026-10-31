import { contextFor, dbRequest, dbRpc, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const classId = body?.classId;
    if (!validId(classId)) throw new ClassroomError("Choose a valid class.");

    const member = await dbRpc(ctx, "is_echo_class_member", { target_class_id: classId });
    if (member !== true) throw new ClassroomError("You do not have access to this class.", 403);
    const controls = await dbRequest(ctx,"class_room_controls?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&select=teacher_muted,teacher_camera_off,removed&limit=1");
    if(controls?.[0]?.removed)throw new ClassroomError("The teacher removed you from this meeting.",403);
    const teacherMuted=!!controls?.[0]?.teacher_muted;
    const teacherCameraOff=!!controls?.[0]?.teacher_camera_off;

    const rooms = await dbRequest(ctx, "class_live_rooms?class_id=eq." + classId + "&status=eq.live&select=id&limit=1");
    if (!rooms?.length) throw new ClassroomError("The professor has not started this class yet.", 409);

    const attendanceId = await dbRpc(ctx, "join_echo_class", { target_class_id: classId });
    if (typeof attendanceId !== "string") throw new ClassroomError("Attendance could not be recorded.", 502);

    const profile = await dbRequest(ctx, "profiles?id=eq." + ctx.user.id + "&select=display_name&limit=1");
    const displayName = profile?.[0]?.display_name || ctx.user.user_metadata?.full_name ||
      ctx.user.user_metadata?.name || (ctx.user.email || "ECHO student").split("@")[0];

    const created = await sfuRequest(ctx, "/sessions/new", "POST");
    const sessionId = created?.sessionId || created?.result?.sessionId;
    if (typeof sessionId !== "string" || !sessionId) throw new ClassroomError("The media service did not create a session.", 502);

    await dbRequest(
      ctx,
      "class_room_participants?on_conflict=class_id,user_id",
      "POST",
      {
        class_id: classId,
        user_id: ctx.user.id,
        session_id: sessionId,
        display_name: String(displayName).slice(0, 120),
        status: "joining",
        joined_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        left_at: null
      },
      "resolution=merge-duplicates,return=minimal"
    );

    return response({ sessionId, attendanceId, displayName, teacherMuted, teacherCameraOff });
  } catch (error) {
    return fail(error);
  }
}
