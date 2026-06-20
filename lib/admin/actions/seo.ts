"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import {
  SeoSchema,
  SeoPathCreateSchema,
} from "@/lib/admin/schemas";
import { adminFormAction, type ActionResult } from "./_helpers";

function revalidateAll() {
  revalidatePath("/", "layout");
}

export async function saveGlobalSeoAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const result = await adminFormAction(SeoSchema, formData, async (input, sb) => {
    // Find or create the single global row.
    const { data: existing } = await sb
      .from("cms_seo")
      .select("id")
      .eq("entity_type", "global")
      .maybeSingle();
    const row = {
      entity_type: "global" as const,
      entity_id: null,
      path: null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
      og_title: input.og_title ?? null,
      og_description: input.og_description ?? null,
      og_image_id: input.og_image_id ?? null,
      canonical_path: input.canonical_path ?? null,
      noindex: input.noindex,
    };
    if (existing?.id) {
      const { error } = await sb
        .from("cms_seo")
        .update(row as never)
        .eq("id", existing.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await sb.from("cms_seo").insert(row as never);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
  });
  if (result.ok) revalidateAll();
  return result;
}

export async function savePathSeoAction(
  path: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const result = await adminFormAction(SeoSchema, formData, async (input, sb) => {
    const { data: existing } = await sb
      .from("cms_seo")
      .select("id")
      .eq("entity_type", "path")
      .eq("path", path)
      .maybeSingle();
    const row = {
      entity_type: "path" as const,
      entity_id: null,
      path,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
      og_title: input.og_title ?? null,
      og_description: input.og_description ?? null,
      og_image_id: input.og_image_id ?? null,
      canonical_path: input.canonical_path ?? null,
      noindex: input.noindex,
    };
    if (existing?.id) {
      const { error } = await sb
        .from("cms_seo")
        .update(row as never)
        .eq("id", existing.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await sb.from("cms_seo").insert(row as never);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
  });
  if (result.ok) {
    revalidatePath(path);
    revalidatePath("/admin/seo");
  }
  return result;
}

export async function createSeoPathAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = SeoPathCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? "Please fix the form and try again.",
    };
  }
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { path, ...rest } = parsed.data;
  const row = {
    entity_type: "path" as const,
    entity_id: null,
    path,
    meta_title: rest.meta_title ?? null,
    meta_description: rest.meta_description ?? null,
    og_title: rest.og_title ?? null,
    og_description: rest.og_description ?? null,
    og_image_id: rest.og_image_id ?? null,
    canonical_path: rest.canonical_path ?? null,
    noindex: rest.noindex,
  };
  // Upsert by (entity_type, path) — if a row already exists, redirect to its editor.
  const { data: existing } = await sb
    .from("cms_seo")
    .select("id")
    .eq("entity_type", "path")
    .eq("path", path)
    .maybeSingle();
  if (existing?.id) {
    redirect(`/admin/seo/path?path=${encodeURIComponent(path)}`);
  }
  const { error } = await sb.from("cms_seo").insert(row as never);
  if (error) return { ok: false, error: error.message };
  revalidatePath(path);
  revalidatePath("/admin/seo");
  redirect(`/admin/seo/path?path=${encodeURIComponent(path)}&saved=1`);
}

export async function deleteSeoPathAction(path: string): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { error } = await sb
    .from("cms_seo")
    .delete()
    .eq("entity_type", "path")
    .eq("path", path);
  if (error) return { ok: false, error: error.message };
  revalidatePath(path);
  revalidatePath("/admin/seo");
  return { ok: true };
}
