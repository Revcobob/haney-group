"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadMediaAction } from "@/lib/admin/actions/media";

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);

  async function refetch() {
    setError(null);
    setItems(null);
    try {
      const r = await fetch("/api/admin/media");
      if (!r.ok) throw new Error(`Media library not available (${r.status})`);
      const d: { items: MediaPickerItem[] } = await r.json();
      setItems(d.items);
      return d.items;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }

  useEffect(() => {
    if (!open) return;
    refetch();
  }, [open]);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadError("Choose a file first.");
      return;
    }
    const fd = new FormData();
    fd.set("file", file);
    fd.set("bucket", "site-media");
    fd.set("alt_text", altInputRef.current?.value ?? "");
    setUploadError(null);
    setUploading(true);
    const result = await uploadMediaAction(undefined, fd);
    setUploading(false);
    if (!result.ok) {
      setUploadError(result.error ?? "Upload failed");
      return;
    }
    // Refresh, then auto-pick whichever row has the file name we just sent.
    const next = await refetch();
    const hit = next?.find((m) => m.file_name === file.name);
    if (hit) {
      onSelect(hit);
      onClose();
      return;
    }
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (altInputRef.current) altInputRef.current.value = "";
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  // Portal to document.body so the upload <form> inside the modal isn't
  // nested inside a caller's <form> (e.g. ArticleForm). Nested forms are
  // invalid HTML — browsers drop the inner form tag and the upload submit
  // ends up submitting the article form instead, blanking it out.
  if (typeof document === "undefined") return null;
  const filtered =
    items?.filter((i) =>
      !query
        ? true
        : `${i.file_name} ${i.alt_text ?? ""} ${i.category ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
    ) ?? null;

  return createPortal(
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
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className={`adminbtn adminbtn--small ${
              showUpload ? "adminbtn--ghost" : "adminbtn--primary"
            }`}
            onClick={() => setShowUpload((v) => !v)}
            style={{ marginLeft: 10 }}
          >
            {showUpload ? "Cancel upload" : "+ Upload new"}
          </button>
        </div>
        {showUpload ? (
          <form
            onSubmit={onUpload}
            className="mediapicker__upload"
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--line-1)",
              background: "var(--paper-2)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 10,
              alignItems: "end",
            }}
          >
            <div className="adminfield" style={{ margin: 0 }}>
              <label className="adminfield__label" htmlFor="mpm-file">
                File
              </label>
              <input
                ref={fileInputRef}
                id="mpm-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="adminfield__input"
                style={{ padding: "8px 10px" }}
                required
              />
            </div>
            <div className="adminfield" style={{ margin: 0 }}>
              <label className="adminfield__label" htmlFor="mpm-alt">
                Alt text
              </label>
              <input
                ref={altInputRef}
                id="mpm-alt"
                type="text"
                placeholder="Describes the image for screen readers"
                className="adminfield__input"
              />
            </div>
            <button
              type="submit"
              className="adminbtn adminbtn--primary"
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload + use"}
            </button>
            {uploadError ? (
              <p
                className="adminfield__error"
                role="alert"
                style={{ gridColumn: "1 / -1", margin: 0 }}
              >
                {uploadError}
              </p>
            ) : null}
          </form>
        ) : null}
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
    </div>,
    document.body
  );
}
