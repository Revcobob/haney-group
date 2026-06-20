import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_media")
    .select("id, public_url, file_name, alt_text, mime_type, category")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
