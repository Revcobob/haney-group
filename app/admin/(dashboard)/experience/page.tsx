import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { RowActions } from "@/components/admin/RowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Experience" };

export default async function AdminExperiencePage() {
  const rows = supabaseServerConfigured ? await listAdminRows("cms_experience_items") : [];
  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Engagement cards</h1>
          <p>
            The anonymized engagement cards on the Experience page. <strong>Use
            anonymized descriptions unless the client has approved public
            identification.</strong>
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/experience/new" className="adminbtn adminbtn--primary">
            + Add engagement
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
          message="No engagements yet."
          newHref="/admin/experience/new"
          newLabel="Add the first engagement"
        />
      ) : (
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>Engagement</div>
            <div>Actions</div>
          </div>
          {rows.map((r) => {
            const id = r.id as string;
            const title = (r.title as string) ?? "Untitled";
            const lead = (r.leading_line as string) ?? "";
            const isVisible = (r.is_visible as boolean) ?? true;
            return (
              <div key={id} className="admintable__row">
                <div>
                  <Link href={`/admin/experience/${id}`} className="admintable__title">
                    {title}
                  </Link>
                  <p className="admintable__sub">{lead}</p>
                  <div style={{ marginTop: 6 }}>
                    <span className={`admintable__pill admintable__pill--${isVisible ? "published" : "hidden"}`}>
                      {isVisible ? "Visible" : "Hidden"}
                    </span>{" "}
                    <span className="admintable__pill">Order {r.display_order as number}</span>
                  </div>
                </div>
                <RowActions
                  table="cms_experience_items"
                  id={id}
                  isVisible={isVisible}
                  editHref={`/admin/experience/${id}`}
                  deleteConfirmLabel="engagement"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
