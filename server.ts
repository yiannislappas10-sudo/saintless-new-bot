const indexFile = Bun.file(new URL("./index.html", import.meta.url));

const server = Bun.serve({
  port: Number(Bun.env.PORT || 3000),
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, app: "echo-lessons" });
    }

    if (url.pathname === "/config") {
      return Response.json(
        {
          supabaseUrl: Bun.env.SUPABASE_URL || "",
          supabaseAnonKey: Bun.env.SUPABASE_ANON_KEY || "",
        },
        {
          headers: {
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        },
      );
    }

    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    return new Response(request.method === "HEAD" ? null : indexFile, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  },
});

console.log(`ECHO is listening on port ${server.port}`);
