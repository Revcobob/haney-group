"use client";

import { useActionState } from "react";
import { SaveBar } from "./SaveBar";
import { TextField, TextareaField, SelectField } from "./Fields";
import { TiptapEditor } from "../TiptapEditor";
import type { ActionResult } from "@/lib/admin/actions/_helpers";

type Action = (
  prev: ActionResult | undefined,
  formData: FormData
) => Promise<ActionResult>;

type Defaults = {
  title?: string;
  slug?: string;
  category?: string;
  article_label?: string;
  summary?: string;
  lede?: string;
  body_html?: string;
  featured_image_id?: string;
  author?: string;
  date_label?: string;
  read_time_minutes?: number;
  status?: "draft" | "published";
};

export function ArticleForm({
  action,
  defaults,
  cancelHref,
  saveSuccessMessage,
}: {
  action: Action;
  defaults?: Defaults;
  cancelHref?: string;
  saveSuccessMessage?: string;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined
  );

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const status = !state ? "idle" : state.ok ? "success" : "error";
  const message = !state
    ? undefined
    : state.ok
    ? saveSuccessMessage ?? "Saved."
    : state.error;

  const hadSlug = Boolean(defaults?.slug);

  // Tiny inline behaviour: while editing a NEW article (no existing slug),
  // auto-derive the slug from the title until the editor types in the
  // slug field manually.
  const autoSlugScript = `(()=>{const t=document.getElementById('title'),s=document.getElementById('slug');if(!t||!s)return;let manual=${JSON.stringify(hadSlug)};s.addEventListener('input',()=>{manual=true});t.addEventListener('input',()=>{if(manual)return;s.value=t.value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/['\\u2018\\u2019"\\u201c\\u201d]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80);});})();`;

  return (
    <form action={formAction} className="adminform">
      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">The Session Briefing</p>
          <h2>Article</h2>
          <p>
            Drafts save without going live. Switch the status to Published when
            you’re ready for the public site to show it.
          </p>
        </div>

        <TextField
          id="title"
          name="title"
          label="Article title"
          required
          defaultValue={defaults?.title}
          error={errors.title}
          maxLength={140}
          placeholder="Why Legislative Timing Matters"
        />

        <TextField
          id="slug"
          name="slug"
          label="URL slug"
          required
          defaultValue={defaults?.slug}
          error={errors.slug}
          help="Lowercase letters, numbers, and dashes only. Becomes /insights/<slug>."
          placeholder="why-legislative-timing-matters"
        />
        <script dangerouslySetInnerHTML={{ __html: autoSlugScript }} />

        <div className="adminform__row two">
          <SelectField
            id="status"
            name="status"
            label="Status"
            defaultValue={defaults?.status ?? "draft"}
            options={[
              { value: "draft", label: "Draft (hidden from the public site)" },
              { value: "published", label: "Published (live on /insights)" },
            ]}
          />
          <TextField
            id="date_label"
            name="date_label"
            label="Date label"
            help="The friendly date shown in the meta strip, e.g. “Interim 2026”."
            defaultValue={defaults?.date_label}
            error={errors.date_label}
            placeholder="Interim 2026"
          />
        </div>
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Editorial</p>
          <h2>Summary &amp; lede</h2>
          <p>
            The summary appears on /insights and in shared previews. The lede
            sits below the article title on the post page.
          </p>
        </div>
        <TextareaField
          id="summary"
          name="summary"
          label="Summary (article-list excerpt)"
          defaultValue={defaults?.summary}
          rows={3}
          maxLength={320}
          error={errors.summary}
        />
        <TextareaField
          id="lede"
          name="lede"
          label="Lede (sits beneath the title)"
          defaultValue={defaults?.lede}
          rows={3}
          maxLength={320}
          error={errors.lede}
        />
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Body</p>
          <h2>Article body</h2>
          <p>
            Rich text — headings, paragraphs, lists, quotes, links. Saved HTML
            is sanitized server-side before it reaches the database.
          </p>
        </div>
        <TiptapEditor
          name="body_html"
          defaultHtml={defaults?.body_html ?? ""}
          placeholder="Open with the strongest sentence in the piece…"
        />
        {errors.body_html ? (
          <p className="adminfield__error" role="alert">
            {errors.body_html}
          </p>
        ) : null}
      </section>

      <section className="adminform__section">
        <div className="adminform__section-head">
          <p className="adminform__section-eyebrow">Taxonomy &amp; Display</p>
          <h2>Category, label, byline</h2>
        </div>
        <div className="adminform__row two">
          <TextField
            id="category"
            name="category"
            label="Category"
            defaultValue={defaults?.category}
            error={errors.category}
            help="e.g. Procedure, Appropriations, Communications"
          />
          <TextField
            id="article_label"
            name="article_label"
            label="Article label (shown in cards)"
            defaultValue={defaults?.article_label}
            error={errors.article_label}
            help="e.g. “Article · Procedure”. Defaults to “Article · {category}”."
          />
        </div>
        <div className="adminform__row two">
          <TextField
            id="author"
            name="author"
            label="Author"
            defaultValue={defaults?.author ?? "Robert Haney"}
            error={errors.author}
          />
          <TextField
            id="read_time_minutes"
            name="read_time_minutes"
            label="Read time (minutes)"
            defaultValue={
              defaults?.read_time_minutes
                ? String(defaults.read_time_minutes)
                : ""
            }
            error={errors.read_time_minutes}
            placeholder="6"
            help="Optional. Skipped on the public meta strip if blank."
          />
        </div>
        <TextField
          id="featured_image_id"
          name="featured_image_id"
          label="Featured image (media ID)"
          defaultValue={defaults?.featured_image_id ?? ""}
          error={errors.featured_image_id}
          help="The hero image. Falls back to a default if blank."
        />
      </section>

      <SaveBar status={status} message={message} cancelHref={cancelHref} />
    </form>
  );
}
