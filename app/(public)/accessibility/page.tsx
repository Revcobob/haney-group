import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility information and contact details for The Haney Group website.",
  alternates: { canonical: "/accessibility" },
};

export default async function AccessibilityPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="pagehero" aria-labelledby="accessibility-title">
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Accessibility</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Website accessibility
          </p>
          <h1 className="h1" id="accessibility-title">
            Accessing this website.
          </h1>
          <p className="lede">
            We want clients and visitors to be able to use this site with the
            technology and input method that works for them.
          </p>
        </div>
      </section>

      <section aria-labelledby="accessibility-measures">
        <div className="container">
          <div className="prose legal__doc">
            <h2 id="accessibility-measures">What we support</h2>
            <p>
              The site is designed for keyboard navigation, visible focus,
              screen-reader-friendly structure, responsive layouts, and reduced
              motion preferences. Images that convey information include text
              alternatives. Decorative images are omitted from the reading order.
            </p>

            <h2>Compatibility</h2>
            <p>
              The site is intended to work with current versions of major browsers
              and common assistive technologies. Browser extensions, older software,
              and some third-party content can affect how a page behaves.
            </p>

            <h2>Report a problem</h2>
            <p>
              If you cannot access information or complete a task on this site,
              tell us which page you were using and what went wrong. We will provide
              the information another way when we can and use the report to improve
              the site.
            </p>
            <p className="legal__contact">
              <strong>Contact The Haney Group</strong>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
              <br />
              <a href={settings.phone_link}>{settings.phone}</a>
            </p>

            <h2>Ongoing work</h2>
            <p>
              Accessibility is part of our regular review of the site. We update
              content, contrast, image handling, and interaction behavior as issues
              are found.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
