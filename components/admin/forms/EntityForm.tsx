"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

export function EntityForm({
  action,
  cancelHref,
  children,
  primaryLabel,
}: {
  action: Action;
  cancelHref?: string;
  children: (fieldErrors: Record<string, string>) => React.ReactNode;
  primaryLabel?: string;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status: "idle" | "success" | "error" = !state
    ? "idle"
    : state.ok
    ? "success"
    : "error";
  const message = !state
    ? undefined
    : state.ok
    ? "Saved."
    : state.error;

  return (
    <form action={formAction} className="adminform">
      {children(fieldErrors)}
      <SaveBar
        status={status}
        message={message}
        cancelHref={cancelHref}
        primaryLabel={primaryLabel}
      />
    </form>
  );
}
