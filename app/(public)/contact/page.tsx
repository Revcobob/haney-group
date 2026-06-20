import type { Metadata } from "next";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { ContactForm } from "@/components/site/ContactForm";
import {
  PageHeroBlock,
  ContactLeftColBlock,
  ContactRightColBlock,
} from "@/components/site/PageBlocks";
import { getSiteSettings } from "@/lib/content/site";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type {
  PageHeroContent,
  ContactLeftColContent,
  ContactRightColContent,
} from "@/lib/sections/types";

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

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPageWithSections("contact"),
    getSiteSettings(),
  ]);
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const left = findSection(sections, "contact_left_col");
  const right = findSection(sections, "contact_right_col");
  const closing = findSection(sections, "closing_cta");

  const rightContent =
    (right?.content_json as ContactRightColContent | undefined) ?? null;

  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      <section data-reveal>
        <div className="container">
          <div className="colgrid">
            {left ? (
              <ContactLeftColBlock
                s={left}
                c={left.content_json as ContactLeftColContent}
                phone={settings.phone}
                phoneLink={settings.phone_link}
                email={settings.email}
                addrLine1={settings.mailing_address_line_1}
                addrLine2={settings.mailing_address_line_2}
                addrLine3={settings.mailing_address_line_3}
              />
            ) : null}

            {right ? (
              <ContactRightColBlock
                s={right}
                c={rightContent!}
                contactForm={
                  <ContactForm
                    consentLanguage={
                      rightContent?.consent_language || settings.consent_language
                    }
                    submitLabel={
                      rightContent?.submit_label ||
                      settings.contact_form_submit_label
                    }
                  />
                }
              />
            ) : null}
          </div>
        </div>
      </section>

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
