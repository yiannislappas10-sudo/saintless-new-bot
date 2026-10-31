import { contextFor, dbRequest, dbRpc, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

async function closeSession(ctx, sessionId) {
  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) return [];
  const warnings=[];
  try {
    const inspected=await sfuRequest(ctx,"/sessions/"+encodeURIComponent(sessionId),"GET");
    const activeTracks=(inspected?.tracks||[]).filter(track=>
      typeof track?.mid==="string" && track.status!=="inactive"
    );
    if (activeTracks.length) {
      const closed=await sfuRequest(ctx,
        "/sessions/"+encodeURIComponent(sessionId)+"/tracks/close",
        "PUT",
        {tracks:activeTracks.map(track=>({mid:track.mid})),force:true}
      );
      for (const track of closed?.tracks||[]) {
        if (track?.errorCode && track.errorCode!=="close_track_error") {
          warnings.push(track.errorDescription||track.errorCode);
        }
      }
    }
  } catch(error) {
    warnings.push(error.message||"Could not close a media session.");
  }
  return warnings;
}

export async function onRequestPost({ request, env }) {
  try {
    const ctx=await contextFor(request,env);
    let body;
    try { body=await request.json(); } catch { throw new ClassroomError("Invalid request body."); }
    const classId=body?.classId;
    if(!validId(classId))throw new ClassroomError("Choose a valid class.");

    const [participants,subscriptions]=await Promise.all([
      dbRequest(ctx,"class_room_participants?class_id=eq."+classId+"&select=session_id"),
      dbRequest(ctx,"class_room_subscriptions?class_id=eq."+classId+"&status=eq.active&select=session_id")
    ]);
    const sessionIds=[...new Set([...(participants||[]).map(x=>x.session_id),...(subscriptions||[]).map(x=>x.session_id)].filter(Boolean))];
    const warnings=[];
    for(const sessionId of sessionIds)warnings.push(...await closeSession(ctx,sessionId));

    const ended=await dbRpc(ctx,"end_echo_classroom",{target_class_id:classId});
    return response({ended:true,mediaSessionsClosed:sessionIds.length,cleanupWarnings:warnings});
  } catch(error) {
    return fail(error);
  }
}
