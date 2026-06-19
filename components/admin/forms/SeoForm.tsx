"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, ToggleField } from "./Fields";
import { CountedTextField, CountedTextareaField } from "./CountedField";
import { SeoPreviews } from "../SeoPreviews";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

type Defaults = {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_id?: string;
  og_image_url?: string;
  canonical_path?: string;
  noindex?: boolean;
};

export function SeoForm({
  action,
  defaults,
  pathHint,
  cancelHref,
  showNoindex = true,
}: {
  action: Action;
  defaults?: Defaults;
  pathHint: string;
  cancelHref?: string;
  showNoindex?: boolean;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  return (
    <div className="seoeditor">
      <form action={formAction} className="adminform">
        <section className="adminform__section">
          <div className="adminform__section-head">
            <p className="adminform__section-eyebrow">Search</p>
            <h2>Title &amp; description</h2>
            <p>
              These show up in Google results and most link previews. Keep titles
              under 60 characters and descriptions under 160.
            </p>
          </div>
          <CountedTextField
            id="meta_title"
            name="meta_title"
            label="Meta title"
            defaultValue={defaults?.meta_title}
            error={errors.meta_title}
            recommendedMax={60}
            help="The big blue link in search results. Falls back to the site default when blank."
          />
          <CountedTextareaField
            id="meta_description"
            name="meta_description"
            label="Meta description"
            defaultValue={defaults?.meta_description}
            error={errors.meta_description}
            recommendedMax={160}
            rows={3}
            help="The grey text under the title in search results."
          />
        </section>

        <section className="adminform__section">
          <div className="adminform__section-head">
            <p className="adminform__section-eyebrow">Social</p>
            <h2>Open Graph (link previews)</h2>
            <p>
              Used by LinkedIn, X, iMessage, Slack, and similar. Defaults to the
              title and description above if left blank.
            </p>
          </div>
          <CountedTextField
            id="og_title"
            name="og_title"
            label="Social title"
            defaultValue={defaults?.og_title}
            error={errors.og_title}
            recommendedMax={70}
          />
          <CountedTextareaField
            id="og_description"
            name="og_description"
            label="Social description"
            defaultValue={defaults?.og_description}
            error={errors.og_description}
            recommendedMax={200}
            rows={3}
          />
          <TextField
            id="og_image_id"
            name="og_image_id"
            label="Social image (media ID)"
            defaultValue={defaults?.og_image_id ?? ""}
            error={errors.og_image_id}
            help="Paste a cms_media ID. 1200×630 works best. Falls back to the global default if blank."
          />
        </section>

        <section className="adminform__section">
          <div className="adminform__section-head">
            <p className="adminform__section-eyebrow">Indexing</p>
            <h2>Canonical &amp; crawlers</h2>
          </div>
          <TextField
            id="canonical_path"
            name="canonical_path"
            label="Canonical path"
            defaultValue={defaults?.canonical_path}
            error={errors.canonical_path}
            placeholder={pathHint}
            help="Override only when this page duplicates another URL. Most pages leave this blank."
          />
          {showNoindex ? (
            <ToggleField
              id="noindex"
              name="noindex"
              label="Hide from search engines (noindex)"
              defaultChecked={defaults?.noindex ?? false}
              help="Tick to add noindex,nofollow meta. Use sparingly."
            />
          ) : null}
        </section>

        <SaveBar status={status} message={message} cancelHref={cancelHref} />
      </form>

      <SeoPreviews
        initial={{
          metaTitle: defaults?.meta_title ?? "The Haney Group",
          metaDescription:
            defaults?.meta_description ??
            "Senior-led Texas legislative strategy, appropriations, and procedural expertise.",
          ogTitle: defaults?.og_title ?? defaults?.meta_title ?? "The Haney Group",
          ogDescription:
            defaults?.og_description ??
            defaults?.meta_description ??
            "Senior-led Texas legislative strategy, appropriations, and procedural expertise.",
          canonicalPath: defaults?.canonical_path ?? pathHint,
        }}
        pathHint={pathHint}
        ogImageUrl={defaults?.og_image_url}
      />
    </div>
  );
}
