"use client";

import { useState, useTransition } from "react";
import { reorderSectionsAction } from "@/lib/admin/actions/sections";

type Item = { section_key: string; section_label: string };

export function SectionReorderList({
  pageId,
  pageSlug,
  items: initialItems,
  onReordered,
}: {
  pageId: string;
  pageSlug: string;
  items: Item[];
  /** Fired after a successful reorder so the parent can refresh
   *  the rendered preview (e.g. bump the visual editor iframe). */
  onReordered?: () => void;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setItems(next);
    setError(null);
    startTransition(async () => {
      const result = await reorderSectionsAction(
        pageId,
        pageSlug,
        next.map((s) => s.section_key)
      );
      if (!result.ok) {
        setError(result.error ?? "Reorder failed");
        // Roll back the optimistic move.
        setItems(items);
        return;
      }
      onReordered?.();
    });
  }

  return (
    <div className="sectionreorder">
      <div className="admin__side-label" style={{ marginBottom: 8 }}>
        Reorder sections
      </div>
      <p className="adminfield__help" style={{ marginTop: 0, marginBottom: 10 }}>
        Use the arrows to change the order sections appear on the page.
        Changes save as you click.
      </p>
      <ol className="sectionreorder__list">
        {items.map((s, i) => (
          <li key={s.section_key} className="sectionreorder__row">
            <span className="sectionreorder__num">{i + 1}.</span>
            <span className="sectionreorder__label">{s.section_label}</span>
            <span className="sectionreorder__actions">
              <button
                type="button"
                className="adminbtn adminbtn--ghost adminbtn--small"
                onClick={() => move(i, -1)}
                disabled={pending || i === 0}
                aria-label={`Move ${s.section_label} up`}
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="adminbtn adminbtn--ghost adminbtn--small"
                onClick={() => move(i, 1)}
                disabled={pending || i === items.length - 1}
                aria-label={`Move ${s.section_label} down`}
                title="Move down"
              >
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      {error ? (
        <p className="adminfield__error" role="alert" style={{ marginTop: 10 }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
