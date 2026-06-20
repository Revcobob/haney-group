import type { Metadata } from "next";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import {
  PageHeroBlock,
  FirmIntroBlock,
  StatStripBlock,
  PrinciplesGridBlock,
  PersonBioBlock,
  Region,
} from "@/components/site/PageBlocks";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type {
  PageHeroContent,
  FirmIntroContent,
  StatStripContent,
  PrinciplesGridContent,
  PersonBioContent,
  SectionHeaderContent,
} from "@/lib/sections/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/about",
    fallback: {
      title: "About",
      description:
        "A senior-led Austin government relations firm built around procedural and budgetary fluency and disciplined communications. Led by Robert Haney, former Chief Clerk of the Texas House, and Julie Freeman Haney.",
    },
  });
}

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function AboutPage() {
  const page = await getPageWithSections("about");
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const firmIntro = findSection(sections, "firm_intro");
  const stats = findSection(sections, "stat_strip");
  const principles = findSection(sections, "principles_grid");
  const principalsHead = findSection(sections, "principals_section_head");
  const robert = findSection(sections, "principal_robert");
  const julie = findSection(sections, "principal_julie");
  const closing = findSection(sections, "closing_cta");

  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      {firmIntro ? (
        <FirmIntroBlock
          s={firmIntro}
          c={firmIntro.content_json as FirmIntroContent}
        />
      ) : null}

      {stats ? (
        <StatStripBlock s={stats} c={stats.content_json as StatStripContent} />
      ) : null}

      {principles ? (
        <PrinciplesGridBlock
          s={principles}
          c={principles.content_json as PrinciplesGridContent}
        />
      ) : null}

      {principalsHead || robert || julie ? (
        <section className="firm" data-reveal id="robert">
          <div className="container">
            {principalsHead ? (
              <Region
                sectionKey={principalsHead.section_key}
                sectionLabel={principalsHead.section_label}
              >
                <div className="section__head">
                  {(principalsHead.content_json as SectionHeaderContent)
                    .eyebrow ? (
                    <p className="eyebrow">
                      {
                        (principalsHead.content_json as SectionHeaderContent)
                          .eyebrow
                      }
                    </p>
                  ) : null}
                  {(principalsHead.content_json as SectionHeaderContent)
                    .heading ? (
                    <h2 className="h2">
                      {
                        (principalsHead.content_json as SectionHeaderContent)
                          .heading
                      }
                    </h2>
                  ) : null}
                </div>
              </Region>
            ) : null}

            <div className="peoplelist">
              {robert ? (
                <PersonBioBlock
                  s={robert}
                  c={robert.content_json as PersonBioContent}
                />
              ) : null}
              {julie ? (
                <PersonBioBlock
                  s={julie}
                  c={julie.content_json as PersonBioContent}
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
