import { contextFor, dbRequest, dbRpc, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

async function closeSession(ctx, sessionId) {
  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) return;
  const inspected = await sfuRequest(ctx, "/sessions/"+encodeURIComponent(sessionId), "GET");
  const tracks = (inspected?.tracks || []).filter(track =>
    typeof track.mid === "string" && track.status !== "inactive"
  );
  if (tracks.length) {
    await sfuRequest(ctx,
      "/sessions/"+encodeURIComponent(sessionId)+"/tracks/close",
      "PUT",
      { tracks:tracks.map(track=>({mid:track.mid})), force:true }
    );
  }
}

async function writeControl(ctx, classId, targetUserId, fields) {
  await dbRequest(ctx,
    "class_room_controls?on_conflict=class_id,user_id",
    "POST",
    { class_id:classId, user_id:targetUserId, ...fields, updated_by:ctx.user.id, updated_at:new Date().toISOString() },
    "resolution=merge-duplicates,return=minimal"
  );
}

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    let body;
    try { body = await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const { classId, targetUserId, action } = body || {};
    if (!validId(classId) || !validId(targetUserId)) throw new ClassroomError("Choose a valid participant.");
    if (!["mute","unmute","remove","lower-hand","readmit"].includes(action)) throw new ClassroomError("Unknown moderation action.");

    const teacher = await dbRpc(ctx, "is_echo_professor", {});
    if (teacher !== true) throw new ClassroomError("Only the professor can moderate this meeting.", 403);

    if (action === "readmit") {
      await writeControl(ctx, classId, targetUserId, { teacher_muted:false, removed:false });
      return response({ action, targetUserId, restored:true });
    }

    const participantRows = await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+targetUserId+"&select=session_id,status&limit=1");
    if (!participantRows?.length) throw new ClassroomError("This participant is not in the meeting.", 404);

    if (action === "lower-hand") {
      await dbRequest(ctx,
        "class_room_participants?class_id=eq."+classId+"&user_id=eq."+targetUserId,
        "PATCH", { hand_raised:false, hand_raised_at:null }, "return=minimal"
      );
      return response({ action, targetUserId, updated:true });
    }

    if (action === "mute" || action === "unmute") {
      if (participantRows[0].status !== "active") throw new ClassroomError("This participant is no longer active.", 409);
      await writeControl(ctx, classId, targetUserId, { teacher_muted:action === "mute" });
      return response({ action, targetUserId, teacherMuted:action === "mute" });
    }

    // Removing a participant is a meeting-only block. Their session is closed and
    // the removed flag prevents them from creating another media session.
    await writeControl(ctx, classId, targetUserId, { teacher_muted:true, removed:true });

    const [publications, subscriptions] = await Promise.all([
      dbRequest(ctx,
        "class_room_publications?class_id=eq."+classId+"&user_id=eq."+targetUserId+"&select=session_id"),
      dbRequest(ctx,
        "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+targetUserId+"&status=eq.active&select=session_id")
    ]);
    const sessions = new Set([
      participantRows[0].session_id,
      ...(publications || []).map(row=>row.session_id),
      ...(subscriptions || []).map(row=>row.session_id)
    ].filter(Boolean));
    const warnings = [];
    for (const sessionId of sessions) {
      try { await closeSession(ctx, sessionId); }
      catch (error) { warnings.push(error.message || "A media connection could not be closed."); }
    }

    await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+targetUserId,
      "PATCH", { status:"left", left_at:new Date().toISOString(), hand_raised:false, hand_raised_at:null }, "return=minimal"
    );
    await dbRequest(ctx,
      "class_room_publications?class_id=eq."+classId+"&user_id=eq."+targetUserId,
      "DELETE", undefined, "return=minimal"
    );
    await dbRequest(ctx,
      "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+targetUserId+"&status=eq.active",
      "PATCH", { status:"ended" }, "return=minimal"
    );
    await dbRequest(ctx,
      "class_attendance?class_id=eq."+classId+"&student_id=eq."+targetUserId+"&left_at=is.null",
      "PATCH", { left_at:new Date().toISOString() }, "return=minimal"
    );

    return response({ action, targetUserId, removed:true, cleanupWarnings:warnings });
  } catch (error) {
    return fail(error);
  }
}