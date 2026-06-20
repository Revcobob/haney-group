import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

// Read-only health checks for the admin Health page. Each check returns
// a list of issues with a severity, message, and optional link the
// admin can follow to fix the row. All checks are best-effort — if a
// query fails we silently emit nothing from that check rather than
// blowing up the page.

export type Severity = "info" | "warn" | "error";

export type HealthIssue = {
  id: string;
  severity: Severity;
  category: string;
  message: string;
  fixHref?: string;
};

async function safeData<T>(p: PromiseLike<{ data: T | null }>, fb: T): Promise<T> {
  try {
    const { data } = await p;
    return (data ?? fb) as T;
  } catch {
    return fb;
  }
}

// Media rows that have no alt text. Flagged warn — alt text is required
// for accessibility but the row itself still works.
async function checkMediaAlt(): Promise<HealthIssue[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const rows = await safeData(
    sb
      .from("cms_media")
      .select("id, file_name")
      .or("alt_text.is.null,alt_text.eq.")
      .order("created_at", { ascending: false })
      .limit(100),
    [] as Array<{ id: string; file_name: string }>
  );
  return rows.map((m) => ({
    id: `media-alt-${m.id}`,
    severity: "warn" as const,
    category: "Accessibility",
    message: `${m.file_name} has no alt text.`,
    fixHref: `/admin/media/${m.id}`,
  }));
}

// Entity rows whose image foreign keys point at a cms_media id that
// no longer exists. Flagged error — the public site will render an
// empty <img> for these.
async function checkBrokenImageRef(
  table: string,
  fkColumn: string,
  fixPath: (id: string) => string,
  label: string
): Promise<HealthIssue[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const rows = (await safeData(
    sb.from(table).select(`id, title, ${fkColumn}`).not(fkColumn, "is", null),
    [] as unknown[]
  )) as Array<Record<string, unknown>>;
  if (rows.length === 0) return [];
  const ids = Array.from(
    new Set(
      rows
        .map((r) => r[fkColumn] as string | null)
        .filter((v): v is string => Boolean(v))
    )
  );
  if (ids.length === 0) return [];
  const present = await safeData(
    sb.from("cms_media").select("id").in("id", ids),
    [] as Array<{ id: string }>
  );
  const presentSet = new Set(present.map((p) => p.id));
  const issues: HealthIssue[] = [];
  for (const row of rows) {
    const ref = row[fkColumn] as string | null;
    if (!ref || presentSet.has(ref)) continue;
    issues.push({
      id: `${table}-${fkColumn}-${row.id as string}`,
      severity: "error",
      category: "Broken image link",
      message: `${label} "${(row.title as string) ?? "(untitled)"}" references a media row that no longer exists.`,
      fixHref: fixPath(row.id as string),
    });
  }
  return issues;
}

async function checkNavigationHrefs(): Promise<HealthIssue[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const rows = await safeData(
    sb.from("cms_navigation_items").select("id, label, href"),
    [] as Array<{ id: string; label: string; href: string }>
  );
  const issues: HealthIssue[] = [];
  for (const row of rows) {
    const href = (row.href ?? "").trim();
    if (!href) {
      issues.push({
        id: `nav-empty-${row.id}`,
        severity: "warn",
        category: "Navigation",
        message: `"${row.label}" has an empty link.`,
        fixHref: `/admin/navigation/${row.id}`,
      });
      continue;
    }
    const looksOk =
      href.startsWith("/") ||
      href.startsWith("#") ||
      /^https?:\/\//i.test(href) ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");
    if (!looksOk) {
      issues.push({
        id: `nav-bad-${row.id}`,
        severity: "error",
        category: "Navigation",
        message: `"${row.label}" link "${href}" is not a path, URL, mailto:, or tel: link.`,
        fixHref: `/admin/navigation/${row.id}`,
      });
    }
  }
  return issues;
}

async function checkEmptySections(): Promise<HealthIssue[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const rows = await safeData(
    sb
      .from("cms_page_sections")
      .select("id, section_key, section_label, section_type, content_json, page_id")
      .eq("is_visible", true),
    [] as Array<{
      id: string;
      section_key: string;
      section_label: string;
      section_type: string;
      content_json: Record<string, unknown> | null;
      page_id: string;
    }>
  );
  if (rows.length === 0) return [];
  const pageIds = Array.from(new Set(rows.map((s) => s.page_id)));
  const pageRows = await safeData(
    sb.from("cms_pages").select("id, slug").in("id", pageIds),
    [] as Array<{ id: string; slug: string }>
  );
  const slugByPage = new Map(pageRows.map((p) => [p.id, p.slug]));
  const issues: HealthIssue[] = [];
  for (const s of rows) {
    const c = (s.content_json ?? {}) as Record<string, unknown>;
    const headline = (c.headline as string) || (c.heading as string) || "";
    if (typeof headline !== "string" || headline.trim().length === 0) {
      const slug = slugByPage.get(s.page_id) ?? "";
      issues.push({
        id: `empty-${s.id}`,
        severity: "warn",
        category: "Empty section",
        message: `"${s.section_label}" (${s.section_type}) has no headline / heading.`,
        fixHref: slug
          ? `/admin/pages/${slug}?section=${s.section_key}`
          : undefined,
      });
    }
  }
  return issues;
}

export async function runHealthChecks(): Promise<HealthIssue[]> {
  const groups = await Promise.all([
    checkMediaAlt(),
    checkBrokenImageRef(
      "cms_services",
      "icon_media_id",
      (id) => `/admin/services/${id}`,
      "Service"
    ),
    checkBrokenImageRef(
      "cms_industries",
      "illustration_media_id",
      (id) => `/admin/industries/${id}`,
      "Industry"
    ),
    checkBrokenImageRef(
      "cms_experience_items",
      "image_media_id",
      (id) => `/admin/experience/${id}`,
      "Engagement"
    ),
    checkBrokenImageRef(
      "cms_client_logos",
      "logo_media_id",
      (id) => `/admin/clients/${id}`,
      "Client logo"
    ),
    checkBrokenImageRef(
      "cms_articles",
      "featured_image_id",
      (id) => `/admin/insights/${id}`,
      "Article"
    ),
    checkNavigationHrefs(),
    checkEmptySections(),
  ]);
  return groups.flat();
}
