"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { setPageStatusAction } from "@/lib/admin/actions/sections";

export function PageStatusToggle({
  pageSlug,
  status,
}: {
  pageSlug: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const next = status === "published" ? "draft" : "published";

  function onClick() {
    if (next === "draft") {
      const ok = window.confirm(
        `Hide this page from the public site? Visitors will get a 404 at this URL until you re-publish.`
      );
      if (!ok) return;
    }
    setError(null);
    startTransition(async () => {
      const result = await setPageStatusAction(pageSlug, next);
      if (!result.ok) {
        setError(result.error ?? "Failed");
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className="adminbtn adminbtn--ghost adminbtn--small"
        onClick={onClick}
        disabled={pending}
        title={
          status === "published"
            ? "Unpublish — hides this page from the public site"
            : "Publish — makes this page live"
        }
      >
        {pending
          ? "…"
          : status === "published"
          ? "Unpublish"
          : "Publish"}
      </button>
      {error ? (
        <span className="adminfield__error" role="alert">
          {error}
        </span>
      ) : null}
    </>
  );
}
