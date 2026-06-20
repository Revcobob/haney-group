import "server-only";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  clerkConfigured,
  env,
  getAdminEmails,
  getEditorEmails,
} from "@/lib/env";

export type AdminRole = "admin" | "editor";
export type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: AdminRole;
};

function deriveRole(emails: string[]): AdminRole | null {
  const lower = emails.map((e) => e.toLowerCase());
  const admins = getAdminEmails();
  const editors = getEditorEmails();

  // Admins win when listed in both.
  if (admins.some((a) => lower.includes(a))) return "admin";
  if (editors.some((e) => lower.includes(e))) return "editor";

  // No explicit allowlist at all: fall back to "admin" during dev so a
  // brand-new project isn't locked out of its own UI.
  if (admins.length === 0 && editors.length === 0) {
    return process.env.NODE_ENV === "development" ? "admin" : null;
  }
  return null;
}

// Returns the admin user if the request is signed in AND on either
// allowlist. Otherwise redirects: to /admin/login when unauthenticated,
// or to /admin/forbidden when authenticated but not allowlisted.
export async function requireAdmin(): Promise<AdminUser> {
  if (!clerkConfigured) redirect("/admin/setup-needed");

  const { userId } = await auth();
  if (!userId) redirect(env.CLERK_SIGN_IN_URL);

  const user = await currentUser();
  if (!user) redirect(env.CLERK_SIGN_IN_URL);

  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const role = deriveRole(emails);
  if (!role) redirect("/admin/forbidden");

  return {
    id: user.id,
    email: emails[0] ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    role,
  };
}

// Stronger gate. Used by actions that should not be exposed to the
// "editor" role: Site Settings, Navigation, page publish toggles,
// row deletes. Editors that hit one of these get bounced to a
// dedicated message so they see why.
export async function requireFullAdmin(): Promise<AdminUser> {
  const user = await requireAdmin();
  if (user.role !== "admin") redirect("/admin/forbidden?need=admin");
  return user;
}

// Lighter check — returns the admin user or null, no redirect.
export async function maybeAdmin(): Promise<AdminUser | null> {
  if (!clerkConfigured) return null;
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const role = deriveRole(emails);
  if (!role) return null;
  return {
    id: user.id,
    email: emails[0] ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
    role,
  };
}
