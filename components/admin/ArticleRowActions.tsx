"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  deleteArticleAction,
  togglePublishAction,
} from "@/lib/admin/actions/insights";

export function ArticleRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: "draft" | "published";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onTogglePublish() {
    const next = status === "published" ? "draft" : "published";
    startTransition(async () => {
      await togglePublishAction(id, next);
      router.refresh();
    });
  }

  function onDelete() {
    if (
      !window.confirm(
        "Delete this article? It will be removed from the public site. This cannot be undone."
      )
    )
      return;
    startTransition(async () => {
      await deleteArticleAction(id);
      router.refresh();
    });
  }

  return (
    <div className="admintable__actions">
      <Link
        href={`/insights/${slug}`}
        target="_blank"
        className="adminbtn adminbtn--ghost adminbtn--small"
      >
        Preview
      </Link>
      <button
        type="button"
        onClick={onTogglePublish}
        disabled={pending}
        className="adminbtn adminbtn--ghost adminbtn--small"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <Link
        href={`/admin/insights/${id}`}
        className="adminbtn adminbtn--primary adminbtn--small"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="adminbtn adminbtn--danger adminbtn--small"
      >
        Delete
      </button>
    </div>
  );
}
