"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireFullAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { getSectionType } from "@/lib/sections/types";
import { getPageFallback } from "@/content/fallbacks/pages";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { recordAudit } from "@/lib/admin/audit";
import type { ActionResult } from "./_helpers";

const SLUG_TO_PUBLIC_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  experience: "/experience",
  industries: "/industries",
  insights: "/insights",
  contact: "/contact",
  privacy: "/privacy",
};

function publicPathForSlug(slug: string): string {
  return SLUG_TO_PUBLIC_PATH[slug] ?? `/${slug}`;
}

// Parse a FormData into a nested object that matches the schema shape.
// Supports dotted keys (e.g. "primary_cta.label") and bracketed array keys
// (e.g. "items[0].title"). Anything not recognized falls through as a
// string at top level.
function formDataToJson(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [rawKey, rawValue] of formData.entries()) {
    if (rawKey.startsWith("_")) continue; // reserved, e.g. _csrf-style fields
    const value =
      typeof rawValue === "string" ? rawValue : "";
    setDeep(out, rawKey, value);
  }
  return out;
}

function setDeep(
  target: Record<string, unknown>,
  path: string,
  value: string
): void {
  // Tokenize: "items[0].title" → ["items", "[0]", ".title"]
  const tokens: Array<{ kind: "key" | "index"; v: string }> = [];
  let i = 0;
  while (i < path.length) {
    if (path[i] === ".") {
      i++;
      continue;
    }
    if (path[i] === "[") {
      const end = path.indexOf("]", i);
      if (end < 0) break;
      tokens.push({ kind: "index", v: path.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    let j = i;
    while (j < path.length && path[j] !== "." && path[j] !== "[") j++;
    tokens.push({ kind: "key", v: path.slice(i, j) });
    i = j;
  }
  if (tokens.length === 0) return;

  let cursor: Record<string, unknown> | unknown[] = target;
  for (let k = 0; k < tokens.length - 1; k++) {
    const tok = tokens[k];
    const next = tokens[k + 1];
    const wantsArray = next.kind === "index";
    if (tok.kind === "index") {
      const idx = parseInt(tok.v, 10);
      const arr = cursor as unknown[];
      while (arr.length <= idx) arr.push(wantsArray ? [] : {});
      if (arr[idx] === undefined) arr[idx] = wantsArray ? [] : {};
      cursor = arr[idx] as Record<string, unknown> | unknown[];
    } else {
      const obj = cursor as Record<string, unknown>;
      if (obj[tok.v] === undefined) obj[tok.v] = wantsArray ? [] : {};
      cursor = obj[tok.v] as Record<string, unknown> | unknown[];
    }
  }
  const last = tokens[tokens.length - 1];
  if (last.kind === "index") {
    const idx = parseInt(last.v, 10);
    const arr = cursor as unknown[];
    while (arr.length <= idx) arr.push("");
    arr[idx] = value;
  } else {
    (cursor as Record<string, unknown>)[last.v] = value;
  }
}

export type SaveSectionArgs = {
  pageId: string;
  pageSlug: string;
  sectionKey: string;
  sectionLabel: string;
  sectionType: string;
  displayOrder: number;
};

// Section meta is now carried by hidden form inputs (prefixed `_meta_`)
// so a single server action can serve any section without rebinding —
// the dashboard editor and the visual editor both call it the same way.
function readSectionArgs(formData: FormData): SaveSectionArgs {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  return {
    pageId: get("_meta_page_id"),
    pageSlug: get("_meta_page_slug"),
    sectionKey: get("_meta_section_key"),
    sectionLabel: get("_meta_section_label"),
    sectionType: get("_meta_section_type"),
    displayOrder: Number(get("_meta_display_order")) || 0,
  };
}

export async function saveSectionAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!supabaseServerConfigured) {
    return {
      ok: false,
      error:
        "Supabase is not connected. Set the env vars then try again.",
    };
  }
  const args = readSectionArgs(formData);
  if (!args.pageId || !args.sectionKey || !args.sectionType) {
    return {
      ok: false,
      error: "Section context was missing from the form. Reload and try again.",
    };
  }
  const typeDef = getSectionType(args.sectionType);
  if (!typeDef) return { ok: false, error: `Unknown section type: ${args.sectionType}` };

  const raw = formDataToJson(formData);
  // Sanitize every rich-text field on the type before validation so the
  // body_html columns never carry script tags or unsafe attributes.
  for (const field of typeDef.fields) {
    if (field.type === "rich-text") {
      const v = raw[field.key];
      if (typeof v === "string") raw[field.key] = sanitizeArticleHtml(v);
    }
  }
  // Always normalize through the schema so optional fields get their defaults
  // and unrecognized keys get dropped.
  const parsed = typeDef.schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const sb = serverSupabase();

  // Upsert into cms_page_sections by (page_id, section_key). When updating,
  // merge new field values into the existing content_json instead of
  // replacing it — fields the form didn't render (e.g. background_image_url
  // resolved at read time) shouldn't be wiped just because they aren't in
  // the submit body.
  const { data: existing } = await sb
    .from("cms_page_sections")
    .select("id, content_json")
    .eq("page_id", args.pageId)
    .eq("section_key", args.sectionKey)
    .maybeSingle();

  // Shallow + per-key deep merge: existing keys keep their value when the
  // form didn't submit a non-blank value for them.
  const incoming = parsed.data as Record<string, unknown>;
  const previous = (existing?.content_json as Record<string, unknown> | null) ?? {};
  const mergedContent: Record<string, unknown> = { ...previous };
  for (const [k, v] of Object.entries(incoming)) {
    const isBlankString = typeof v === "string" && v.trim().length === 0;
    const isEmptyArray = Array.isArray(v) && v.length === 0;
    if (v === undefined || v === null || isBlankString || isEmptyArray) {
      // Keep whatever was there before.
      continue;
    }
    mergedContent[k] = v;
  }

  const row = {
    page_id: args.pageId,
    section_key: args.sectionKey,
    section_label: args.sectionLabel,
    section_type: args.sectionType,
    content_json: mergedContent,
    display_order: args.displayOrder,
    is_visible: true,
  };

  if (existing?.id) {
    const { error } = await sb
      .from("cms_page_sections")
      .update(row as never)
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await sb.from("cms_page_sections").insert(row as never);
    if (error) return { ok: false, error: error.message };
  }

  const publicPath = publicPathForSlug(args.pageSlug);
  revalidatePath(publicPath);
  revalidatePath(`/admin/pages/${args.pageSlug}`);
  revalidatePath(`/admin/pages/${args.pageSlug}/visual`);
  await recordAudit(admin, {
    table: "cms_page_sections",
    action: "update",
    detail: `${args.pageSlug} · ${args.sectionLabel || args.sectionKey}`,
  });
  return { ok: true };
}

// Reorder every section on a page. Caller submits the new ordering as
// an array of section_keys. For each key:
//   - if a cms_page_sections row exists, its display_order is updated
//     to match the new index;
//   - if not (the section currently lives in the fallback only), we
//     insert a real row using the fallback content_json so the order
//     persists on the public site.
export async function reorderSectionsAction(
  pageId: string,
  pageSlug: string,
  orderedKeys: string[]
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  if (!pageId || orderedKeys.length === 0) {
    return { ok: false, error: "Missing page or ordering." };
  }
  const sb = serverSupabase();
  const fb = getPageFallback(pageSlug);
  const fbByKey = new Map(
    (fb?.sections ?? []).map((s) => [s.section_key, s])
  );

  const { data: existing, error: loadErr } = await sb
    .from("cms_page_sections")
    .select("id, section_key")
    .eq("page_id", pageId);
  if (loadErr) return { ok: false, error: loadErr.message };
  const existingByKey = new Map(
    (existing ?? []).map((r) => [r.section_key as string, r.id as string])
  );

  for (let i = 0; i < orderedKeys.length; i++) {
    const key = orderedKeys[i];
    const newOrder = i + 1;
    const rowId = existingByKey.get(key);
    if (rowId) {
      const { error } = await sb
        .from("cms_page_sections")
        .update({ display_order: newOrder } as never)
        .eq("id", rowId);
      if (error) return { ok: false, error: error.message };
      continue;
    }
    // No row yet — promote the fallback section to a real row so the
    // ordering sticks.
    const fbSection = fbByKey.get(key);
    if (!fbSection) continue; // unknown key; ignore quietly
    const { error } = await sb.from("cms_page_sections").insert({
      page_id: pageId,
      section_key: fbSection.section_key,
      section_label: fbSection.section_label,
      section_type: fbSection.section_type,
      content_json: fbSection.content_json,
      display_order: newOrder,
      is_visible: true,
    } as never);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(publicPathForSlug(pageSlug));
  revalidatePath(`/admin/pages/${pageSlug}`);
  revalidatePath(`/admin/pages/${pageSlug}/visual`);
  await recordAudit(admin, {
    table: "cms_page_sections",
    action: "reorder",
    detail: `${pageSlug} · ${orderedKeys.length} sections`,
  });
  return { ok: true };
}

// Reset a single section's content back to whatever the in-tree
// fallback defines. Useful when an experimental edit broke a section
// and the admin wants to recover without touching the database.
export async function resetSectionToDefaultAction(
  pageId: string,
  pageSlug: string,
  sectionKey: string
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  if (!pageId || !sectionKey) {
    return { ok: false, error: "Missing page or section key." };
  }
  const fb = getPageFallback(pageSlug);
  const fbSection = fb?.sections.find((s) => s.section_key === sectionKey);
  if (!fbSection) {
    return {
      ok: false,
      error: "No default content exists for this section.",
    };
  }
  const sb = serverSupabase();
  const { data: existing } = await sb
    .from("cms_page_sections")
    .select("id")
    .eq("page_id", pageId)
    .eq("section_key", sectionKey)
    .maybeSingle();

  const row = {
    page_id: pageId,
    section_key: fbSection.section_key,
    section_label: fbSection.section_label,
    section_type: fbSection.section_type,
    content_json: fbSection.content_json,
    display_order: fbSection.display_order,
    is_visible: true,
  };

  if (existing?.id) {
    const { error } = await sb
      .from("cms_page_sections")
      .update(row as never)
      .eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await sb.from("cms_page_sections").insert(row as never);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(publicPathForSlug(pageSlug));
  revalidatePath(`/admin/pages/${pageSlug}`);
  revalidatePath(`/admin/pages/${pageSlug}/visual`);
  await recordAudit(admin, {
    table: "cms_page_sections",
    action: "reset",
    detail: `${pageSlug} · ${fbSection.section_label}`,
  });
  return { ok: true };
}

// Toggle a page between "published" (live) and "draft" (hidden from
// the public site). Public reads filter on status='published'.
export async function setPageStatusAction(
  pageSlug: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const admin = await requireFullAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  if (!pageSlug) return { ok: false, error: "Missing page slug." };
  const sb = serverSupabase();
  const { error } = await sb
    .from("cms_pages")
    .update({ status } as never)
    .eq("slug", pageSlug);
  if (error) return { ok: false, error: error.message };
  revalidatePath(publicPathForSlug(pageSlug));
  revalidatePath("/admin/pages");
  await recordAudit(admin, {
    table: "cms_pages",
    action: status === "published" ? "publish" : "unpublish",
    detail: pageSlug,
  });
  return { ok: true };
}

// "Seed this page from fallback" — bulk insert the fallback sections for a
// page that hasn't been edited yet. Handy when you want a starting point.
export async function seedPageFromFallbackAction(
  pageId: string,
  pageSlug: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not connected." };
  }
  const fb = getPageFallback(pageSlug);
  if (!fb) return { ok: false, error: "No fallback content for this page." };

  const sb = serverSupabase();
  const rows = fb.sections.map((s) => ({
    page_id: pageId,
    section_key: s.section_key,
    section_label: s.section_label,
    section_type: s.section_type,
    content_json: s.content_json,
    display_order: s.display_order,
    is_visible: true,
  }));
  // upsert-by-section_key for idempotency
  const { error } = await sb
    .from("cms_page_sections")
    .upsert(rows as never, { onConflict: "page_id,section_key" });
  if (error) return { ok: false, error: error.message };

  revalidatePath(publicPathForSlug(pageSlug));
  revalidatePath(`/admin/pages/${pageSlug}`);
  return { ok: true };
}
