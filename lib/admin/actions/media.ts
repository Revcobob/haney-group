"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { MediaUpdateSchema } from "@/lib/admin/schemas";
import type { ActionResult } from "./_helpers";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const BUCKETS = new Set([
  "site-media",
  "hero-images",
  "insight-images",
  "client-logos",
  "og-images",
]);

function slugifyFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const stem = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const safe = stem
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${safe || "upload"}-${Date.now().toString(36)}${ext}`;
}

export async function uploadMediaAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected. Set the env vars to upload." };
  }

  const file = formData.get("file");
  const bucketIn = String(formData.get("bucket") ?? "site-media");
  const altText = String(formData.get("alt_text") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose a file to upload." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: "Allowed image types: JPG, PNG, WebP, GIF. SVG uploads are disabled.",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "File is larger than 8 MB. Compress and retry." };
  }
  const bucket = BUCKETS.has(bucketIn) ? bucketIn : "site-media";

  const sb = serverSupabase();
  const path = slugifyFilename(file.name);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await sb.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000, immutable",
      upsert: false,
    });
  if (upErr) return { ok: false, error: `Upload failed: ${upErr.message}` };

  const { data: pub } = sb.storage.from(bucket).getPublicUrl(path);

  const { error: insErr } = await sb.from("cms_media").insert({
    file_name: file.name,
    file_path: path,
    bucket,
    public_url: pub.publicUrl,
    mime_type: file.type,
    size_bytes: file.size,
    alt_text: altText || null,
    category: category || null,
    uploaded_by: admin.id,
  });
  if (insErr) {
    // Best-effort: try to delete the uploaded file so we don't orphan it.
    await sb.storage.from(bucket).remove([path]);
    return { ok: false, error: `Saving metadata failed: ${insErr.message}` };
  }

  revalidatePath("/admin/media");
  return { ok: true };
}

export async function updateMediaAction(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  const raw = Object.fromEntries(formData.entries());
  const parsed = MediaUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const sb = serverSupabase();
  const { error } = await sb
    .from("cms_media")
    .update({
      alt_text: parsed.data.alt_text ?? null,
      caption: parsed.data.caption ?? null,
      category: parsed.data.category ?? null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${id}`);
  return { ok: true };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  const sb = serverSupabase();
  const { data: row } = await sb
    .from("cms_media")
    .select("bucket, file_path")
    .eq("id", id)
    .maybeSingle();
  if (row?.bucket && row?.file_path) {
    await sb.storage.from(row.bucket as string).remove([row.file_path as string]);
  }
  const { error } = await sb.from("cms_media").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}
