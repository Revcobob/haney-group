"use client";

import { useEffect, useRef } from "react";

// Attach a beforeunload guard to a <form>. Snapshots the form's initial
// FormData and compares it on every change; when dirty, the browser
// confirm appears if the user tries to leave or close the tab.
//
// Reset via the returned `markClean` callback after a successful save.
export function useUnsavedChangesGuard(formRef: React.RefObject<HTMLFormElement | null>) {
  const baselineRef = useRef<string>("");
  const dirtyRef = useRef<boolean>(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serialize(form);

    function onInput() {
      const form = formRef.current;
      if (!form) return;
      dirtyRef.current = serialize(form) !== baselineRef.current;
    }
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      e.preventDefault();
      // Spec requires returnValue to be set; modern browsers ignore the string.
      e.returnValue = "";
    }
    form.addEventListener("input", onInput);
    form.addEventListener("change", onInput);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      form.removeEventListener("input", onInput);
      form.removeEventListener("change", onInput);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [formRef]);

  function markClean() {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serialize(form);
    dirtyRef.current = false;
  }
  return { markClean };
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
