import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAdminInquiries } from "@/lib/admin/data/inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  await requireAdmin();
  const rows = await listAdminInquiries({});
  const header = [
    "id",
    "created_at",
    "name",
    "organization",
    "email",
    "phone",
    "inquiry_type",
    "status",
    "source_page",
    "message",
    "notes",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.created_at,
        r.name,
        r.organization,
        r.email,
        r.phone,
        r.inquiry_type,
        r.status,
        r.source_page,
        r.message,
        r.notes,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  const filename = `haney-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
