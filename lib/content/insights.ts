// Single typed accessor for insight articles.
// Reads cms_articles from Supabase when configured; falls back to the
// static /content/fallbacks/insights.ts list when Supabase has no rows
// (or is not configured). The site never breaks regardless of DB state.

import "server-only";
import { publicSupabase } from "@/lib/supabase/public";
import {
  type InsightArticle,
  insightArticles as fallbackArticles,
  getArticleBySlug as getFallbackBySlug,
} from "@/content/fallbacks/insights";

export type { InsightArticle };

type DbArticleRow = {
  slug: string;
  title: string;
  category: string | null;
  article_label: string | null;
  summary: string | null;
  lede: string | null;
  body_html: string | null;
  author: string | null;
  date_label: string | null;
  read_time_minutes: number | null;
  cms_media: { public_url?: string } | null;
};

function mapDbRow(row: DbArticleRow): InsightArticle {
  const fb = fallbackArticles[0];
  return {
    slug: row.slug,
    title: row.title,
    lede: row.lede ?? "",
    summary: row.summary ?? "",
    category: row.category ?? "",
    article_label: row.article_label ?? (row.category ? `Article · ${row.category}` : "Article"),
    hero_image: row.cms_media?.public_url ?? fb.hero_image,
    author: row.author ?? "The Haney Group",
    date_label: row.date_label ?? "",
    read_time:
      row.read_time_minutes && row.read_time_minutes > 0
        ? `${row.read_time_minutes} min read`
        : "",
    body_html: row.body_html ?? "",
  };
}

export async function listPublishedArticles(): Promise<InsightArticle[]> {
  const sb = publicSupabase();
  if (!sb) return fallbackArticles;
  const { data } = await sb
    .from("cms_articles")
    .select(
      "slug, title, category, article_label, summary, lede, body_html, author, date_label, read_time_minutes, cms_media:featured_image_id(public_url)"
    )
    .eq("status", "published")
    .or(`scheduled_publish_at.is.null,scheduled_publish_at.lte.${new Date().toISOString()}`)
    .or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (!data || data.length === 0) return fallbackArticles;
  return (data as unknown as DbArticleRow[]).map(mapDbRow);
}

export async function getArticle(slug: string): Promise<InsightArticle | null> {
  const sb = publicSupabase();
  if (sb) {
    const { data } = await sb
      .from("cms_articles")
      .select(
        "slug, title, category, article_label, summary, lede, body_html, author, date_label, read_time_minutes, cms_media:featured_image_id(public_url)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .or(
        `scheduled_publish_at.is.null,scheduled_publish_at.lte.${new Date().toISOString()}`
      )
      .maybeSingle();
    if (data) return mapDbRow(data as unknown as DbArticleRow);
  }
  return getFallbackBySlug(slug) ?? null;
}

export async function listArticleSlugs(): Promise<string[]> {
  const sb = publicSupabase();
  if (sb) {
    const { data } = await sb
      .from("cms_articles")
      .select("slug")
      .eq("status", "published")
      .or(
        `scheduled_publish_at.is.null,scheduled_publish_at.lte.${new Date().toISOString()}`
      );
    if (data && data.length > 0) {
      return data.map((r) => r.slug as string);
    }
  }
  return fallbackArticles.map((a) => a.slug);
}
