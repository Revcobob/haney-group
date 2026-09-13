"use client";

import { useState, useTransition } from "react";
import { sendTestNotificationAction } from "@/lib/admin/actions/notifications";

// Diagnostics helper: sends a sample inquiry alert so an admin can confirm
// the firm inbox really receives contact-form notifications.
export function TestNotificationButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: true; to: string[] } | { ok: false; error: string } | null
  >(null);

  function onClick() {
    setResult(null);
    startTransition(async () => {
      const res = await sendTestNotificationAction();
      setResult(
        res.ok
          ? { ok: true, to: res.data?.to ?? [] }
          : { ok: false, error: res.error }
      );
    });
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        className="adminbtn adminbtn--ghost adminbtn--small"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send test notification"}
      </button>
      {result ? (
        <p
          className="admintable__sub"
          style={{ marginTop: 8, color: result.ok ? "var(--text-2)" : "#B25C2E" }}
        >
          {result.ok
            ? `Sent to ${result.to.join(", ")}. Check the inbox (and spam) — if it never arrives, the sending domain is not verified in Resend.`
            : `FAIL — ${result.error}`}
        </p>
      ) : null}
    </div>
  );
}
