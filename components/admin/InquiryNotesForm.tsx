"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { TextareaField } from "./forms/Fields";
import {
  saveInquiryNotesAction,
  saveInquiryNotesAndReturnAction,
} from "@/lib/admin/actions/inquiries";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

export function InquiryNotesForm({
  id,
  defaultNotes,
}: {
  id: string;
  defaultNotes: string;
}) {
  const action = saveInquiryNotesAction.bind(null, id);
  const returnAction = saveInquiryNotesAndReturnAction.bind(null, id);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const status: "idle" | "success" | "error" = !state
    ? "idle"
    : state.ok
    ? "success"
    : "error";
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

      <div className="adminsavebar" role="status">
        {message ? (
          <span
            className={`adminsavebar__msg${
              status === "error"
                ? " adminsavebar__msg--error"
                : status === "success"
                ? " adminsavebar__msg--success"
                : ""
            }`}
          >
            {message}
          </span>
        ) : (
          <span />
        )}
        <div className="adminsavebar__actions">
          <SaveNotesButtons returnAction={returnAction} />
        </div>
      </div>
    </form>
  );
}

// Two-button pair. "Save notes" submits through useActionState so the
// success / error banner appears in place. "Save & return" overrides
// the form's action via the button's formAction attribute and routes
// back to the inquiry list via a server-side redirect.
function SaveNotesButtons({
  returnAction,
}: {
  returnAction: (formData: FormData) => Promise<void>;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        className="adminbtn adminbtn--ghost"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save notes"}
      </button>
      <button
        type="submit"
        className="adminbtn adminbtn--primary"
        formAction={returnAction}
        disabled={pending}
      >
        {pending ? "Saving…" : "Save & return"}
      </button>
    </>
  );
}
