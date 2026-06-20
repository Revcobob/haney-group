import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Pages" };

// Every public page on the site. For each, we describe what's editable
// and where the editor actually lives. Some pages are section-driven
// (homepage), some are settings-driven (contact), some pull from
// structured tables (services, industries, experience, insights).
type PageRow = {
  slug: string;
  title: string;
  publicHref: string;
  editorHref: string;
  visualHref?: string;
  description: string;
  editLabel: string;
  pills: string[];
};

const PAGES: PageRow[] = [
  {
    slug: "home",
    title: "Homepage",
    publicHref: "/",
    editorHref: "/admin/pages/home",
    visualHref: "/admin/pages/home/visual",
    description:
      "Hero, capabilities, process band, proof, approach, principals, industries, insights teaser, closing CTA — fully section-driven.",
    editLabel: "Edit sections",
    pills: ["Hero", "Problem", "Capabilities", "Process", "Proof", "+5 more"],
  },
  {
    slug: "about",
    title: "About",
    publicHref: "/about",
    editorHref: "/admin/pages/about",
    visualHref: "/admin/pages/about/visual",
    description:
      "Firm story, by-the-numbers strip, the three working principles, and full principal bios for Robert and Julie.",
    editLabel: "Edit sections",
    pills: ["Hero", "Firm intro", "Stats", "Principles", "Bios"],
  },
  {
    slug: "services",
    title: "Services",
    publicHref: "/services",
    editorHref: "/admin/pages/services",
    visualHref: "/admin/pages/services/visual",
    description:
      "Page hero, capabilities heading, the senior-representation band, and the practice-areas heading. Capability cards live under the Services manager.",
    editLabel: "Edit sections",
    pills: ["Hero", "Capabilities intro", "Banner", "Practice areas"],
  },
  {
    slug: "experience",
    title: "Experience",
    publicHref: "/experience",
    editorHref: "/admin/pages/experience",
    visualHref: "/admin/pages/experience/visual",
    description:
      "Page hero and the closing pull quote. Engagement cards live under the Experience manager.",
    editLabel: "Edit sections",
    pills: ["Hero", "Closing quote"],
  },
  {
    slug: "industries",
    title: "Clients · Industries",
    publicHref: "/industries",
    editorHref: "/admin/pages/industries",
    visualHref: "/admin/pages/industries/visual",
    description:
      "Page hero and client-logos strip copy. Industry tiles live under the Industries manager; client logos under Client Logos.",
    editLabel: "Edit sections",
    pills: ["Hero", "Logos strip"],
  },
  {
    slug: "insights",
    title: "Insights · The Session Briefing",
    publicHref: "/insights",
    editorHref: "/admin/pages/insights",
    visualHref: "/admin/pages/insights/visual",
    description:
      "Page hero. Article entries live under the Insights manager (Tiptap rich-text editor + draft/published workflow).",
    editLabel: "Edit sections",
    pills: ["Hero"],
  },
  {
    slug: "contact",
    title: "Contact",
    publicHref: "/contact",
    editorHref: "/admin/pages/contact",
    visualHref: "/admin/pages/contact/visual",
    description:
      "Page hero, both column intros, and the form-button / consent copy. Phone, email, and mailing address come from Site Settings; notification email also lives there.",
    editLabel: "Edit sections",
    pills: ["Hero", "Left column", "Right column"],
  },
  {
    slug: "privacy",
    title: "Privacy & Legal",
    publicHref: "/privacy",
    editorHref: "/admin/pages/privacy",
    visualHref: "/admin/pages/privacy/visual",
    description:
      "Page hero plus the Privacy Policy and Legal Notice long-form articles, edited with full rich text.",
    editLabel: "Edit sections",
    pills: ["Hero", "Privacy Policy", "Legal Notice"],
  },
];

export default function AdminPagesPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Pages</p>
        <h1>Website pages</h1>
        <p>
          Every public page and where to edit it. The homepage uses the
          full section editor; other pages either pull from structured
          tables (services, industries, articles) or from Site Settings
          (contact). Static pages link out to the live URL for now.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              The public site is rendering from built-in fallback content.
              Editing here will start working once the database is wired up.
            </p>
          </div>
        </div>
      ) : null}

      <div className="admintable">
        <div className="admintable__row admintable__row--header">
          <div>Page</div>
          <div>Actions</div>
        </div>
        {PAGES.map((p) => (
          <div key={p.slug} className="admintable__row">
            <div>
              <Link href={p.editorHref} className="admintable__title">
                {p.title}
              </Link>
              <p className="admintable__sub">
                <Link
                  href={p.publicHref}
                  target="_blank"
                  style={{ color: "var(--text-3)" }}
                >
                  {p.publicHref}
                </Link>{" "}
                — {p.description}
              </p>
              <div style={{ marginTop: 6 }}>
                {p.pills.map((pill) => (
                  <span
                    key={pill}
                    className="admintable__pill"
                    style={{ marginRight: 4 }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div className="admintable__actions">
              {p.visualHref ? (
                <Link
                  href={p.visualHref}
                  className="adminbtn adminbtn--ghost adminbtn--small"
                >
                  Visual editor
                </Link>
              ) : null}
              <Link
                href={p.editorHref}
                className="adminbtn adminbtn--primary adminbtn--small"
              >
                {p.editLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
