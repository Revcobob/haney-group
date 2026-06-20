"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  SectionForm,
  type SectionMeta,
} from "./forms/SectionForm";
import { SectionReorderList } from "./SectionReorderList";
import type { FieldConfig } from "@/lib/sections/types";
import {
  saveSectionAction,
  publishAllDraftsAction,
} from "@/lib/admin/actions/sections";

export type EditorSectionData = {
  section_key: string;
  section_label: string;
  section_type: string;
  display_order: number;
  content_json: Record<string, unknown>;
  has_draft: boolean;
  draft_updated_at: string | null;
  type_def: {
    type: string;
    label: string;
    description: string;
    fields: FieldConfig[];
  } | null; // null when section_type isn't registered
};

type EditMessage = { type: "edit-section"; sectionKey: string };
function isEditMessage(d: unknown): d is EditMessage {
  return (
    typeof d === "object" &&
    d !== null &&
    (d as { type?: string }).type === "edit-section" &&
    typeof (d as { sectionKey?: string }).sectionKey === "string"
  );
}

export function VisualEditorClient({
  pageId,
  pageSlug,
  sections,
  previewSrc,
}: {
  pageId: string;
  pageSlug: string;
  sections: EditorSectionData[];
  previewSrc: string;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(
    sections[0]?.section_key ?? null
  );
  const [collapsed, setCollapsed] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // bump to reload iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Add a body class so the (dashboard) layout can collapse its sidebar
  // for the duration of the visual editor view.
  useEffect(() => {
    document.body.classList.add("body--visual-editor");
    return () => {
      document.body.classList.remove("body--visual-editor");
    };
  }, []);

  // Receive click events from the preview iframe.
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (iframeRef.current?.contentWindow !== ev.source) return;
      if (isEditMessage(ev.data)) {
        setActiveKey(ev.data.sectionKey);
        // If the panel was hidden, open it on click.
        setCollapsed(false);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Highlight whatever's active over in the iframe.
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !activeKey) return;
    win.postMessage(
      { type: "highlight-section", sectionKey: activeKey },
      "*"
    );
  }, [activeKey, iframeKey]);

  const active = sections.find((s) => s.section_key === activeKey) ?? null;
  const draftCount = sections.filter((s) => s.has_draft).length;

  const reloadIframe = useCallback(() => {
    setIframeKey((k) => k + 1);
  }, []);

  return (
    <div className={`visualeditor${collapsed ? " visualeditor--collapsed" : ""}`}>
      <div className="visualeditor__frame">
        <iframe
          ref={iframeRef}
          key={iframeKey}
          src={previewSrc}
          title="Page preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      <aside className="visualeditor__panel" aria-label="Section editor">
        <div className="visualeditor__panel-head">
          <button
            type="button"
            className="adminbtn adminbtn--ghost adminbtn--small"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            title={collapsed ? "Open editor panel" : "Collapse editor panel"}
          >
            {collapsed ? "Open editor →" : "← Collapse"}
          </button>
          {!collapsed ? (
            <Link
              href="/admin/pages"
              className="adminbtn adminbtn--ghost adminbtn--small"
            >
              All pages
            </Link>
          ) : null}
        </div>

        {!collapsed ? (
          <div className="visualeditor__panel-body">
            <p className="visualeditor__hint" style={{ marginBottom: 14 }}>
              Click any region in the preview, or pick a section below. Edits
              save in place; the preview reloads on save.
            </p>

            <div className="adminfield" style={{ marginBottom: 12 }}>
              <label
                className="adminfield__label"
                htmlFor="visualeditor-section-select"
              >
                Section to edit
              </label>
              <select
                id="visualeditor-section-select"
                className="adminfield__select"
                value={activeKey ?? ""}
                onChange={(e) => setActiveKey(e.target.value || null)}
              >
                {sections.length === 0 ? (
                  <option value="">No sections yet</option>
                ) : null}
                {sections.map((s) => (
                  <option key={s.section_key} value={s.section_key}>
                    {s.section_label}
                    {s.has_draft ? " — draft" : ""}
                  </option>
                ))}
              </select>
            </div>

            {pageId && draftCount > 0 ? (
              <PublishAllDraftsButton
                pageId={pageId}
                pageSlug={pageSlug}
                count={draftCount}
                onPublished={reloadIframe}
              />
            ) : null}

            {pageId && sections.length > 1 ? (
              <details
                style={{ marginBottom: 18 }}
                open={reorderOpen}
                onToggle={(e) => setReorderOpen((e.target as HTMLDetailsElement).open)}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--text-2)",
                    padding: "6px 0",
                    userSelect: "none",
                  }}
                >
                  {reorderOpen ? "Hide" : "Reorder sections"}
                </summary>
                <div style={{ marginTop: 10 }}>
                  <SectionReorderList
                    pageId={pageId}
                    pageSlug={pageSlug}
                    items={sections.map((s) => ({
                      section_key: s.section_key,
                      section_label: s.section_label,
                    }))}
                    onReordered={reloadIframe}
                  />
                </div>
              </details>
            ) : null}

            <div>
              {!active ? (
                <p className="visualeditor__hint">
                  Pick a section to start editing.
                </p>
              ) : !active.type_def ? (
                <div className="admin__notice admin__notice--warning">
                  <div>
                    <strong>Unknown section type</strong>
                    <p>
                      <code>{active.section_type}</code> isn’t registered in{" "}
                      <code>lib/sections/types.ts</code>. Add it there to make
                      this section editable.
                    </p>
                  </div>
                </div>
              ) : (
                <SectionForm
                  key={active.section_key}
                  typeDef={active.type_def}
                  content={active.content_json}
                  action={saveSectionAction}
                  meta={{
                    pageId,
                    pageSlug,
                    sectionKey: active.section_key,
                    sectionLabel: active.section_label,
                    sectionType: active.section_type,
                    displayOrder: active.display_order,
                  }}
                  hasDraft={active.has_draft}
                  draftUpdatedAt={active.draft_updated_at}
                  onSaved={reloadIframe}
                  compact
                />
              )}
            </div>
          </div>
        ) : null}
      </aside>

      {collapsed ? (
        <button
          type="button"
          className="visualeditor__tab"
          onClick={() => setCollapsed(false)}
          aria-label="Open editor panel"
        >
          ◀ Edit
        </button>
      ) : null}
    </div>
  );
}

function PublishAllDraftsButton({
  pageId,
  pageSlug,
  count,
  onPublished,
}: {
  pageId: string;
  pageSlug: string;
  count: number;
  onPublished?: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  function publish() {
    if (
      !window.confirm(
        `Publish ${count} pending draft${count === 1 ? "" : "s"} on this page?`
      )
    ) {
      return;
    }
    setError(null);
    start(async () => {
      const r = await publishAllDraftsAction(pageId, pageSlug);
      if (!r.ok) {
        setError(r.error ?? "Publish failed");
        return;
      }
      onPublished?.();
    });
  }
  return (
    <div
      style={{
        marginBottom: 14,
        padding: "10px 12px",
        background: "#FFF5DD",
        border: "1px solid #E6CC85",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 13,
      }}
    >
      <span>
        <strong>
          {count} draft{count === 1 ? "" : "s"} pending
        </strong>{" "}
        on this page.
      </span>
      <button
        type="button"
        className="adminbtn adminbtn--primary adminbtn--small"
        onClick={publish}
        disabled={pending}
      >
        {pending ? "Publishing…" : `Publish all`}
      </button>
      {error ? (
        <p className="adminfield__error" role="alert" style={{ width: "100%", margin: 0 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
