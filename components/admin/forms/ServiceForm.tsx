"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, TextareaField, ToggleField } from "./Fields";
import { MediaPickerField } from "./MediaPickerField";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

type Defaults = {
  title?: string;
  description?: string;
  href?: string;
  icon_media_id?: string;
  display_order?: number;
  is_visible?: boolean;
};

export function ServiceForm({
  action,
  defaults,
  cancelHref,
}: {
  action: Action;
  defaults?: Defaults;
  cancelHref?: string;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  return (
    <form action={formAction} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Service / Capability</p>
          <h2>Card details</h2>
          <p>
            Appears in the &ldquo;What We Do&rdquo; grid on the homepage and on the
            Services page.
          </p>
        </div>
        <TextField
          id="title"
          name="title"
          label="Service title"
          defaultValue={defaults?.title}
          required
          error={errors.title}
          maxLength={60}
        />
        <TextareaField
          id="description"
          name="description"
          label="Short description"
          help="One or two sentences. Shown directly below the title on the card."
          defaultValue={defaults?.description}
          rows={3}
          required
          error={errors.description}
          maxLength={280}
        />
        <TextField
          id="href"
          name="href"
          label="Optional detail page link"
          help="Use a path like /services/legislative-strategy if this capability has a dedicated detail page."
          defaultValue={defaults?.href}
          error={errors.href}
          placeholder="/services/…"
        />
        <MediaPickerField
          name="icon_media_id"
          label="Icon"
          help="Pick the SVG / PNG icon shown above the title on the card."
          defaultId={defaults?.icon_media_id}
          error={errors.icon_media_id}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Display</p>
          <h2>Order &amp; visibility</h2>
        </div>
        <TextField
          id="display_order"
          name="display_order"
          label="Display order"
          help="Lower numbers come first. Cards with the same number sort by created date."
          defaultValue={String(defaults?.display_order ?? 0)}
          error={errors.display_order}
        />
        <ToggleField
          id="is_visible"
          name="is_visible"
          label="Show this service on the public site"
          help="Uncheck to keep the row but hide it from visitors."
          defaultChecked={defaults?.is_visible ?? true}
        />
      </section>

      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
