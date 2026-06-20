"use server";

import { revalidatePath } from "next/cache";
import { adminFormAction, type ActionResult } from "./_helpers";
import { SettingsSchema } from "@/lib/admin/schemas";

export async function saveSettingsAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
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
  }
  return result;
}
