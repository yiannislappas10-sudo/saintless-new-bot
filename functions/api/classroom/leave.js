import { contextFor, dbRequest, dbRpc, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

async function closeSession(ctx, sessionId) {
  if (typeof sessionId !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)) return [];
  const warnings=[];
  try {
    const inspected=await sfuRequest(ctx,"/sessions/"+encodeURIComponent(sessionId),"GET");
    const activeTracks=(inspected?.tracks||[]).filter(track=>typeof track?.mid==="string"&&track.status!=="inactive");
    if(activeTracks.length){
      const closed=await sfuRequest(ctx,"/sessions/"+encodeURIComponent(sessionId)+"/tracks/close","PUT",{
        tracks:activeTracks.map(track=>({mid:track.mid})),force:true
      });
      for(const track of closed?.tracks||[]){
        if(track?.errorCode&&track.errorCode!=="close_track_error")warnings.push(track.errorDescription||track.errorCode);
      }
    }
  }catch(error){warnings.push(error.message||"Could not close a media session.");}
  return warnings;
}

export async function onRequestPost({ request, env }) {
  const cleanupWarnings=[];
  try {
    const ctx=await contextFor(request,env);
    let body;
    try{body=await request.json();}catch{throw new ClassroomError("Invalid request body.");}
    const {classId,sessionId,attendanceId}=body||{};
    if(!validId(classId)||typeof sessionId!=="string"||!/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)){
      throw new ClassroomError("Invalid classroom session.");
    }
    const participant=await dbRequest(ctx,
      "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId)+"&select=session_id&limit=1");
    if(!participant?.length)throw new ClassroomError("This classroom session is not authorized.",403);

    cleanupWarnings.push(...await closeSession(ctx,sessionId));
    const subscriptions=await dbRequest(ctx,
      "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&status=eq.active&select=session_id");
    for(const subscription of subscriptions||[])cleanupWarnings.push(...await closeSession(ctx,subscription.session_id));

    const operations=[
      ()=>dbRequest(ctx,
        "class_room_participants?class_id=eq."+classId+"&user_id=eq."+ctx.user.id+"&session_id=eq."+encodeURIComponent(sessionId),
        "PATCH",{status:"left",left_at:new Date().toISOString()},"return=minimal"),
      ()=>dbRequest(ctx,
        "class_room_publications?class_id=eq."+classId+"&user_id=eq."+ctx.user.id,
        "DELETE",undefined,"return=minimal"),
      ()=>dbRequest(ctx,
        "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&status=eq.active",
        "PATCH",{status:"ended"},"return=minimal")
    ];
    for(const operation of operations){
      try{await operation();}catch(error){cleanupWarnings.push(error.message||"Database cleanup failed.");}
    }
    if(validId(attendanceId)){
      try{await dbRpc(ctx,"leave_echo_class",{target_attendance_id:attendanceId});}
      catch(error){cleanupWarnings.push(error.message||"Attendance could not be closed.");}
    }
    return response({left:cleanupWarnings.length===0,cleanupWarnings});
  }catch(error){return fail(error);}
}
