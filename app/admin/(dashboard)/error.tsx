"use client";

import { useEffect } from "react";

// Per-route-group error boundary. Without this, any throw inside an
// admin page (e.g. Supabase query failure, missing table, expired
// service-role key) collapses to Next.js's redacted "Application
// error" splash with only a digest. Surface the real message so the
// editor knows what to fix instead of staring at an opaque digest.
export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] route boundary caught", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Something went wrong</p>
        <h1>This admin page hit an error</h1>
        <p>
          The route threw while loading data from Supabase. The most common
          causes are a migration that hasn’t actually been applied, a
          service-role key from a different Supabase project than the URL, or
          an RLS policy blocking the service role (it shouldn’t, but worth a
          look).
        </p>
      </div>
      <div className="admin__notice admin__notice--warning">
        <div>
          <strong>{error.message || "Unknown error"}</strong>
          {error.digest ? (
            <p>
              Vercel digest <code>{error.digest}</code>. Search the project’s
              runtime logs for this digest to see the full stack.
            </p>
          ) : null}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          type="button"
          onClick={() => reset()}
          className="adminbtn adminbtn--primary"
        >
          Try again
        </button>
        <a href="/admin/dashboard" className="adminbtn adminbtn--ghost">
          Back to dashboard
        </a>
      </div>
    </>
  );
}
