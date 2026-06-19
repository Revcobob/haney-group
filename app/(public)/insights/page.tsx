import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { listPublishedArticles } from "@/lib/content/insights";
import { resolveMetadata } from "@/lib/content/seo";

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

export default async function InsightsIndexPage() {
  const articles = await listPublishedArticles();
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/insights-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Insights</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Insights
          </p>
          <h1 className="h1" id="ph-h1">
            The Session Briefing.
          </h1>
          <p className="lede">
            A candid read on what moved at the Texas Capitol, written by the
            firm during session and monthly during interim.
          </p>
        </div>
      </section>

      <section className="article-section" data-reveal>
        <div className="container">
          <div className="postlist">
            {articles.map((a) => (
              <article key={a.slug} className="postlist__item postlist__item--thumb">
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

      <ClosingCTA />
    </>
  );
}
