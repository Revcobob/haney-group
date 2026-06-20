"use server";

import { revalidatePath } from "next/cache";
import { adminFormAction, type ActionResult } from "./_helpers";
import {
  ServiceSchema,
  IndustrySchema,
  ExperienceSchema,
  ClientLogoSchema,
  NavItemSchema,
} from "@/lib/admin/schemas";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

type EntityTable =
  | "cms_services"
  | "cms_industries"
  | "cms_experience_items"
  | "cms_client_logos"
  | "cms_navigation_items";

const schemaFor = {
  cms_services: ServiceSchema,
  cms_industries: IndustrySchema,
  cms_experience_items: ExperienceSchema,
  cms_client_logos: ClientLogoSchema,
  cms_navigation_items: NavItemSchema,
} as const;

const revalidationPathsFor: Record<EntityTable, string[]> = {
  cms_services: ["/", "/services"],
  cms_industries: ["/industries"],
  cms_experience_items: ["/experience"],
  cms_client_logos: ["/industries"],
  cms_navigation_items: ["/"],
};

const adminListPathFor: Record<EntityTable, string> = {
  cms_services: "/admin/services",
  cms_industries: "/admin/industries",
  cms_experience_items: "/admin/experience",
  cms_client_logos: "/admin/clients",
  cms_navigation_items: "/admin/navigation",
};

export async function createEntityAction(
  table: EntityTable,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const schema = schemaFor[table];
  const result = await adminFormAction(schema, formData, async (input, sb) => {
    const { error } = await sb.from(table).insert(input as never);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });
  if (result.ok) {
    revalidatePath("/", "layout");
    revalidatePath(adminListPathFor[table]);
    for (const p of revalidationPathsFor[table]) revalidatePath(p);
  }
  return result;
}

export async function updateEntityAction(
  table: EntityTable,
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const schema = schemaFor[table];
  const result = await adminFormAction(schema, formData, async (input, sb) => {
    const { error } = await sb.from(table).update(input as never).eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });
  if (result.ok) {
    revalidatePath("/", "layout");
    revalidatePath(adminListPathFor[table]);
    for (const p of revalidationPathsFor[table]) revalidatePath(p);
  }
  return result;
}

export async function deleteEntityAction(
  table: EntityTable,
  id: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(adminListPathFor[table]);
  for (const p of revalidationPathsFor[table]) revalidatePath(p);
  return { ok: true };
}

export async function toggleVisibilityAction(
  table: EntityTable,
  id: string,
  next: boolean
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { error } = await sb.from(table).update({ is_visible: next }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath(adminListPathFor[table]);
  for (const p of revalidationPathsFor[table]) revalidatePath(p);
  return { ok: true };
}

// Bulk reorder rows in any entity table. Caller supplies the row IDs in
// the desired order; display_order is overwritten 1..N to match.
export async function reorderEntityAction(
  table: EntityTable,
  orderedIds: string[]
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (orderedIds.length === 0) return { ok: true };
  const sb = serverSupabase();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await sb
      .from(table)
      .update({ display_order: i + 1 } as never)
      .eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/", "layout");
  revalidatePath(adminListPathFor[table]);
  for (const p of revalidationPathsFor[table]) revalidatePath(p);
  return { ok: true };
}

// Apply visibility OR delete to many rows at once.
export async function bulkEntityAction(
  table: EntityTable,
  ids: string[],
  op: "hide" | "show" | "delete"
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (ids.length === 0) return { ok: true };
  const sb = serverSupabase();
  if (op === "delete") {
    const { error } = await sb.from(table).delete().in("id", ids);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await sb
      .from(table)
      .update({ is_visible: op === "show" } as never)
      .in("id", ids);
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/", "layout");
  revalidatePath(adminListPathFor[table]);
  for (const p of revalidationPathsFor[table]) revalidatePath(p);
  return { ok: true };
}
