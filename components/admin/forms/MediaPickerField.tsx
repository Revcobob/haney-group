"use client";

import { useEffect, useState } from "react";
import { MediaPickerModal, type MediaPickerItem } from "../MediaPickerModal";

// A drop-in form field that shows a thumbnail + filename for whatever
// media row is currently selected, and opens the Media Library picker
// when the admin clicks Choose / Replace. The hidden input under
// `name` holds the cms_media UUID — that is what gets submitted.
//
// If only `defaultId` is provided (no `defaultUrl`), the component
// looks up the media row over /api/admin/media on mount so the admin
// always sees the actual image, not just an opaque UUID.
export function MediaPickerField({
  name,
  label,
  defaultId,
  defaultUrl,
  defaultFileName,
  help,
  error,
  required,
}: {
  name: string;
  label: string;
  defaultId?: string;
  defaultUrl?: string;
  defaultFileName?: string;
  help?: string;
  error?: string;
  required?: boolean;
}) {
  const [id, setId] = useState(defaultId ?? "");
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [fileName, setFileName] = useState(defaultFileName ?? "");
  const [open, setOpen] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Resolve URL for an existing ID when the caller didn't pass one.
  useEffect(() => {
    if (!id || url) return;
    let cancelled = false;
    setResolving(true);
    fetch("/api/admin/media")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items: MediaPickerItem[] }) => {
        if (cancelled) return;
        const hit = d.items.find((m) => m.id === id);
        if (hit) {
          setUrl(hit.public_url);
          setFileName(hit.file_name);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, url]);

  const displayName =
    fileName || (url ? url.split("/").pop() ?? "" : "");

  return (
    <div className="adminfield">
      <span className="adminfield__label">
        {label}
        {required ? (
          <span
            aria-hidden="true"
            style={{ color: "var(--amber-600)", marginLeft: 4 }}
          >
            *
          </span>
        ) : null}
      </span>
      <div className="adminimg" style={{ alignItems: "flex-start" }}>
        <div className="adminimg__preview">
          {url ? (
            <img src={url} alt="" />
          ) : id && resolving ? (
            <span className="adminimg__placeholder">Loading…</span>
          ) : id ? (
            <span className="adminimg__placeholder">Missing</span>
          ) : null}
        </div>
        <div className="adminimg__meta" style={{ flex: 1, minWidth: 0 }}>
          <p className="adminimg__name">
            {url
              ? displayName
              : id
              ? resolving
                ? "Looking up image…"
                : "Image not found in library"
              : "No image selected"}
          </p>
          {help ? <p className="adminimg__alt">{help}</p> : null}
          <div
            style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}
          >
            <button
              type="button"
              className="adminbtn adminbtn--ghost adminbtn--small"
              onClick={() => setOpen(true)}
            >
              {url || id ? "Replace from library" : "Choose from library"}
            </button>
            {id ? (
              <button
                type="button"
                className="adminbtn adminbtn--ghost adminbtn--small"
                onClick={() => {
                  setId("");
                  setUrl("");
                  setFileName("");
                }}
              >
                Remove image
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {error ? (
        <p className="adminfield__error" role="alert">
          {error}
        </p>
      ) : null}
      <input type="hidden" name={name} value={id} />
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(item: MediaPickerItem) => {
          setId(item.id);
          setUrl(item.public_url);
          setFileName(item.file_name);
        }}
      />
    </div>
  );
}
