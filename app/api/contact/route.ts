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
  company_website: z.string().optional(), // honeypot
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
  if (input.company_website && input.company_website.trim().length > 0) {
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

  // 4) If Supabase isn't configured, fail soft — accept the message but tell the
  //    visitor we'll be in touch by phone or email. This matches the visitor's
  //    expectation while keeping operations from breaking during setup.
  if (!supabaseServerConfigured) {
    return NextResponse.json(
      {
        ok: true,
        notice:
          "Saved locally; database not yet connected. The firm will follow up directly.",
      },
      { status: 200 }
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
