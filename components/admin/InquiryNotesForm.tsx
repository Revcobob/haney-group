"use client";

import { useActionState } from "react";
import { TextareaField } from "./forms/Fields";
import { SaveBar } from "./forms/SaveBar";
import { saveInquiryNotesAction } from "@/lib/admin/actions/inquiries";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

export function InquiryNotesForm({
  id,
  defaultNotes,
}: {
  id: string;
  defaultNotes: string;
}) {
  const action = saveInquiryNotesAction.bind(null, id);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Notes saved." : state.error;

  return (
    <form action={formAction} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Internal</p>
          <h2>Notes</h2>
          <p>Private to the firm. Useful for tracking response status, next steps, or context.</p>
        </div>
        <TextareaField
          id="notes"
          name="notes"
          label="Notes"
          defaultValue={defaultNotes}
          rows={5}
          placeholder="Called back on Tuesday — wants a 30-minute call next week."
        />
      </section>
      <SaveBar status={status} message={message} primaryLabel="Save notes" />
    </form>
  );
}
