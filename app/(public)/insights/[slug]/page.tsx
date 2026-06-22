import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, listArticleSlugs } from "@/lib/content/insights";

// Allow new slugs published via the admin to render without a redeploy.
// Unknown slugs return notFound() below.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await listArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      title: `${article.title} · The Haney Group`,
      description: article.summary,
      images: article.hero_image,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: `url('${article.hero_image}')` }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/insights">Insights</Link>
            <span className="sep">/</span>
            <span>{article.title}</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            The Session Briefing · Article
          </p>
          <h1 className="h1" id="ph-h1">
            {article.title}
          </h1>
          <p className="lede">{article.lede}</p>
        </div>
      </section>

      <section className="article-section" data-reveal>
        <div className="container">
          <div className="prose article__lead">
            <div className="article__topbar">
              <Link className="article__back" href="/insights" aria-label="Back to Insights">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                <span>Back to Insights</span>
              </Link>
            </div>

            <div className="article__meta">
              <span className="article__meta-group">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>
                  By <strong className="article__byline">{article.author}</strong>
                </span>
              </span>
              <span className="article__meta-sep"></span>
              <span className="article__meta-group">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>{article.date_label}</span>
              </span>
              <span className="article__meta-sep"></span>
              <span className="article__meta-group">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span>{article.read_time}</span>
              </span>
              <span className="article__meta-sep"></span>
              <span className="article__meta-group">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.59 13.41 13 21l-9-9V3h9l7.59 7.59a2 2 0 0 1 0 2.82z" />
                  <circle cx="8" cy="8" r="1.5" />
                </svg>
                <span>{article.category}</span>
              </span>
            </div>

            <div
              className="article__body"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />

            <div className="article__close">
              <p>
                <strong>Want to discuss this with the firm?</strong> Every
                engagement begins with a short, confidential conversation about
                the issue, the timing, and what success would look like.
              </p>
              <Link className="article__email" href="/contact">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
                <span>Contact The Haney Group</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
