import { NextResponse } from "next/server";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { clientIp, hashIp, checkRateLimit } from "@/lib/rate-limit";
import { notifyNewInquiry } from "@/lib/email";

export const runtime = "nodejs";

const PayloadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(320),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  inquiry_type: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000),
  consent: z.boolean().refine((v) => v === true, "Consent is required"),
  source_page: z.string().trim().max(300).optional().or(z.literal("")),
  // Honeypot — see ContactForm. New + old names accepted so a stale
  // cached client doesn't get false-flagged during rollout.
  hp_check: z.string().optional(),
  company_website: z.string().optional(),
});

export async function POST(request: Request) {
  // 1) Parse JSON
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // 2) Honeypot — silently accept then drop so bots think they succeeded.
  // Log the drop so a real visitor unexpectedly tripping the trap shows
  // up in Vercel logs instead of vanishing into the void.
  const hpTripped =
    (input.hp_check && input.hp_check.trim().length > 0) ||
    (input.company_website && input.company_website.trim().length > 0);
  if (hpTripped) {
    // eslint-disable-next-line no-console
    console.warn("[contact] honeypot tripped — dropping submission", {
      email: input.email,
      hp_check: input.hp_check?.slice(0, 40),
      company_website: input.company_website?.slice(0, 40),
      ua: request.headers.get("user-agent")?.slice(0, 120),
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 3) Rate limit per IP hash.
  const ip = clientIp(request);
  const ipHash = hashIp(ip);
  const { allowed } = checkRateLimit(ipHash);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this network. Please try again later or call us." },
      { status: 429 }
    );
  }

  // 4) If Supabase isn't configured, refuse to silently swallow the note —
  //    tell the visitor to use phone or email so the firm doesn't lose
  //    inquiries during a misconfiguration. The admin /admin/inquiries
  //    inbox depends on this row landing in cms_contact_inquiries.
  if (!supabaseServerConfigured) {
    // Loud in production: this should never happen on a deployed site.
    // eslint-disable-next-line no-console
    console.error(
      "[/api/contact] Supabase server env not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY so inquiries are recorded.",
      { email: input.email }
    );
    return NextResponse.json(
      {
        error:
          "We can’t record your note right now. Please email info@haney-group.com or call (512) 925-5000.",
      },
      { status: 503 }
    );
  }

  // 5) Insert into cms_contact_inquiries.
  const sb = serverSupabase();
  const row = {
    name: input.name,
    organization: input.organization || null,
    email: input.email,
    phone: input.phone || null,
    inquiry_type: input.inquiry_type || null,
    message: input.message,
    consent: true,
    source_page: input.source_page || "/contact",
    ip_hash: ipHash || null,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    status: "new" as const,
  };
  const { data: inserted, error } = await sb
    .from("cms_contact_inquiries")
    .insert(row as never)
    .select("id")
    .single();
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/contact] cms_contact_inquiries insert failed", {
      message: error.message,
      code: (error as { code?: string }).code,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      email: input.email,
    });
    return NextResponse.json(
      { error: "We couldn’t save your note. Please call (512) 925-5000." },
      { status: 500 }
    );
  }

  // 6) Email notification (best-effort, never blocks the visitor).
  notifyNewInquiry({
    name: input.name,
    organization: input.organization || undefined,
    email: input.email,
    phone: input.phone || undefined,
    inquiry_type: input.inquiry_type || undefined,
    message: input.message,
    source_page: input.source_page || "/contact",
    id: inserted?.id as string | undefined,
  }).catch(() => {
    // Email failure shouldn't break the user flow; the inquiry is already saved.
  });

  return NextResponse.json({ ok: true, id: inserted?.id }, { status: 200 });
}
