import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import type { AdminUser } from "@/lib/auth";

export function AdminHeader({ user }: { user: AdminUser | null }) {
  return (
    <header className="admin__header">
      <div className="admin__header-inner">
        <Link className="admin__brand" href="/admin/dashboard">
          <img src="/assets/img/inline-1c87817066.png" alt="The Haney Group" />
          <div className="admin__brand-meta">
            <span className="admin__brand-eyebrow">The Haney Group</span>
            <span className="admin__brand-label">Site Admin</span>
          </div>
        </Link>
        <div className="admin__userbar">
          <Link href="/">View site →</Link>
          {user ? (
            <>
              <div className="admin__user">
                <span className="admin__user-name">
                  {user.firstName ?? user.email.split("@")[0]}{" "}
                  {user.lastName ?? ""}
                </span>
                <span className="admin__user-email">{user.email}</span>
              </div>
              <SignOutButton redirectUrl="/admin/login">
                <button type="button">Sign out</button>
              </SignOutButton>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
