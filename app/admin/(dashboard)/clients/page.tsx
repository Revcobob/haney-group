import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import {
  EntityListClient,
  type EntityListRow,
} from "@/components/admin/EntityListClient";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Client Logos" };

type ClientRow = EntityListRow & {
  client_name: string;
  website_url: string | null;
  client_status: string;
  alt_missing: boolean;
};

export default async function AdminClientsPage() {
  const raw = supabaseServerConfigured
    ? await listAdminRows("cms_client_logos")
    : [];
  const rows: ClientRow[] = raw.map((r) => ({
    id: r.id as string,
    is_visible: (r.is_visible as boolean) ?? true,
    display_order: (r.display_order as number) ?? 0,
    client_name: (r.client_name as string) ?? "Untitled",
    website_url: (r.website_url as string | null) ?? null,
    client_status: (r.client_status as string) ?? "current",
    alt_missing: !(r.alt_text as string | null),
  }));

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
        <EntityListClient
          table="cms_client_logos"
          rows={rows}
          editHref={(r) => `/admin/clients/${r.id}`}
          deleteConfirmLabel="client logo"
          renderRow={(r) => (
            <>
              <Link href={`/admin/clients/${r.id}`} className="admintable__title">
                {r.client_name}
              </Link>
              {r.website_url ? (
                <p className="admintable__sub">{r.website_url}</p>
              ) : null}
              <div style={{ marginTop: 6 }}>
                <span
                  className={`admintable__pill admintable__pill--${
                    r.is_visible ? "published" : "hidden"
                  }`}
                >
                  {r.is_visible ? "Visible" : "Hidden"}
                </span>{" "}
                <span className="admintable__pill">
                  {r.client_status === "past" ? "Past" : "Current"}
                </span>{" "}
                <span className="admintable__pill">Order {r.display_order}</span>
                {r.alt_missing ? (
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
            </>
          )}
        />
      )}
    </>
  );
}
