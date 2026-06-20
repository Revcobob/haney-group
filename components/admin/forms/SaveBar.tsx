"use client";

import { useFormStatus } from "react-dom";

export function SaveBar({
  message,
  status,
  cancelHref,
  primaryLabel = "Save changes",
  secondary,
}: {
  message?: string;
  status?: "idle" | "success" | "error";
  cancelHref?: string;
  primaryLabel?: string;
  /** Optional left-aligned secondary action (e.g. "Reset to default").
   *  Rendered before the cancel/save cluster. */
  secondary?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
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
      ) : <span />}
      <div className="adminsavebar__actions">
        {secondary ? (
          <span className="adminsavebar__secondary">{secondary}</span>
        ) : null}
        {cancelHref ? (
          <a className="adminbtn adminbtn--ghost" href={cancelHref}>
            Cancel
          </a>
        ) : null}
        <button
          className="adminbtn adminbtn--primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Saving…" : primaryLabel}
        </button>
      </div>
    </div>
  );
}
