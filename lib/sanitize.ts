import "server-only";
import DOMPurify from "isomorphic-dompurify";

// Server-side sanitization for any rich-text content written into Supabase.
// Tiptap output goes through this before INSERT/UPDATE; the public site
// reads sanitized HTML and renders it via dangerouslySetInnerHTML.

// Conservative allowlist tuned for The Session Briefing posts:
// editorial prose, headings, lists, blockquotes, links, basic formatting.
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "code",
  "h1", "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote",
  "a",
  "hr",
  "img",
  "figure", "figcaption",
  "aside",
  "div", "span",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "title",
  "src", "alt", "width", "height", "loading",
  "class", "id",
  "aria-labelledby", "aria-hidden",
];

export function sanitizeArticleHtml(input: string): string {
  if (!input) return "";
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    USE_PROFILES: { html: true },
    // Force noopener/noreferrer on any link with target=_blank.
    ADD_ATTR: ["target", "rel"],
  });
  // Belt-and-suspenders: enforce safe rel on links opening in a new tab.
  return clean.replace(
    /<a([^>]+target=["']_blank["'][^>]*)>/gi,
    (match, attrs: string) => {
      const hasRel = /rel=/i.test(attrs);
      if (hasRel) return `<a${attrs.replace(/rel=["'][^"']*["']/i, 'rel="noopener noreferrer"')}>`;
      return `<a${attrs} rel="noopener noreferrer">`;
    }
  );
}
