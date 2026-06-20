"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  deleteEntityAction,
  toggleVisibilityAction,
} from "@/lib/admin/actions/entities";

type EntityTable =
  | "cms_services"
  | "cms_industries"
  | "cms_experience_items"
  | "cms_client_logos"
  | "cms_navigation_items";

export function RowActions({
  table,
  id,
  isVisible,
  editHref,
  deleteConfirmLabel,
}: {
  table: EntityTable;
  id: string;
  isVisible: boolean;
  editHref: string;
  deleteConfirmLabel: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onToggle() {
    startTransition(async () => {
      await toggleVisibilityAction(table, id, !isVisible);
      router.refresh();
    });
  }
  function onDelete() {
    if (!window.confirm(`Delete this ${deleteConfirmLabel}? This cannot be undone.`))
      return;
    startTransition(async () => {
      await deleteEntityAction(table, id);
      router.refresh();
    });
  }

  return (
    <div className="admintable__actions">
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className="adminbtn adminbtn--ghost adminbtn--small"
      >
        {isVisible ? "Hide" : "Show"}
      </button>
      <Link href={editHref} className="adminbtn adminbtn--primary adminbtn--small">
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
