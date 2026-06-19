/* eslint-disable no-console */
/**
 * Seed Supabase with the current static fallback content.
 *
 * Run:
 *   npm run seed                # idempotent: skips rows that already exist
 *   npm run seed -- --reset     # truncates each cms_ table first (destructive)
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env.
 *
 * Image handling: each unique /assets/...  path in the fallbacks gets one
 * cms_media row whose public_url IS that /assets/ path. That keeps existing
 * static files working — Phase 4 lets you re-upload through the Media
 * Library to migrate into Supabase Storage proper.
 */
import { createClient } from "@supabase/supabase-js";
import { serviceCards } from "../content/fallbacks/services";
import { industryCards } from "../content/fallbacks/industries";
import { experienceItems } from "../content/fallbacks/experience";
import { clientLogos, clientDisclaimer } from "../content/fallbacks/clients";
import {
  headerNav,
  footerServicesNav,
  footerFirmNav,
  utilityNav,
} from "../content/fallbacks/navigation";
import { siteSettings } from "../content/fallbacks/settings";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESET = process.argv.includes("--reset");

if (!URL || !KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Add them to .env.local and re-run."
  );
  process.exit(1);
}

const sb = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function reset(table: string) {
  const { error } = await sb.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(`reset ${table}: ${error.message}`);
}

type MediaMap = Map<string, string>;

async function ensureMedia(paths: Iterable<string>, category: string): Promise<MediaMap> {
  const map: MediaMap = new Map();
  for (const path of new Set(paths)) {
    if (!path) continue;
    const filePath = path.replace(/^\//, "");
    const fileName = path.split("/").pop() ?? "asset";

    // Look up existing row by file_path within bucket "static".
    const { data: existing } = await sb
      .from("cms_media")
      .select("id")
      .eq("bucket", "static")
      .eq("file_path", filePath)
      .maybeSingle();
    if (existing?.id) {
      map.set(path, existing.id as string);
      continue;
    }

    const mime =
      filePath.endsWith(".png")
        ? "image/png"
        : filePath.endsWith(".webp")
        ? "image/webp"
        : filePath.endsWith(".svg")
        ? "image/svg+xml"
        : filePath.endsWith(".gif")
        ? "image/gif"
        : "image/jpeg";

    const { data: ins, error } = await sb
      .from("cms_media")
      .insert({
        file_name: fileName,
        file_path: filePath,
        bucket: "static",
        public_url: path,
        mime_type: mime,
        size_bytes: 0,
        alt_text: null,
        category,
      })
      .select("id")
      .single();
    if (error) throw new Error(`insert media ${path}: ${error.message}`);
    map.set(path, ins.id as string);
  }
  return map;
}

async function upsertOne(table: string, where: Record<string, unknown>, row: Record<string, unknown>) {
  const { data: existing } = await sb
    .from(table)
    .select("id")
    .match(where)
    .maybeSingle();
  if (existing?.id) {
    const { error } = await sb.from(table).update(row).eq("id", existing.id);
    if (error) throw new Error(`update ${table}: ${error.message}`);
    return existing.id as string;
  }
  const { data: ins, error } = await sb.from(table).insert(row).select("id").single();
  if (error) throw new Error(`insert ${table}: ${error.message}`);
  return ins.id as string;
}

async function seedSettings() {
  const rows = [
    ...Object.entries(siteSettings).map(([k, v]) => ({
      setting_key: k,
      setting_value_json: v,
    })),
    { setting_key: "client_disclaimer", setting_value_json: clientDisclaimer },
  ];
  const { error } = await sb
    .from("cms_site_settings")
    .upsert(rows, { onConflict: "setting_key" });
  if (error) throw new Error(`settings: ${error.message}`);
  console.log(`✓ Settings (${rows.length} keys)`);
}

async function seedNavigation() {
  if (RESET) await reset("cms_navigation_items");
  const all = [
    ...headerNav.map((n) => ({ ...n, nav_area: "header", is_visible: true })),
    ...footerServicesNav.map((n) => ({ ...n, nav_area: "footer_primary", is_visible: true })),
    ...footerFirmNav.map((n) => ({ ...n, nav_area: "utility_bar", is_visible: true })),
    ...utilityNav.map((n) => ({ ...n, nav_area: "footer_utility", is_visible: true })),
  ];
  for (const n of all) {
    await upsertOne(
      "cms_navigation_items",
      { nav_area: n.nav_area, label: n.label },
      n
    );
  }
  console.log(`✓ Navigation (${all.length} links)`);
}

async function seedServices() {
  if (RESET) await reset("cms_services");
  const media = await ensureMedia(
    serviceCards.map((s) => s.icon),
    "service-icon"
  );
  for (const s of serviceCards) {
    await upsertOne(
      "cms_services",
      { title: s.title },
      {
        title: s.title,
        description: s.description,
        href: s.href ?? null,
        icon_media_id: media.get(s.icon) ?? null,
        display_order: s.display_order,
        is_visible: true,
      }
    );
  }
  console.log(`✓ Services (${serviceCards.length})`);
}

async function seedIndustries() {
  if (RESET) await reset("cms_industries");
  const media = await ensureMedia(
    industryCards.map((i) => i.image),
    "industry-illustration"
  );
  for (const i of industryCards) {
    await upsertOne(
      "cms_industries",
      { title: i.title },
      {
        title: i.title,
        description: i.description,
        illustration_media_id: media.get(i.image) ?? null,
        display_order: i.display_order,
        is_visible: true,
      }
    );
  }
  console.log(`✓ Industries (${industryCards.length})`);
}

async function seedExperience() {
  if (RESET) await reset("cms_experience_items");
  const media = await ensureMedia(
    experienceItems.map((e) => e.image),
    "experience"
  );
  for (const e of experienceItems) {
    const mediaId = media.get(e.image);
    if (mediaId && e.image_alt) {
      // Ensure the media row carries the alt text.
      await sb.from("cms_media").update({ alt_text: e.image_alt }).eq("id", mediaId);
    }
    await upsertOne(
      "cms_experience_items",
      { title: e.title },
      {
        title: e.title,
        client_type: e.client_type,
        leading_line: e.leading_line,
        body: e.body,
        image_media_id: mediaId ?? null,
        display_order: e.display_order,
        is_visible: true,
      }
    );
  }
  console.log(`✓ Experience (${experienceItems.length})`);
}

async function seedClientLogos() {
  if (RESET) await reset("cms_client_logos");
  const media = await ensureMedia(
    clientLogos.map((c) => c.logo),
    "client-logo"
  );
  for (const c of clientLogos) {
    const mediaId = media.get(c.logo);
    if (mediaId) {
      await sb.from("cms_media").update({ alt_text: c.alt_text }).eq("id", mediaId);
    }
    await upsertOne(
      "cms_client_logos",
      { client_name: c.client_name },
      {
        client_name: c.client_name,
        logo_media_id: mediaId ?? null,
        website_url: c.website_url,
        alt_text: c.alt_text,
        client_status: c.client_status,
        display_order: c.display_order,
        is_visible: true,
      }
    );
  }
  console.log(`✓ Client logos (${clientLogos.length})`);
}

async function main() {
  console.log(`Seeding Supabase at ${URL}${RESET ? " (RESET)" : ""}…`);
  await seedSettings();
  await seedNavigation();
  await seedServices();
  await seedIndustries();
  await seedExperience();
  await seedClientLogos();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
