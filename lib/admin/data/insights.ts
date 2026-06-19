import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export type AdminArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  article_label: string | null;
  summary: string | null;
  lede: string | null;
  body_html: string | null;
  featured_image_id: string | null;
  author: string | null;
  date_label: string | null;
  read_time_minutes: number | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function listAdminArticles(): Promise<AdminArticleRow[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_articles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminArticleRow[];
}

export async function getAdminArticle(
  id: string
): Promise<AdminArticleRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as AdminArticleRow | null) ?? null;
}
