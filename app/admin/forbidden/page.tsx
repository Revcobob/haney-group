import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="admin__authshell">
      <div className="admin__authcard">
        <div className="admin__authcard-brand">
          <img src="/assets/img/inline-1c87817066.png" alt="The Haney Group" />
          <div className="admin__authcard-brand-meta">
            <span className="admin__authcard-eyebrow">The Haney Group</span>
            <span className="admin__authcard-meta-label">Site Admin</span>
          </div>
        </div>
        <div className="admin__authcard-rule" aria-hidden="true"></div>
        <div>
          <h1>This account is not authorized.</h1>
          <p>
            You signed in successfully, but this email is not on the admin
            allowlist for The Haney Group site. If you should have access, ask a
            firm principal to add your address to the <code>ADMIN_EMAILS</code>{" "}
            list and try again.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <SignOutButton redirectUrl="/admin/login">
            <button
              type="button"
              style={{
                background: "#C9892A",
                color: "#06091A",
                border: 0,
                padding: "12px 18px",
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer",
              }}
            >
              Sign out and try a different account
            </button>
          </SignOutButton>
        </div>
        <div className="admin__authcard-foot">
          <span>Access Denied</span>
          <Link href="/">← Return to haney-group.com</Link>
        </div>
      </div>
    </div>
  );
}
