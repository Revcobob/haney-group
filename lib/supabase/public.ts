import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, supabasePublicConfigured } from "@/lib/env";

// Anon Supabase client. Safe to use in server components for read-only
// queries against RLS-protected tables. Returns null when Supabase is not
// configured so callers can fall back to static content.

let cached: SupabaseClient | null | undefined;

export function publicSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  if (!supabasePublicConfigured || !env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    cached = null;
    return null;
  }
  cached = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
