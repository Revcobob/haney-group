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

export function ExperienceForm({
  action,
  defaults,
  cancelHref,
}: {
  action: Action;
  defaults?: {
    title?: string;
    client_type?: string;
    leading_line?: string;
    body?: string;
    image_media_id?: string;
    pull_quote?: string;
    pull_quote_attribution?: string;
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
          <p className="adminform__section-eyebrow">Engagement</p>
          <h2>Engagement card</h2>
          <p>Use anonymized descriptions unless the client has approved public identification.</p>
        </div>
        <TextField id="title" name="title" label="Anonymized client / engagement title" defaultValue={defaults?.title} required error={errors.title} maxLength={80} placeholder="Statewide trade association" />
        <TextField id="client_type" name="client_type" label="Client type (optional)" defaultValue={defaults?.client_type} error={errors.client_type} placeholder="Provider · Coalition · Association" />
        <TextField id="leading_line" name="leading_line" label="Lead line (bold opener)" defaultValue={defaults?.leading_line} error={errors.leading_line} placeholder="Article II budget rider, interim through session." />
        <TextareaField id="body" name="body" label="Engagement description" help="Brief, declarative. The lead line appears in bold before this paragraph." defaultValue={defaults?.body} rows={5} required error={errors.body} />
        <MediaPickerField name="image_media_id" label="Image" defaultId={defaults?.image_media_id} error={errors.image_media_id} />
      </section>
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Pull Quote</p>
          <h2>Optional pull quote</h2>
          <p>Shown on some engagement layouts. Leave blank to omit.</p>
        </div>
        <TextareaField id="pull_quote" name="pull_quote" label="Quote text" defaultValue={defaults?.pull_quote} rows={3} error={errors.pull_quote} />
        <TextField id="pull_quote_attribution" name="pull_quote_attribution" label="Attribution" defaultValue={defaults?.pull_quote_attribution} error={errors.pull_quote_attribution} placeholder="General Counsel · Statewide Trade Association" />
      </section>
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Display</p>
          <h2>Order &amp; visibility</h2>
        </div>
        <TextField id="display_order" name="display_order" label="Display order" defaultValue={String(defaults?.display_order ?? 0)} error={errors.display_order} />
        <ToggleField id="is_visible" name="is_visible" label="Show this engagement on the public site" defaultChecked={defaults?.is_visible ?? true} />
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
