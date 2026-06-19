import { z } from "zod";

// Friendly error messages so the admin sees plain language, not "string too short".

const blankToUndef = (v: unknown) =>
  typeof v === "string" && v.trim().length === 0 ? undefined : v;

const requiredText = (msg: string) =>
  z.preprocess(blankToUndef, z.string().trim().min(1, msg));
const optionalText = z.preprocess(blankToUndef, z.string().trim().optional());
const requiredEmail = (msg: string) =>
  z.preprocess(blankToUndef, z.string().trim().email(msg));
const optionalUrl = z.preprocess(
  blankToUndef,
  z.string().url("Please enter a complete URL like https://…").optional()
);
const optionalHref = z.preprocess(
  blankToUndef,
  z
    .string()
    .refine(
      (v) => v.startsWith("/") || v.startsWith("#") || /^https?:\/\//i.test(v),
      "Use a path like /services or a full URL like https://…"
    )
    .optional()
);
const optionalUuid = z.preprocess(
  blankToUndef,
  z.string().uuid("That doesn’t look like a valid media ID.").optional()
);
const booleanField = z
  .preprocess((v) => v === "on" || v === true || v === "true", z.boolean())
  .default(true);
const orderField = z.coerce.number().int().min(0).default(0);

// ----- Settings -----
export const SettingsSchema = z.object({
  firm_name: requiredText("Firm name is required"),
  phone: requiredText("Phone is required"),
  phone_link: requiredText("Tel link is required"),
  email: requiredEmail("Please enter a valid email address"),
  city_state: requiredText("City / state is required"),
  mailing_address_line_1: requiredText("Mailing address line 1 is required"),
  mailing_address_line_2: optionalText,
  mailing_address_line_3: optionalText,
  linkedin_url: optionalUrl,
  session_briefing_link_label: optionalText,
  footer_description: requiredText("Footer description is required"),
  footer_tagline: requiredText("Footer tagline is required"),
  copyright_text: requiredText("Copyright text is required"),
  privacy_link: optionalHref,
  tec_link: optionalHref,
  accessibility_link: optionalHref,
  default_og_image: optionalText,
  consent_language: requiredText("Consent language is required"),
});
export type SettingsInput = z.infer<typeof SettingsSchema>;

// ----- Services -----
export const ServiceSchema = z.object({
  title: requiredText("Title is required"),
  description: requiredText("Description is required"),
  icon_media_id: optionalUuid,
  href: optionalHref,
  display_order: orderField,
  is_visible: booleanField,
});
export type ServiceInput = z.infer<typeof ServiceSchema>;

// ----- Industries -----
export const IndustrySchema = z.object({
  title: requiredText("Title is required"),
  description: requiredText("Description is required"),
  illustration_media_id: optionalUuid,
  display_order: orderField,
  is_visible: booleanField,
});
export type IndustryInput = z.infer<typeof IndustrySchema>;

// ----- Experience -----
export const ExperienceSchema = z.object({
  title: requiredText("Title is required"),
  client_type: optionalText,
  leading_line: optionalText,
  body: requiredText("Body is required"),
  image_media_id: optionalUuid,
  pull_quote: optionalText,
  pull_quote_attribution: optionalText,
  display_order: orderField,
  is_visible: booleanField,
});
export type ExperienceInput = z.infer<typeof ExperienceSchema>;

// ----- Client Logos -----
export const ClientLogoSchema = z.object({
  client_name: requiredText("Client name is required"),
  logo_media_id: optionalUuid,
  website_url: optionalUrl,
  alt_text: requiredText("Alt text is required for accessibility"),
  client_status: z.enum(["current", "past"]).default("current"),
  display_order: orderField,
  is_visible: booleanField,
});
export type ClientLogoInput = z.infer<typeof ClientLogoSchema>;

// ----- Navigation Items -----
export const NavItemSchema = z.object({
  nav_area: z.enum(["header", "footer_primary", "footer_utility", "utility_bar"]),
  label: requiredText("Label is required"),
  href: requiredText("Link is required"),
  display_order: orderField,
  is_visible: booleanField,
});
export type NavItemInput = z.infer<typeof NavItemSchema>;

// ----- Media -----
export const MediaUpdateSchema = z.object({
  alt_text: optionalText,
  caption: optionalText,
  category: optionalText,
});
export type MediaUpdateInput = z.infer<typeof MediaUpdateSchema>;

// ----- Articles (Insights / The Session Briefing) -----
const slugField = z.preprocess(
  blankToUndef,
  z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and dashes only"
    )
);

export const ArticleSchema = z.object({
  title: requiredText("Title is required"),
  slug: slugField,
  category: optionalText,
  article_label: optionalText,
  summary: optionalText,
  lede: optionalText,
  body_html: optionalText,
  featured_image_id: optionalUuid,
  author: optionalText,
  date_label: optionalText,
  read_time_minutes: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(1).max(120).optional()
  ),
  status: z.enum(["draft", "published"]).default("draft"),
});
export type ArticleInput = z.infer<typeof ArticleSchema>;
