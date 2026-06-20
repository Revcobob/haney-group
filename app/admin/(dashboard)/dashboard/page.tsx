import type { Metadata } from "next";
import Link from "next/link";
import { supabaseServerConfigured } from "@/lib/env";
import { listAdminArticles } from "@/lib/admin/data/insights";
import { countNewInquiries } from "@/lib/admin/data/inquiries";

export const metadata: Metadata = { title: "Dashboard" };

type QuickLink = { href: string; eyebrow: string; title: string; body: string };

const quickLinks: QuickLink[] = [
  { href: "/admin/pages", eyebrow: "Pages", title: "Edit Pages", body: "Every public page and where to edit it — homepage sections, services, industries, contact page text, and more." },
  { href: "/admin/pages/home/visual", eyebrow: "Visual", title: "Open Visual Editor", body: "Click any region on the homepage to edit it inline, with a live preview that reloads on save." },
  { href: "/admin/insights", eyebrow: "Insights", title: "Write an Insight Article", body: "Draft, edit, and publish posts for The Session Briefing." },
  { href: "/admin/settings#contact", eyebrow: "Contact", title: "Edit Contact Page", body: "Update the Contact page text and change the email address that gets new-inquiry alerts." },
  { href: "/admin/inquiries", eyebrow: "Inbox", title: "Contact Inquiries", body: "Review and triage notes that came in through the Contact form." },
  { href: "/admin/settings", eyebrow: "Site", title: "Site Settings", body: "Firm name, address, phone, email, footer copy, and every site-wide setting." },
];

export default async function DashboardPage() {
  const supabaseReady = supabaseServerConfigured;
  const [articles, newInquiryCount] = await Promise.all([
    supabaseReady ? listAdminArticles() : Promise.resolve([]),
    supabaseReady ? countNewInquiries() : Promise.resolve(0),
  ]);
  const draftCount = articles.filter((a) => a.status === "draft").length;
  const publishedCount = articles.filter((a) => a.status === "published").length;

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Welcome</p>
        <h1>Site overview</h1>
        <p>
          Update the website, publish to The Session Briefing, manage SEO, and
          review contact inquiries — all in one place.
        </p>
      </div>

      {!supabaseReady ? (
        <div className="admin__notice admin__notice--info" role="status">
          <div>
            <strong>Supabase not yet connected.</strong>
            <p>
              The admin UI is live but the CMS database is not wired up. Set{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment to enable
              page editing, articles, media, and inquiries.
            </p>
          </div>
        </div>
      ) : null}

      <div className="admin__grid admin__grid--3">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href} className="admin__card admin__card--link">
            <span className="admin__card-eyebrow">{q.eyebrow}</span>
            <h3>{q.title}</h3>
            <p>{q.body}</p>
            <span className="admin__card-action">
              Open <span className="arrow">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="admin__pagehead" style={{ marginTop: 48 }}>
        <p className="admin__pagehead-eyebrow">At a glance</p>
        <h1 style={{ fontSize: 22 }}>Recent activity</h1>
        <p>
          New contact inquiries, draft articles, and recently updated pages will
          appear here once Supabase is connected.
        </p>
      </div>

      <div className="admin__grid admin__grid--4">
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{supabaseReady ? newInquiryCount : "—"}</span>
            <span className="admin__stat-label">New inquiries (awaiting review)</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{supabaseReady ? draftCount : "—"}</span>
            <span className="admin__stat-label">Draft articles</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{supabaseReady ? publishedCount : "—"}</span>
            <span className="admin__stat-label">Published articles</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">—</span>
            <span className="admin__stat-label">Pages edited (last 30d)</span>
          </div>
        </div>
      </div>
    </>
  );
}
