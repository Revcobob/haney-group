import type { Metadata } from "next";
import Link from "next/link";
import { pageFallbacks } from "@/content/fallbacks/pages";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Pages" };

export default function AdminPagesPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Pages</p>
        <h1>Website pages</h1>
        <p>
          Edit the headlines, copy, cards, images, and CTAs on each public page.
          Use the dashboard editor for a section list, or the visual editor to
          click directly on a region in a preview of the page.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              The public site is rendering from built-in fallback content.
              Editing here will start working once the database is wired up;
              you can review the section list now.
            </p>
          </div>
        </div>
      ) : null}

      <div className="admintable">
        <div className="admintable__row admintable__row--header">
          <div>Page</div>
          <div>Actions</div>
        </div>
        {pageFallbacks.map((p) => (
          <div key={p.slug} className="admintable__row">
            <div>
              <Link
                href={`/admin/pages/${p.slug}`}
                className="admintable__title"
              >
                {p.title}
              </Link>
              <p className="admintable__sub">
                /{p.slug === "home" ? "" : p.slug} · {p.sections.length} sections
              </p>
              <div style={{ marginTop: 6 }}>
                {p.sections.slice(0, 6).map((s) => (
                  <span
                    key={s.section_key}
                    className="admintable__pill"
                    style={{ marginRight: 4 }}
                  >
                    {s.section_label}
                  </span>
                ))}
                {p.sections.length > 6 ? (
                  <span className="admintable__pill">+{p.sections.length - 6} more</span>
                ) : null}
              </div>
            </div>
            <div className="admintable__actions">
              <Link
                href={`/admin/pages/${p.slug}/visual`}
                className="adminbtn adminbtn--ghost adminbtn--small"
              >
                Visual editor
              </Link>
              <Link
                href={`/admin/pages/${p.slug}`}
                className="adminbtn adminbtn--primary adminbtn--small"
              >
                Edit sections
              </Link>
            </div>
          </div>
        ))}
      </div>

      {pageFallbacks.length < 8 ? (
        <div className="admin__notice admin__notice--info" style={{ marginTop: 24 }}>
          <div>
            <strong>Only the homepage has a section editor configured.</strong>
            <p>
              About, Services, Experience, Industries, Insights, Contact, and
              Privacy can be added to <code>content/fallbacks/pages.ts</code>{" "}
              as their structure stabilises. The schema (cms_page_sections)
              already supports them.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
