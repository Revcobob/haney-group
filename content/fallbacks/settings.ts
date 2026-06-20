// Global site settings — the "single source of truth" for repeated info
// like firm phone, email, address, copyright. Moves to cms_site_settings
// in Phase 4 so principals can change these without a code deploy.

export type SiteSettings = {
  firm_name: string;
  phone: string;
  phone_link: string;
  email: string;
  city_state: string;
  mailing_address_line_1: string;
  mailing_address_line_2: string;
  mailing_address_line_3: string;
  linkedin_url: string;
  session_briefing_link_label: string;
  footer_description: string;
  footer_tagline: string;
  copyright_text: string;
  privacy_link: string;
  tec_link: string;
  accessibility_link: string;
  default_og_image: string;
  consent_language: string;
};

export const siteSettings: SiteSettings = {
  firm_name: "The Haney Group",
  phone: "(512) 925-5000",
  phone_link: "tel:+15129255000",
  email: "info@haney-group.com",
  city_state: "Austin, Texas",
  mailing_address_line_1: "The Haney Group",
  mailing_address_line_2: "P.O. Box 521",
  mailing_address_line_3: "Austin, Texas 78767",
  linkedin_url: "https://www.linkedin.com/",
  session_briefing_link_label: "The Session Briefing",
  footer_description:
    "A senior-led Austin government relations firm — Texas legislative strategy, appropriations, and procedural expertise for organizations with priorities at the Capitol.",
  footer_tagline: "Proven expertise. Focused results. Unmatched influence.",
  copyright_text: "Haney Group LLC. All rights reserved.",
  privacy_link: "/privacy",
  tec_link: "#",
  accessibility_link: "#",
  default_og_image: "/assets/img/capitol-hero-web2.jpg",
  consent_language:
    "I understand my message will be reviewed by The Haney Group and consent to being contacted about my inquiry.",
};
