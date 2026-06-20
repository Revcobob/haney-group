import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { PageHeroBlock } from "@/components/site/PageBlocks";
import { listPublishedArticles } from "@/lib/content/insights";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type { PageHeroContent } from "@/lib/sections/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/insights",
    fallback: {
      title: "Insights · The Session Briefing",
      description:
        "A candid read on what moved at the Texas Capitol, written by The Haney Group during session and monthly during interim.",
    },
  });
}

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function InsightsIndexPage() {
  const [page, articles] = await Promise.all([
    getPageWithSections("insights"),
    listPublishedArticles(),
  ]);
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const closing = findSection(sections, "closing_cta");

  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      <section className="article-section" data-reveal>
        <div className="container">
          <div className="postlist">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="postlist__item postlist__item--thumb"
              >
                <div className="postlist__thumb">
                  <img src={a.hero_image} alt="" loading="lazy" />
                </div>
                <div>
                  <div className="postlist__meta">{a.article_label}</div>
                  <h3 className="postlist__title">
                    <Link href={`/insights/${a.slug}`}>{a.title}</Link>
                  </h3>
                  <p className="postlist__excerpt">{a.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {closing ? <ClosingCTA section={closing} /> : <ClosingCTA />}
    </>
  );
}
