"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SectionMeta = {
  section_key: string;
  section_label: string;
  section_type: string;
};

type EditMessage = {
  type: "edit-section";
  sectionKey: string;
};

function isEditMessage(d: unknown): d is EditMessage {
  return (
    typeof d === "object" &&
    d !== null &&
    (d as { type?: string }).type === "edit-section" &&
    typeof (d as { sectionKey?: string }).sectionKey === "string"
  );
}

export function VisualEditorClient({
  pageSlug,
  sections,
  previewSrc,
}: {
  pageSlug: string;
  sections: SectionMeta[];
  previewSrc: string;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Receive click events from the preview iframe.
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      // Same-origin check: only accept messages from our own iframe.
      if (iframeRef.current?.contentWindow !== ev.source) return;
      if (isEditMessage(ev.data)) {
        setActiveKey(ev.data.sectionKey);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // When activeKey changes, mirror back to the iframe to highlight the region.
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !activeKey) return;
    win.postMessage({ type: "highlight-section", sectionKey: activeKey }, "*");
  }, [activeKey]);

  return (
    <div className="visualeditor">
      <div className="visualeditor__frame">
        <iframe
          ref={iframeRef}
          src={previewSrc}
          title="Page preview"
          // Same origin so we can postMessage without CORS gymnastics.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
      <aside className="visualeditor__panel">
        <div className="visualeditor__panel-head">
          <div>
            <p className="adminform__section-eyebrow" style={{ marginBottom: 4 }}>
              Visual editor
            </p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
              Click any highlighted section in the preview
            </p>
          </div>
        </div>
        <div className="visualeditor__panel-body">
          {sections.length === 0 ? (
            <p className="visualeditor__hint">
              No sections registered for this page yet. Add a default in{" "}
              <code>content/fallbacks/pages.ts</code> and run the seed.
            </p>
          ) : (
            <>
              <p className="visualeditor__hint" style={{ marginBottom: 14 }}>
                Hover the preview to outline each editable region. Click one to
                jump to its form, or pick from the list below.
              </p>
              <div className="admin__side-group" style={{ margin: 0 }}>
                <div className="admin__side-label">Sections</div>
                {sections.map((s) => {
                  const isActive = s.section_key === activeKey;
                  return (
                    <Link
                      key={s.section_key}
                      href={`/admin/pages/${pageSlug}?section=${s.section_key}`}
                      className={`admin__side-link${isActive ? " is-active" : ""}`}
                      onMouseEnter={() => setActiveKey(s.section_key)}
                    >
                      <span style={{ flex: 1 }}>{s.section_label}</span>
                      <span style={{ color: "var(--amber-600)", fontSize: 11 }}>
                        Edit →
                      </span>
                    </Link>
                  );
                })}
              </div>

              {activeKey ? (
                <div
                  className="admin__notice admin__notice--info"
                  style={{ marginTop: 18 }}
                >
                  <div>
                    <strong>
                      {sections.find((s) => s.section_key === activeKey)?.section_label}
                    </strong>
                    <p>
                      <Link
                        href={`/admin/pages/${pageSlug}?section=${activeKey}`}
                        style={{ color: "var(--navy-900)", textDecoration: "underline" }}
                      >
                        Open the editor for this section →
                      </Link>
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
