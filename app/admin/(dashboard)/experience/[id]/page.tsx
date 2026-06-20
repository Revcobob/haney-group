import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import { updateExperienceAction } from "@/lib/admin/actions/experience";

export const metadata: Metadata = { title: "Edit engagement" };

export default async function AdminExperienceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_experience_items", id);
  if (!row) notFound();

  const update = updateExperienceAction.bind(null, id);
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Experience / Edit</p>
        <h1>{(row.title as string) ?? "Edit engagement"}</h1>
        <p>Updates publish immediately.</p>
      </div>
      <ExperienceForm
        action={update}
        cancelHref="/admin/experience"
        defaults={{
          title: row.title as string,
          client_type: (row.client_type as string | null) ?? undefined,
          leading_line: (row.leading_line as string | null) ?? undefined,
          body: (row.body as string | null) ?? undefined,
          image_media_id: (row.image_media_id as string | null) ?? undefined,
          pull_quote: (row.pull_quote as string | null) ?? undefined,
          pull_quote_attribution: (row.pull_quote_attribution as string | null) ?? undefined,
          display_order: row.display_order as number,
          is_visible: row.is_visible as boolean,
        }}
      />
    </>
  );
}
