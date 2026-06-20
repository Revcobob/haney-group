import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { RowActions } from "@/components/admin/RowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const rows = supabaseServerConfigured
    ? await listAdminRows("cms_services")
    : [];

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Services &amp; capabilities</h1>
          <p>
            The six capability cards on the homepage and the four practice areas
            on the Services page. Hide a card to remove it from the public site
            without losing the row.
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/services/new" className="adminbtn adminbtn--primary">
            + Add service
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>The public site is rendering from built-in fallback content. Connect Supabase to manage these rows here.</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EntityListEmpty
          message="No services yet. Add one to get started, or run the seed to import the existing six capabilities."
          newHref="/admin/services/new"
          newLabel="Add the first service"
        />
      ) : (
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>Service</div>
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
                  <Link href={`/admin/services/${id}`} className="admintable__title">
                    {title}
                  </Link>
                  <p className="admintable__sub">
                    {description.length > 120
                      ? description.slice(0, 120) + "…"
                      : description}
                  </p>
                  <div style={{ marginTop: 6 }}>
                    <span
                      className={`admintable__pill admintable__pill--${
                        isVisible ? "published" : "hidden"
                      }`}
                    >
                      {isVisible ? "Visible" : "Hidden"}
                    </span>{" "}
                    <span className="admintable__pill">
                      Order {r.display_order as number}
                    </span>
                  </div>
                </div>
                <RowActions
                  table="cms_services"
                  id={id}
                  isVisible={isVisible}
                  editHref={`/admin/services/${id}`}
                  deleteConfirmLabel="service"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
