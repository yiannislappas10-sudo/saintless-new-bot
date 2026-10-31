export class ClassroomError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export const response = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin"
  }
});
export async function contextFor(request, env) {
  if (request.method !== "POST") throw new ClassroomError("Method not allowed.", 405);
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) throw new ClassroomError("Forbidden.", 403);
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new ClassroomError("Sign in required.", 401);
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) throw new ClassroomError("Classroom database is not configured.", 503);
  const auth = await fetch(env.SUPABASE_URL + "/auth/v1/user", {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: authorization },
    cache: "no-store"
  });
  if (!auth.ok) throw new ClassroomError("Your sign-in session is invalid or expired.", 401);
  const user = await auth.json();
  if (!user?.id) throw new ClassroomError("Your sign-in session is invalid.", 401);
  return { env, user, token: authorization.slice(7) };
}
export async function dbRequest(ctx, path, method = "GET", body = undefined, prefer = undefined) {
  const headers = {
    apikey: ctx.env.SUPABASE_ANON_KEY,
    Authorization: "Bearer " + ctx.token,
    Accept: "application/json"
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;
  const result = await fetch(ctx.env.SUPABASE_URL + "/rest/v1/" + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store"
  });
  const text = await result.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!result.ok) {
    const message = data?.message || data?.hint || data?.details || "Database request failed.";
    throw new ClassroomError(message, result.status >= 500 ? 502 : result.status);
  }
  return data;
}
export async function dbRpc(ctx, name, params) {
  return dbRequest(ctx, "rpc/" + encodeURIComponent(name), "POST", params);
}
export async function sfuRequest(ctx, path, method = "POST", body = undefined) {
  const appId = ctx.env.REALTIME_SFU_APP_ID;
  const secret = ctx.env.REALTIME_SFU_BEARER_TOKEN;
  if (!appId || !secret) throw new ClassroomError("Live classroom service is not configured.", 503);
  const headers = { Authorization: "Bearer " + secret, Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let result;
  try {
    result = await fetch("https://rtc.live.cloudflare.com/v1/apps/" + encodeURIComponent(appId) + path, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store"
    });
  } catch {
    throw new ClassroomError("Could not reach the live classroom media service.", 502);
  }
  const text = await result.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!result.ok || data?.errorCode || data?.success === false) {
    const message = data?.errorDescription || data?.message || "The live classroom media service rejected the request.";
    throw new ClassroomError(message, result.status >= 500 ? 502 : 502);
  }
  return data;
}
export function validId(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
export function fail(error) {
  if (error instanceof ClassroomError) return response({ error: error.message }, error.status);
  return response({ error: "The classroom request could not be completed." }, 500);
}
