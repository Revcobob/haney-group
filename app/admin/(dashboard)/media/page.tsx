import type { Metadata } from "next";
import { listAdminRows, type AdminRow } from "@/lib/admin/data/entities";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { MediaList, type MediaListItem } from "@/components/admin/MediaList";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Media Library" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let raw: AdminRow[] = [];
  let loadError: string | null = null;
  if (supabaseServerConfigured) {
    try {
      raw = await listAdminRows("cms_media", "created_at");
    } catch (e) {
      // Don't crash the whole route just because cms_media can't be read —
      // an editor still needs the upload form to triage the problem.
      loadError = e instanceof Error ? e.message : "Unknown error";
      console.error("[admin/media] failed to load cms_media rows", loadError);
    }
  }
  // listAdminRows sorts ascending; flip so the most recent uploads appear
  // at the top of the grid where the editor will look for them.
  const rows = [...raw].reverse();

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Media</p>
        <h1>Media library</h1>
        <p>
          Images used across the public site. Click a tile to edit alt text,
          caption, or category. Files live in Supabase Storage.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              Connect Supabase to upload and manage media. Existing assets in
              <code> /public/assets/</code> continue to serve the public site.
            </p>
          </div>
        </div>
      ) : (
        <MediaUpload />
      )}

      {loadError ? (
        <div className="admin__notice admin__notice--warning" style={{ marginTop: 18 }}>
          <div>
            <strong>Couldn’t load the media library.</strong>
            <p>
              Supabase replied: <code>{loadError}</code>. Common causes: the{" "}
              <code>cms_media</code> table or one of the storage buckets hasn’t
              been created (run <code>supabase/migrations/0001_initial_schema.sql</code>{" "}
              and <code>0003_storage_buckets.sql</code>), or the service-role
              key is wrong / expired.
            </p>
          </div>
        </div>
      ) : null}

      <MediaList
        items={rows.map<MediaListItem>((r) => ({
          id: r.id as string,
          public_url: (r.public_url as string) ?? "",
          file_name: (r.file_name as string) ?? "Untitled",
          alt_text: (r.alt_text as string | null) ?? "",
          mime_type: (r.mime_type as string) ?? "",
        }))}
      />
    </>
  );
}
