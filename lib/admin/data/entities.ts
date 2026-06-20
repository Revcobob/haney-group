import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

// Admin-side list/get helpers for the structured CMS tables.
// They return raw DB rows (including hidden / draft), unlike lib/content/site.ts
// which only returns visible/published rows for the public site.

export type AdminRow = Record<string, unknown> & { id: string };

export async function listAdminRows(
  table: string,
  orderColumn: string = "display_order"
): Promise<AdminRow[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const { data, error } = await sb
    .from(table)
    .select("*")
    .order(orderColumn, { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminRow[];
}

export async function getAdminRow(
  table: string,
  id: string
): Promise<AdminRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data, error } = await sb.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminRow | null) ?? null;
}
