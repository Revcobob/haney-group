import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPathSeoRow } from "@/lib/admin/data/seo";
import { getAdminRow } from "@/lib/admin/data/entities";
import { SeoForm } from "@/components/admin/forms/SeoForm";
import { savePathSeoAction, deleteSeoPathAction } from "@/lib/admin/actions/seo";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Page SEO" };

export default async function AdminSeoPathPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; saved?: string }>;
}) {
  const { path: rawPath, saved } = await searchParams;
  if (!rawPath) redirect("/admin/seo");
  const path = rawPath;

  const row = supabaseServerConfigured ? await getPathSeoRow(path) : null;
  const ogMedia = row?.og_image_id
    ? await getAdminRow("cms_media", row.og_image_id)
    : null;

  const action = savePathSeoAction.bind(null, path);

  async function onDelete() {
    "use server";
    await deleteSeoPathAction(path);
    redirect("/admin/seo");
  }

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">
          <Link href="/admin/seo" style={{ color: "inherit" }}>
            ← All SEO
          </Link>
        </p>
        <h1>
          SEO for <code style={{ fontSize: "0.85em" }}>{path}</code>
        </h1>
        <p>
          Overrides global defaults for this path. Leave a field blank to
          inherit from global defaults; leave everything blank to behave the
          same as having no row at all.
        </p>
      </div>

      {saved ? (
        <div className="admin__notice admin__notice--info" role="status">
          <div>
            <strong>Saved.</strong>
            <p>Changes are live at {path}.</p>
          </div>
        </div>
      ) : null}

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>You can review the form but saving is disabled.</p>
          </div>
        </div>
      ) : null}

      <SeoForm
        action={action}
        pathHint={path}
        cancelHref="/admin/seo"
        defaults={
          row
            ? {
                meta_title: row.meta_title ?? undefined,
                meta_description: row.meta_description ?? undefined,
                og_title: row.og_title ?? undefined,
                og_description: row.og_description ?? undefined,
                og_image_id: row.og_image_id ?? undefined,
                og_image_url:
                  (ogMedia?.public_url as string | undefined) ?? undefined,
                canonical_path: row.canonical_path ?? undefined,
                noindex: row.noindex,
              }
            : undefined
        }
      />

      {row ? (
        <form action={onDelete} style={{ marginTop: 24 }}>
          <button type="submit" className="adminbtn adminbtn--danger adminbtn--small">
            Remove SEO override (revert to defaults)
          </button>
        </form>
      ) : null}
    </>
  );
}
