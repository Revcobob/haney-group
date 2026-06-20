import "server-only";
import { publicSupabase } from "@/lib/supabase/public";
import {
  pageFallbacks,
  getPageFallback,
  type PageFallback,
  type PageSectionFallback,
} from "@/content/fallbacks/pages";

export type PageSection = PageSectionFallback;
export type Page = PageFallback;

type DbPageRow = {
  id: string;
  slug: string;
  title: string;
  page_type: string;
};

type DbSectionRow = {
  section_key: string;
  section_label: string;
  section_type: string;
  content_json: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
};

// Resolve every URL inside a content_json shape that ends in "_id" by
// joining cms_media. This keeps the section type schemas simple (they
// only reference media IDs) while the public components consume URLs.
async function resolveImageUrls(content: Record<string, unknown>): Promise<Record<string, unknown>> {
  const sb = publicSupabase();
  if (!sb) return content;
  const ids = new Set<string>();

  const walk = (v: unknown) => {
    if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (v && typeof v === "object") {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (k.endsWith("_id") && typeof val === "string" && val.length > 0) ids.add(val);
        else walk(val);
      }
    }
  };
  walk(content);

  if (ids.size === 0) return content;
  const { data } = await sb
    .from("cms_media")
    .select("id, public_url, alt_text")
    .in("id", Array.from(ids));
  const lookup = new Map(
    (data ?? []).map((r) => [
      r.id as string,
      { url: r.public_url as string, alt: (r.alt_text as string | null) ?? "" },
    ])
  );

  const apply = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(apply);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        out[k] = apply(val);
        // For every key foo_id, populate foo_url (and foo_alt when present).
        if (k.endsWith("_id") && typeof val === "string" && lookup.has(val)) {
          const baseKey = k.slice(0, -3);
          const m = lookup.get(val)!;
          out[`${baseKey}_url`] = m.url;
          if (m.alt && !(baseKey + "_alt" in (v as Record<string, unknown>))) {
            out[`${baseKey}_alt`] = m.alt;
          }
        }
      }
      return out;
    }
    return v;
  };
  return apply(content) as Record<string, unknown>;
}

export async function getPageWithSections(slug: string): Promise<Page | null> {
  const sb = publicSupabase();
  const fallback = getPageFallback(slug) ?? null;
  if (!sb) return fallback;

  const { data: pageRow } = await sb
    .from("cms_pages")
    .select("id, slug, title, page_type")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!pageRow) return fallback;

  const { data: sectionRows } = await sb
    .from("cms_page_sections")
    .select(
      "section_key, section_label, section_type, content_json, display_order, is_visible"
    )
    .eq("page_id", (pageRow as DbPageRow).id)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (!sectionRows || sectionRows.length === 0) return fallback;

  const sections: PageSection[] = await Promise.all(
    (sectionRows as DbSectionRow[]).map(async (s) => ({
      section_key: s.section_key,
      section_label: s.section_label,
      section_type: s.section_type,
      content_json: await resolveImageUrls(s.content_json ?? {}),
      display_order: s.display_order,
    }))
  );
  return {
    slug: pageRow.slug,
    title: pageRow.title,
    page_type: pageRow.page_type,
    sections,
  };
}

// Convenience: get a single section's content_json by section_key.
export async function getPageSection(
  slug: string,
  sectionKey: string
): Promise<Record<string, unknown> | null> {
  const page = await getPageWithSections(slug);
  if (!page) return null;
  const s = page.sections.find((sec) => sec.section_key === sectionKey);
  return s?.content_json ?? null;
}

export function listPageSlugs(): string[] {
  return pageFallbacks.map((p) => p.slug);
}
