import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { updateServiceAction } from "@/lib/admin/actions/services";

export const metadata: Metadata = { title: "Edit service" };

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_services", id);
  if (!row) notFound();

  const update = updateServiceAction.bind(null, id);
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Services / Edit</p>
        <h1>{(row.title as string) ?? "Edit service"}</h1>
        <p>Updates publish immediately. Hide the row first if you want to draft.</p>
      </div>
      <ServiceForm
        action={update}
        cancelHref="/admin/services"
        defaults={{
          title: row.title as string,
          description: row.description as string,
          href: (row.href as string | null) ?? undefined,
          icon_media_id: (row.icon_media_id as string | null) ?? undefined,
          display_order: row.display_order as number,
          is_visible: row.is_visible as boolean,
        }}
      />
    </>
  );
}
