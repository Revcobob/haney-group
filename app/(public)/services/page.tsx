import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { EditableRegion } from "@/components/site/EditableRegion";
import { PageHeroBlock } from "@/components/site/PageBlocks";
import { getServiceCards } from "@/lib/content/site";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type {
  PageHeroContent,
  SectionHeaderContent,
  ProcessBreakContent,
} from "@/lib/sections/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/services",
    fallback: {
      title: "Services",
      description:
        "Texas legislative strategy, lobbying, bill drafting, appropriations, parliamentary procedure, coalition work, and public affairs.",
    },
  });
}

const practiceAreas = [
  {
    href: "/services/legislative-strategy",
    number: "01",
    title: "Legislative Strategy",
    body: "Choose the author, map the committee and calendar path, count the votes, and prepare for floor and conference.",
  },
  {
    href: "/services/appropriations",
    number: "02",
    title: "Appropriations & Riders",
    body: "Article placement, rider drafting, LBB and agency work, and House and Senate budget strategy.",
  },
  {
    href: "/services/public-affairs",
    number: "03",
    title: "Public Affairs",
    body: "Legislative messages, media responses, executive briefings, and board materials for public issues.",
  },
  {
    href: "/services/parliamentary",
    number: "04",
    title: "Parliamentary Procedure",
    body: "House Rules, points of order, germaneness, floor procedure, and advice on chamber operations.",
  },
];

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function ServicesPage() {
  const [page, capabilities] = await Promise.all([
    getPageWithSections("services"),
    getServiceCards(),
  ]);
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const capsHeader = findSection(sections, "capabilities_intro");
  const srbreak = findSection(sections, "srbreak");
  const practiceHeader = findSection(sections, "practice_areas_intro");
  const closing = findSection(sections, "closing_cta");

  return (
    <div className="services-index">
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      {capsHeader ? (
        <EditableRegion
          sectionKey={capsHeader.section_key}
          sectionLabel={capsHeader.section_label}
        >
          <section className="caps services-index__caps" data-reveal>
            <div className="container">
              <div className="section__head">
                {(capsHeader.content_json as SectionHeaderContent).eyebrow ? (
                  <p className="eyebrow">
                    {(capsHeader.content_json as SectionHeaderContent).eyebrow}
                  </p>
                ) : null}
                {(capsHeader.content_json as SectionHeaderContent).heading ? (
                  <h2 className="h2">
                    {(capsHeader.content_json as SectionHeaderContent).heading}
                  </h2>
                ) : null}
              </div>
              <div className="services-caplist">
                {capabilities.map((cap, index) => (
                  <article key={cap.title} className="services-capability">
                    <span className="services-capability__number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <img
                      className="services-capability__mark"
                      src={cap.icon}
                      alt=""
                      loading="lazy"
                      width={72}
                      height={72}
                    />
                    <div className="services-capability__copy">
                      <h3>{cap.title}</h3>
                      <p>{cap.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </EditableRegion>
      ) : null}

      {srbreak ? (
        <EditableRegion
          sectionKey={srbreak.section_key}
          sectionLabel={srbreak.section_label}
        >
          <section className="srbreak" aria-labelledby="srbreak-h" data-reveal>
            <div className="container">
              <div className="srbreak__inner">
                <figure className="srbreak__media">
                  {(srbreak.content_json as ProcessBreakContent).image_url ? (
                    <img
                      src={
                        (srbreak.content_json as ProcessBreakContent).image_url
                      }
                      alt={
                        (srbreak.content_json as ProcessBreakContent).image_alt
                      }
                      loading="lazy"
                      width={1600}
                      height={686}
                    />
                  ) : null}
                </figure>
                <div className="srbreak__copy">
                  {(srbreak.content_json as ProcessBreakContent).eyebrow ? (
                    <p className="eyebrow">
                      {(srbreak.content_json as ProcessBreakContent).eyebrow}
                    </p>
                  ) : null}
                  {(srbreak.content_json as ProcessBreakContent).heading ? (
                    <h2 id="srbreak-h">
                      {(srbreak.content_json as ProcessBreakContent).heading}
                    </h2>
                  ) : null}
                  {(srbreak.content_json as ProcessBreakContent).body ? (
                    <p>{(srbreak.content_json as ProcessBreakContent).body}</p>
                  ) : null}
                  {(srbreak.content_json as ProcessBreakContent).primary_cta
                    ?.label ? (
                    <div className="srbreak__cta">
                      <Link
                        className="btn btn--primary"
                        href={
                          (srbreak.content_json as ProcessBreakContent)
                            .primary_cta?.href || "#"
                        }
                      >
                        {
                          (srbreak.content_json as ProcessBreakContent)
                            .primary_cta?.label
                        }{" "}
                        <span className="arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </EditableRegion>
      ) : null}

      {practiceHeader ? (
        <EditableRegion
          sectionKey={practiceHeader.section_key}
          sectionLabel={practiceHeader.section_label}
        >
          <section className="services-practices" data-reveal>
            <div className="container">
              <div className="section__head">
                {(practiceHeader.content_json as SectionHeaderContent).eyebrow ? (
                  <p className="eyebrow">
                    {
                      (practiceHeader.content_json as SectionHeaderContent)
                        .eyebrow
                    }
                  </p>
                ) : null}
                {(practiceHeader.content_json as SectionHeaderContent).heading ? (
                  <h2 className="h2">
                    {
                      (practiceHeader.content_json as SectionHeaderContent)
                        .heading
                    }
                  </h2>
                ) : null}
              </div>
              <div className="services-practice-list">
                {practiceAreas.map((p) => (
                  <Link key={p.href} className="services-practice" href={p.href}>
                    <span className="services-practice__number">{p.number}</span>
                    <span className="services-practice__copy">
                      <span className="services-practice__title">{p.title}</span>
                      <span className="services-practice__body">{p.body}</span>
                    </span>
                    <span className="services-practice__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </EditableRegion>
      ) : null}

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </div>
  );
}
