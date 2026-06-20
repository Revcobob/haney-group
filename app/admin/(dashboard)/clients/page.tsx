import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { RowActions } from "@/components/admin/RowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Client Logos" };

export default async function AdminClientsPage() {
  const rows = supabaseServerConfigured ? await listAdminRows("cms_client_logos") : [];
  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Selected client logos</h1>
          <p>The grayscale strip on the Clients page.</p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/clients/new" className="adminbtn adminbtn--primary">
            + Add client logo
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>Public site rendering from built-in fallback content.</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EntityListEmpty
          message="No client logos yet."
          newHref="/admin/clients/new"
          newLabel="Add the first client logo"
        />
      ) : (
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>Client</div>
            <div>Actions</div>
          </div>
          {rows.map((r) => {
            const id = r.id as string;
            const name = (r.client_name as string) ?? "Untitled";
            const status = (r.client_status as string) ?? "current";
            const isVisible = (r.is_visible as boolean) ?? true;
            const altMissing = !r.alt_text;
            return (
              <div key={id} className="admintable__row">
                <div>
                  <Link href={`/admin/clients/${id}`} className="admintable__title">
                    {name}
                  </Link>
                  {r.website_url ? (
                    <p className="admintable__sub">{r.website_url as string}</p>
                  ) : null}
                  <div style={{ marginTop: 6 }}>
                    <span className={`admintable__pill admintable__pill--${isVisible ? "published" : "hidden"}`}>
                      {isVisible ? "Visible" : "Hidden"}
                    </span>{" "}
                    <span className="admintable__pill">{status === "past" ? "Past" : "Current"}</span>{" "}
                    <span className="admintable__pill">Order {r.display_order as number}</span>
                    {altMissing ? (
                      <>
                        {" "}
                        <span
                          className="admintable__pill"
                          style={{ color: "#B25C2E", borderColor: "#E5C0C0" }}
                        >
                          Missing alt text
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
                <RowActions
                  table="cms_client_logos"
                  id={id}
                  isVisible={isVisible}
                  editHref={`/admin/clients/${id}`}
                  deleteConfirmLabel="client logo"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
