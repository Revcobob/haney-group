import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { RowActions } from "@/components/admin/RowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Navigation" };

const AREA_LABEL: Record<string, string> = {
  header: "Main header",
  footer_primary: "Footer · Primary",
  footer_utility: "Footer · Utility",
  utility_bar: "Utility bar",
};

export default async function AdminNavigationPage() {
  const rows = supabaseServerConfigured
    ? await listAdminRows("cms_navigation_items")
    : [];

  const byArea: Record<string, typeof rows> = {
    header: [],
    footer_primary: [],
    footer_utility: [],
    utility_bar: [],
  };
  for (const r of rows) {
    const a = (r.nav_area as string) ?? "header";
    if (byArea[a]) byArea[a].push(r);
  }

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Site</p>
          <h1>Navigation</h1>
          <p>Header, footer, and utility-bar links. Edits appear everywhere the nav renders.</p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/navigation/new" className="adminbtn adminbtn--primary">
            + Add link
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>The public site is rendering from built-in fallback navigation.</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EntityListEmpty
          message="No navigation items yet."
          newHref="/admin/navigation/new"
          newLabel="Add the first link"
        />
      ) : (
        <>
          {(["header", "footer_primary", "footer_utility", "utility_bar"] as const).map(
            (area) => (
              <div key={area} style={{ marginBottom: 24 }}>
                <div className="admintable__row admintable__row--header" style={{ borderRadius: "8px 8px 0 0", border: "1px solid var(--line-1)", borderBottom: 0 }}>
                  <div>{AREA_LABEL[area]}</div>
                  <div></div>
                </div>
                {byArea[area].length === 0 ? (
                  <div className="admintable" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                    <div className="admintable__empty">No links in this area yet.</div>
                  </div>
                ) : (
                  <div className="admintable" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0 }}>
                    {byArea[area].map((r) => {
                      const id = r.id as string;
                      const label = (r.label as string) ?? "Untitled";
                      const href = (r.href as string) ?? "";
                      const isVisible = (r.is_visible as boolean) ?? true;
                      return (
                        <div key={id} className="admintable__row">
                          <div>
                            <Link href={`/admin/navigation/${id}`} className="admintable__title">
                              {label}
                            </Link>
                            <p className="admintable__sub">{href}</p>
                            <div style={{ marginTop: 6 }}>
                              <span className={`admintable__pill admintable__pill--${isVisible ? "published" : "hidden"}`}>
                                {isVisible ? "Visible" : "Hidden"}
                              </span>{" "}
                              <span className="admintable__pill">Order {r.display_order as number}</span>
                            </div>
                          </div>
                          <RowActions
                            table="cms_navigation_items"
                            id={id}
                            isVisible={isVisible}
                            editHref={`/admin/navigation/${id}`}
                            deleteConfirmLabel="nav link"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          )}
        </>
      )}
    </>
  );
}
