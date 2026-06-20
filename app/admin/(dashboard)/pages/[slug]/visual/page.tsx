import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageFallback } from "@/content/fallbacks/pages";
import {
  getOrCreatePageBySlug,
  listEditorSections,
} from "@/lib/admin/data/pages";
import { VisualEditorClient } from "@/components/admin/VisualEditorClient";
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
  let sections: Array<{ section_key: string; section_label: string; section_type: string }> = [];
  if (supabaseServerConfigured) {
    const page = await getOrCreatePageBySlug(slug);
    if (page) {
      const rows = await listEditorSections(page.id, slug);
      sections = rows.map((s) => ({
        section_key: s.section_key,
        section_label: s.section_label,
        section_type: s.section_type,
      }));
    }
  }
  if (sections.length === 0) {
    sections = fb.sections.map((s) => ({
      section_key: s.section_key,
      section_label: s.section_label,
      section_type: s.section_type,
    }));
  }

  return (
    <VisualEditorClient
      pageSlug={slug}
      sections={sections}
      previewSrc={`/preview${publicPath === "/" ? "/home" : publicPath}?edit=1`}
    />
  );
}
