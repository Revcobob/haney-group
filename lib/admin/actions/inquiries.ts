"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import type { ActionResult } from "./_helpers";
import type { InquiryStatus } from "@/lib/admin/data/inquiries";

const ALLOWED_STATUSES: InquiryStatus[] = [
  "new",
  "reviewed",
  "responded",
  "archived",
  "spam",
];

function isStatus(v: unknown): v is InquiryStatus {
  return typeof v === "string" && (ALLOWED_STATUSES as string[]).includes(v);
}

export async function setInquiryStatusAction(
  id: string,
  next: InquiryStatus
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!isStatus(next)) return { ok: false, error: "Invalid status." };

  const sb = serverSupabase();
  const { error } = await sb
    .from("cms_contact_inquiries")
    .update({ status: next } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

export async function deleteInquiryAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const sb = serverSupabase();
  const { error } = await sb.from("cms_contact_inquiries").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}

const NotesSchema = z.object({
  notes: z.string().max(5000).optional(),
});

export async function saveInquiryNotesAction(
  id: string,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const parsed = NotesSchema.safeParse({
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, error: "Notes are too long." };
  }
  const sb = serverSupabase();
  const { error } = await sb
    .from("cms_contact_inquiries")
    .update({ notes: parsed.data.notes ?? null } as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true };
}

// Same write, then bounce back to the list. Used by the "Save & return"
// button — the redirect throws, which React/Next handles natively, so
// the action signature stays simple and doesn't need useActionState.
export async function saveInquiryNotesAndReturnAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  if (!supabaseServerConfigured) {
    redirect("/admin/inquiries");
  }
  const parsed = NotesSchema.safeParse({
    notes: String(formData.get("notes") ?? ""),
  });
  if (parsed.success) {
    const sb = serverSupabase();
    await sb
      .from("cms_contact_inquiries")
      .update({ notes: parsed.data.notes ?? null } as never)
      .eq("id", id);
  }
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}

// CSV export (server action invoked from a form button). Generates a CSV
// string and triggers a download via redirect to a data-URL-style route.
// We avoid data URLs at scale by streaming through a one-shot endpoint.
export async function exportInquiriesAction(): Promise<void> {
  await requireAdmin();
  // Redirect to the streaming endpoint, which itself re-checks admin.
  redirect("/api/admin/inquiries/export");
}
