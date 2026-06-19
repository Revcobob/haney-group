import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, supabaseServerConfigured } from "@/lib/env";

// Service-role Supabase client. Bypasses RLS — use ONLY inside server code
// after requireAdmin() has authorized the caller, or in safely-scoped server
// actions / route handlers. Never import this from a client component.

let cached: SupabaseClient | null | undefined;

export function serverSupabase(): SupabaseClient {
  if (cached) return cached;
  if (
    !supabaseServerConfigured ||
    !env.SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Supabase server client requested before environment was configured. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }
  cached = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
