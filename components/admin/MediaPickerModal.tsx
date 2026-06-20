"use client";

import { useEffect, useState } from "react";

export type MediaPickerItem = {
  id: string;
  public_url: string;
  file_name: string;
  alt_text: string | null;
  mime_type: string;
  category: string | null;
};

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaPickerItem) => void;
}) {
  const [items, setItems] = useState<MediaPickerItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setError(null);
    setItems(null);
    fetch("/api/admin/media")
      .then(async (r) => {
        if (!r.ok) throw new Error(`Media library not available (${r.status})`);
        return r.json();
      })
      .then((d: { items: MediaPickerItem[] }) => setItems(d.items))
      .catch((e: Error) => setError(e.message));
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const filtered =
    items?.filter((i) =>
      !query
        ? true
        : `${i.file_name} ${i.alt_text ?? ""} ${i.category ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    ) ?? null;

  return (
    <div className="mediapicker" role="dialog" aria-modal="true" aria-label="Choose media">
      <div className="mediapicker__backdrop" onClick={onClose} />
      <div className="mediapicker__panel">
        <div className="mediapicker__head">
          <div>
            <p className="adminform__section-eyebrow" style={{ marginBottom: 6 }}>
              Media library
            </p>
            <h2 style={{ margin: 0, fontSize: 18 }}>Choose an image</h2>
          </div>
          <button type="button" onClick={onClose} className="adminbtn adminbtn--ghost">
            Close
          </button>
        </div>
        <div className="mediapicker__searchbar">
          <input
            type="search"
            placeholder="Search by file name, alt text, or tag…"
            className="adminfield__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mediapicker__body">
          {error ? (
            <p className="adminfield__error" style={{ padding: 16 }}>
              {error}
            </p>
          ) : filtered === null ? (
            <p style={{ padding: 16, color: "var(--text-3)" }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: 16, color: "var(--text-3)" }}>No media found.</p>
          ) : (
            <div className="mediagrid">
              {filtered.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className="mediagrid__item"
                  style={{
                    cursor: "pointer",
                    appearance: "none",
                    border: "1px solid var(--line-1)",
                    background: "var(--paper)",
                    padding: 0,
                    textAlign: "left",
                  }}
                  onClick={() => {
                    onSelect(m);
                    onClose();
                  }}
                >
                  <div className="mediagrid__thumb">
                    {m.public_url ? <img src={m.public_url} alt={m.alt_text ?? ""} /> : null}
                  </div>
                  <div className="mediagrid__body">
                    <p className="mediagrid__name">{m.file_name}</p>
                    <p className="mediagrid__meta">
                      {m.mime_type.replace(/^image\//, "").toUpperCase()}
                      {m.alt_text ? null : (
                        <> · <span className="mediagrid__noalt">Missing alt</span></>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
