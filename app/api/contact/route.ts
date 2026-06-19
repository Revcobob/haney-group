import { NextResponse } from "next/server";

// Phase 2 stub. Phase 6 wires this to Supabase + Resend (info@haney-group.com).
// Already enforces: honeypot check, required fields, consent, basic shape.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const get = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const honeypot = get("company_website");
  const name = get("name");
  const email = get("email");
  const message = get("message");
  const consent = body.consent === true;

  // Honeypot — silently accept then drop. Bots see success; humans never see this.
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please confirm consent before submitting." },
      { status: 400 }
    );
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return NextResponse.json({ error: "Submission is too long." }, { status: 400 });
  }

  // TODO Phase 6: insert into cms_contact_inquiries + notify info@haney-group.com
  return NextResponse.json({ ok: true }, { status: 200 });
}
