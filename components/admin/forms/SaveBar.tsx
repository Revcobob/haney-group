"use client";

import { useFormStatus } from "react-dom";

export function SaveBar({
  message,
  status,
  cancelHref,
  primaryLabel = "Save changes",
}: {
  message?: string;
  status?: "idle" | "success" | "error";
  cancelHref?: string;
  primaryLabel?: string;
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
