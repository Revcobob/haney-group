import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { IndustryForm } from "@/components/admin/forms/IndustryForm";
import { updateIndustryAction } from "@/lib/admin/actions/industries";

export const metadata: Metadata = { title: "Edit industry" };

export default async function AdminIndustryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_industries", id);
  if (!row) notFound();

  const update = updateIndustryAction.bind(null, id);
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Industries / Edit</p>
        <h1>{(row.title as string) ?? "Edit industry"}</h1>
        <p>Updates publish immediately.</p>
      </div>
      <IndustryForm
        action={update}
        cancelHref="/admin/industries"
        defaults={{
          title: row.title as string,
          description: row.description as string,
          illustration_media_id: (row.illustration_media_id as string | null) ?? undefined,
          display_order: row.display_order as number,
          is_visible: row.is_visible as boolean,
        }}
      />
    </>
  );
}
