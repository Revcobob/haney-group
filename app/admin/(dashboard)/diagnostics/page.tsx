import type { Metadata } from "next";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured, env, clerkConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Diagnostics" };
export const dynamic = "force-dynamic";

type ProbeResult = {
  label: string;
  ok: boolean;
  detail: string;
};

function maskUrl(url: string | undefined): string {
  if (!url) return "—";
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "(invalid URL)";
  }
}

function maskKey(key: string | undefined): string {
  if (!key) return "—";
  if (key.length < 12) return "(short key)";
  return `${key.slice(0, 4)}…${key.slice(-4)} (len ${key.length})`;
}

async function probeTable(table: string): Promise<ProbeResult> {
  try {
    const sb = serverSupabase();
    const { error, count } = await sb
      .from(table)
      .select("*", { count: "exact", head: true });
    if (error) {
      return {
        label: `SELECT count(*) FROM ${table}`,
        ok: false,
        detail: `${error.message}${
          (error as { code?: string }).code
            ? ` (code ${(error as { code?: string }).code})`
            : ""
        }${
          (error as { hint?: string }).hint
            ? ` — hint: ${(error as { hint?: string }).hint}`
            : ""
        }`,
      };
    }
    return {
      label: `SELECT count(*) FROM ${table}`,
      ok: true,
      detail: `${count ?? 0} rows`,
    };
  } catch (e) {
    return {
      label: `SELECT count(*) FROM ${table}`,
      ok: false,
      detail: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function probeBucket(bucket: string): Promise<ProbeResult> {
  try {
    const sb = serverSupabase();
    const { error } = await sb.storage.from(bucket).list("", { limit: 1 });
    if (error) {
      return {
        label: `storage.list('${bucket}')`,
        ok: false,
        detail: error.message,
      };
    }
    return {
      label: `storage.list('${bucket}')`,
      ok: true,
      detail: "reachable",
    };
  } catch (e) {
    return {
      label: `storage.list('${bucket}')`,
      ok: false,
      detail: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export default async function AdminDiagnosticsPage() {
  const tables: ProbeResult[] = [];
  const buckets: ProbeResult[] = [];

  if (supabaseServerConfigured) {
    const tableNames = [
      "cms_media",
      "cms_contact_inquiries",
      "cms_articles",
      "cms_pages",
      "cms_page_sections",
      "cms_audit_log",
    ];
    for (const t of tableNames) {
      tables.push(await probeTable(t));
    }
    const bucketNames = [
      "site-media",
      "hero-images",
      "insight-images",
      "client-logos",
      "og-images",
    ];
    for (const b of bucketNames) {
      buckets.push(await probeBucket(b));
    }
  }

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Ops</p>
        <h1>Diagnostics</h1>
        <p>
          Read-only probes against Clerk and Supabase. Use this when admin
          pages throw a redacted “Application error” — every check here
          surfaces its actual error message in plain text.
        </p>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>
        Environment
      </h2>
      <div className="admintable">
        <div className="admintable__row">
          <div>
            <strong>Clerk configured</strong>
            <p className="admintable__sub">{clerkConfigured ? "yes" : "no — auth will block all admin routes"}</p>
          </div>
        </div>
        <div className="admintable__row">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL</strong>
            <p className="admintable__sub"><code>{maskUrl(env.SUPABASE_URL)}</code></p>
          </div>
        </div>
        <div className="admintable__row">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>
            <p className="admintable__sub"><code>{maskKey(env.SUPABASE_ANON_KEY)}</code></p>
          </div>
        </div>
        <div className="admintable__row">
          <div>
            <strong>SUPABASE_SERVICE_ROLE_KEY</strong>
            <p className="admintable__sub"><code>{maskKey(env.SUPABASE_SERVICE_ROLE_KEY)}</code></p>
          </div>
        </div>
        <div className="admintable__row">
          <div>
            <strong>supabaseServerConfigured</strong>
            <p className="admintable__sub">{supabaseServerConfigured ? "true" : "false — server-side Supabase code will fail or skip"}</p>
          </div>
        </div>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning" style={{ marginTop: 18 }}>
          <div>
            <strong>Supabase not configured at runtime.</strong>
            <p>
              The two env vars NEXT_PUBLIC_SUPABASE_URL and
              SUPABASE_SERVICE_ROLE_KEY must both be present (non-empty) for
              the admin to read and write CMS data. Add them to the right
              Vercel environment and redeploy.
            </p>
          </div>
        </div>
      ) : null}

      <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>
        Tables
      </h2>
      <div className="admintable">
        {tables.length === 0 ? (
          <div className="admintable__empty">Skipped — Supabase not configured.</div>
        ) : (
          tables.map((p) => (
            <div key={p.label} className="admintable__row">
              <div>
                <strong>{p.label}</strong>
                <p
                  className="admintable__sub"
                  style={{ color: p.ok ? "var(--text-2)" : "#B25C2E" }}
                >
                  {p.ok ? "OK" : "FAIL"} — <code>{p.detail}</code>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 700, marginTop: 32, marginBottom: 8 }}>
        Storage buckets
      </h2>
      <div className="admintable">
        {buckets.length === 0 ? (
          <div className="admintable__empty">Skipped — Supabase not configured.</div>
        ) : (
          buckets.map((p) => (
            <div key={p.label} className="admintable__row">
              <div>
                <strong>{p.label}</strong>
                <p
                  className="admintable__sub"
                  style={{ color: p.ok ? "var(--text-2)" : "#B25C2E" }}
                >
                  {p.ok ? "OK" : "FAIL"} — <code>{p.detail}</code>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
