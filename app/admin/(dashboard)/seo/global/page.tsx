import type { Metadata } from "next";
import Link from "next/link";
import { getGlobalSeoRow } from "@/lib/admin/data/seo";
import { getAdminRow } from "@/lib/admin/data/entities";
import { SeoForm } from "@/components/admin/forms/SeoForm";
import { saveGlobalSeoAction } from "@/lib/admin/actions/seo";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Global SEO defaults" };

export default async function AdminSeoGlobalPage() {
  const row = supabaseServerConfigured ? await getGlobalSeoRow() : null;
  const ogMedia = row?.og_image_id
    ? await getAdminRow("cms_media", row.og_image_id)
    : null;

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">
          <Link href="/admin/seo" style={{ color: "inherit" }}>
            ← All SEO
          </Link>
        </p>
        <h1>Global SEO defaults</h1>
        <p>
          These values are used when a page doesn’t set its own title,
          description, or social image. They’re also the only values used on
          paths that don’t have a custom row yet.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>You can review the form but saving is disabled.</p>
          </div>
        </div>
      ) : null}

      <SeoForm
        action={saveGlobalSeoAction}
        pathHint="/"
        cancelHref="/admin/seo"
        showNoindex={false}
        defaults={
          row
            ? {
                meta_title: row.meta_title ?? undefined,
                meta_description: row.meta_description ?? undefined,
                og_title: row.og_title ?? undefined,
                og_description: row.og_description ?? undefined,
                og_image_id: row.og_image_id ?? undefined,
                og_image_url: (ogMedia?.public_url as string | undefined) ?? undefined,
                canonical_path: row.canonical_path ?? undefined,
                noindex: row.noindex,
              }
            : undefined
        }
      />
    </>
  );
}
