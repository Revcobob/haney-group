import "server-only";
import sanitizeHtml, { type IOptions } from "sanitize-html";

// Server-side sanitization for rich-text content written to Supabase.
// Tiptap output goes through this before INSERT/UPDATE; the public site
// reads sanitized HTML and renders it via dangerouslySetInnerHTML.
//
// sanitize-html instead of DOMPurify: DOMPurify needs jsdom on the server,
// which trips Vercel's serverless bundler over an ESM-only sub-dep.
// sanitize-html runs cleanly without any DOM.

const OPTIONS: IOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s", "code", "pre",
    "h1", "h2", "h3", "h4",
    "ul", "ol", "li",
    "blockquote",
    "a",
    "hr",
    "img",
    "figure", "figcaption",
    "aside",
    "div", "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class", "id", "aria-labelledby", "aria-hidden"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Disallow inline event handlers and javascript: URLs by default; we keep
  // sanitize-html's defaults, which strip them.
  transformTags: {
    // Any anchor opening in a new tab gets safe rel attributes.
    a: (tagName, attribs) => {
      const out: Record<string, string> = { ...attribs };
      if (out.target === "_blank") {
        out.rel = "noopener noreferrer";
      }
      return { tagName, attribs: out };
    },
  },
};

export function sanitizeArticleHtml(input: string): string {
  if (!input) return "";
  return sanitizeHtml(input, OPTIONS);
}
