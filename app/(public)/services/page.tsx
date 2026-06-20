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
        "Six capabilities and four specialized practice areas — legislative strategy, appropriations, public affairs, and parliamentary procedure — for organizations whose Texas priorities cannot afford to be misunderstood.",
    },
  });
}

const practiceAreas = [
  {
    href: "/services/legislative-strategy",
    icon: "/assets/img/icon-legislative-strategy.png",
    title: "Legislative Strategy",
    body: "Read the calendar, map the path, time the engagement. The work that decides whether a bill moves.",
  },
  {
    href: "/services/appropriations",
    icon: "/assets/img/icon-appropriations.png",
    title: "Appropriations & Riders",
    body: "Article posture, rider language, LBB engagement, and interim work that protects funding cycle to cycle.",
  },
  {
    href: "/services/public-affairs",
    icon: "/assets/img/icon-public-affairs.png",
    title: "Public Affairs",
    body: "Message development, media posture, and board-ready communications for clients whose issues are public.",
  },
  {
    href: "/services/parliamentary",
    icon: "/assets/img/icon-procedural-2.png",
    title: "Parliamentary Procedure",
    body: "The institutional advisory practice. House Rules, modernization, and procedural counsel to legislatures.",
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
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      {capsHeader ? (
        <EditableRegion
          sectionKey={capsHeader.section_key}
          sectionLabel={capsHeader.section_label}
        >
          <section className="caps" data-reveal>
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
              <div className="caps__grid">
                {capabilities.map((cap) => (
                  <article key={cap.title} className="cap">
                    <img
                      className="cap__icon"
                      src={cap.icon}
                      alt=""
                      loading="lazy"
                      width={480}
                      height={480}
                    />
                    <h3>{cap.title}</h3>
                    <p>{cap.description}</p>
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
          <section className="approach" data-reveal>
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
              <div className="tilegrid">
                {practiceAreas.map((p) => (
                  <Link key={p.href} className="tile" href={p.href}>
                    <img
                      className="tile__icon"
                      src={p.icon}
                      alt=""
                      loading="lazy"
                      width={480}
                      height={480}
                    />
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                    <span className="tile__more">
                      Read more{" "}
                      <span className="arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </EditableRegion>
      ) : null}

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
