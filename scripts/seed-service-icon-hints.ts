/* eslint-disable no-console */
/**
 * Update every cms_services row with the descriptive icon_hint from
 * the in-tree fallback (content/fallbacks/services.ts). Idempotent —
 * matches existing rows by title and only writes the icon_hint column,
 * so nothing else about the service is touched.
 *
 *   npm run seed:icon-hints
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in
 * .env.local (the same env this project's seed script uses). If the
 * cms_services.icon_hint column is missing, run the 0004 migration
 * in supabase/migrations first.
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
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
  process.exit(1);
}

const sb = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const card of serviceCards) {
    if (!card.icon_hint) {
      skipped++;
      continue;
    }
    const { data: row, error: findErr } = await sb
      .from("cms_services")
      .select("id, title, icon_hint")
      .eq("title", card.title)
      .maybeSingle();

    if (findErr) {
      console.error(`  ✗ ${card.title}: lookup failed — ${findErr.message}`);
      continue;
    }
    if (!row) {
      console.warn(
        `  ⚠ ${card.title}: no row in cms_services — run "npm run seed" first.`
      );
      missing++;
      continue;
    }
    if (row.icon_hint === card.icon_hint) {
      console.log(`  · ${card.title}: already up to date`);
      skipped++;
      continue;
    }

    const { error: updErr } = await sb
      .from("cms_services")
      .update({ icon_hint: card.icon_hint } as never)
      .eq("id", row.id as string);

    if (updErr) {
      console.error(`  ✗ ${card.title}: update failed — ${updErr.message}`);
      continue;
    }
    console.log(`  ✓ ${card.title}: ${card.icon_hint}`);
    updated++;
  }

  console.log(
    `\nDone. ${updated} updated · ${skipped} unchanged · ${missing} missing in DB.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
