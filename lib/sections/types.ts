// Schema-driven section type registry. Each section_type entry declares:
//   - a zod schema for its content_json
//   - a friendly label for the editor
//   - a list of fields with plain-language labels + UI hints
// The dashboard editor and visual editor both render forms by walking
// the field list for the section's type.

import { z } from "zod";

// ---------- shared primitives ----------
const text = z
  .preprocess((v) => (typeof v === "string" ? v : ""), z.string().trim())
  .default("");
const optionalText = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
    z.string().optional()
  )
  .optional();
const optionalImageId = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
    z.string().optional()
  )
  .optional();

const CtaSchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});
export type Cta = z.infer<typeof CtaSchema>;

// ---------- per-section schemas ----------

export const HeroSchema = z.object({
  eyebrow: text,
  headline: text,
  lede: text,
  primary_cta: CtaSchema.default({ label: "", href: "" }),
  secondary_cta: CtaSchema.default({ label: "", href: "" }),
  background_image_id: optionalImageId,
  background_image_url: optionalText,
  meta_text_html: text,
  credit_text: optionalText,
});
export type HeroContent = z.infer<typeof HeroSchema>;

export const ProblemSchema = z.object({
  eyebrow: text,
  heading: text,
  body_paragraphs: z.array(z.string().default("")).default([]),
});
export type ProblemContent = z.infer<typeof ProblemSchema>;

export const ProcessBreakSchema = z.object({
  eyebrow: text,
  heading: text,
  body: text,
  primary_cta: CtaSchema.default({ label: "", href: "" }),
  image_id: optionalImageId,
  image_url: optionalText,
  image_alt: text,
});
export type ProcessBreakContent = z.infer<typeof ProcessBreakSchema>;

export const ProofItemSchema = z.object({
  image_id: optionalImageId,
  image_url: optionalText,
  title: z.string().default(""),
  body: z.string().default(""),
});
export const ProofSchema = z.object({
  eyebrow: text,
  heading: text,
  items: z.array(ProofItemSchema).default([]),
});
export type ProofContent = z.infer<typeof ProofSchema>;

export const ApproachStepSchema = z.object({
  image_id: optionalImageId,
  image_url: optionalText,
  title: z.string().default(""),
  body: z.string().default(""),
});
export const ApproachSchema = z.object({
  eyebrow: text,
  heading: text,
  steps: z.array(ApproachStepSchema).default([]),
});
export type ApproachContent = z.infer<typeof ApproachSchema>;

export const SectionHeaderSchema = z.object({
  eyebrow: text,
  heading: text,
  lede: text,
});
export type SectionHeaderContent = z.infer<typeof SectionHeaderSchema>;

export const QuoteSchema = z.object({
  quote: text,
  attribution: text,
});
export type QuoteContent = z.infer<typeof QuoteSchema>;

export const IssuesSchema = z.object({
  eyebrow: text,
  heading: text,
  lede: text,
  quote: text,
  quote_attribution: text,
});
export type IssuesContent = z.infer<typeof IssuesSchema>;

export const ClosingCtaSchema = z.object({
  eyebrow: text,
  heading: text,
  body: text,
  primary_cta: CtaSchema.default({ label: "", href: "" }),
  secondary_cta: CtaSchema.default({ label: "", href: "" }),
});
export type ClosingCtaContent = z.infer<typeof ClosingCtaSchema>;

export const PageHeroSchema = z.object({
  eyebrow: text,
  headline: text,
  lede: text,
  crumb_label: text,
  background_image_id: optionalImageId,
  background_image_url: optionalText,
});
export type PageHeroContent = z.infer<typeof PageHeroSchema>;

// ---------- field UI configuration ----------
export type FieldType =
  | "text"
  | "textarea"
  | "richtext-inline" // single-line HTML; we render as plain textarea for now
  | "image"
  | "cta"
  | "paragraph-list"
  | "card-list-proof"
  | "card-list-approach";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  maxLength?: number;
};

export type SectionTypeDef = {
  type: string;
  label: string;
  description: string;
  schema: z.ZodTypeAny;
  fields: FieldConfig[];
  // Optional helper to provide an empty default when no row exists.
  empty: () => Record<string, unknown>;
};

