"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  SectionForm,
  type SectionMeta,
} from "./forms/SectionForm";
import type { FieldConfig } from "@/lib/sections/types";
import { saveSectionAction } from "@/lib/admin/actions/sections";

export type EditorSectionData = {
  section_key: string;
  section_label: string;
  section_type: string;
  display_order: number;
  content_json: Record<string, unknown>;
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

  function reloadIframe() {
    setIframeKey((k) => k + 1);
  }

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

            <div className="adminfield" style={{ marginBottom: 18 }}>
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
                  </option>
                ))}
              </select>
            </div>

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
