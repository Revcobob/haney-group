import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { getSiteSettings } from "@/lib/content/site";

// Thin Resend wrapper. Optional — when RESEND_API_KEY is not set,
// every send is a no-op so the contact API still succeeds.

// The firm inbox always gets a copy of an inquiry alert. The CMS setting
// and CONTACT_NOTIFICATION_EMAIL can add or redirect to another address,
// but they can't silently turn the firm's own notifications off.
export const FIRM_INBOX = "info@haney-group.com";

let cached: Resend | null | undefined;

export const emailConfigured = Boolean(env.RESEND_API_KEY);

function client(): Resend | null {
  if (cached !== undefined) return cached;
  if (!env.RESEND_API_KEY) {
    cached = null;
    return null;
  }
  cached = new Resend(env.RESEND_API_KEY);
  return cached;
}

function normalizeList(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.includes("@"));
}

// Resolve recipients: the firm inbox, plus whatever the CMS setting
// contact_notification_email and the CONTACT_NOTIFICATION_EMAIL env var
// name (each may be a comma-separated list). Deduplicated, case-insensitive.
export async function resolveRecipients(): Promise<string[]> {
  const candidates: string[] = [FIRM_INBOX];
  try {
    const settings = await getSiteSettings();
    candidates.push(...normalizeList(settings.contact_notification_email));
  } catch {
    // settings query failed — the env var and firm inbox still apply.
  }
  candidates.push(...normalizeList(env.CONTACT_NOTIFICATION_EMAIL));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const address of candidates) {
    const key = address.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(address);
  }
  return out;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function notifyNewInquiry(input: {
  name: string;
  organization?: string;
  email: string;
  phone?: string;
  inquiry_type?: string;
  message: string;
  source_page?: string;
  id?: string;
}): Promise<{ ok: boolean; to?: string[]; reason?: string }> {
  const resend = client();
  if (!resend) {
    // Loud: an inquiry landed and nobody was told about it.
    // eslint-disable-next-line no-console
    console.error(
      "[email] RESEND_API_KEY is not set — no inquiry notification was sent.",
      { inquiryId: input.id }
    );
    return { ok: false, reason: "RESEND_API_KEY not set" };
  }

  const to = await resolveRecipients();
  const subject = `New inquiry: ${input.name}${input.organization ? ` (${input.organization})` : ""}`;
  const adminUrl = input.id
    ? `https://www.haney-group.com/admin/inquiries/${input.id}`
    : "https://www.haney-group.com/admin/inquiries";

  const fields: Array<[string, string | undefined]> = [
    ["Name", input.name],
    ["Organization", input.organization],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Type", input.inquiry_type],
    ["Source page", input.source_page],
  ];

  const text = [
    `New inquiry through the website contact form.`,
    ``,
    ...fields
      .filter(([, v]) => Boolean(v))
      .map(([label, v]) => `${(label + ":").padEnd(14)}${v}`),
    ``,
    `--- Message ---`,
    input.message,
    `---------------`,
    ``,
    `Review and respond in the admin: ${adminUrl}`,
  ].join("\n");

  const html = [
    `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#14181F;line-height:1.55">`,
    `<p style="margin:0 0 16px"><strong>New inquiry through the website contact form.</strong></p>`,
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 18px">`,
    ...fields
      .filter(([, v]) => Boolean(v))
      .map(
        ([label, v]) =>
          `<tr><td style="padding:3px 16px 3px 0;color:#5A6472;white-space:nowrap">${label}</td>` +
          `<td style="padding:3px 0"><strong>${escapeHtml(v as string)}</strong></td></tr>`
      ),
    `</table>`,
    `<div style="border-left:3px solid #C9892A;padding:2px 0 2px 14px;margin:0 0 20px;white-space:pre-wrap">${escapeHtml(
      input.message
    )}</div>`,
    `<p style="margin:0"><a href="${adminUrl}" style="color:#8A5D14">Review and respond in the admin →</a></p>`,
    `</div>`,
  ].join("");

  try {
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to,
      replyTo: input.email,
      subject,
      text,
      html,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[email] Resend rejected the inquiry notification", {
        inquiryId: input.id,
        to,
        message: error.message,
        name: error.name,
      });
      return { ok: false, to, reason: error.message };
    }
    return { ok: true, to };
  } catch (e) {
    const reason = e instanceof Error ? e.message : "send failed";
    // eslint-disable-next-line no-console
    console.error("[email] inquiry notification failed to send", {
      inquiryId: input.id,
      to,
      reason,
    });
    return { ok: false, to, reason };
  }
}

// Used by /admin/diagnostics to prove the notification path end-to-end
// without having to submit the public contact form.
export async function sendTestNotification(): Promise<{
  ok: boolean;
  to?: string[];
  reason?: string;
}> {
  return notifyNewInquiry({
    name: "Test notification",
    organization: "The Haney Group",
    email: FIRM_INBOX,
    inquiry_type: "Diagnostics",
    message:
      "This is a test of the contact-form notification path, sent from /admin/diagnostics. " +
      "If you received it, real inquiries will reach this inbox too.",
    source_page: "/admin/diagnostics",
  });
}
