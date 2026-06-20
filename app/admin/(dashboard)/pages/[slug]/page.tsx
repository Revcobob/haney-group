import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPageFallback } from "@/content/fallbacks/pages";
import {
  getOrCreatePageBySlug,
  listEditorSections,
  getEditorSection,
} from "@/lib/admin/data/pages";
import { getSectionType } from "@/lib/sections/types";
import { SectionForm } from "@/components/admin/forms/SectionForm";
import { saveSectionAction } from "@/lib/admin/actions/sections";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Edit page" };

export default async function AdminPageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { slug } = await params;
  const { section: sectionKey } = await searchParams;

  const fb = getPageFallback(slug);
  if (!fb) notFound();

  // When Supabase isn't connected we still let the admin preview the section
  // list, but disable actual saves with a banner.
  let page = null as Awaited<ReturnType<typeof getOrCreatePageBySlug>>;
  let sections: Awaited<ReturnType<typeof listEditorSections>> = [];
  if (supabaseServerConfigured) {
    page = await getOrCreatePageBySlug(slug);
    if (page) sections = await listEditorSections(page.id, slug);
  } else {
    sections = fb.sections.map((s) => ({
      id: "",
      page_id: "",
      section_key: s.section_key,
      section_label: s.section_label,
      section_type: s.section_type,
      content_json: s.content_json,
      display_order: s.display_order,
      is_visible: true,
      updated_at: "",
      isNew: true,
    }));
  }

  const activeKey = sectionKey ?? sections[0]?.section_key;
  const active =
    page && activeKey
      ? await getEditorSection(page.id, slug, activeKey)
      : sections.find((s) => s.section_key === activeKey) ?? null;

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">
            <Link href="/admin/pages" style={{ color: "inherit" }}>
              ← All pages
            </Link>
          </p>
          <h1>{fb.title}</h1>
          <p>
            Section-by-section editor. Pick a section on the left, fill the
            form, save. Changes appear on the public site immediately.
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <Link
            href={slug === "home" ? "/" : `/${slug}`}
            target="_blank"
            className="adminbtn adminbtn--ghost"
          >
            View page ↗
          </Link>
          <Link
            href={`/admin/pages/${slug}/visual`}
            className="adminbtn adminbtn--primary"
          >
            Open visual editor
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              Saving is disabled. You can browse the section list and form
              layout below; once env vars are set, your first save will create
              the page row and persist the section.
            </p>
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "flex-start" }}>
        <aside className="admin__card" style={{ padding: 6 }}>
          <div className="admin__side-group" style={{ margin: 0 }}>
            <div className="admin__side-label">Sections</div>
            {sections.map((s) => {
              const isActive = s.section_key === activeKey;
              return (
                <Link
                  key={s.section_key}
                  href={`/admin/pages/${slug}?section=${s.section_key}`}
                  className={`admin__side-link${isActive ? " is-active" : ""}`}
                >
                  <span style={{ flex: 1 }}>{s.section_label}</span>
                  {s.isNew ? (
                    <span className="admintable__pill admintable__pill--draft" style={{ fontSize: 9 }}>
                      Default
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          {active ? (
            (() => {
              const typeDef = getSectionType(active.section_type);
              if (!typeDef) {
                return (
                  <div className="admin__notice admin__notice--warning">
                    <div>
                      <strong>Unknown section type:</strong>
                      <p>
                        <code>{active.section_type}</code> is not registered in{" "}
                        <code>lib/sections/types.ts</code>.
                      </p>
                    </div>
                  </div>
                );
              }
              const boundAction = saveSectionAction.bind(null, {
                pageId: page?.id ?? "",
                pageSlug: slug,
                sectionKey: active.section_key,
                sectionLabel: active.section_label,
                sectionType: active.section_type,
                displayOrder: active.display_order,
              });
              // Only pass serializable fields to the client form.
              // schema + empty() stay server-side.
              const clientTypeDef = {
                type: typeDef.type,
                label: typeDef.label,
                description: typeDef.description,
                fields: typeDef.fields,
              };
              return (
                <SectionForm
                  typeDef={clientTypeDef}
                  content={active.content_json}
                  action={boundAction}
                  cancelHref={`/admin/pages/${slug}`}
                />
              );
            })()
          ) : (
            <p style={{ color: "var(--text-3)" }}>Pick a section on the left.</p>
          )}
        </div>
      </div>
    </>
  );
}

// Defensive: support calling /admin/pages without a slug.
export function generateStaticParams() {
  return [] as Array<{ slug: string }>;
}

// Calling this satisfies an unused-import warning during refactors.
void redirect;
