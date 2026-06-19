"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TextField, TextareaField } from "./forms/Fields";
import { SaveBar } from "./forms/SaveBar";
import {
  updateMediaAction,
  deleteMediaAction,
} from "@/lib/admin/actions/media";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

export function MediaEditForm({
  id,
  defaults,
}: {
  id: string;
  defaults: { alt_text: string; caption: string; category: string };
}) {
  const update = updateMediaAction.bind(null, id);
  const [state, action] = useActionState<ActionResult | undefined, FormData>(
    update,
    undefined
  );
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  function onDelete() {
    if (!window.confirm("Delete this file? It will be removed from Supabase Storage as well. This cannot be undone."))
      return;
    startTransition(async () => {
      const res = await deleteMediaAction(id);
      if (res.ok) router.push("/admin/media");
      else window.alert(res.error);
    });
  }

  return (
    <form action={action} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Metadata</p>
          <h2>Edit file details</h2>
          <p>The file itself can&rsquo;t be edited here. Re-upload to change the image.</p>
        </div>
        <TextField
          id="m-alt"
          name="alt_text"
          label="Alt text"
          help="Required for accessibility on any image used on a public page."
          defaultValue={defaults.alt_text}
          error={errors.alt_text}
        />
        <TextareaField
          id="m-caption"
          name="caption"
          label="Caption (optional)"
          defaultValue={defaults.caption}
          rows={3}
          error={errors.caption}
        />
        <TextField
          id="m-cat"
          name="category"
          label="Tag / category"
          defaultValue={defaults.category}
          error={errors.category}
        />
      </section>
      <SaveBar
        status={status}
        message={message}
        cancelHref="/admin/media"
      />
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="adminbtn adminbtn--danger"
        >
          {pending ? "Deleting…" : "Delete this file"}
        </button>
      </div>
    </form>
  );
}
