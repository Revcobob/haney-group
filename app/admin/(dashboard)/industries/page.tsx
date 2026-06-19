import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { RowActions } from "@/components/admin/RowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Industries" };

export default async function AdminIndustriesPage() {
  const rows = supabaseServerConfigured ? await listAdminRows("cms_industries") : [];

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Industry cards</h1>
          <p>The nine sector cards on the Clients page. Reorder via display order.</p>
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
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>Industry</div>
            <div>Actions</div>
          </div>
          {rows.map((r) => {
            const id = r.id as string;
            const title = (r.title as string) ?? "Untitled";
            const description = (r.description as string) ?? "";
            const isVisible = (r.is_visible as boolean) ?? true;
            return (
              <div key={id} className="admintable__row">
                <div>
                  <Link href={`/admin/industries/${id}`} className="admintable__title">
                    {title}
                  </Link>
                  <p className="admintable__sub">
                    {description.length > 140 ? description.slice(0, 140) + "…" : description}
                  </p>
                  <div style={{ marginTop: 6 }}>
                    <span className={`admintable__pill admintable__pill--${isVisible ? "published" : "hidden"}`}>
                      {isVisible ? "Visible" : "Hidden"}
                    </span>{" "}
                    <span className="admintable__pill">Order {r.display_order as number}</span>
                  </div>
                </div>
                <RowActions
                  table="cms_industries"
                  id={id}
                  isVisible={isVisible}
                  editHref={`/admin/industries/${id}`}
                  deleteConfirmLabel="industry"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
