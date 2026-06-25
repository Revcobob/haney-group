import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows, type AdminRow } from "@/lib/admin/data/entities";
import {
  EntityListClient,
  type EntityListRow,
} from "@/components/admin/EntityListClient";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Services" };

type ServiceRow = EntityListRow & {
  title: string;
  description: string;
};

export default async function AdminServicesPage() {
  let raw: AdminRow[] = [];
  let loadError: string | null = null;
  if (supabaseServerConfigured) {
    try {
      raw = await listAdminRows("cms_services");
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Unknown error";
      console.error("[admin/services] failed to load cms_services rows", loadError);
    }
  }
  const rows: ServiceRow[] = raw.map((r) => {
    const id = r.id as string;
    const title = (r.title as string) ?? "Untitled";
    const description = (r.description as string) ?? "";
    const is_visible = (r.is_visible as boolean) ?? true;
    const display_order = (r.display_order as number) ?? 0;
    return {
      id,
      is_visible,
      display_order,
      title,
      description,
      editHref: `/admin/services/${id}`,
      content: (
        <>
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
                is_visible ? "published" : "hidden"
              }`}
            >
              {is_visible ? "Visible" : "Hidden"}
            </span>{" "}
            <span className="admintable__pill">Order {display_order}</span>
          </div>
        </>
      ),
    };
  });

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
            <p>
              The public site is rendering from built-in fallback content. Connect
              Supabase to manage these rows here.
            </p>
          </div>
        </div>
      ) : loadError ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Couldn’t load services.</strong>
            <p>
              Supabase replied: <code>{loadError}</code>. Open{" "}
              <Link href="/admin/diagnostics" style={{ textDecoration: "underline" }}>
                /admin/diagnostics
              </Link>{" "}
              to confirm the table and key.
            </p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EntityListEmpty
          message="No services yet. Add one to get started, or run the seed to import the existing six capabilities."
          newHref="/admin/services/new"
          newLabel="Add the first service"
        />
      ) : (
        <EntityListClient
          table="cms_services"
          rows={rows}
          deleteConfirmLabel="service"
        />
      )}
    </>
  );
}
