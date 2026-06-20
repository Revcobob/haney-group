// Global site settings — the "single source of truth" for repeated info
// like firm phone, email, address, copyright. Stored as cms_site_settings
// rows so principals can change them without a code deploy.

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

  // Contact page + form
  contact_notification_email: string;
  contact_page_eyebrow: string;
  contact_page_headline: string;
  contact_page_lede: string;
  contact_left_eyebrow: string;
  contact_left_heading: string;
  contact_left_body_html: string;
  contact_right_eyebrow: string;
  contact_right_heading: string;
  contact_form_submit_label: string;
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

  // Contact page + form
  contact_notification_email: "info@haney-group.com",
  contact_page_eyebrow: "Contact",
  contact_page_headline: "Start a confidential conversation.",
  contact_page_lede:
    "Tell us a little about the issue, the timing, and what success would look like. We will be in touch within one business day.",
  contact_left_eyebrow: "Reach The Firm",
  contact_left_heading: "Talk directly to a principal.",
  contact_left_body_html:
    "<p>The Haney Group is a small firm. Inquiries reach a principal directly. We respond inside one business day, often the same day during session.</p><p>For urgent procedural questions during session, please call.</p>",
  contact_right_eyebrow: "Send a Note",
  contact_right_heading: "A few details help us prepare.",
  contact_form_submit_label: "Send Message",
};
