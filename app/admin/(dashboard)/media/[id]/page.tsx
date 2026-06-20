import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdminRow } from "@/lib/admin/data/entities";
import { MediaEditForm } from "@/components/admin/MediaEditForm";

export const metadata: Metadata = { title: "Edit file" };

export default async function AdminMediaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getAdminRow("cms_media", id);
  if (!row) notFound();

  const url = (row.public_url as string) ?? "";
  const altText = (row.alt_text as string | null) ?? "";

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Media / Edit</p>
        <h1>{(row.file_name as string) ?? "Edit file"}</h1>
        <p>
          ID <code style={{ fontSize: 12 }}>{id}</code> · Use this ID when
          attaching this file to a service, industry, engagement, or client logo.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: 28 }}>
        <div className="admin__card" style={{ padding: 16 }}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={altText}
              style={{ width: "100%", borderRadius: "var(--radius-sm)" }}
            />
          ) : null}
          <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-3)" }}>
            <p style={{ margin: 0 }}>Bucket: {row.bucket as string}</p>
            <p style={{ margin: "4px 0 0" }}>Path: {row.file_path as string}</p>
            <p style={{ margin: "4px 0 0" }}>
              MIME: {row.mime_type as string} · {Math.round((row.size_bytes as number) / 1024)} KB
            </p>
            <p style={{ margin: "8px 0 0" }}>
              <a href={url} target="_blank" rel="noopener" style={{ color: "var(--navy-900)", textDecoration: "underline" }}>
                Open public URL
              </a>
            </p>
          </div>
        </div>

        <MediaEditForm
          id={id}
          defaults={{
            alt_text: altText,
            caption: (row.caption as string | null) ?? "",
            category: (row.category as string | null) ?? "",
          }}
        />
      </div>
    </>
  );
}
