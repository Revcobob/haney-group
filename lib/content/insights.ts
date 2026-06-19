// Single typed accessor for insight articles.
// Phase 2: reads from /content/fallbacks/insights.ts.
// Phase 5: swap to read published rows from cms_articles in Supabase,
// falling back to the static list if Supabase is unreachable.

import {
  type InsightArticle,
  insightArticles,
  getArticleBySlug as getFallbackBySlug,
} from "@/content/fallbacks/insights";

export type { InsightArticle };

export async function listPublishedArticles(): Promise<InsightArticle[]> {
  return insightArticles;
}

export async function getArticle(slug: string): Promise<InsightArticle | null> {
  return getFallbackBySlug(slug) ?? null;
}

export async function listArticleSlugs(): Promise<string[]> {
  return insightArticles.map((a) => a.slug);
}
