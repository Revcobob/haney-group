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

export const RichTextBlockSchema = z.object({
  eyebrow: text,
  heading: text,
  body_paragraphs: z.array(z.string().default("")).default([]),
});
export type RichTextBlockContent = z.infer<typeof RichTextBlockSchema>;

export const HtmlBlockSchema = z.object({
  eyebrow: text,
  heading: text,
  body_html: text,
});
export type HtmlBlockContent = z.infer<typeof HtmlBlockSchema>;

const StatItemSchema = z.object({
  num: z.string().default(""),
  label: z.string().default(""),
});
export const StatStripSchema = z.object({
  eyebrow: text,
  heading: text,
  items: z.array(StatItemSchema).default([]),
});
export type StatStripContent = z.infer<typeof StatStripSchema>;

const PrincipleItemSchema = z.object({
  num: z.string().default(""),
  title: z.string().default(""),
  body: z.string().default(""),
});
export const PrinciplesGridSchema = z.object({
  eyebrow: text,
  heading: text,
  items: z.array(PrincipleItemSchema).default([]),
});
export type PrinciplesGridContent = z.infer<typeof PrinciplesGridSchema>;

const FounderShortSchema = z.object({
  name: z.string().default(""),
  role: z.string().default(""),
  bio: z.string().default(""),
});
export const FirmIntroSchema = z.object({
  eyebrow: text,
  heading: text,
  body_paragraphs_html: z.array(z.string().default("")).default([]),
  founders: z.array(FounderShortSchema).default([]),
});
export type FirmIntroContent = z.infer<typeof FirmIntroSchema>;

export const PersonBioSchema = z.object({
  anchor: text,
  name: text,
  role: text,
  portrait_image_id: optionalImageId,
  portrait_image_url: optionalText,
  body_paragraphs: z.array(z.string().default("")).default([]),
  pull_quote: text,
  link_url: text,
  link_label: text,
});
export type PersonBioContent = z.infer<typeof PersonBioSchema>;

export const ClientLogosStripSchema = z.object({
  eyebrow: text,
  heading: text,
  disclaimer: text,
});
export type ClientLogosStripContent = z.infer<typeof ClientLogosStripSchema>;

export const ContactLeftColSchema = z.object({
  eyebrow: text,
  heading: text,
  body_html: text,
});
export type ContactLeftColContent = z.infer<typeof ContactLeftColSchema>;

export const ContactRightColSchema = z.object({
  eyebrow: text,
  heading: text,
  submit_label: text,
  consent_language: text,
});
export type ContactRightColContent = z.infer<typeof ContactRightColSchema>;

export const QuoteCardSchema = z.object({
  quote: text,
  attribution: text,
});
export type QuoteCardContent = z.infer<typeof QuoteCardSchema>;

const AudienceItemSchema = z.object({
  title: z.string().default(""),
  body: z.string().default(""),
});
export const AudienceGridSchema = z.object({
  eyebrow: text,
  heading: text,
  lede: text,
  items: z.array(AudienceItemSchema).default([]),
});
export type AudienceGridContent = z.infer<typeof AudienceGridSchema>;

export const FinalCtaSchema = z.object({
  eyebrow: text,
  heading: text,
  body: text,
  cta: CtaSchema.default({ label: "", href: "" }),
});
export type FinalCtaContent = z.infer<typeof FinalCtaSchema>;

// ---------- field UI configuration ----------
export type FieldType =
  | "text"
  | "textarea"
  | "richtext-inline" // single-line HTML; we render as plain textarea for now
  | "rich-text" // full Tiptap editor; produces sanitized HTML
  | "image"
  | "cta"
  | "paragraph-list"
  | "card-list-proof"
  | "card-list-approach"
  | "stat-list"
  | "principles-list"
  | "founder-list"
  | "audience-list";

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

const pageHeroDef: SectionTypeDef = {
  type: "page_hero",
  label: "Page hero",
  description:
    "The photographic banner at the top of an interior page — breadcrumb label, eyebrow, headline, lede, and background image.",
  schema: PageHeroSchema,
  fields: [
    { key: "crumb_label", label: "Breadcrumb label", type: "text", maxLength: 60, help: "Shown in the breadcrumb trail after “Home”." },
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 80 },
    { key: "headline", label: "Headline", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede", type: "textarea", maxLength: 480 },
    { key: "background_image_id", label: "Background image", type: "image" },
  ],
  empty: () => PageHeroSchema.parse({}),
};

const richTextBlockDef: SectionTypeDef = {
  type: "rich_text",
  label: "Rich text block",
  description: "Eyebrow + heading on the left, paragraphs on the right.",
  schema: RichTextBlockSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body_paragraphs", label: "Body paragraphs", type: "paragraph-list", help: "One paragraph per row." },
  ],
  empty: () => RichTextBlockSchema.parse({}),
};

const htmlBlockDef: SectionTypeDef = {
  type: "html_block",
  label: "Rich-formatted article",
  description: "Long-form copy with headings, lists, and links. Used for legal pages and similar.",
  schema: HtmlBlockSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "text", maxLength: 200 },
    { key: "body_html", label: "Body", type: "rich-text", help: "Full rich-text editor with headings, lists, links." },
  ],
  empty: () => HtmlBlockSchema.parse({}),
};

const statStripDef: SectionTypeDef = {
  type: "stat_strip",
  label: "Statistics strip",
  description: "A horizontal row of big-number statistics with labels.",
  schema: StatStripSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow (optional)", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading (optional)", type: "text", maxLength: 200 },
    { key: "items", label: "Statistics", type: "stat-list", help: "Each row is a big number + short caption." },
  ],
  empty: () => StatStripSchema.parse({}),
};

