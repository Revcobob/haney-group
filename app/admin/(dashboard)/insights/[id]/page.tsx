import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminArticle } from "@/lib/admin/data/insights";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { updateArticleAction } from "@/lib/admin/actions/insights";

export const metadata: Metadata = { title: "Edit article" };

export default async function AdminInsightEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const article = await getAdminArticle(id);
  if (!article) notFound();

  const update = updateArticleAction.bind(null, id);

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">
          Insights / Edit · {article.status === "published" ? "Published" : "Draft"}
        </p>
        <h1>{article.title}</h1>
        <p>
          Public URL:{" "}
          {article.status === "published" ? (
            <Link
              href={`/insights/${article.slug}`}
              target="_blank"
              style={{ color: "var(--navy-900)", textDecoration: "underline" }}
            >
              /insights/{article.slug} ↗
            </Link>
          ) : (
            <span style={{ color: "var(--text-3)" }}>
              /insights/{article.slug} · not yet published
            </span>
          )}
        </p>
      </div>

      {saved ? (
        <div className="admin__notice admin__notice--info" role="status">
          <div>
            <strong>Saved.</strong>
            <p>
              Your changes are live. Continue editing or{" "}
              <Link href="/admin/insights" style={{ color: "var(--navy-900)", textDecoration: "underline" }}>
                return to the article list
              </Link>
              .
            </p>
          </div>
        </div>
      ) : null}

      <ArticleForm
        action={update}
        cancelHref="/admin/insights"
        defaults={{
          title: article.title,
          slug: article.slug,
          category: article.category ?? undefined,
          article_label: article.article_label ?? undefined,
          summary: article.summary ?? undefined,
          lede: article.lede ?? undefined,
          body_html: article.body_html ?? "",
          featured_image_id: article.featured_image_id ?? undefined,
          author: article.author ?? undefined,
          date_label: article.date_label ?? undefined,
          read_time_minutes: article.read_time_minutes ?? undefined,
          status: article.status,
          scheduled_publish_at: article.scheduled_publish_at ?? null,
        }}
      />
    </>
  );
}
