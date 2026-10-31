export async function onRequestGet({ env }) {
  return Response.json(
    {
      supabaseUrl: env.SUPABASE_URL || "",
      supabaseAnonKey: env.SUPABASE_ANON_KEY || "",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
