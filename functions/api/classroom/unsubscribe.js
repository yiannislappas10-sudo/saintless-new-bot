import { contextFor, dbRequest, sfuRequest, response, fail, validId, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx=await contextFor(request,env);
    let body;
    try{body=await request.json();}catch{throw new ClassroomError("Invalid request body.");}
    const {classId,publisherId}=body||{};
    if(!validId(classId)||!validId(publisherId)||publisherId===ctx.user.id)throw new ClassroomError("Invalid participant.");
    const rows=await dbRequest(ctx,
      "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&publisher_id=eq."+publisherId+"&status=eq.active&select=session_id&limit=1");
    if(!rows?.length)return response({unsubscribed:true,alreadyClosed:true});
    const sessionId=rows[0].session_id;
    const warnings=[];
    try{
      const inspected=await sfuRequest(ctx,"/sessions/"+encodeURIComponent(sessionId),"GET");
      const tracks=(inspected?.tracks||[]).filter(track=>typeof track?.mid==="string"&&track.status!=="inactive");
      if(tracks.length){
        const closed=await sfuRequest(ctx,"/sessions/"+encodeURIComponent(sessionId)+"/tracks/close","PUT",{
          tracks:tracks.map(track=>({mid:track.mid})),force:true
        });
        for(const track of closed?.tracks||[])if(track?.errorCode&&track.errorCode!=="close_track_error")warnings.push(track.errorDescription||track.errorCode);
      }
    }catch(error){warnings.push(error.message||"Could not close the receiving media session.");}
    await dbRequest(ctx,
      "class_room_subscriptions?class_id=eq."+classId+"&subscriber_id=eq."+ctx.user.id+"&publisher_id=eq."+publisherId+"&status=eq.active",
      "PATCH",{status:"ended"},"return=minimal");
    return response({unsubscribed:warnings.length===0,cleanupWarnings:warnings});
  }catch(error){return fail(error);}
}
