import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import {
  EntityListClient,
  type EntityListRow,
} from "@/components/admin/EntityListClient";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Industries" };

type IndustryRow = EntityListRow & {
  title: string;
  description: string;
};

export default async function AdminIndustriesPage() {
  const raw = supabaseServerConfigured ? await listAdminRows("cms_industries") : [];
  const rows: IndustryRow[] = raw.map((r) => ({
    id: r.id as string,
    is_visible: (r.is_visible as boolean) ?? true,
    display_order: (r.display_order as number) ?? 0,
    title: (r.title as string) ?? "Untitled",
    description: (r.description as string) ?? "",
  }));

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Industry cards</h1>
          <p>The nine sector cards on the Clients page. Reorder via the arrows.</p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/industries/new" className="adminbtn adminbtn--primary">
            + Add industry
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>The public site is rendering from built-in fallback content.</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EntityListEmpty
          message="No industries yet."
          newHref="/admin/industries/new"
          newLabel="Add the first industry"
        />
      ) : (
        <EntityListClient
          table="cms_industries"
          rows={rows}
          editHref={(r) => `/admin/industries/${r.id}`}
          deleteConfirmLabel="industry"
          renderRow={(r) => (
            <>
              <Link href={`/admin/industries/${r.id}`} className="admintable__title">
                {r.title}
              </Link>
              <p className="admintable__sub">
                {r.description.length > 140
                  ? r.description.slice(0, 140) + "…"
                  : r.description}
              </p>
              <div style={{ marginTop: 6 }}>
                <span
                  className={`admintable__pill admintable__pill--${
                    r.is_visible ? "published" : "hidden"
                  }`}
                >
                  {r.is_visible ? "Visible" : "Hidden"}
                </span>{" "}
                <span className="admintable__pill">Order {r.display_order}</span>
              </div>
            </>
          )}
        />
      )}
    </>
  );
}
