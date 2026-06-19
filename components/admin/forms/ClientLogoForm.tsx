"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, SelectField, ToggleField } from "./Fields";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

export function ClientLogoForm({
  action,
  defaults,
  cancelHref,
}: {
  action: Action;
  defaults?: {
    client_name?: string;
    logo_media_id?: string;
    website_url?: string;
    alt_text?: string;
    client_status?: "current" | "past";
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
          <p className="adminform__section-eyebrow">Selected Clients</p>
          <h2>Client logo</h2>
          <p>Appears in the grayscale logo strip on the Clients page.</p>
        </div>
        <TextField id="client_name" name="client_name" label="Client name" defaultValue={defaults?.client_name} required error={errors.client_name} />
        <TextField id="alt_text" name="alt_text" label="Alt text (required)" help="Describes the logo for screen readers and when images don’t load." defaultValue={defaults?.alt_text} required error={errors.alt_text} />
        <TextField id="logo_media_id" name="logo_media_id" label="Logo (media ID)" help="Media picker lands in the Media Library section." defaultValue={defaults?.logo_media_id ?? ""} error={errors.logo_media_id} />
        <TextField id="website_url" name="website_url" type="url" label="Client website" defaultValue={defaults?.website_url} placeholder="https://www.example.com" error={errors.website_url} />
      </section>
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Status</p>
          <h2>Current or past client</h2>
        </div>
        <SelectField
          id="client_status"
          name="client_status"
          label="Engagement status"
          defaultValue={defaults?.client_status ?? "current"}
          options={[
            { value: "current", label: "Current client" },
            { value: "past", label: "Past client" },
          ]}
        />
        <TextField id="display_order" name="display_order" label="Display order" defaultValue={String(defaults?.display_order ?? 0)} error={errors.display_order} />
        <ToggleField id="is_visible" name="is_visible" label="Show this logo on the public site" defaultChecked={defaults?.is_visible ?? true} />
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
