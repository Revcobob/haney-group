"use client";

import { useActionState, useRef } from "react";
import { uploadMediaAction } from "@/lib/admin/actions/media";
import type { ActionResult } from "@/lib/admin/actions/_helpers";
import { TextField, SelectField } from "./forms/Fields";
import { SaveBar } from "./forms/SaveBar";

export function MediaUpload() {
  const [state, action] = useActionState<ActionResult | undefined, FormData>(
    uploadMediaAction,
    undefined
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Uploaded." : state.error;

  return (
    <form action={action} className="adminform" encType="multipart/form-data">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">New Upload</p>
          <h2>Add a file to the library</h2>
          <p>
            JPG, PNG, WebP, or GIF up to 8&nbsp;MB. Alt text is required for
            anything used on a public page; you can edit it later.
          </p>
        </div>
        <div className="adminfield">
          <label className="adminfield__label" htmlFor="m-file">
            File <span aria-hidden="true" style={{ color: "var(--amber-600)" }}>*</span>
          </label>
          <input
            ref={fileRef}
            id="m-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            className="adminfield__input"
            style={{ padding: "8px 10px" }}
          />
          <p className="adminfield__help">SVG uploads are intentionally disabled for safety.</p>
        </div>
        <SelectField
          id="m-bucket"
          name="bucket"
          label="Bucket / category"
          defaultValue="site-media"
          options={[
            { value: "site-media", label: "Site media (general)" },
            { value: "hero-images", label: "Hero images" },
            { value: "insight-images", label: "Insight images" },
            { value: "client-logos", label: "Client logos" },
            { value: "og-images", label: "Open Graph / social cards" },
          ]}
          help="Choose where this file lives. Public URLs come back automatically."
        />
        <TextField
          id="m-alt"
          name="alt_text"
          label="Alt text (recommended)"
          help="Describes the image for screen readers and when images don’t load."
        />
        <TextField
          id="m-cat"
          name="category"
          label="Tag / category (optional)"
          help="Free-text tag used to filter the library, e.g. 'principal', 'article hero'."
        />
      </section>
      <SaveBar status={status} message={message} primaryLabel="Upload" />
    </form>
  );
}
