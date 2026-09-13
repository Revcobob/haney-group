"use server";

import { requireAdmin } from "@/lib/auth";
import { sendTestNotification } from "@/lib/email";
import type { ActionResult } from "./_helpers";

// Fires a sample inquiry notification so an admin can confirm the firm
// inbox actually receives contact-form alerts.
export async function sendTestNotificationAction(): Promise<
  ActionResult<{ to: string[] }>
> {
  await requireAdmin();
  const result = await sendTestNotification();
  if (!result.ok) {
    return {
      ok: false,
      error: result.reason ?? "The test notification could not be sent.",
    };
  }
  return { ok: true, data: { to: result.to ?? [] } };
}
