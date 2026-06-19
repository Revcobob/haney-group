import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/forms/ArticleForm";
import { createArticleAction } from "@/lib/admin/actions/insights";

export const metadata: Metadata = { title: "New article" };

export default function AdminInsightsNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Insights / New</p>
        <h1>Write a new article</h1>
        <p>
          Save as a draft to keep working. Publish when the piece is ready for{" "}
          <code>/insights</code>.
        </p>
      </div>
      <ArticleForm
        action={createArticleAction}
        cancelHref="/admin/insights"
        saveSuccessMessage="Article created. Redirecting…"
      />
    </>
  );
}
