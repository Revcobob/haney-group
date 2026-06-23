import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminInquiry } from "@/lib/admin/data/inquiries";
import { InquiryStatusBar } from "@/components/admin/InquiryStatusBar";
import { InquiryNotesForm } from "@/components/admin/InquiryNotesForm";

export const metadata: Metadata = { title: "Inquiry" };

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Chicago",
      timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminInquiry(id);
  if (!row) notFound();

  const replySubject = encodeURIComponent(
    `Re: your message to The Haney Group${row.organization ? ` (${row.organization})` : ""}`
  );

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">
          <Link href="/admin/inquiries" style={{ color: "inherit" }}>
            ← All inquiries
          </Link>
        </p>
        <h1>
          {row.name}
          {row.organization ? <span style={{ color: "var(--text-3)", fontWeight: 500 }}> · {row.organization}</span> : null}
        </h1>
        <p>
          Received {fmtDate(row.created_at)}
          {row.source_page ? <> from <code>{row.source_page}</code></> : null}.
        </p>
      </div>

      <InquiryStatusBar id={row.id} current={row.status} />

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p className="admin__pagehead-eyebrow" style={{ margin: 0 }}>
            Message
          </p>
          <blockquote className="inqmessage">{row.message}</blockquote>

          <div style={{ marginTop: 8 }}>
            <InquiryNotesForm id={row.id} defaultNotes={row.notes ?? ""} />
          </div>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="inqmeta">
            <div className="inqmeta__row">
              <span className="inqmeta__label">Email</span>
              <span className="inqmeta__value">
                <a href={`mailto:${row.email}?subject=${replySubject}`}>{row.email}</a>
              </span>
            </div>
            {row.phone ? (
              <div className="inqmeta__row">
                <span className="inqmeta__label">Phone</span>
                <span className="inqmeta__value">
                  <a href={`tel:${row.phone.replace(/[^0-9+]/g, "")}`}>{row.phone}</a>
                </span>
              </div>
            ) : null}
            <div className="inqmeta__row">
              <span className="inqmeta__label">Inquiry type</span>
              <span className="inqmeta__value">{row.inquiry_type ?? "—"}</span>
            </div>
            <div className="inqmeta__row">
              <span className="inqmeta__label">Source page</span>
              <span className="inqmeta__value">{row.source_page ?? "—"}</span>
            </div>
            <div className="inqmeta__row">
              <span className="inqmeta__label">Consent given</span>
              <span className="inqmeta__value">{row.consent ? "Yes" : "No"}</span>
            </div>
            <div className="inqmeta__row">
              <span className="inqmeta__label">Last updated</span>
              <span className="inqmeta__value">{fmtDate(row.updated_at)}</span>
            </div>
          </div>

          <div className="admin__card">
            <p className="admin__pagehead-eyebrow" style={{ margin: 0 }}>
              Quick reply
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>
              Opens your mail client with a pre-filled subject line.
            </p>
            <a
              href={`mailto:${row.email}?subject=${replySubject}`}
              className="adminbtn adminbtn--primary"
              style={{ marginTop: 4 }}
            >
              Reply to {row.name.split(" ")[0]}
            </a>
            {row.phone ? (
              <a
                href={`tel:${row.phone.replace(/[^0-9+]/g, "")}`}
                className="adminbtn adminbtn--ghost"
              >
                Call {row.phone}
              </a>
            ) : null}
          </div>

          {row.user_agent || row.ip_hash ? (
            <div className="admin__card">
              <p className="admin__pagehead-eyebrow" style={{ margin: 0 }}>
                Diagnostic
              </p>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5, wordBreak: "break-word" }}>
                {row.user_agent ? <p style={{ margin: "4px 0" }}>UA: {row.user_agent}</p> : null}
                {row.ip_hash ? <p style={{ margin: "4px 0" }}>IP hash: {row.ip_hash}</p> : null}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
