import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { NavItemForm } from "@/components/admin/forms/NavItemForm";
import { updateNavItemAction } from "@/lib/admin/actions/navigation";

export const metadata: Metadata = { title: "Edit nav link" };

export default async function AdminNavEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_navigation_items", id);
  if (!row) notFound();

  const update = updateNavItemAction.bind(null, id);
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Navigation / Edit</p>
        <h1>{(row.label as string) ?? "Edit link"}</h1>
      </div>
      <NavItemForm
        action={update}
        cancelHref="/admin/navigation"
        defaults={{
          nav_area: row.nav_area as
            | "header"
            | "footer_primary"
            | "footer_utility"
            | "utility_bar",
          label: row.label as string,
          href: row.href as string,
          display_order: row.display_order as number,
          is_visible: row.is_visible as boolean,
        }}
      />
    </>
  );
}
