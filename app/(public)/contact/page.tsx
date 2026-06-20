import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { ContactForm } from "@/components/site/ContactForm";
import { getSiteSettings } from "@/lib/content/site";
import { resolveMetadata } from "@/lib/content/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/contact",
    fallback: {
      title: "Contact",
      description:
        "Start a confidential conversation with The Haney Group. Inquiries reach a principal directly. We respond within one business day, often the same day during session.",
    },
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/contact-us-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Contact</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            {settings.contact_page_eyebrow}
          </p>
          <h1 className="h1" id="ph-h1">
            {settings.contact_page_headline}
          </h1>
          <p className="lede">{settings.contact_page_lede}</p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="colgrid">
            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                {settings.contact_left_eyebrow}
              </p>
              <h2 className="h2" style={{ marginBottom: 24 }}>
                {settings.contact_left_heading}
              </h2>
              <div className="prose" style={{ maxWidth: "48ch" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: settings.contact_left_body_html,
                  }}
                />
                <p>
                  <strong>Phone</strong>
                  <br />
                  <a href={settings.phone_link}>{settings.phone}</a>
                </p>
                <p>
                  <strong>Email</strong>
                  <br />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </p>
                <p>
                  <strong>Mailing address</strong>
                  <br />
                  {settings.mailing_address_line_1}
                  <br />
                  {settings.mailing_address_line_2}
                  <br />
                  {settings.mailing_address_line_3}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                {settings.contact_right_eyebrow}
              </p>
              <h2 className="h2" style={{ marginBottom: 24 }}>
                {settings.contact_right_heading}
              </h2>
              <ContactForm
                consentLanguage={settings.consent_language}
                submitLabel={settings.contact_form_submit_label}
              />
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
