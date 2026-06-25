"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  reorderEntityAction,
  bulkEntityAction,
  deleteEntityAction,
  toggleVisibilityAction,
} from "@/lib/admin/actions/entities";

type EntityTable =
  | "cms_services"
  | "cms_industries"
  | "cms_experience_items"
  | "cms_client_logos";

export type EntityListRow = {
  id: string;
  is_visible: boolean;
  display_order: number;
  /** Server-rendered URL for the row's Edit button. */
  editHref: string;
  /** Server-rendered JSX for the row body. Server components can pass
   *  JSX into client components as ReactNode props, but they cannot
   *  pass functions — so the page renders the row up front instead of
   *  handing this component a render callback. */
  content: React.ReactNode;
};

export function EntityListClient<R extends EntityListRow>({
  table,
  rows: initialRows,
  deleteConfirmLabel,
}: {
  table: EntityTable;
  rows: R[];
  deleteConfirmLabel: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggleSelected(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }
  function toggleAll() {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const next = rows.slice();
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setRows(next);
    setError(null);
    startTransition(async () => {
      const result = await reorderEntityAction(
        table,
        next.map((r) => r.id)
      );
      if (!result.ok) {
        setError(result.error ?? "Reorder failed");
        setRows(rows);
        return;
      }
      router.refresh();
    });
  }

  function runBulk(op: "hide" | "show" | "delete") {
    if (selected.size === 0) return;
    if (op === "delete") {
      const ok = window.confirm(
        `Delete ${selected.size} selected ${deleteConfirmLabel}${
          selected.size === 1 ? "" : "s"
        }? This cannot be undone.`
      );
      if (!ok) return;
    }
    const ids = Array.from(selected);
    setError(null);
    startTransition(async () => {
      const result = await bulkEntityAction(table, ids, op);
      if (!result.ok) {
        setError(result.error ?? "Bulk action failed");
        return;
      }
      setSelected(new Set());
      router.refresh();
    });
  }

  function rowToggle(id: string, nextVisible: boolean) {
    setError(null);
    startTransition(async () => {
      await toggleVisibilityAction(table, id, nextVisible);
      router.refresh();
    });
  }
  function rowDelete(id: string) {
    if (!window.confirm(`Delete this ${deleteConfirmLabel}? This cannot be undone.`))
      return;
    setError(null);
    startTransition(async () => {
      await deleteEntityAction(table, id);
      router.refresh();
    });
  }

  const allSelected = selected.size === rows.length && rows.length > 0;
  const someSelected = selected.size > 0;

  return (
    <>
      <div className="bulkbar" role="region" aria-label="Bulk actions">
        <label className="bulkbar__check">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = !allSelected && someSelected;
            }}
            onChange={toggleAll}
          />
          <span>
            {selected.size === 0
              ? `Select all (${rows.length})`
              : `${selected.size} selected`}
          </span>
        </label>
        <div className="bulkbar__actions">
          <button
            type="button"
            className="adminbtn adminbtn--ghost adminbtn--small"
            disabled={!someSelected || pending}
            onClick={() => runBulk("show")}
          >
            Show
          </button>
          <button
            type="button"
            className="adminbtn adminbtn--ghost adminbtn--small"
            disabled={!someSelected || pending}
            onClick={() => runBulk("hide")}
          >
            Hide
          </button>
          <button
            type="button"
            className="adminbtn adminbtn--danger adminbtn--small"
            disabled={!someSelected || pending}
            onClick={() => runBulk("delete")}
          >
            Delete
          </button>
        </div>
      </div>

      {error ? (
        <p className="adminfield__error" role="alert" style={{ marginTop: 10 }}>
          {error}
        </p>
      ) : null}

      <div className="admintable">
        <div className="admintable__row admintable__row--header">
          <div>Row</div>
          <div>Actions</div>
        </div>
        {rows.map((r, i) => {
          const isChecked = selected.has(r.id);
          return (
            <div key={r.id} className="admintable__row">
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelected(r.id)}
                  aria-label={`Select row ${i + 1}`}
                  style={{ marginTop: 4 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>{r.content}</div>
              </div>
              <div className="admintable__actions">
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button
                    type="button"
                    className="adminbtn adminbtn--ghost adminbtn--small"
                    onClick={() => move(i, -1)}
                    disabled={pending || i === 0}
                    title="Move up"
                    aria-label="Move up"
                    style={{ padding: "2px 8px", lineHeight: 1 }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="adminbtn adminbtn--ghost adminbtn--small"
                    onClick={() => move(i, 1)}
                    disabled={pending || i === rows.length - 1}
                    title="Move down"
                    aria-label="Move down"
                    style={{ padding: "2px 8px", lineHeight: 1 }}
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => rowToggle(r.id, !r.is_visible)}
                  disabled={pending}
                  className="adminbtn adminbtn--ghost adminbtn--small"
                >
                  {r.is_visible ? "Hide" : "Show"}
                </button>
                <Link
                  href={r.editHref}
                  className="adminbtn adminbtn--primary adminbtn--small"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => rowDelete(r.id)}
                  disabled={pending}
                  className="adminbtn adminbtn--danger adminbtn--small"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
