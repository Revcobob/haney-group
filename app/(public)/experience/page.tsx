import type { Metadata } from "next";
import Image from "next/image";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import {
  PageHeroBlock,
  QuoteCardBlock,
} from "@/components/site/PageBlocks";
import { getExperienceItems } from "@/lib/content/site";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type {
  PageHeroContent,
  QuoteCardContent,
} from "@/lib/sections/types";
import { blurProps } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/experience",
    fallback: {
      title: "Experience",
      description:
        "Selected anonymized engagements: regulatory bills, Article II budget riders, preemption defense, permit reform, public-affairs programs, and parliamentary consults across the Texas Capitol.",
    },
  });
}

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function ExperiencePage() {
  const [page, engagements] = await Promise.all([
    getPageWithSections("experience"),
    getExperienceItems(),
  ]);
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const quote = findSection(sections, "engagements_quote");
  const closing = findSection(sections, "closing_cta");

  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      <section data-reveal>
        <div className="container">
          <div className="tilegrid">
            {engagements.map((e) => (
              <article key={e.title} className="tile tile--banner">
                <div className="tile__banner">
                  <Image
                    src={e.image}
                    {...blurProps(e.image)}
                    alt={e.image_alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 719px) 100vw, 50vw"
                  />
                </div>
                <div className="tile__body">
                  <h3>{e.title}</h3>
                  <p>
                    <strong>{e.leading_line}</strong>
                    {e.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {quote ? (
            <QuoteCardBlock
              s={quote}
              c={quote.content_json as QuoteCardContent}
            />
          ) : null}
        </div>
      </section>

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
