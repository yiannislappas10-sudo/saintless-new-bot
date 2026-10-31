import { contextFor, dbRpc, sfuRequest, response, fail, ClassroomError } from "../../_utils/classroom.js";

export async function onRequestPost({ request, env }) {
  try {
    const ctx = await contextFor(request, env);
    const owner = await dbRpc(ctx, "is_echo_owner", {});
    if (owner !== true) throw new ClassroomError("Only the Primary Owner can run this service check.", 403);
    const created = await sfuRequest(ctx, "/sessions/new", "POST");
    const sessionId = created?.sessionId;
    if (typeof sessionId !== "string" || !sessionId) throw new ClassroomError("The SFU did not return a session identifier.", 502);
    const inspected = await sfuRequest(ctx, "/sessions/" + encodeURIComponent(sessionId), "GET");
    return response({
      configured:true,
      reachable:true,
      sessionCreated:true,
      sessionInspected:!!inspected,
      message:"Cloudflare Realtime SFU accepted a session and returned its status."
    });
  } catch (error) {
    return fail(error);
  }
}