const principlesGridDef: SectionTypeDef = {
  type: "principles_grid",
  label: "Principles grid",
  description: "Numbered cards — “01 / Title / Body”.",
  schema: PrinciplesGridSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "text", maxLength: 200 },
    { key: "items", label: "Principles", type: "principles-list", help: "Each item is a numbered card." },
  ],
  empty: () => PrinciplesGridSchema.parse({}),
};

const firmIntroDef: SectionTypeDef = {
  type: "firm_intro",
  label: "Firm intro + founder snapshots",
  description: "Two-column block: the firm copy on the left, small founder cards on the right.",
  schema: FirmIntroSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body_paragraphs_html", label: "Body paragraphs (HTML allowed)", type: "paragraph-list", help: "One paragraph per row. <strong> and <em> are allowed." },
    { key: "founders", label: "Founder snapshots", type: "founder-list", help: "The two small bio cards beside the body copy." },
  ],
  empty: () => FirmIntroSchema.parse({}),
};

const personBioDef: SectionTypeDef = {
  type: "person_bio",
  label: "Full principal bio",
  description: "Portrait + name + role + multiple paragraphs + optional pull quote + LinkedIn link.",
  schema: PersonBioSchema,
  fields: [
    { key: "anchor", label: "URL anchor", type: "text", maxLength: 40, help: "Used in deep links like /about#robert. Lowercase, no spaces." },
    { key: "name", label: "Name", type: "text", maxLength: 80 },
    { key: "role", label: "Role / subtitle", type: "text", maxLength: 200 },
    { key: "portrait_image_id", label: "Portrait", type: "image" },
    { key: "body_paragraphs", label: "Biography paragraphs", type: "paragraph-list", help: "One paragraph per row." },
    { key: "pull_quote", label: "Pull quote (optional)", type: "textarea", maxLength: 400 },
    { key: "link_url", label: "External link URL (optional)", type: "text", maxLength: 300, placeholder: "https://www.linkedin.com/in/…" },
    { key: "link_label", label: "External link label", type: "text", maxLength: 40, placeholder: "LinkedIn" },
  ],
  empty: () => PersonBioSchema.parse({}),
};

const clientLogosDef: SectionTypeDef = {
  type: "client_logos_strip",
  label: "Client logos strip",
  description: "The grayscale scrolling logo strip. Logos themselves are managed under Client Logos.",
  schema: ClientLogosStripSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "disclaimer", label: "Disclaimer line", type: "textarea", maxLength: 320, help: "The grey note under the strip." },
  ],
  empty: () => ClientLogosStripSchema.parse({}),
};

const contactLeftDef: SectionTypeDef = {
  type: "contact_left_col",
  label: "Contact: Reach the Firm column",
  description: "Left column on /contact — eyebrow, heading, and intro paragraphs above the phone/email/address block.",
  schema: ContactLeftColSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body_html", label: "Intro paragraphs", type: "rich-text", help: "Phone/email/address are added automatically below this." },
  ],
  empty: () => ContactLeftColSchema.parse({}),
};

const contactRightDef: SectionTypeDef = {
  type: "contact_right_col",
  label: "Contact: Send a Note column",
  description: "Right column on /contact — eyebrow, heading, and the labels around the form.",
  schema: ContactRightColSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "submit_label", label: "Submit button text", type: "text", maxLength: 40 },
    { key: "consent_language", label: "Consent checkbox language", type: "textarea", maxLength: 320 },
  ],
  empty: () => ContactRightColSchema.parse({}),
};

const quoteCardDef: SectionTypeDef = {
  type: "quote_card",
  label: "Pull quote",
  description: "A standalone editorial quote — often used at the bottom of a page.",
  schema: QuoteCardSchema,
  fields: [
    { key: "quote", label: "Quote", type: "textarea", maxLength: 600 },
    { key: "attribution", label: "Attribution", type: "text", maxLength: 200 },
  ],
  empty: () => QuoteCardSchema.parse({}),
};

const audienceGridDef: SectionTypeDef = {
  type: "audience_grid",
  label: "Who We Help",
  description: "A grid of prospective client audiences with a short description for each.",
  schema: AudienceGridSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "lede", label: "Lede (optional)", type: "textarea", maxLength: 320 },
    { key: "items", label: "Audiences", type: "audience-list", help: "Each card is a category we serve, with a short description of how." },
  ],
  empty: () => AudienceGridSchema.parse({}),
};

const finalCtaDef: SectionTypeDef = {
  type: "final_cta",
  label: "Final conversion band",
  description: "A centered, single-button conversion call placed just before the footer.",
  schema: FinalCtaSchema,
  fields: [
    { key: "eyebrow", label: "Eyebrow (optional)", type: "text", maxLength: 60 },
    { key: "heading", label: "Heading", type: "textarea", maxLength: 200 },
    { key: "body", label: "Body", type: "textarea", maxLength: 600 },
    { key: "cta", label: "Button", type: "cta" },
  ],
  empty: () => FinalCtaSchema.parse({}),
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
  page_hero: pageHeroDef,
  rich_text: richTextBlockDef,
  html_block: htmlBlockDef,
  stat_strip: statStripDef,
  principles_grid: principlesGridDef,
  firm_intro: firmIntroDef,
  person_bio: personBioDef,
  client_logos_strip: clientLogosDef,
  contact_left_col: contactLeftDef,
  contact_right_col: contactRightDef,
  quote_card: quoteCardDef,
  audience_grid: audienceGridDef,
  final_cta: finalCtaDef,
};

export function getSectionType(type: string): SectionTypeDef | undefined {
  return SECTION_TYPES[type];
}
