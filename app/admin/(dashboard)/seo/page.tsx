import type { Metadata } from "next";
import Link from "next/link";
import { listSeoRows } from "@/lib/admin/data/seo";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "SEO" };

// The set of public pages the admin should be able to override SEO for.
// New pages added in code should be added here so they appear in the picker.
const KNOWN_PATHS: Array<{ path: string; label: string; description: string }> = [
  { path: "/", label: "Homepage", description: "/ — the firm landing page" },
  { path: "/about", label: "About", description: "/about — firm story + principal bios" },
  { path: "/services", label: "Services", description: "/services — six capabilities + four practice areas" },
  { path: "/services/legislative-strategy", label: "Service · Legislative Strategy", description: "/services/legislative-strategy" },
  { path: "/services/appropriations", label: "Service · Appropriations", description: "/services/appropriations" },
  { path: "/services/public-affairs", label: "Service · Public Affairs", description: "/services/public-affairs" },
  { path: "/services/parliamentary", label: "Service · Parliamentary", description: "/services/parliamentary" },
  { path: "/experience", label: "Experience", description: "/experience — anonymized engagements" },
  { path: "/industries", label: "Clients", description: "/industries — industries + client logos" },
  { path: "/insights", label: "Insights index", description: "/insights — The Session Briefing" },
  { path: "/contact", label: "Contact", description: "/contact — the inquiry form" },
  { path: "/privacy", label: "Privacy", description: "/privacy — privacy + legal notice" },
];

export default async function AdminSeoListPage() {
  const rows = supabaseServerConfigured ? await listSeoRows() : [];
  const byPath = new Map(
    rows.filter((r) => r.entity_type === "path" && r.path).map((r) => [r.path as string, r])
  );
  const hasGlobal = rows.some((r) => r.entity_type === "global");

  return (
    <>
      <div className="adminheaderbar">
        <div className="admin__pagehead" style={{ marginBottom: 0 }}>
          <p className="admin__pagehead-eyebrow">SEO</p>
          <h1>SEO manager</h1>
          <p>
            Per-page meta titles, descriptions, social previews, and canonical
            paths. Global defaults fill in when a page leaves a field blank.
          </p>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              The public site is using built-in default metadata from{" "}
              <code>app/layout.tsx</code> until Supabase is wired up.
            </p>
          </div>
        </div>
      ) : null}

      <div className="admin__grid admin__grid--3" style={{ marginBottom: 28 }}>
        <Link href="/admin/seo/global" className="admin__card admin__card--link">
          <span className="admin__card-eyebrow">Site-wide</span>
          <h3>Global defaults</h3>
          <p>
            The fallback title, description, and social image used when a page
            leaves its own SEO blank.
          </p>
          <span className="admin__card-action">
            {hasGlobal ? "Edit global" : "Set global defaults"}{" "}
            <span className="arrow">→</span>
          </span>
        </Link>
        <div className="admin__card">
          <span className="admin__card-eyebrow">Configured paths</span>
          <h3>{byPath.size}</h3>
          <p>
            Public paths with custom SEO. Paths without a row inherit from the
            global defaults, then code-level fallback.
          </p>
        </div>
        <div className="admin__card">
          <span className="admin__card-eyebrow">Insight articles</span>
          <h3>—</h3>
          <p>
            Articles set their own title and description from the article form
            in <Link href="/admin/insights" style={{ color: "var(--navy-900)", textDecoration: "underline" }}>Insights</Link>.
          </p>
        </div>
      </div>

      <div className="admin__pagehead" style={{ marginBottom: 16 }}>
        <p className="admin__pagehead-eyebrow">Pages</p>
        <h1 style={{ fontSize: 22 }}>Per-page SEO</h1>
        <p>
          One row per public path. The amber pill marks paths with a custom
          override; the rest fall back to global defaults.
        </p>
      </div>

      <div className="admintable">
        <div className="admintable__row admintable__row--header">
          <div>Page</div>
          <div>Status</div>
        </div>
        {KNOWN_PATHS.map((p) => {
          const row = byPath.get(p.path);
          const has = Boolean(row);
          const href = `/admin/seo/path?path=${encodeURIComponent(p.path)}`;
          return (
            <div key={p.path} className="admintable__row">
              <div>
                <Link href={href} className="admintable__title">
                  {p.label}
                </Link>
                <p className="admintable__sub">{p.description}</p>
                <div style={{ marginTop: 6 }}>
                  {has ? (
                    <>
                      <span className="admintable__pill admintable__pill--published">
                        Custom SEO
                      </span>{" "}
                      {row?.noindex ? (
                        <span
                          className="admintable__pill"
                          style={{
                            color: "#B25C2E",
                            borderColor: "#E5C0C0",
                            background: "#FBEAEA",
                          }}
                        >
                          noindex
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className="admintable__pill">Inherits defaults</span>
                  )}
                </div>
              </div>
              <div className="admintable__actions">
                <Link
                  href={href}
                  className="adminbtn adminbtn--primary adminbtn--small"
                >
                  {has ? "Edit" : "Add SEO"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
