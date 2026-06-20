import type { Metadata } from "next";
import Link from "next/link";
import {
  listAdminInquiries,
  type InquiryFilter,
  type InquiryStatus,
} from "@/lib/admin/data/inquiries";
import { InquiryFilterBar } from "@/components/admin/InquiryFilterBar";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Inquiries" };

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_LIST: InquiryStatus[] = [
  "new",
  "reviewed",
  "responded",
  "archived",
  "spam",
];

export default async function AdminInquiriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const filter: InquiryFilter = {
    status: (status as InquiryStatus | "all" | undefined) ?? undefined,
    search: q,
  };
  const rows = supabaseServerConfigured ? await listAdminInquiries(filter) : [];

  // Always compute "new" count from a separate unfiltered query for the
  // headline metric, but stay cheap by reusing the filtered rows when no
  // filter is active.
  const newCount =
    filter.status === undefined || filter.status === "all"
      ? rows.filter((r) => r.status === "new").length
      : (supabaseServerConfigured ? await listAdminInquiries({ status: "new" }) : []).length;

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Inbox</p>
          <h1>Contact inquiries</h1>
          <p>
            Notes submitted through the public Contact form. Triage with status
            pills, leave private notes, and export when you need a CSV.
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <form action="/api/admin/inquiries/export" method="get">
            <button type="submit" className="adminbtn adminbtn--ghost">
              Export CSV
            </button>
          </form>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              Inquiries land here once Supabase is wired up. The public Contact
              form currently fails soft: visitors see a success state, the firm
              is told to follow up by phone or email.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="admin__grid admin__grid--3" style={{ marginBottom: 18 }}>
            <div className="admin__card">
              <div className="admin__stat">
                <span className="admin__stat-num">{newCount}</span>
                <span className="admin__stat-label">New (awaiting review)</span>
              </div>
            </div>
            {STATUS_LIST.filter((s) => s !== "new").map((s) => {
              const count = rows.filter((r) => r.status === s).length;
              return (
                <div key={s} className="admin__card">
                  <div className="admin__stat">
                    <span className="admin__stat-num">{count}</span>
                    <span className="admin__stat-label">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                      {filter.status === undefined || filter.status === "all"
                        ? " (this page)"
                        : " (filtered)"}
                    </span>
                  </div>
                </div>
              );
            }).slice(0, 2)}
          </div>

          <InquiryFilterBar />
        </>
      )}

      {supabaseServerConfigured && rows.length === 0 ? (
        <div className="admintable">
          <div className="admintable__empty">
            {filter.status && filter.status !== "all"
              ? `No inquiries with status “${filter.status}”.`
              : filter.search
              ? "No inquiries match that search."
              : "No inquiries yet. New submissions to the Contact form will land here."}
          </div>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>From</div>
            <div>Status</div>
          </div>
          {rows.map((r) => (
            <div key={r.id} className="admintable__row">
              <div>
                <Link
                  href={`/admin/inquiries/${r.id}`}
                  className="admintable__title"
                >
                  {r.name}
                  {r.organization ? ` · ${r.organization}` : ""}
                </Link>
                <p className="admintable__sub">
                  {r.email}
                  {r.phone ? ` · ${r.phone}` : ""} ·{" "}
                  <span style={{ color: "var(--text-3)" }}>{fmtDate(r.created_at)}</span>
                </p>
                <p className="admintable__sub" style={{ marginTop: 6, color: "var(--text-2)" }}>
                  {r.message.length > 200 ? r.message.slice(0, 200) + "…" : r.message}
                </p>
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.inquiry_type ? (
                    <span className="admintable__pill">{r.inquiry_type}</span>
                  ) : null}
                  {r.source_page ? (
                    <span className="admintable__pill">From {r.source_page}</span>
                  ) : null}
                </div>
              </div>
              <div className="admintable__actions">
                <span className={`inqpill inqpill--${r.status}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
