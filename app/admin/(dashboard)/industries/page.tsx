import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows, type AdminRow } from "@/lib/admin/data/entities";
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
  let raw: AdminRow[] = [];
  let loadError: string | null = null;
  if (supabaseServerConfigured) {
    try {
      raw = await listAdminRows("cms_industries");
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Unknown error";
      console.error("[admin/industries] failed to load cms_industries rows", loadError);
    }
  }
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
      ) : loadError ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Couldn’t load industries.</strong>
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
