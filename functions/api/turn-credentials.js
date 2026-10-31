export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST", "Cache-Control": "no-store" },
    });
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return new Response("Forbidden", { status: 403 });
  }

  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return new Response("Authentication required", { status: 401 });
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY ||
      !env.TURN_KEY_ID || !env.TURN_KEY_API_TOKEN) {
    return new Response("Voice calling is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Verify the ECHO session with Supabase before issuing short-lived TURN credentials.
  let authResponse;
  try {
    authResponse = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        Authorization: authorization,
      },
    });
  } catch {
    return new Response("Authentication service unavailable", { status: 502 });
  }

  if (!authResponse.ok) {
    return new Response("Invalid ECHO session", { status: 401 });
  }

  // Keep the long-lived TURN key on the server; only the expiring ICE credentials
  // are returned to the signed-in browser.
  let turnResponse;
  try {
    turnResponse = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(env.TURN_KEY_ID)}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ttl: 14400 }),
      },
    );
  } catch {
    return new Response("Voice network service unavailable", { status: 502 });
  }

  if (!turnResponse.ok) {
    return new Response("Could not create voice connection credentials", {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const credentials = await turnResponse.json();
  if (!Array.isArray(credentials.iceServers) || credentials.iceServers.length === 0) {
    return new Response("Invalid voice connection credentials", { status: 502 });
  }

  return Response.json(
    { iceServers: credentials.iceServers },
    {
      headers: {
        "Cache-Control": "no-store, private",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
