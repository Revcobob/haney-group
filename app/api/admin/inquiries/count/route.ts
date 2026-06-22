import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { countNewInquiries } from "@/lib/admin/data/inquiries";

export const dynamic = "force-dynamic";

// Lightweight count endpoint used by the sidebar to keep the inquiry
// notification badge fresh while the admin is on a long-lived page.
export async function GET() {
  await requireAdmin();
  const count = await countNewInquiries();
  return NextResponse.json({ count });
}
