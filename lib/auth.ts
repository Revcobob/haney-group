import "server-only";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkConfigured, env, getAdminEmails } from "@/lib/env";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

// Returns the admin user if the request is signed in AND on the email
// allowlist. Otherwise redirects: to /admin/login when unauthenticated,
// or to /admin/forbidden when authenticated but not allowlisted.
export async function requireAdmin(): Promise<AdminUser> {
  if (!clerkConfigured) redirect("/admin/setup-needed");

  const { userId } = await auth();
  if (!userId) redirect(env.CLERK_SIGN_IN_URL);

  const user = await currentUser();
  if (!user) redirect(env.CLERK_SIGN_IN_URL);

  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const allow = getAdminEmails();

  // If no allowlist is set, only allow when running the dev server locally.
  // In production an empty allowlist == nobody allowed.
  if (allow.length === 0) {
    if (process.env.NODE_ENV !== "development") {
      redirect("/admin/forbidden");
    }
  } else if (!emails.some((e) => allow.includes(e))) {
    redirect("/admin/forbidden");
  }

  return {
    id: user.id,
    email: emails[0] ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

// Lighter check — returns the admin user or null, no redirect.
export async function maybeAdmin(): Promise<AdminUser | null> {
  if (!clerkConfigured) return null;
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const allow = getAdminEmails();
  if (allow.length === 0 && process.env.NODE_ENV !== "development") return null;
  if (allow.length > 0 && !emails.some((e) => allow.includes(e))) return null;
  return {
    id: user.id,
    email: emails[0] ?? "",
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
