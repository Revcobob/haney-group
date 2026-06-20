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
    editorHref: "/about",
    description:
      "Firm story and full principal bios. Currently rendered from the source page; section editor lands when the structure stabilizes.",
    editLabel: "View page ↗",
    pills: ["Static for now"],
  },
  {
    slug: "services",
    title: "Services",
    publicHref: "/services",
    editorHref: "/admin/services",
    description:
      "The six capability cards on the Services page and homepage. Edit titles, descriptions, icons, links, and visibility.",
    editLabel: "Edit Services",
    pills: ["6 capabilities", "4 practice areas"],
  },
  {
    slug: "experience",
    title: "Experience",
    publicHref: "/experience",
    editorHref: "/admin/experience",
    description:
      "Anonymized engagement cards. Add, edit, hide, reorder. Helper text reminds you about client confidentiality.",
    editLabel: "Edit Engagements",
    pills: ["Anonymized cards"],
  },
  {
    slug: "industries",
    title: "Clients · Industries",
    publicHref: "/industries",
    editorHref: "/admin/industries",
    description:
      "The nine industry / sector cards. The grayscale client logo strip is managed separately under Client Logos.",
    editLabel: "Edit Industries",
    pills: ["9 industries", "+ logo strip"],
  },
  {
    slug: "insights",
    title: "Insights · The Session Briefing",
    publicHref: "/insights",
    editorHref: "/admin/insights",
    description:
      "Write, edit, draft, and publish articles. Uses the Tiptap rich-text editor with sanitization.",
    editLabel: "Manage Articles",
    pills: ["Drafts + published"],
  },
  {
    slug: "contact",
    title: "Contact",
    publicHref: "/contact",
    editorHref: "/admin/settings#contact",
    description:
      "Page hero text, both column intros, form labels, consent language, and the email address that gets notified on new submissions. Phone, email, and mailing address are in Site Settings · Identity.",
    editLabel: "Edit Contact Page",
    pills: ["Hero", "Left column", "Right column", "Notification email"],
  },
  {
    slug: "privacy",
    title: "Privacy & Legal",
    publicHref: "/privacy",
    editorHref: "/privacy",
    description:
      "Static legal copy. Edit directly in the source if updates are required; no section editor configured yet.",
    editLabel: "View page ↗",
    pills: ["Static for now"],
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
