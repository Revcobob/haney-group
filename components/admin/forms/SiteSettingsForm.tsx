"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, TextareaField } from "./Fields";
import type { ActionResult } from "@/lib/admin/actions/_helpers";
import type { SiteSettings } from "@/content/fallbacks/settings";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

export function SiteSettingsForm({
  action,
  settings,
}: {
  action: Action;
  settings: SiteSettings;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status: "idle" | "success" | "error" = !state
    ? "idle"
    : state.ok
    ? "success"
    : "error";
  const message = !state ? undefined : state.ok ? "Saved." : state.error;

  return (
    <form action={formAction} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">The Firm</p>
          <h2>Identity</h2>
          <p>Where the firm name and primary contact details appear.</p>
        </div>
        <div className="adminform__row two">
          <TextField
            id="firm_name"
            name="firm_name"
            label="Firm name"
            defaultValue={settings.firm_name}
            required
            error={errors.firm_name}
          />
          <TextField
            id="city_state"
            name="city_state"
            label="City / state"
            defaultValue={settings.city_state}
            help="Shown in the utility bar."
            required
            error={errors.city_state}
          />
        </div>
        <div className="adminform__row two">
          <TextField
            id="phone"
            name="phone"
            label="Primary phone (display)"
            defaultValue={settings.phone}
            placeholder="(512) 925-5000"
            required
            error={errors.phone}
          />
          <TextField
            id="phone_link"
            name="phone_link"
            label="Phone link (tel: URL)"
            defaultValue={settings.phone_link}
            placeholder="tel:+15129255000"
            required
            error={errors.phone_link}
          />
        </div>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Primary email"
          defaultValue={settings.email}
          required
          error={errors.email}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Address</p>
          <h2>Mailing address</h2>
          <p>Appears in the footer contact column.</p>
        </div>
        <TextField
          id="mailing_address_line_1"
          name="mailing_address_line_1"
          label="Line 1"
          defaultValue={settings.mailing_address_line_1}
          required
          error={errors.mailing_address_line_1}
        />
        <TextField
          id="mailing_address_line_2"
          name="mailing_address_line_2"
          label="Line 2"
          defaultValue={settings.mailing_address_line_2}
          error={errors.mailing_address_line_2}
        />
        <TextField
          id="mailing_address_line_3"
          name="mailing_address_line_3"
          label="Line 3"
          defaultValue={settings.mailing_address_line_3}
          error={errors.mailing_address_line_3}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Social &amp; Linked Content</p>
          <h2>Links</h2>
        </div>
        <TextField
          id="linkedin_url"
          name="linkedin_url"
          type="url"
          label="LinkedIn URL"
          defaultValue={settings.linkedin_url}
          placeholder="https://www.linkedin.com/company/…"
          error={errors.linkedin_url}
        />
        <TextField
          id="session_briefing_link_label"
          name="session_briefing_link_label"
          label="Utility-bar Insights label"
          defaultValue={settings.session_briefing_link_label}
          help="The text used in the utility bar for the Insights link."
          error={errors.session_briefing_link_label}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Footer</p>
          <h2>Footer copy</h2>
        </div>
        <TextField
          id="footer_tagline"
          name="footer_tagline"
          label="Footer tagline"
          defaultValue={settings.footer_tagline}
          maxLength={80}
          required
          error={errors.footer_tagline}
        />
        <TextareaField
          id="footer_description"
          name="footer_description"
          label="Footer description"
          defaultValue={settings.footer_description}
          rows={3}
          required
          error={errors.footer_description}
        />
        <TextField
          id="copyright_text"
          name="copyright_text"
          label="Copyright text"
          defaultValue={settings.copyright_text}
          help="Year is added automatically, e.g. “© 2026 [your text]”."
          required
          error={errors.copyright_text}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Compliance &amp; Legal</p>
          <h2>Compliance links</h2>
        </div>
        <TextField
          id="privacy_link"
          name="privacy_link"
          label="Privacy link"
          defaultValue={settings.privacy_link}
          error={errors.privacy_link}
        />
        <TextField
          id="tec_link"
          name="tec_link"
          label="Texas Ethics Commission lobby registration link"
          defaultValue={settings.tec_link}
          error={errors.tec_link}
        />
        <TextField
          id="accessibility_link"
          name="accessibility_link"
          label="Accessibility link"
          defaultValue={settings.accessibility_link}
          error={errors.accessibility_link}
        />
      </section>

      <section
        className="adminform__section"
        id="contact"
        style={{ scrollMarginTop: 90 }}
      >
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Contact page · Hero</p>
          <h2>Top of the Contact page</h2>
          <p>The headline, eyebrow, and lede on /contact above the form.</p>
        </div>
        <div className="adminform__row two">
          <TextField
            id="contact_page_eyebrow"
            name="contact_page_eyebrow"
            label="Hero eyebrow"
            defaultValue={settings.contact_page_eyebrow}
            error={errors.contact_page_eyebrow}
          />
          <TextField
            id="contact_page_headline"
            name="contact_page_headline"
            label="Hero headline"
            defaultValue={settings.contact_page_headline}
            error={errors.contact_page_headline}
            maxLength={140}
          />
        </div>
        <TextareaField
          id="contact_page_lede"
          name="contact_page_lede"
          label="Hero lede"
          defaultValue={settings.contact_page_lede}
          rows={3}
          error={errors.contact_page_lede}
          maxLength={320}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Contact page · Reach The Firm column</p>
          <h2>Left column copy</h2>
          <p>
            Eyebrow, heading, and intro text that sits above the firm’s
            phone, email, and address. Phone, email, and mailing address
            themselves come from the Identity / Address sections above.
          </p>
        </div>
        <div className="adminform__row two">
          <TextField
            id="contact_left_eyebrow"
            name="contact_left_eyebrow"
            label="Eyebrow"
            defaultValue={settings.contact_left_eyebrow}
            error={errors.contact_left_eyebrow}
          />
          <TextField
            id="contact_left_heading"
            name="contact_left_heading"
            label="Heading"
            defaultValue={settings.contact_left_heading}
            error={errors.contact_left_heading}
            maxLength={140}
          />
        </div>
        <TextareaField
          id="contact_left_body_html"
          name="contact_left_body_html"
          label="Intro paragraphs (HTML allowed)"
          defaultValue={settings.contact_left_body_html}
          rows={5}
          error={errors.contact_left_body_html}
          help="Use <p>…</p> per paragraph. The phone, email, and mailing address blocks below this are rendered automatically from the Identity / Address sections."
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Contact page · Send a Note column</p>
          <h2>Right column copy + form</h2>
        </div>
        <div className="adminform__row two">
          <TextField
            id="contact_right_eyebrow"
            name="contact_right_eyebrow"
            label="Eyebrow"
            defaultValue={settings.contact_right_eyebrow}
            error={errors.contact_right_eyebrow}
          />
          <TextField
            id="contact_right_heading"
            name="contact_right_heading"
            label="Heading"
            defaultValue={settings.contact_right_heading}
            error={errors.contact_right_heading}
            maxLength={140}
          />
        </div>
        <TextField
          id="contact_form_submit_label"
          name="contact_form_submit_label"
          label="Submit button text"
          defaultValue={settings.contact_form_submit_label}
          error={errors.contact_form_submit_label}
          maxLength={40}
        />
        <TextareaField
          id="consent_language"
          name="consent_language"
          label="Consent checkbox language"
          defaultValue={settings.consent_language}
          rows={3}
          required
          error={errors.consent_language}
          help="Shown beneath the consent checkbox on the public Contact form."
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Contact form notifications</p>
          <h2>Where new inquiries are emailed</h2>
          <p>
            When the public Contact form is submitted, an email goes here
            with the visitor’s message and a link into the admin Inquiries
            inbox. Requires <code>RESEND_API_KEY</code> to be configured
            to actually send.
          </p>
        </div>
        <TextField
          id="contact_notification_email"
          name="contact_notification_email"
          type="email"
          label="Notification recipient email"
          defaultValue={settings.contact_notification_email}
          required
          error={errors.contact_notification_email}
          placeholder="info@haney-group.com"
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Default SEO</p>
          <h2>Social sharing image</h2>
          <p>Used as the Open Graph / Twitter card image when a page doesn’t set its own.</p>
        </div>
        <TextField
          id="default_og_image"
          name="default_og_image"
          label="Default Open Graph image path"
          defaultValue={settings.default_og_image}
          help="A path like /assets/img/capitol-hero-web2.jpg. Phase 7 adds a picker."
          error={errors.default_og_image}
        />
      </section>

      <SaveBar status={status} message={message} />
    </form>
  );
}
