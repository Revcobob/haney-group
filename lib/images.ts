import blurManifest from "@/content/generated/blur-manifest.json";

const MANIFEST: Record<string, string> = blurManifest;

/**
 * Blur-up props for a photograph served from /assets/.
 *
 * Spread onto a next/image <Image> so the photo fades up from a ~12px
 * placeholder instead of popping in from an empty box:
 *
 *   <Image src={url} {...blurProps(url)} … />
 *
 * Returns nothing when the path has no placeholder -- an icon or logo, which
 * the generator skips deliberately, or a remote CMS upload that was not on
 * disk at build time. Both cases fall back to next/image's default, so a call
 * site never has to care. Placeholders live in
 * content/generated/blur-manifest.json; regenerate with `npm run blur`.
 */
export function blurProps(
  src?: string | null
): { placeholder: "blur"; blurDataURL: string } | Record<string, never> {
  if (!src) return {};
  const blurDataURL = MANIFEST[src];
  if (!blurDataURL) return {};
  return { placeholder: "blur", blurDataURL };
}
