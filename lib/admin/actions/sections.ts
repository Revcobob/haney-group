"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import { getSectionType } from "@/lib/sections/types";
import { getPageFallback } from "@/content/fallbacks/pages";
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

export async function saveSectionAction(
  args: {
    pageId: string;
    pageSlug: string;
    sectionKey: string;
    sectionLabel: string;
    sectionType: string;
    displayOrder: number;
  },
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return {
      ok: false,
      error:
        "Supabase is not connected. Set the env vars then try again.",
    };
  }
  const typeDef = getSectionType(args.sectionType);
  if (!typeDef) return { ok: false, error: `Unknown section type: ${args.sectionType}` };

  const raw = formDataToJson(formData);
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
