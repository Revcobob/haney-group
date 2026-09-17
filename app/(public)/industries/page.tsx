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
import { blurProps } from "@/lib/images";

const ORIGINAL_HERO_LEDE =
  "The firm represents associations, public entities, providers, companies, and policy organizations across nine areas of Texas law and regulation.";
const REVISED_HERO_LEDE =
  "The firm represents associations, public entities, providers, companies, and policy organizations before the Texas Legislature and state agencies.";
const ORIGINAL_LOGO_HEADING = "A selection of clients.";
const REVISED_LOGO_HEADING = "Organizations we have represented.";

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
  const heroContent = hero?.content_json as PageHeroContent | undefined;
  const logoContent = logosSection?.content_json as
    | ClientLogosStripContent
    | undefined;

  return (
    <div className="clients-page">
      {hero && heroContent ? (
        <PageHeroBlock
          s={hero}
          c={{
            ...heroContent,
            lede:
              heroContent.lede === ORIGINAL_HERO_LEDE
                ? REVISED_HERO_LEDE
                : heroContent.lede,
          }}
        />
      ) : null}

      {logosSection && logoContent ? (
        <ClientLogosStripBlock
          s={logosSection}
          c={{
            ...logoContent,
            heading:
              logoContent.heading === ORIGINAL_LOGO_HEADING
                ? REVISED_LOGO_HEADING
                : logoContent.heading,
            disclaimer: logoContent.disclaimer || disclaimer,
          }}
          logos={logos.map((l) => ({
            client_name: l.client_name,
            logo: l.logo,
            alt_text: l.alt_text,
            website_url: l.website_url,
          }))}
        />
      ) : null}

      <section
        className="client-sectors"
        data-reveal
        aria-labelledby="client-sectors-heading"
      >
        <div className="container client-sectors__layout">
          <div className="client-sectors__intro">
            <div>
              <p className="eyebrow">Subject matter</p>
              <h2 className="h2" id="client-sectors-heading">
                Work across nine areas of Texas policy.
              </h2>
            </div>
            <p>
              Our work covers legislation, appropriations, agency action, and
              procedure in the areas below.
            </p>
          </div>

          <div className="client-sectors__list">
            {industries.map((industry) => (
              <article className="client-sector" key={industry.title}>
                <div className="client-sector__mark" aria-hidden="true">
                  <Image
                    src={industry.image}
                    {...blurProps(industry.image)}
                    alt=""
                    loading="lazy"
                    fill
                    sizes="(max-width: 640px) 110px, (max-width: 980px) 50vw, 33vw"
                  />
                </div>
                <div className="client-sector__copy">
                  <h3>{industry.title}</h3>
                  <p>{industry.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </div>
  );
}
