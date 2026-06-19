// Header, footer, and utility-bar nav links. Phase 4 moves these to
// cms_navigation_items so principals can edit labels/URLs without code.

export type NavItem = {
  label: string;
  href: string;
  display_order: number;
};

export const headerNav: NavItem[] = [
  { label: "About", href: "/about", display_order: 1 },
  { label: "Services", href: "/services", display_order: 2 },
  { label: "Experience", href: "/experience", display_order: 3 },
  { label: "Clients", href: "/industries", display_order: 4 },
  { label: "Insights", href: "/insights", display_order: 5 },
  { label: "Contact", href: "/contact", display_order: 6 },
];

export const footerServicesNav: NavItem[] = [
  { label: "Legislative Strategy", href: "/services/legislative-strategy", display_order: 1 },
  { label: "Appropriations & Riders", href: "/services/appropriations", display_order: 2 },
  { label: "Public Affairs", href: "/services/public-affairs", display_order: 3 },
  { label: "Parliamentary Procedure", href: "/services/parliamentary", display_order: 4 },
  { label: "All services", href: "/services", display_order: 5 },
];

export const footerFirmNav: NavItem[] = [
  { label: "About", href: "/about", display_order: 1 },
  { label: "Experience", href: "/experience", display_order: 2 },
  { label: "Clients", href: "/industries", display_order: 3 },
  { label: "Insights", href: "/insights", display_order: 4 },
  { label: "Contact", href: "/contact", display_order: 5 },
];

export const utilityNav: NavItem[] = [
  { label: "Privacy", href: "/privacy", display_order: 1 },
  { label: "Texas Ethics Commission Lobby Registration", href: "#", display_order: 2 },
  { label: "Accessibility", href: "#", display_order: 3 },
];
