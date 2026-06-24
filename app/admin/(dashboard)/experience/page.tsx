import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows, type AdminRow } from "@/lib/admin/data/entities";
import {
  EntityListClient,
  type EntityListRow,
} from "@/components/admin/EntityListClient";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Experience" };

type ExperienceRow = EntityListRow & {
  title: string;
  leading_line: string;
};

export default async function AdminExperiencePage() {
  let raw: AdminRow[] = [];
  let loadError: string | null = null;
  if (supabaseServerConfigured) {
    try {
      raw = await listAdminRows("cms_experience_items");
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Unknown error";
      console.error("[admin/experience] failed to load cms_experience_items rows", loadError);
    }
  }
  const rows: ExperienceRow[] = raw.map((r) => ({
    id: r.id as string,
    is_visible: (r.is_visible as boolean) ?? true,
    display_order: (r.display_order as number) ?? 0,
    title: (r.title as string) ?? "Untitled",
    leading_line: (r.leading_line as string) ?? "",
  }));

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Structure</p>
          <h1>Engagement cards</h1>
          <p>
            The anonymized engagement cards on the Experience page.{" "}
            <strong>
              Use anonymized descriptions unless the client has approved public
              identification.
            </strong>
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <Link
            href="/admin/experience/new"
            className="adminbtn adminbtn--primary"
          >
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
      ) : loadError ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Couldn’t load engagements.</strong>
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
          message="No engagements yet."
          newHref="/admin/experience/new"
          newLabel="Add the first engagement"
        />
      ) : (
        <EntityListClient
          table="cms_experience_items"
          rows={rows}
          editHref={(r) => `/admin/experience/${r.id}`}
          deleteConfirmLabel="engagement"
          renderRow={(r) => (
            <>
              <Link
                href={`/admin/experience/${r.id}`}
                className="admintable__title"
              >
                {r.title}
              </Link>
              <p className="admintable__sub">{r.leading_line}</p>
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
