import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import {
  PageHeroBlock,
  ClientLogosStripBlock,
} from "@/components/site/PageBlocks";
import { getIndustryCards, getClientLogos } from "@/lib/content/site";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type {
  PageHeroContent,
  ClientLogosStripContent,
} from "@/lib/sections/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/industries",
    fallback: {
      title: "Clients",
      description:
        "Clients and sectors represented by The Haney Group in Texas legislative, appropriations, regulatory, and procedural matters.",
    },
  });
}

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function IndustriesPage() {
  const [page, industries, { logos, disclaimer }] = await Promise.all([
    getPageWithSections("industries"),
    getIndustryCards(),
    getClientLogos(),
  ]);
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const logosSection = findSection(sections, "client_logos_strip");
  const closing = findSection(sections, "closing_cta");

  // The industry tile grid itself isn't an editable section — it's driven
  // by /admin/industries — but we still wrap it as a non-clickable region
  // so it visually integrates with the page in the visual editor.
  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      <section data-reveal>
        <div className="container">
          <div className="tilegrid">
            {industries.map((i) => (
              <article key={i.title} className="tile tile--banner tile--illo">
                <div className="tile__banner">
                  <Image
                    src={i.image}
                    alt=""
                    loading="lazy"
                    fill
                    sizes="(max-width: 719px) 100vw, 50vw"
                  />
                </div>
                <div className="tile__body">
                  <h3>{i.title}</h3>
                  <p>{i.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {logosSection ? (
        <ClientLogosStripBlock
          s={logosSection}
          c={{
            ...(logosSection.content_json as ClientLogosStripContent),
            disclaimer:
              (logosSection.content_json as ClientLogosStripContent)
                .disclaimer || disclaimer,
          }}
          logos={logos.map((l) => ({
            client_name: l.client_name,
            logo: l.logo,
            alt_text: l.alt_text,
            website_url: l.website_url,
          }))}
        />
      ) : null}

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
