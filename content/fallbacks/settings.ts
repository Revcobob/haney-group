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
    "An Austin government relations firm advising clients on Texas legislation, appropriations, House procedure, and advocacy.",
  footer_tagline: "Direct counsel from people who know the process.",
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
    "Tell us the issue, the next deadline, and the result you need. A principal will reply within one business day.",
  contact_left_eyebrow: "Reach The Firm",
  contact_left_heading: "Talk directly to a principal.",
  contact_left_body_html:
    "<p>Your inquiry goes directly to a principal. We reply within one business day and often sooner during session.</p><p>For an urgent procedural question, please call.</p>",
  contact_right_eyebrow: "Send a Note",
  contact_right_heading: "Tell us what is at issue.",
  contact_form_submit_label: "Send Message",
};
