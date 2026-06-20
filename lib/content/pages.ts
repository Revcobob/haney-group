import "server-only";
import { headers } from "next/headers";
import { publicSupabase } from "@/lib/supabase/public";
import {
  pageFallbacks,
  getPageFallback,
  type PageFallback,
  type PageSectionFallback,
} from "@/content/fallbacks/pages";

// /preview/* requests carry an x-preview-drafts header set by middleware.
// Public visitors never have it set, so this only flips on inside the
// visual editor iframe.
async function inPreviewContext(): Promise<boolean> {
  try {
    const h = await headers();
    return h.get("x-preview-drafts") === "1";
  } catch {
    return false;
  }
}

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
  draft_content_json: Record<string, unknown> | null;
  has_draft: boolean | null;
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

// Deep-merge: DB content takes priority where it has a real value; the
// fallback fills in any missing/blank field. Treats "", null, undefined,
// and empty arrays as "use fallback for this leaf".
function isBlank(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim().length === 0) return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function deepMergeWithFallback(
  primary: unknown,
  fallback: unknown
): unknown {
  if (isBlank(primary)) return fallback;
  if (Array.isArray(primary) && Array.isArray(fallback)) {
    // For arrays, prefer the primary length (admin's intent) but heal
    // any blank slot from the fallback at the same index when present.
    return primary.map((item, i) =>
      deepMergeWithFallback(item, fallback[i] ?? undefined)
    );
  }
  if (
    primary &&
    typeof primary === "object" &&
    fallback &&
    typeof fallback === "object" &&
    !Array.isArray(primary) &&
    !Array.isArray(fallback)
  ) {
    const a = primary as Record<string, unknown>;
    const b = fallback as Record<string, unknown>;
    const out: Record<string, unknown> = { ...b, ...a };
    for (const k of Object.keys(out)) {
      out[k] = deepMergeWithFallback(a[k], b[k]);
    }
    return out;
  }
  return primary;
}

export async function getPageWithSections(
  slug: string,
  opts?: { preferDraft?: boolean }
): Promise<Page | null> {
  const sb = publicSupabase();
  const fallback = getPageFallback(slug) ?? null;
  if (!sb) return fallback;

  // Auto-detect preview iframe via the middleware-set header so every
  // public page rendered via /preview/* sees its drafts without having
  // to be aware of preview at all.
  const preferDraft = opts?.preferDraft ?? (await inPreviewContext());

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
      "section_key, section_label, section_type, content_json, draft_content_json, has_draft, display_order, is_visible"
    )
    .eq("page_id", (pageRow as DbPageRow).id)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (!sectionRows || sectionRows.length === 0) return fallback;

  // Choose live or draft content per row. Draft preference is only
  // honored when explicitly requested (preview iframe), so public
  // visitors never see in-flight content.
  const pickContent = (row: DbSectionRow): Record<string, unknown> =>
    preferDraft && row.has_draft && row.draft_content_json
      ? row.draft_content_json
      : row.content_json;

  // Index fallback sections by key so per-section merging is O(1).
  const fallbackByKey = new Map(
    (fallback?.sections ?? []).map((s) => [s.section_key, s])
  );

  // Start with all fallback sections (in display order), so any section
  // missing from the DB still renders.
  const dbByKey = new Map(
    (sectionRows as DbSectionRow[]).map((s) => [s.section_key, s])
  );
  const merged: PageSection[] = [];

  // First, every fallback section — overlay the DB row if present.
  for (const fbSection of fallback?.sections ?? []) {
    const dbSection = dbByKey.get(fbSection.section_key);
    if (!dbSection) {
      merged.push(fbSection);
      continue;
    }
    const mergedContent = deepMergeWithFallback(
      pickContent(dbSection) ?? {},
      fbSection.content_json ?? {}
    ) as Record<string, unknown>;
    merged.push({
      section_key: dbSection.section_key,
      section_label: dbSection.section_label || fbSection.section_label,
      section_type: dbSection.section_type || fbSection.section_type,
      content_json: await resolveImageUrls(mergedContent),
      display_order: dbSection.display_order ?? fbSection.display_order,
    });
  }

  // Then any DB sections the admin added that aren't in the fallback.
  for (const dbSection of sectionRows as DbSectionRow[]) {
    const fb = fallbackByKey.get(dbSection.section_key);
    if (fb) continue; // already merged above
    merged.push({
      section_key: dbSection.section_key,
      section_label: dbSection.section_label,
      section_type: dbSection.section_type,
      content_json: await resolveImageUrls(pickContent(dbSection) ?? {}),
      display_order: dbSection.display_order,
    });
  }

  merged.sort((a, b) => a.display_order - b.display_order);

  return {
    slug: pageRow.slug,
    title: pageRow.title,
    page_type: pageRow.page_type,
    sections: merged,
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
