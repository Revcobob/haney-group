import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import type { AdminUser } from "@/lib/auth";
import { BrandMark } from "./BrandMark";

export function AdminHeader({ user }: { user: AdminUser | null }) {
  return (
    <header className="admin__header">
      <div className="admin__header-inner">
        <Link
          className="admin__brand"
          href="/admin/dashboard"
          style={{ color: "var(--paper)" }}
        >
          <BrandMark size="md" />
        </Link>
        <div className="admin__userbar">
          <span className="admin__kbdhint" aria-hidden="true">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
            <span>to search</span>
          </span>
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
