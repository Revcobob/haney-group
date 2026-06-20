import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { getPageFallback, type PageFallback } from "@/content/fallbacks/pages";

export type AdminPageRow = {
  id: string;
  slug: string;
  title: string;
  page_type: string;
  status: "draft" | "published";
  updated_at: string;
};

export type AdminSectionRow = {
  id: string;
  page_id: string;
  section_key: string;
  section_label: string;
  section_type: string;
  content_json: Record<string, unknown>;
  display_order: number;
  is_visible: boolean;
  updated_at: string;
};

export async function getOrCreatePageBySlug(slug: string): Promise<AdminPageRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data: existing } = await sb
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return existing as unknown as AdminPageRow;

  // Auto-create a page row from the fallback if available so the editor
  // has something to work with even before the seed runs.
  const fb = getPageFallback(slug);
  if (!fb) return null;
  const { data: created, error } = await sb
    .from("cms_pages")
    .insert({
      slug: fb.slug,
      title: fb.title,
      page_type: fb.page_type,
      status: "published",
    } as never)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return created as unknown as AdminPageRow;
}

export async function listAdminSections(pageId: string): Promise<AdminSectionRow[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminSectionRow[];
}

// Returns sections merged with fallback: any fallback section that doesn't
// exist in the DB yet is returned as a synthetic row (no id) so the editor
// can offer it. Persistence happens on first save.
export type EditorSection = AdminSectionRow & { isNew?: boolean };

export async function listEditorSections(
  pageId: string,
  slug: string
): Promise<EditorSection[]> {
  const persisted = await listAdminSections(pageId);
  const fb = getPageFallback(slug);
  if (!fb) return persisted as EditorSection[];

  const seen = new Set(persisted.map((s) => s.section_key));
  const synthetic: EditorSection[] = fb.sections
    .filter((s) => !seen.has(s.section_key))
    .map((s) => ({
      id: "",
      page_id: pageId,
      section_key: s.section_key,
      section_label: s.section_label,
      section_type: s.section_type,
      content_json: s.content_json,
      display_order: s.display_order,
      is_visible: true,
      updated_at: "",
      isNew: true,
    }));
  return [...persisted, ...synthetic].sort(
    (a, b) => a.display_order - b.display_order
  );
}

export async function getEditorSection(
  pageId: string,
  slug: string,
  sectionKey: string
): Promise<EditorSection | null> {
  const all = await listEditorSections(pageId, slug);
  return all.find((s) => s.section_key === sectionKey) ?? null;
}
