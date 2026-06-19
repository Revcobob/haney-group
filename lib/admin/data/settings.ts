import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";
import {
  siteSettings as fallbackSettings,
  type SiteSettings,
} from "@/content/fallbacks/settings";

export async function getAdminSettings(): Promise<SiteSettings> {
  if (!supabaseServerConfigured) return fallbackSettings;
  const sb = serverSupabase();
  const { data } = await sb
    .from("cms_site_settings")
    .select("setting_key, setting_value_json");
  if (!data || data.length === 0) return fallbackSettings;
  const merged: SiteSettings = { ...fallbackSettings };
  for (const row of data) {
    const k = row.setting_key as string;
    const v = row.setting_value_json;
    if (k in merged && typeof v === "string") {
      (merged as Record<string, string>)[k] = v;
    }
  }
  return merged;
}
