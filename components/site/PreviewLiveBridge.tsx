"use client";

import { useEffect } from "react";

// Loaded inside the visual editor's preview iframe. Listens for
// preview-overlay messages from the parent (the admin shell) and
// patches plain text fields in the rendered DOM. Best-effort and
// limited to text — image / CTA / list edits still need a save.
//
// Each EditableRegion already adds data-section-key on its wrapper;
// inside, the bridge maps a small set of well-known field names to
// CSS selectors that consistently match across HomeSections + the
// generic PageBlocks renderers.

type Msg = {
  type: "preview-overlay";
  sectionKey: string;
  fields: Record<string, string>;
};

const SELECTOR_BY_FIELD: Record<string, string> = {
  eyebrow: ".eyebrow",
  crumb_label: ".pagehero__crumbs > span:last-child",
  headline: "h1, .h1",
  heading: "h2, .h2",
  lede: ".lede",
  // Two flavors of "body copy": one with the .body class, one with no
  // class but always inside a section. Use the strongest selector that
  // can match either layout.
  body: ".body, p.principle__body, p.body, .processbreak__copy p:nth-of-type(2)",
  credit_text: ".hero__credit",
  meta_text_html: ".hero__meta p",
  attribution: "cite",
  quote: "blockquote p",
};

function isOverlay(d: unknown): d is Msg {
  return (
    typeof d === "object" &&
    d !== null &&
    (d as Record<string, unknown>).type === "preview-overlay" &&
    typeof (d as Record<string, unknown>).sectionKey === "string"
  );
}

export function PreviewLiveBridge() {
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (!isOverlay(ev.data)) return;
      const region = document.querySelector(
        `[data-section-key="${CSS.escape(ev.data.sectionKey)}"]`
      );
      if (!region) return;
      for (const [field, value] of Object.entries(ev.data.fields)) {
        const sel = SELECTOR_BY_FIELD[field];
        if (!sel) continue;
        const el = region.querySelector(sel);
        if (!el) continue;
        // Use textContent so any HTML in the value is rendered as text
        // (safer than innerHTML and matches what the public site shows
        // for fields that aren't explicitly rich text).
        el.textContent = value;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return null;
}
