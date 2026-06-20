import type { Metadata } from "next";
import { PageHeroBlock, HtmlBlock } from "@/components/site/PageBlocks";
import { getPageWithSections, type PageSection } from "@/lib/content/pages";
import { resolveMetadata } from "@/lib/content/seo";
import type { PageHeroContent, HtmlBlockContent } from "@/lib/sections/types";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/privacy",
    fallback: {
      title: "Privacy & Legal",
      description:
        "How The Haney Group handles information collected through our website, and the terms that govern your use of haney-group.com.",
    },
  });
}

function findSection(sections: PageSection[], key: string): PageSection | null {
  return sections.find((s) => s.section_key === key) ?? null;
}

export default async function PrivacyPage() {
  const page = await getPageWithSections("privacy");
  const sections = page?.sections ?? [];
  const hero = findSection(sections, "page_hero");
  const htmlBlocks = sections.filter((s) => s.section_type === "html_block");

  return (
    <>
      {hero ? (
        <PageHeroBlock s={hero} c={hero.content_json as PageHeroContent} />
      ) : null}

      <section data-reveal>
        <div className="container">
          <div className="prose">
            {htmlBlocks.map((s, i) => (
              <div key={s.section_key}>
                <HtmlBlock s={s} c={s.content_json as HtmlBlockContent} />
                {i < htmlBlocks.length - 1 ? (
                  <hr className="legal__divider" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
