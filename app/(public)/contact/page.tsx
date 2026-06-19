import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { ContactForm } from "@/components/site/ContactForm";
import { getSiteSettings } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a confidential conversation with The Haney Group. Inquiries reach a principal directly. We respond within one business day, often the same day during session.",
  alternates: { canonical: "/contact" },
};

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
            Contact
          </p>
          <h1 className="h1" id="ph-h1">
            Start a confidential conversation.
          </h1>
          <p className="lede">
            Tell us a little about the issue, the timing, and what success would
            look like. We will be in touch within one business day.
          </p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="colgrid">
            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                Reach The Firm
              </p>
              <h2 className="h2" style={{ marginBottom: 24 }}>
                Talk directly to a principal.
              </h2>
              <div className="prose" style={{ maxWidth: "48ch" }}>
                <p>
                  The Haney Group is a small firm. Inquiries reach a principal
                  directly. We respond inside one business day, often the same
                  day during session.
                </p>
                <p>For urgent procedural questions during session, please call.</p>
                <p>
                  <strong>Phone</strong>
                  <br />
                  <a href="tel:+15129255000">(512) 925-5000</a>
                </p>
                <p>
                  <strong>Email</strong>
                  <br />
                  <a href="mailto:info@haney-group.com">info@haney-group.com</a>
                </p>
                <p>
                  <strong>Mailing address</strong>
                  <br />
                  The Haney Group
                  <br />
                  P.O. Box 521
                  <br />
                  Austin, Texas 78767
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                Send a Note
              </p>
              <h2 className="h2" style={{ marginBottom: 24 }}>
                A few details help us prepare.
              </h2>
              <ContactForm consentLanguage={settings.consent_language} />
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
