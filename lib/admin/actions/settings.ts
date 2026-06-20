"use server";

import { revalidatePath } from "next/cache";
import { adminFormAction, type ActionResult } from "./_helpers";
import { SettingsSchema } from "@/lib/admin/schemas";
import { requireFullAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/admin/audit";

export async function saveSettingsAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const admin = await requireFullAdmin();
  const result = await adminFormAction(SettingsSchema, formData, async (input, sb) => {
    const rows = Object.entries(input).map(([setting_key, value]) => ({
      setting_key,
      setting_value_json: value ?? "",
    }));
    const { error } = await sb.from("cms_site_settings").upsert(rows, {
      onConflict: "setting_key",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });
  if (result.ok) {
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    await recordAudit(admin, {
      table: "cms_site_settings",
      action: "update",
    });
  }
  return result;
}
