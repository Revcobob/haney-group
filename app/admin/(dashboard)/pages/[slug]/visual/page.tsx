import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageFallback } from "@/content/fallbacks/pages";
import {
  getOrCreatePageBySlug,
  listEditorSections,
} from "@/lib/admin/data/pages";
import { getSectionType } from "@/lib/sections/types";
import {
  VisualEditorClient,
  type EditorSectionData,
} from "@/components/admin/VisualEditorClient";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Visual editor" };

const SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  experience: "/experience",
  industries: "/industries",
  insights: "/insights",
  contact: "/contact",
  privacy: "/privacy",
};

export default async function VisualEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fb = getPageFallback(slug);
  if (!fb) notFound();

  const publicPath = SLUG_TO_PATH[slug] ?? `/${slug}`;
  let pageId = "";
  let editorRows: EditorSectionData[] = [];

  if (supabaseServerConfigured) {
    const page = await getOrCreatePageBySlug(slug);
    if (page) {
      pageId = page.id;
      const rows = await listEditorSections(page.id, slug);
      editorRows = rows.map((s) => {
        const typeDef = getSectionType(s.section_type);
        // Editing always works against the draft when one exists, so
        // the form prefills with whatever's staged rather than the
        // last-published copy.
        const content = s.has_draft && s.draft_content_json
          ? s.draft_content_json
          : s.content_json;
        return {
          section_key: s.section_key,
          section_label: s.section_label,
          section_type: s.section_type,
          display_order: s.display_order,
          content_json: content,
          has_draft: s.has_draft,
          draft_updated_at: s.draft_updated_at,
          type_def: typeDef
            ? {
                type: typeDef.type,
                label: typeDef.label,
                description: typeDef.description,
                fields: typeDef.fields,
              }
            : null,
        };
      });
    }
  }
  if (editorRows.length === 0) {
    editorRows = fb.sections.map((s) => {
      const typeDef = getSectionType(s.section_type);
      return {
        section_key: s.section_key,
        section_label: s.section_label,
        section_type: s.section_type,
        display_order: s.display_order,
        content_json: s.content_json,
        has_draft: false,
        draft_updated_at: null,
        type_def: typeDef
          ? {
              type: typeDef.type,
              label: typeDef.label,
              description: typeDef.description,
              fields: typeDef.fields,
            }
          : null,
      };
    });
  }

  return (
    <VisualEditorClient
      pageId={pageId}
      pageSlug={slug}
      sections={editorRows}
      previewSrc={`/preview${publicPath === "/" ? "/home" : publicPath}?edit=1`}
    />
  );
}
