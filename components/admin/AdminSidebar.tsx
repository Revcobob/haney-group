"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** When set, the sidebar renders a small notification badge on the
   *  link showing the current value (e.g. unread inquiry count). */
  badgeKey?: "newInquiries";
};

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const overview: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <Icon d="M3 12 12 3l9 9M5 10v10h14V10" /> },
];
const content: NavItem[] = [
  { href: "/admin/pages", label: "Pages", icon: <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6M9 13h6M9 17h6" /> },
  { href: "/admin/insights", label: "Insights", icon: <Icon d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM19 6h2v14a2 2 0 0 1-2 2 M8 8h7M8 12h7M8 16h4" /> },
  { href: "/admin/media", label: "Media Library", icon: <Icon d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M3 17l5-5 4 4 4-4 5 5 M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /> },
  { href: "/admin/inquiries", label: "Inquiries", icon: <Icon d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />, badgeKey: "newInquiries" },
  { href: "/admin/seo", label: "SEO", icon: <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" /> },
];
const structure: NavItem[] = [
  { href: "/admin/services", label: "Services", icon: <Icon d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" /> },
  { href: "/admin/industries", label: "Industries", icon: <Icon d="M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4" /> },
  { href: "/admin/experience", label: "Experience", icon: <Icon d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM9 5h6v2H9z" /> },
  { href: "/admin/clients", label: "Client Logos", icon: <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
];
const settings: NavItem[] = [
  { href: "/admin/navigation", label: "Navigation", icon: <Icon d="M4 6h16M4 12h16M4 18h16" /> },
  { href: "/admin/settings", label: "Site Settings", icon: <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.27.61.7.7 1.18.1.49-.06.99-.4 1.32-.34.33-.83.49-1.32.4-.48-.09-.91-.34-1.18-.7" /> },
  { href: "/admin/health", label: "Site Health", icon: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
];

type Badges = { newInquiries: number };

function Section({
  label,
  items,
  badges,
}: {
  label: string;
  items: NavItem[];
  badges: Badges;
}) {
  const pathname = usePathname();
  return (
    <div className="admin__side-group">
      <div className="admin__side-label">{label}</div>
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
        const badge = item.badgeKey ? badges[item.badgeKey] : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin__side-link${active ? " is-active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {badge > 0 ? (
              <span
                className="admin__side-badge"
                aria-label={`${badge} new`}
              >
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminSidebar({
  role,
  initialNewInquiryCount = 0,
}: {
  role: "admin" | "editor";
  initialNewInquiryCount?: number;
}) {
  // Live-refresh the inquiry badge every 60s without a full reload.
  // The initial value comes from the layout (server-rendered) so the
  // badge is correct on first paint; the poll keeps it fresh while the
  // admin is parked on one page. Updates also refetch on tab-focus.
  const [newInquiries, setNewInquiries] = useState(initialNewInquiryCount);
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const r = await fetch("/api/admin/inquiries/count", {
          cache: "no-store",
        });
        if (!r.ok) return;
        const d = (await r.json()) as { count: number };
        if (!cancelled && typeof d.count === "number") setNewInquiries(d.count);
      } catch {
        // Network blip — leave the last good value in place.
      }
    }
    const handle = window.setInterval(refresh, 60_000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(handle);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Editors get the same content + structure surfaces, but the admin-only
  // entries (Navigation, Site Settings) are filtered out — they'd 403
  // anyway, so don't tease them.
  const visibleSettings =
    role === "admin"
      ? settings
      : settings.filter((s) => s.href === "/admin/health");
  const badges: Badges = { newInquiries };
  return (
    <aside className="admin__side" aria-label="Admin navigation">
      <Section label="Overview" items={overview} badges={badges} />
      <Section label="Content" items={content} badges={badges} />
      <Section label="Structure" items={structure} badges={badges} />
      <Section
        label={role === "admin" ? "Site" : "Ops"}
        items={visibleSettings}
        badges={badges}
      />
    </aside>
  );
}
