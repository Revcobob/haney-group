import "server-only";
import type { Metadata } from "next";
import { publicSupabase } from "@/lib/supabase/public";
import { siteSettings } from "@/content/fallbacks/settings";

// Resolves SEO for a public route. Lookup order:
//   1. Path-specific row in cms_seo (entity_type='path', path=<path>)
//   2. Global row in cms_seo (entity_type='global')
//   3. Static fallback from /content/fallbacks/settings.ts
// Returns a Next.js Metadata object suitable for export from a route's
// generateMetadata().

export type SeoFallback = {
  title?: string;
  description?: string;
  ogImage?: string;
};

type SeoRow = {
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  canonical_path: string | null;
  noindex: boolean;
  cms_media: { public_url?: string } | null;
};

async function fetchRow(
  filters: { type: "path"; path: string } | { type: "global" }
): Promise<SeoRow | null> {
  const sb = publicSupabase();
  if (!sb) return null;
  let q = sb
    .from("cms_seo")
    .select(
      "meta_title, meta_description, og_title, og_description, canonical_path, noindex, cms_media:og_image_id(public_url)"
    );
  q = filters.type === "global"
    ? q.eq("entity_type", "global")
    : q.eq("entity_type", "path").eq("path", filters.path);
  const { data } = await q.maybeSingle();
  return (data as unknown as SeoRow | null) ?? null;
}

export async function resolveMetadata(opts: {
  path: string;
  fallback: SeoFallback;
}): Promise<Metadata> {
  const [pathRow, globalRow] = await Promise.all([
    fetchRow({ type: "path", path: opts.path }),
    fetchRow({ type: "global" }),
  ]);

  const title =
    pathRow?.meta_title?.trim() ||
    globalRow?.meta_title?.trim() ||
    opts.fallback.title ||
    siteSettings.firm_name;

  const description =
    pathRow?.meta_description?.trim() ||
    globalRow?.meta_description?.trim() ||
    opts.fallback.description ||
    siteSettings.footer_description;

  const ogTitle =
    pathRow?.og_title?.trim() ||
    globalRow?.og_title?.trim() ||
    title;

  const ogDescription =
    pathRow?.og_description?.trim() ||
    globalRow?.og_description?.trim() ||
    description;

  const ogImage =
    pathRow?.cms_media?.public_url ||
    globalRow?.cms_media?.public_url ||
    opts.fallback.ogImage ||
    siteSettings.default_og_image;

  const canonical =
    pathRow?.canonical_path?.trim() ||
    globalRow?.canonical_path?.trim() ||
    opts.path;

  const noindex = Boolean(pathRow?.noindex);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
