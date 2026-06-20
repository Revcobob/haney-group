import type { Metadata } from "next";
import Link from "next/link";
import { listAdminRows } from "@/lib/admin/data/entities";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage() {
  const rows = supabaseServerConfigured
    ? await listAdminRows("cms_media", "created_at")
    : [];

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

      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
          {rows.length} {rows.length === 1 ? "file" : "files"}
        </h2>

        {rows.length === 0 ? (
          <div className="admintable">
            <div className="admintable__empty">
              {supabaseServerConfigured
                ? "No uploads yet. Use the form above to add your first file."
                : "Uploaded files will appear here once Supabase is connected."}
            </div>
          </div>
        ) : (
          <div className="mediagrid">
            {rows.map((r) => {
              const id = r.id as string;
              const url = (r.public_url as string) ?? "";
              const name = (r.file_name as string) ?? "Untitled";
              const altText = (r.alt_text as string | null) ?? "";
              const mime = (r.mime_type as string) ?? "";
              return (
                <Link key={id} href={`/admin/media/${id}`} className="mediagrid__item">
                  <div className="mediagrid__thumb">
                    {url ? (
                      <img src={url} alt={altText} loading="lazy" />
                    ) : null}
                  </div>
                  <div className="mediagrid__body">
                    <p className="mediagrid__name">{name}</p>
                    <p className="mediagrid__meta">
                      {mime.replace(/^image\//, "").toUpperCase()}{" "}
                      {altText ? null : (
                        <span className="mediagrid__noalt">· Missing alt</span>
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
