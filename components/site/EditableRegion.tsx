"use client";

import { useEffect, useRef, useState } from "react";

// Wraps a public-site section. In normal rendering it adds nothing visible.
// When the page is loaded via /preview/* with ?edit=1, it adds a subtle
// dashed outline on hover, a tiny label, and posts a message to the parent
// window when clicked so the visual editor can sync.

export function EditableRegion({
  sectionKey,
  sectionLabel,
  children,
}: {
  sectionKey: string;
  sectionLabel: string;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [targeted, setTargeted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditing(params.get("edit") === "1");
  }, []);

  useEffect(() => {
    if (!editing) return;
    function onMessage(ev: MessageEvent) {
      const d = ev.data as { type?: string; sectionKey?: string };
      if (d?.type === "highlight-section") {
        setTargeted(d.sectionKey === sectionKey);
        if (d.sectionKey === sectionKey && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [editing, sectionKey]);

  if (!editing) return <>{children}</>;

  return (
    <div
      ref={ref}
      className={`editable-region${targeted ? " is-targeted" : ""}`}
      data-section-key={sectionKey}
      data-label={sectionLabel}
      onClick={(e) => {
        // Allow inner anchors to keep working when held with cmd/ctrl/middle-click;
        // otherwise intercept and notify parent.
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        e.stopPropagation();
        window.parent?.postMessage(
          { type: "edit-section", sectionKey },
          window.location.origin
        );
      }}
    >
      {children}
    </div>
  );
}
