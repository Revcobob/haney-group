import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { ClientLogoForm } from "@/components/admin/forms/ClientLogoForm";
import { updateClientLogoAction } from "@/lib/admin/actions/clients";

export const metadata: Metadata = { title: "Edit client logo" };

export default async function AdminClientsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_client_logos", id);
  if (!row) notFound();

  const update = updateClientLogoAction.bind(null, id);
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Clients / Edit</p>
        <h1>{(row.client_name as string) ?? "Edit client logo"}</h1>
        <p>Updates publish immediately.</p>
      </div>
      <ClientLogoForm
        action={update}
        cancelHref="/admin/clients"
        defaults={{
          client_name: row.client_name as string,
          logo_media_id: (row.logo_media_id as string | null) ?? undefined,
          website_url: (row.website_url as string | null) ?? undefined,
          alt_text: (row.alt_text as string | null) ?? undefined,
          client_status: ((row.client_status as string) ?? "current") as
            | "current"
            | "past",
          display_order: row.display_order as number,
          is_visible: row.is_visible as boolean,
        }}
      />
    </>
  );
}
