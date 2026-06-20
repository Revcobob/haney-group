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

export function IndustryForm({
  action,
  defaults,
  cancelHref,
}: {
  action: Action;
  defaults?: {
    title?: string;
    description?: string;
    illustration_media_id?: string;
    display_order?: number;
    is_visible?: boolean;
  };
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
          <p className="adminform__section-eyebrow">Industry / Sector</p>
          <h2>Card details</h2>
          <p>Appears in the industries grid on the Clients page.</p>
        </div>
        <TextField id="title" name="title" label="Industry title" defaultValue={defaults?.title} required error={errors.title} maxLength={60} />
        <TextareaField id="description" name="description" label="Description" help="One or two sentences explaining the firm’s work in this sector." defaultValue={defaults?.description} rows={3} required error={errors.description} maxLength={320} />
        <MediaPickerField name="illustration_media_id" label="Illustration" help="The illustration shown on the industry card." defaultId={defaults?.illustration_media_id} error={errors.illustration_media_id} />
      </section>
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Display</p>
          <h2>Order &amp; visibility</h2>
        </div>
        <TextField id="display_order" name="display_order" label="Display order" defaultValue={String(defaults?.display_order ?? 0)} help="Lower numbers come first." error={errors.display_order} />
        <ToggleField id="is_visible" name="is_visible" label="Show this industry on the public site" defaultChecked={defaults?.is_visible ?? true} />
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
