"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, SelectField, ToggleField } from "./Fields";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

export function NavItemForm({
  action,
  defaults,
  cancelHref,
}: {
  action: Action;
  defaults?: {
    nav_area?: "header" | "footer_primary" | "footer_utility" | "utility_bar";
    label?: string;
    href?: string;
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
          <p className="adminform__section-eyebrow">Navigation</p>
          <h2>Link</h2>
          <p>Edits to nav links publish everywhere they render.</p>
        </div>
        <SelectField
          id="nav_area"
          name="nav_area"
          label="Where this link appears"
          defaultValue={defaults?.nav_area ?? "header"}
          options={[
            { value: "header", label: "Main header" },
            { value: "footer_primary", label: "Footer — primary column" },
            { value: "footer_utility", label: "Footer — utility links (Privacy, etc.)" },
            { value: "utility_bar", label: "Top utility bar" },
          ]}
        />
        <TextField id="label" name="label" label="Label" defaultValue={defaults?.label} required error={errors.label} maxLength={60} />
        <TextField id="href" name="href" label="Link" defaultValue={defaults?.href} required error={errors.href} placeholder="/about or https://…" />
        <TextField id="display_order" name="display_order" label="Display order" defaultValue={String(defaults?.display_order ?? 0)} error={errors.display_order} help="Lower numbers come first." />
        <ToggleField id="is_visible" name="is_visible" label="Show this link" defaultChecked={defaults?.is_visible ?? true} />
      </section>
      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
