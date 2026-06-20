"use client";

import { useState, useTransition } from "react";
import { resetSectionToDefaultAction } from "@/lib/admin/actions/sections";

export function ResetSectionButton({
  pageId,
  pageSlug,
  sectionKey,
  sectionLabel,
  onReset,
}: {
  pageId: string;
  pageSlug: string;
  sectionKey: string;
  sectionLabel: string;
  onReset?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!pageId) {
      setError("Save this section once before you can reset it.");
      return;
    }
    const ok = window.confirm(
      `Reset "${sectionLabel}" to its default content?\n\n` +
        "Any edits you've saved to this section will be replaced."
    );
    if (!ok) return;
    setError(null);
    startTransition(async () => {
      const result = await resetSectionToDefaultAction(
        pageId,
        pageSlug,
        sectionKey
      );
      if (!result.ok) {
        setError(result.error ?? "Reset failed");
        return;
      }
      onReset?.();
    });
  }

  return (
    <>
      <button
        type="button"
        className="adminbtn adminbtn--ghost adminbtn--small"
        onClick={handleClick}
        disabled={pending}
        title="Replace this section's content with the built-in default"
      >
        {pending ? "Resetting…" : "Reset to default"}
      </button>
      {error ? (
        <span
          className="adminfield__error"
          role="alert"
          style={{ marginLeft: 10 }}
        >
          {error}
        </span>
      ) : null}
    </>
  );
}
