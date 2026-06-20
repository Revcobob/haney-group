"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type MediaListItem = {
  id: string;
  public_url: string;
  file_name: string;
  alt_text: string;
  mime_type: string;
};

export function MediaList({ items }: { items: MediaListItem[] }) {
  const [showAll, setShowAll] = useState(true);
  const missingCount = useMemo(
    () => items.filter((i) => !i.alt_text.trim()).length,
    [items]
  );
  const filtered = useMemo(
    () => (showAll ? items : items.filter((i) => !i.alt_text.trim())),
    [items, showAll]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
          {items.length} {items.length === 1 ? "file" : "files"}
          {missingCount > 0 ? (
            <>
              {" · "}
              <span style={{ color: "var(--amber-600)" }}>
                {missingCount} need alt text
              </span>
            </>
          ) : null}
        </h2>
        <div className="admintable__actions">
          <button
            type="button"
            className={`adminbtn adminbtn--small ${
              showAll ? "adminbtn--primary" : "adminbtn--ghost"
            }`}
            onClick={() => setShowAll(true)}
          >
            All
          </button>
          <button
            type="button"
            className={`adminbtn adminbtn--small ${
              !showAll ? "adminbtn--primary" : "adminbtn--ghost"
            }`}
            onClick={() => setShowAll(false)}
            disabled={missingCount === 0}
            title={missingCount === 0 ? "Every file has alt text" : ""}
          >
            Missing alt only
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admintable">
          <div className="admintable__empty">
            {items.length === 0
              ? "No uploads yet. Use the form above to add your first file."
              : "Nothing matches the current filter."}
          </div>
        </div>
      ) : (
        <div className="mediagrid">
          {filtered.map((r) => {
            const mimeShort = r.mime_type.replace(/^image\//, "").toUpperCase();
            const hasAlt = r.alt_text.trim().length > 0;
            return (
              <Link
                key={r.id}
                href={`/admin/media/${r.id}`}
                className="mediagrid__item"
              >
                <div className="mediagrid__thumb">
                  {r.public_url ? (
                    <img src={r.public_url} alt={r.alt_text} loading="lazy" />
                  ) : null}
                </div>
                <div className="mediagrid__body">
                  <p className="mediagrid__name">{r.file_name}</p>
                  <p className="mediagrid__meta">
                    {mimeShort}
                    {hasAlt ? null : (
                      <>
                        {" · "}
                        <span className="mediagrid__noalt">Missing alt</span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
