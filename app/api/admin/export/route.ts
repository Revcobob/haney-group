import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

// JSON snapshot of every cms_ table. Used as a "download a backup
// before a big edit" / "move content between environments" tool.
// Storage objects (media files in Supabase Storage) are NOT included —
// you'd need to re-upload or back those up through Supabase directly.
const TABLES = [
  "cms_pages",
  "cms_page_sections",
  "cms_site_settings",
  "cms_services",
  "cms_industries",
  "cms_experience_items",
  "cms_client_logos",
  "cms_navigation_items",
  "cms_articles",
  "cms_media",
  "cms_seo_paths",
  "cms_contact_inquiries",
] as const;

export async function GET() {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return NextResponse.json(
      { error: "Supabase is not connected." },
      { status: 503 }
    );
  }
  const sb = serverSupabase();
  const snapshot: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
    schema_version: "0005",
  };
  for (const table of TABLES) {
    const { data, error } = await sb.from(table).select("*");
    if (error) {
      // Surface but don't abort — a missing table shouldn't kill the rest.
      snapshot[table] = { error: error.message };
      continue;
    }
    snapshot[table] = data ?? [];
  }
  const body = JSON.stringify(snapshot, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="haney-cms-snapshot-${stamp}.json"`,
    },
  });
}
