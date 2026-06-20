import type { Metadata } from "next";
import Link from "next/link";
import { listAdminArticles } from "@/lib/admin/data/insights";
import { ArticleRowActions } from "@/components/admin/ArticleRowActions";
import { EntityListEmpty } from "@/components/admin/EntityListEmpty";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Insights" };

function formatUpdated(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function AdminInsightsListPage() {
  const articles = supabaseServerConfigured ? await listAdminArticles() : [];
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const publishedCount = articles.filter((a) => a.status === "published").length;

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">Insights</p>
          <h1>The Session Briefing</h1>
          <p>
            Draft, edit, and publish posts. Drafts stay hidden from{" "}
            <code>/insights</code> until you switch the status.
          </p>
        </div>
        <div className="adminheaderbar__actions">
          <Link href="/admin/insights/new" className="adminbtn adminbtn--primary">
            + New article
          </Link>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              The public Insights page is rendering from the six built-in
              fallback articles. Connect Supabase and run <code>npm run seed</code>{" "}
              to manage articles here.
            </p>
          </div>
        </div>
      ) : null}

      {supabaseServerConfigured && articles.length > 0 ? (
        <div className="admin__grid admin__grid--3" style={{ marginBottom: 24 }}>
          <div className="admin__card">
            <div className="admin__stat">
              <span className="admin__stat-num">{publishedCount}</span>
              <span className="admin__stat-label">Published</span>
            </div>
          </div>
          <div className="admin__card">
            <div className="admin__stat">
              <span className="admin__stat-num">{draftCount}</span>
              <span className="admin__stat-label">Drafts</span>
            </div>
          </div>
          <div className="admin__card">
            <div className="admin__stat">
              <span className="admin__stat-num">{articles.length}</span>
              <span className="admin__stat-label">Total articles</span>
            </div>
          </div>
        </div>
      ) : null}

      {supabaseServerConfigured && articles.length === 0 ? (
        <EntityListEmpty
          message="No articles yet. Write the first one — or run the seed to import the six existing posts."
          newHref="/admin/insights/new"
          newLabel="Write the first article"
        />
      ) : null}

      {articles.length > 0 ? (
        <div className="admintable">
          <div className="admintable__row admintable__row--header">
            <div>Article</div>
            <div>Actions</div>
          </div>
          {articles.map((a) => {
            const isPublished = a.status === "published";
            return (
              <div key={a.id} className="admintable__row">
                <div>
                  <Link
                    href={`/admin/insights/${a.id}`}
                    className="admintable__title"
                  >
                    {a.title}
                  </Link>
                  <p className="admintable__sub">
                    {(a.summary ?? a.lede ?? "").slice(0, 160)}
                    {(a.summary ?? a.lede ?? "").length > 160 ? "…" : ""}
                  </p>
                  <div style={{ marginTop: 6 }}>
                    <span
                      className={`admintable__pill admintable__pill--${
                        isPublished ? "published" : "draft"
                      }`}
                    >
                      {isPublished ? "Published" : "Draft"}
                    </span>{" "}
                    {a.category ? (
                      <>
                        <span className="admintable__pill">{a.category}</span>{" "}
                      </>
                    ) : null}
                    <span className="admintable__pill">
                      Updated {formatUpdated(a.updated_at)}
                    </span>{" "}
                    <span className="admintable__pill">/insights/{a.slug}</span>
                  </div>
                </div>
                <ArticleRowActions id={a.id} slug={a.slug} status={a.status} />
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
