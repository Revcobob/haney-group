import type { Metadata } from "next";
import Link from "next/link";
import { runHealthChecks } from "@/lib/admin/data/health";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Site Health" };
export const dynamic = "force-dynamic";

export default async function AdminHealthPage() {
  const issues = supabaseServerConfigured ? await runHealthChecks() : [];
  const byCategory = new Map<string, typeof issues>();
  for (const i of issues) {
    const arr = byCategory.get(i.category) ?? [];
    arr.push(i);
    byCategory.set(i.category, arr);
  }
  const totals = {
    error: issues.filter((i) => i.severity === "error").length,
    warn: issues.filter((i) => i.severity === "warn").length,
    info: issues.filter((i) => i.severity === "info").length,
  };

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Ops</p>
        <h1>Site health</h1>
        <p>
          Read-only scan of the CMS for the things that usually rot
          first: missing alt text, image references pointing at media
          that no longer exists, malformed navigation links, and
          sections that lost their headline. Re-run any time by
          reloading the page.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>Connect Supabase to run health checks.</p>
          </div>
        </div>
      ) : null}

      <div className="admin__grid admin__grid--4">
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{totals.error}</span>
            <span className="admin__stat-label">Errors (likely breaking)</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{totals.warn}</span>
            <span className="admin__stat-label">Warnings (rough edges)</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">{issues.length}</span>
            <span className="admin__stat-label">Total issues</span>
          </div>
        </div>
        <div className="admin__card">
          <div className="admin__stat">
            <span className="admin__stat-num">
              {totals.error === 0 && totals.warn === 0 ? "✓" : "—"}
            </span>
            <span className="admin__stat-label">All clear</span>
          </div>
        </div>
      </div>

      {issues.length === 0 && supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--info" style={{ marginTop: 24 }}>
          <div>
            <strong>Nothing to flag.</strong>
            <p>Every checked surface is in good shape.</p>
          </div>
        </div>
      ) : null}

      {Array.from(byCategory.entries()).map(([category, items]) => (
        <section key={category} style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>
            {category}
            <span style={{ color: "var(--text-3)", fontWeight: 400, marginLeft: 8, fontSize: 14 }}>
              {items.length} {items.length === 1 ? "issue" : "issues"}
            </span>
          </h2>
          <div className="admintable">
            {items.map((issue) => (
              <div key={issue.id} className="admintable__row">
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    className="admintable__pill"
                    style={{
                      textTransform: "uppercase",
                      fontSize: 10,
                      color:
                        issue.severity === "error"
                          ? "#B25C2E"
                          : issue.severity === "warn"
                          ? "var(--amber-600)"
                          : "var(--text-3)",
                      borderColor:
                        issue.severity === "error"
                          ? "#E5C0C0"
                          : "var(--line-2)",
                      flexShrink: 0,
                    }}
                  >
                    {issue.severity}
                  </span>
                  <span>{issue.message}</span>
                </div>
                <div className="admintable__actions">
                  {issue.fixHref ? (
                    <Link
                      href={issue.fixHref}
                      className="adminbtn adminbtn--primary adminbtn--small"
                    >
                      Fix
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
