import type { Metadata } from "next";
import { getAdminSettings } from "@/lib/admin/data/settings";
import { saveSettingsAction } from "@/lib/admin/actions/settings";
import { EntityForm } from "@/components/admin/forms/EntityForm";
import { TextField, TextareaField } from "@/components/admin/forms/Fields";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Site</p>
        <h1>Site settings</h1>
        <p>
          Firm name, phone, email, mailing address, social links, footer copy,
          and compliance links. Changes save to the live site immediately.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              You can view current values below, but saving is disabled until
              Supabase env vars are set. The site is rendering from built-in
              fallback content.
            </p>
          </div>
        </div>
      ) : null}

      <EntityForm action={saveSettingsAction}>
        {(errors) => (
          <>
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

            <section className="adminform__section">
              <div className="adminform__section-head">
                <p className="adminform__section-eyebrow">Contact form</p>
                <h2>Consent language</h2>
                <p>Shown beneath the consent checkbox on the public Contact form.</p>
              </div>
              <TextareaField
                id="consent_language"
                name="consent_language"
                label="Consent language"
                defaultValue={settings.consent_language}
                rows={3}
                required
                error={errors.consent_language}
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
          </>
        )}
      </EntityForm>
    </>
  );
}
