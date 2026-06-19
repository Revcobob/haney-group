import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export type SeoRow = {
  id: string;
  entity_type: "page" | "article" | "path" | "global";
  entity_id: string | null;
  path: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_id: string | null;
  canonical_path: string | null;
  noindex: boolean;
  created_at: string;
  updated_at: string;
};

export async function listSeoRows(): Promise<SeoRow[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_seo")
    .select("*")
    .order("entity_type", { ascending: true })
    .order("path", { ascending: true, nullsFirst: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SeoRow[];
}

export async function getGlobalSeoRow(): Promise<SeoRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_seo")
    .select("*")
    .eq("entity_type", "global")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as SeoRow | null) ?? null;
}

export async function getPathSeoRow(path: string): Promise<SeoRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_seo")
    .select("*")
    .eq("entity_type", "path")
    .eq("path", path)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as SeoRow | null) ?? null;
}
