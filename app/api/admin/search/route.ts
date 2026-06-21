import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { pageFallbacks } from "@/content/fallbacks/pages";

export const dynamic = "force-dynamic";

// Flat searchable index for the Cmd-K palette. Static admin destinations
// + every CMS row that has a recognizable title, with a hint string
// describing what bucket the result came from so the palette can group
// them.

type Hit = {
  id: string;
  title: string;
  hint: string;
  href: string;
};

const STATIC_DESTINATIONS: Hit[] = [
  { id: "nav-dashboard",   title: "Dashboard",           hint: "Admin",   href: "/admin/dashboard" },
  { id: "nav-pages",       title: "Pages",               hint: "Admin",   href: "/admin/pages" },
  { id: "nav-insights",    title: "Insights",            hint: "Admin",   href: "/admin/insights" },
  { id: "nav-media",       title: "Media Library",       hint: "Admin",   href: "/admin/media" },
  { id: "nav-inquiries",   title: "Inquiries",           hint: "Admin",   href: "/admin/inquiries" },
  { id: "nav-seo",         title: "SEO",                 hint: "Admin",   href: "/admin/seo" },
  { id: "nav-services",    title: "Services manager",    hint: "Admin",   href: "/admin/services" },
  { id: "nav-industries",  title: "Industries manager",  hint: "Admin",   href: "/admin/industries" },
  { id: "nav-experience",  title: "Experience manager",  hint: "Admin",   href: "/admin/experience" },
  { id: "nav-clients",     title: "Client Logos",        hint: "Admin",   href: "/admin/clients" },
  { id: "nav-navigation",  title: "Navigation",          hint: "Admin",   href: "/admin/navigation" },
  { id: "nav-settings",    title: "Site Settings",       hint: "Admin",   href: "/admin/settings" },
  { id: "nav-health",      title: "Site Health",         hint: "Admin",   href: "/admin/health" },
];

export async function GET() {
  const admin = await requireAdmin();
  const hits: Hit[] = [...STATIC_DESTINATIONS];

  // Public pages (from the fallback) + their sections.
  for (const page of pageFallbacks) {
    hits.push({
      id: `page-${page.slug}`,
      title: page.title,
      hint: `Edit page · ${page.slug}`,
      href: `/admin/pages/${page.slug}`,
    });
    hits.push({
      id: `page-vis-${page.slug}`,
      title: `${page.title} — Visual editor`,
      hint: `Visual edit · ${page.slug}`,
      href: `/admin/pages/${page.slug}/visual`,
    });
    for (const s of page.sections) {
      hits.push({
        id: `section-${page.slug}-${s.section_key}`,
        title: `${page.title} → ${s.section_label}`,
        hint: `Section · ${s.section_type}`,
        href: `/admin/pages/${page.slug}?section=${s.section_key}`,
      });
    }
  }

  // Filter admin-only destinations out of the editor view; an editor
  // shouldn't see Site Settings / Navigation in their picker.
  let filtered = hits;
  if (admin.role !== "admin") {
    const editorBlocked = new Set([
      "nav-settings",
      "nav-navigation",
    ]);
    filtered = filtered.filter((h) => !editorBlocked.has(h.id));
  }

  if (supabaseServerConfigured) {
    const sb = serverSupabase();
    const tables: Array<{
      table: string;
      titleField: string;
      hint: string;
      hrefBase: string;
    }> = [
      { table: "cms_services",         titleField: "title",       hint: "Service",         hrefBase: "/admin/services/" },
      { table: "cms_industries",       titleField: "title",       hint: "Industry",        hrefBase: "/admin/industries/" },
      { table: "cms_experience_items", titleField: "title",       hint: "Engagement",      hrefBase: "/admin/experience/" },
      { table: "cms_client_logos",     titleField: "client_name", hint: "Client logo",     hrefBase: "/admin/clients/" },
      { table: "cms_articles",         titleField: "title",       hint: "Article",         hrefBase: "/admin/insights/" },
    ];
    for (const t of tables) {
      try {
        const { data } = await sb
          .from(t.table)
          .select(`id, ${t.titleField}`);
        const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
        for (const r of rows) {
          const id = r.id as string;
          const title = (r[t.titleField] as string) ?? "(untitled)";
          filtered.push({
            id: `${t.table}-${id}`,
            title,
            hint: t.hint,
            href: `${t.hrefBase}${id}`,
          });
        }
      } catch {
        // Skip tables that aren't available in this environment.
      }
    }
  }

  return NextResponse.json({ items: filtered });
}
