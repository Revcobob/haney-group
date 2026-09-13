/* eslint-disable no-console */
/**
 * Generate blur-up placeholders for the site's photography.
 *
 * Run:
 *   npm run blur          # rewrite content/generated/blur-manifest.json
 *   npm run blur -- --check   # fail if the manifest is stale (for CI)
 *
 * next/image can only derive a blurDataURL automatically from a statically
 * imported image. Ours arrive as /assets/... strings from the CMS and the
 * static fallbacks, so the placeholders have to be built ahead of time and
 * looked up at render. The manifest is committed, so a normal build needs
 * neither sharp nor this script.
 *
 * Only photographs are worth blurring. Two things are skipped: anything with
 * real transparency, because a blur behind a cut-out renders as a coloured
 * smudge (this is measured via sharp's isOpaque, not guessed from the file
 * name -- several PNGs here declare an alpha channel they never use), and
 * logos, which are wrong to blur even when opaque. lib/images.ts is the
 * read side.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";
import sharp from "sharp";

const IMG_ROOT = join(process.cwd(), "public", "assets", "img");
const OUT_FILE = join(process.cwd(), "content", "generated", "blur-manifest.json");
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Logos and wordmarks: blur is wrong for a mark even when it is opaque. */
const SKIP_PATTERNS = [
  /logo/i,
  /^icon-/i,
  /mark\.png$/i,
  /^footer-mark/i,
];

/** 12px wide is enough to read as colour and shape once it is scaled up. */
const PLACEHOLDER_WIDTH = 12;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isCandidate(file: string): boolean {
  if (!RASTER.has(extname(file).toLowerCase())) return false;
  const name = basename(file);
  return !SKIP_PATTERNS.some((re) => re.test(name));
}

async function main() {
  const check = process.argv.includes("--check");
  const files = walk(IMG_ROOT).filter(isCandidate).sort();

  const manifest: Record<string, string> = {};
  let bytes = 0;
  let cutouts = 0;
  for (const file of files) {
    // A cut-out would show its placeholder as a rectangular smudge behind
    // the artwork, so leave it to next/image's default empty placeholder.
    if (!(await sharp(file).stats()).isOpaque) {
      cutouts += 1;
      continue;
    }
    const key = "/" + relative(join(process.cwd(), "public"), file).split(/[\\/]/).join("/");
    const buf = await sharp(file)
      .resize(PLACEHOLDER_WIDTH, null, { fit: "inside" })
      .webp({ quality: 28, effort: 6 })
      .toBuffer();
    manifest[key] = `data:image/webp;base64,${buf.toString("base64")}`;
    bytes += manifest[key].length;
  }

  const json = JSON.stringify(manifest, null, 2) + "\n";

  if (check) {
    let current = "";
    try {
      current = readFileSync(OUT_FILE, "utf8");
    } catch {
      /* missing counts as stale */
    }
    if (current !== json) {
      console.error(
        `\n✗ blur-manifest.json is stale. Run \`npm run blur\` and commit the result.\n`
      );
      process.exit(1);
    }
    console.log(
      `✓ blur-manifest.json is current (${Object.keys(manifest).length} images)`
    );
    return;
  }

  mkdirSync(join(process.cwd(), "content", "generated"), { recursive: true });
  writeFileSync(OUT_FILE, json);
  const n = Object.keys(manifest).length;
  console.log(
    `✓ ${n} placeholders, ${(bytes / 1024).toFixed(1)} KB total, ` +
      `avg ${Math.round(bytes / Math.max(1, n))} B` +
      (cutouts ? ` (${cutouts} cut-outs skipped)` : "")
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
