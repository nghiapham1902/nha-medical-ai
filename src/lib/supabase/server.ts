import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
export function publicClient() {
  const config = supabaseConfig();
  if (!config) return null;
  // Always anonymous: admin sessions cannot leak drafts into public pages.
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
export async function sessionClient() {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          /* Middleware refreshes cookies when Server Components cannot write. */
        }
      },
    },
  });
}
export async function adminSession() {
  const client = await sessionClient();
  if (!client) return { client: null, status: 503 as const };
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return { client: null, status: 401 as const };
  const { data: admin, error: roleError } = await client
    .from("catalog_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (roleError) return { client: null, status: 503 as const };
  if (!admin) return { client: null, status: 403 as const };
  return { client, status: 200 as const };
}
