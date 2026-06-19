import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Site Admin", template: "%s · Site Admin · The Haney Group" },
  robots: { index: false, follow: false },
};

// Admin routes depend on per-request auth + env. Never prerender them.
export const dynamic = "force-dynamic";

// Bare layout. Each route group inside /admin owns its own chrome:
// - (dashboard)/layout.tsx renders the admin header + sidebar
// - /admin/login, /admin/setup-needed, /admin/forbidden each render the
//   self-contained .admin__authshell card.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
