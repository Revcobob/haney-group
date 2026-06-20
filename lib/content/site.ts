// Single typed entry-point for every CMS-managed structured table.
// Each function attempts Supabase first; falls back to the static
// /content/fallbacks/* exports if Supabase is not configured or returns
// nothing. Result: the public site never breaks regardless of DB state.

import "server-only";
import { publicSupabase } from "@/lib/supabase/public";
import {
  serviceCards as fallbackServices,
  type ServiceCard,
} from "@/content/fallbacks/services";
import {
  industryCards as fallbackIndustries,
  type IndustryCard,
} from "@/content/fallbacks/industries";
import {
  experienceItems as fallbackExperience,
  type ExperienceItem,
} from "@/content/fallbacks/experience";
import {
  clientLogos as fallbackClientLogos,
  clientDisclaimer as fallbackClientDisclaimer,
  type ClientLogo,
} from "@/content/fallbacks/clients";
import {
  headerNav as fallbackHeaderNav,
  footerServicesNav as fallbackFooterServices,
  footerFirmNav as fallbackFooterFirm,
  utilityNav as fallbackUtility,
  type NavItem,
} from "@/content/fallbacks/navigation";
import {
  siteSettings as fallbackSettings,
  type SiteSettings,
} from "@/content/fallbacks/settings";

// ---------- Settings ----------
export async function getSiteSettings(): Promise<SiteSettings> {
  const sb = publicSupabase();
  if (!sb) return fallbackSettings;
  const { data } = await sb
    .from("cms_site_settings")
    .select("setting_key, setting_value_json");
  if (!data || data.length === 0) return fallbackSettings;

  const map = new Map<string, unknown>(
    data.map((r) => [r.setting_key as string, r.setting_value_json])
  );
  const merged: SiteSettings = { ...fallbackSettings };
  for (const [k, v] of map.entries()) {
    if (k in merged && typeof v === "string") {
      (merged as Record<string, string>)[k] = v;
    }
  }
  return merged;
}

// ---------- Services (homepage + /services capability cards) ----------
export async function getServiceCards(): Promise<ServiceCard[]> {
  const sb = publicSupabase();
  if (!sb) return fallbackServices;
  const { data } = await sb
    .from("cms_services")
    .select("title, description, href, display_order, cms_media:icon_media_id(public_url)")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (!data || data.length === 0) return fallbackServices;
  return data.map((row) => ({
    title: row.title as string,
    description: (row.description as string) ?? "",
    href: (row.href as string | null) ?? undefined,
    icon:
      (row.cms_media as { public_url?: string } | null)?.public_url ??
      fallbackServices[0].icon,
    display_order: (row.display_order as number) ?? 0,
  }));
}

// ---------- Industries (Clients page cards) ----------
export async function getIndustryCards(): Promise<IndustryCard[]> {
  const sb = publicSupabase();
  if (!sb) return fallbackIndustries;
  const { data } = await sb
    .from("cms_industries")
    .select("title, description, display_order, cms_media:illustration_media_id(public_url)")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (!data || data.length === 0) return fallbackIndustries;
  return data.map((row) => ({
    title: row.title as string,
    description: (row.description as string) ?? "",
    image:
      (row.cms_media as { public_url?: string } | null)?.public_url ??
      fallbackIndustries[0].image,
    display_order: (row.display_order as number) ?? 0,
  }));
}

// ---------- Experience engagements ----------
export async function getExperienceItems(): Promise<ExperienceItem[]> {
  const sb = publicSupabase();
  if (!sb) return fallbackExperience;
  const { data } = await sb
    .from("cms_experience_items")
    .select(
      "title, client_type, leading_line, body, display_order, cms_media:image_media_id(public_url, alt_text)"
    )
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (!data || data.length === 0) return fallbackExperience;
  return data.map((row) => {
    const media = row.cms_media as
      | { public_url?: string; alt_text?: string }
      | null;
    return {
      title: row.title as string,
      client_type: (row.client_type as string) ?? "",
      leading_line: (row.leading_line as string) ?? "",
      body: (row.body as string) ?? "",
      image: media?.public_url ?? fallbackExperience[0].image,
      image_alt: media?.alt_text ?? "",
      display_order: (row.display_order as number) ?? 0,
    };
  });
}

// ---------- Client logos ----------
export async function getClientLogos(): Promise<{
  logos: ClientLogo[];
  disclaimer: string;
}> {
  const sb = publicSupabase();
  if (!sb) {
    return { logos: fallbackClientLogos, disclaimer: fallbackClientDisclaimer };
  }
  const { data: logoRows } = await sb
    .from("cms_client_logos")
    .select(
      "client_name, website_url, alt_text, client_status, display_order, cms_media:logo_media_id(public_url)"
    )
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  // Disclaimer pulled from settings (special key)
  const { data: disclaimerRow } = await sb
    .from("cms_site_settings")
    .select("setting_value_json")
    .eq("setting_key", "client_disclaimer")
    .maybeSingle();

  const disclaimer =
    (disclaimerRow?.setting_value_json as string | undefined) ??
    fallbackClientDisclaimer;

  if (!logoRows || logoRows.length === 0) {
    return { logos: fallbackClientLogos, disclaimer };
  }
  const logos: ClientLogo[] = logoRows.map((row) => ({
    client_name: row.client_name as string,
    logo:
      (row.cms_media as { public_url?: string } | null)?.public_url ??
      fallbackClientLogos[0].logo,
    website_url: (row.website_url as string | null) ?? "",
    alt_text: (row.alt_text as string | null) ?? (row.client_name as string),
    client_status: (row.client_status as "current" | "past") ?? "current",
    display_order: (row.display_order as number) ?? 0,
  }));
  return { logos, disclaimer };
}

// ---------- Navigation ----------
export type NavAreaSet = {
  header: NavItem[];
  footer_primary: NavItem[];
  footer_utility: NavItem[];
  utility_bar: NavItem[];
};

export async function getNavigation(): Promise<NavAreaSet> {
  const fallback: NavAreaSet = {
    header: fallbackHeaderNav,
    footer_primary: fallbackFooterServices,
    footer_utility: fallbackUtility,
    utility_bar: fallbackFooterFirm,
  };
  const sb = publicSupabase();
  if (!sb) return fallback;
  const { data } = await sb
    .from("cms_navigation_items")
    .select("nav_area, label, href, display_order")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (!data || data.length === 0) return fallback;

  const grouped: NavAreaSet = {
    header: [],
    footer_primary: [],
    footer_utility: [],
    utility_bar: [],
  };
  for (const row of data) {
    const area = row.nav_area as keyof NavAreaSet;
    if (area in grouped) {
      grouped[area].push({
        label: row.label as string,
        href: row.href as string,
        display_order: (row.display_order as number) ?? 0,
      });
    }
  }
  return {
    header: grouped.header.length ? grouped.header : fallback.header,
    footer_primary: grouped.footer_primary.length
      ? grouped.footer_primary
      : fallback.footer_primary,
    footer_utility: grouped.footer_utility.length
      ? grouped.footer_utility
      : fallback.footer_utility,
    utility_bar: grouped.utility_bar.length
      ? grouped.utility_bar
      : fallback.utility_bar,
  };
}
