"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Attach a beforeunload guard to a <form>. Snapshots the form's initial
// FormData and compares it on every change; when dirty, the browser
// confirm appears if the user tries to leave or close the tab.
//
// Returns:
//   isDirty   — live state, true while the form differs from baseline;
//   markClean — call after a successful save to reset the baseline.
//
// The DirtyFormProvider consumes `isDirty` via useDirtyFormRegistration
// so in-app navigation can also prompt before discarding edits.
export function useUnsavedChangesGuard(formRef: React.RefObject<HTMLFormElement | null>) {
  const baselineRef = useRef<string>("");
  const [isDirty, setIsDirty] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serialize(form);
    if (dirtyRef.current) {
      dirtyRef.current = false;
      setIsDirty(false);
    }

    function recompute() {
      const form = formRef.current;
      if (!form) return;
      const next = serialize(form) !== baselineRef.current;
      if (next !== dirtyRef.current) {
        dirtyRef.current = next;
        setIsDirty(next);
      }
    }
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    form.addEventListener("input", recompute);
    form.addEventListener("change", recompute);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      form.removeEventListener("input", recompute);
      form.removeEventListener("change", recompute);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [formRef]);

  const markClean = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serialize(form);
    if (dirtyRef.current) {
      dirtyRef.current = false;
      setIsDirty(false);
    }
  }, [formRef]);

  return { markClean, isDirty };
}

function serialize(form: HTMLFormElement): string {
  const data = new FormData(form);
  const parts: string[] = [];
  for (const [k, v] of data.entries()) {
    if (k.startsWith("_meta_")) continue;
    parts.push(`${k}=${typeof v === "string" ? v : "[file]"}`);
  }
  parts.sort();
  return parts.join("\n");
}
