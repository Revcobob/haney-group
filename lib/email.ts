import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { getSiteSettings } from "@/lib/content/site";

// Thin Resend wrapper. Optional — when RESEND_API_KEY is not set,
// every send is a no-op so the contact API still succeeds.

let cached: Resend | null | undefined;

function client(): Resend | null {
  if (cached !== undefined) return cached;
  if (!env.RESEND_API_KEY) {
    cached = null;
    return null;
  }
  cached = new Resend(env.RESEND_API_KEY);
  return cached;
}

// Resolve the recipient: CMS settings.contact_notification_email wins
// when set; falls back to the CONTACT_NOTIFICATION_EMAIL env var; final
// fallback is info@haney-group.com.
async function resolveRecipient(): Promise<string> {
  try {
    const settings = await getSiteSettings();
    const fromCms = (settings.contact_notification_email ?? "").trim();
    if (fromCms) return fromCms;
  } catch {
    // settings query failed — fall through to env.
  }
  return env.CONTACT_NOTIFICATION_EMAIL || "info@haney-group.com";
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
}): Promise<{ ok: boolean; reason?: string }> {
  const resend = client();
  if (!resend) return { ok: false, reason: "resend not configured" };

  const to = await resolveRecipient();
  const subject = `New inquiry: ${input.name}${input.organization ? ` (${input.organization})` : ""}`;
  const adminUrl = input.id
    ? `https://www.haney-group.com/admin/inquiries/${input.id}`
    : "https://www.haney-group.com/admin/inquiries";

  const text = [
    `New inquiry through the website contact form.`,
    ``,
    `Name:         ${input.name}`,
    input.organization ? `Organization: ${input.organization}` : null,
    `Email:        ${input.email}`,
    input.phone ? `Phone:        ${input.phone}` : null,
    input.inquiry_type ? `Type:         ${input.inquiry_type}` : null,
    input.source_page ? `Source page:  ${input.source_page}` : null,
    ``,
    `--- Message ---`,
    input.message,
    `---------------`,
    ``,
    `Review and respond in the admin: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await resend.emails.send({
      from: "The Haney Group Website <noreply@haney-group.com>",
      to: [to],
      replyTo: input.email,
      subject,
      text,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "send failed" };
  }
}
