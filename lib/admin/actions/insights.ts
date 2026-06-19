"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { ArticleSchema } from "@/lib/admin/schemas";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { adminFormAction, type ActionResult } from "./_helpers";

function revalidateInsights(slug?: string) {
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function createArticleAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const result = await adminFormAction<typeof ArticleSchema, { id: string; slug: string }>(
    ArticleSchema,
    formData,
    async (input, sb) => {
      const row = {
        ...input,
        body_html: sanitizeArticleHtml(input.body_html ?? ""),
        published_at:
          input.status === "published" ? new Date().toISOString() : null,
      };
      const { data, error } = await sb
        .from("cms_articles")
        .insert(row as never)
        .select("id, slug")
        .single();
      if (error) return { ok: false, error: error.message };
      return {
        ok: true,
        data: { id: data.id as string, slug: data.slug as string },
      };
    }
  );
  if (result.ok && result.data) {
    revalidateInsights(result.data.slug);
    redirect(`/admin/insights/${result.data.id}?saved=1`);
  }
  return { ok: result.ok, ...(result.ok ? {} : { error: result.error, fieldErrors: result.fieldErrors }) } as ActionResult;
}

export async function updateArticleAction(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const result = await adminFormAction<typeof ArticleSchema, { slug: string }>(
    ArticleSchema,
    formData,
    async (input, sb) => {
      const { data: existing } = await sb
        .from("cms_articles")
        .select("published_at, status, slug")
        .eq("id", id)
        .maybeSingle();

      const published_at =
        input.status === "published"
          ? (existing?.published_at as string | null) ??
            new Date().toISOString()
          : null;

      const row = {
        ...input,
        body_html: sanitizeArticleHtml(input.body_html ?? ""),
        published_at,
      };
      const { error } = await sb
        .from("cms_articles")
        .update(row as never)
        .eq("id", id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, data: { slug: input.slug } };
    }
  );
  if (result.ok && result.data) {
    revalidateInsights(result.data.slug);
  }
  return { ok: result.ok, ...(result.ok ? {} : { error: result.error, fieldErrors: result.fieldErrors }) } as ActionResult;
}

export async function deleteArticleAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { data: row } = await sb
    .from("cms_articles")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  const { error } = await sb.from("cms_articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateInsights((row?.slug as string | undefined) ?? undefined);
  revalidatePath("/admin/insights");
  return { ok: true };
}

export async function togglePublishAction(
  id: string,
  next: "draft" | "published"
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { data: existing } = await sb
    .from("cms_articles")
    .select("published_at, slug")
    .eq("id", id)
    .maybeSingle();
  const updates: Record<string, unknown> = { status: next };
  if (next === "published") {
    updates.published_at =
      (existing?.published_at as string | null) ?? new Date().toISOString();
  }
  const { error } = await sb
    .from("cms_articles")
    .update(updates as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateInsights((existing?.slug as string | undefined) ?? undefined);
  revalidatePath("/admin/insights");
  return { ok: true };
}