const heroDef: SectionTypeDef = {
  type: "hero",
  label: "Hero",
  description:
    "The dark photographic hero at the top of the page — headline, lede, and two buttons.",
  schema: HeroSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 80, help: "Small uppercase label above the headline." },
    { key: "headline", label: "Hero headline", type: "textarea", maxLength: 160 },
    { key: "lede", label: "Hero description", type: "textarea", maxLength: 480 },
    { key: "primary_cta", label: "Primary button", type: "cta" },
    { key: "secondary_cta", label: "Secondary button", type: "cta" },
    { key: "background_image_id", label: "Background image", type: "image" },
    { key: "meta_text_html", label: "Meta text (HTML allowed)", type: "richtext-inline", help: "Short paragraph under the buttons. HTML links are allowed." },
    { key: "credit_text", label: "Photo credit", type: "text", maxLength: 80 },
  ],
  empty: () =>
    HeroSchema.parse({
      eyebrow: "",
      headline: "",
      lede: "",
      meta_text_html: "",
    }),
};

const problemDef: SectionTypeDef = {
  type: "problem",
  label: "The Challenge",
  description: "Two-column section with an eyebrow + heading on the left and body paragraphs on the right.",
  schema: ProblemSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body_paragraphs", label: "Body paragraphs", type: "paragraph-list", help: "One paragraph per row." },
  ],
  empty: () => ProblemSchema.parse({}),
};

const processbreakDef: SectionTypeDef = {
  type: "processbreak",
  label: "Inside the Process",
  description: "Wide image with copy and a call-to-action button. Editorial mid-page banner.",
  schema: ProcessBreakSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body", label: "Body", type: "textarea", maxLength: 600 },
    { key: "image_id", label: "Banner image", type: "image" },
    { key: "image_alt", label: "Image alt text", type: "text", maxLength: 200 },
    { key: "primary_cta", label: "Button", type: "cta" },
  ],
  empty: () => ProcessBreakSchema.parse({}),
};

const proofDef: SectionTypeDef = {
  type: "proof",
  label: "Why Clients Choose Us",
  description: "Four-up grid of proof points with illustration, title, and body.",
  schema: ProofSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "items", label: "Proof items", type: "card-list-proof", help: "Four items render best." },
  ],
  empty: () => ProofSchema.parse({}),
};

const approachDef: SectionTypeDef = {
  type: "approach",
  label: "How We Work",
  description: "Four-up grid of approach steps with illustration, title, and body.",
  schema: ApproachSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "steps", label: "Steps", type: "card-list-approach", help: "Four steps render best." },
  ],
  empty: () => ApproachSchema.parse({}),
};

const principalsDef: SectionTypeDef = {
  type: "principals_intro",
  label: "Principals intro",
  description: "Heading + lede above the firm's two principal cards. Card content is rendered from code for now.",
  schema: SectionHeaderSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede", type: "textarea", maxLength: 480 },
  ],
  empty: () => SectionHeaderSchema.parse({}),
};

const issuesDef: SectionTypeDef = {
  type: "issues",
  label: "Industries we serve",
  description: "Heading + lede + an editorial pull quote. Industry cards come from the Industries manager.",
  schema: IssuesSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede", type: "textarea", maxLength: 480 },
    { key: "quote", label: "Pull quote", type: "textarea", maxLength: 600 },
    { key: "quote_attribution", label: "Attribution", type: "text", maxLength: 160 },
  ],
  empty: () => IssuesSchema.parse({}),
};

const insightsDef: SectionTypeDef = {
  type: "insights_intro",
  label: "Insights teaser",
  description: "Heading + lede above the three latest articles. Articles come from the Insights manager.",
  schema: SectionHeaderSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede", type: "textarea", maxLength: 480 },
  ],
  empty: () => SectionHeaderSchema.parse({}),
};

const capabilitiesDef: SectionTypeDef = {
  type: "capabilities_intro",
  label: "Capabilities intro",
  description: "Heading above the six capability cards. Capability cards come from the Services manager.",
  schema: SectionHeaderSchema.extend({ lede: text }),
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede (optional)", type: "textarea", maxLength: 480 },
  ],
  empty: () => SectionHeaderSchema.parse({}),
};

const closingCtaDef: SectionTypeDef = {
  type: "closing_cta",
  label: "Closing CTA",
  description: "The final dark band: eyebrow, heading, body, and two CTAs.",
  schema: ClosingCtaSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body", label: "Body", type: "textarea", maxLength: 600 },
    { key: "primary_cta", label: "Primary button", type: "cta" },
    { key: "secondary_cta", label: "Secondary button", type: "cta" },
  ],
  empty: () => ClosingCtaSchema.parse({}),
};

export const SECTION_TYPES: Record<string, SectionTypeDef> = {
  hero: heroDef,
  problem: problemDef,
  processbreak: processbreakDef,
  proof: proofDef,
  approach: approachDef,
  principals_intro: principalsDef,
  issues: issuesDef,
  insights_intro: insightsDef,
  capabilities_intro: capabilitiesDef,
  closing_cta: closingCtaDef,
};

export function getSectionType(type: string): SectionTypeDef | undefined {
  return SECTION_TYPES[type];
}
