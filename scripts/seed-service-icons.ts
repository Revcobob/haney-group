/* eslint-disable no-console */
/**
 * Re-point every cms_services row's icon to the SVG that the fallback
 * (content/fallbacks/services.ts) currently names. Idempotent —
 * matches services by title, finds-or-creates a cms_media row for the
 * fallback's icon path, and updates icon_media_id only if it's
 * different.
 *
 *   npm run seed:icons
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
 * .env.local — same env as the rest of the seed scripts.
 *
 * SVG files themselves live in /public/assets/img/icons/ and are
 * served as static assets; this script doesn't upload anything, it
 * just makes sure the cms_media + cms_services rows agree with the
 * fallback.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { serviceCards } from "../content/fallbacks/services";

(function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) {
    console.error(
      "\n❌  Missing .env.local in " + process.cwd() + "\n\n" +
      "    Create it with at minimum:\n" +
      "      NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\n" +
      "      SUPABASE_SERVICE_ROLE_KEY=eyJ...\n"
    );
    process.exit(1);
  }
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
})();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const sb = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function mimeFor(path: string): string {
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

async function ensureMediaRow(publicPath: string): Promise<string> {
  const filePath = publicPath.replace(/^\//, "");
  const fileName = publicPath.split("/").pop() ?? "asset";
  const { data: existing } = await sb
    .from("cms_media")
    .select("id")
    .eq("bucket", "static")
    .eq("file_path", filePath)
    .maybeSingle();
  if (existing?.id) return existing.id as string;
  const { data: ins, error } = await sb
    .from("cms_media")
    .insert({
      file_name: fileName,
      file_path: filePath,
      bucket: "static",
      public_url: publicPath,
      mime_type: mimeFor(publicPath),
      size_bytes: 0,
      alt_text: null,
      category: "service-icon",
    } as never)
    .select("id")
    .single();
  if (error || !ins) {
    throw new Error(`cms_media insert failed for ${publicPath}: ${error?.message}`);
  }
  return ins.id as string;
}

async function main() {
  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const card of serviceCards) {
    const { data: row, error: findErr } = await sb
      .from("cms_services")
      .select("id, title, icon_media_id")
      .eq("title", card.title)
      .maybeSingle();
    if (findErr) {
      console.error(`  ✗ ${card.title}: lookup failed — ${findErr.message}`);
      continue;
    }
    if (!row) {
      console.warn(`  ⚠ ${card.title}: no cms_services row. Run "npm run seed" first.`);
      missing++;
      continue;
    }
    const mediaId = await ensureMediaRow(card.icon);
    if (row.icon_media_id === mediaId) {
      console.log(`  · ${card.title}: already on ${card.icon}`);
      skipped++;
      continue;
    }
    const { error: updErr } = await sb
      .from("cms_services")
      .update({ icon_media_id: mediaId } as never)
      .eq("id", row.id as string);
    if (updErr) {
      console.error(`  ✗ ${card.title}: update failed — ${updErr.message}`);
      continue;
    }
    console.log(`  ✓ ${card.title}: → ${card.icon}`);
    updated++;
  }

  console.log(
    `\nDone. ${updated} re-pointed · ${skipped} unchanged · ${missing} missing in DB.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
