export type ClientLogo = {
  client_name: string;
  logo: string;
  website_url: string;
  alt_text: string;
  client_status: "current" | "past";
  display_order: number;
};

export const clientLogos: ClientLogo[] = [
  { client_name: "BlueCross BlueShield of Texas", website_url: "https://www.bcbstx.com", logo: "/assets/img/blue-cross-blue-shield-texas-logo.jpg", alt_text: "BlueCross BlueShield of Texas", client_status: "current", display_order: 1 },
  { client_name: "Superior HealthPlan", website_url: "https://www.superiorhealthplan.com", logo: "/assets/img/superior.jpg", alt_text: "Superior HealthPlan", client_status: "current", display_order: 2 },
  { client_name: "Texas Managed Care Alliance", website_url: "https://www.texasmanagedcarealliance.org", logo: "/assets/img/managed health care alliance.webp", alt_text: "Texas Managed Care Alliance", client_status: "current", display_order: 3 },
  { client_name: "Texas REALTORS", website_url: "https://www.texasrealestate.com", logo: "/assets/img/TRA logo.png", alt_text: "Texas REALTORS", client_status: "current", display_order: 4 },
  { client_name: "Wholesale Beer Distributors of Texas", website_url: "https://www.wbdt.com", logo: "/assets/img/Beer Distrib logo.png", alt_text: "Wholesale Beer Distributors of Texas", client_status: "current", display_order: 5 },
  { client_name: "Sports Betting Alliance", website_url: "https://www.sportsbettingalliance.org", logo: "/assets/img/Sports-Betting-Alliance_color.webp", alt_text: "Sports Betting Alliance", client_status: "current", display_order: 6 },
  { client_name: "Trinity Metro", website_url: "https://www.ridetrinitymetro.org", logo: "/assets/img/Trinity_Metro_Logo.png", alt_text: "Trinity Metro", client_status: "current", display_order: 7 },
  { client_name: "Reagan Outdoor Advertising", website_url: "https://www.reaganoutdoor.com", logo: "/assets/img/ReaganLogo_NEW-1_.png", alt_text: "Reagan Outdoor Advertising", client_status: "current", display_order: 8 },
  { client_name: "Hill Country Alliance", website_url: "https://www.hillcountryalliance.org", logo: "/assets/img/hillcountryalliance-300x300.png", alt_text: "Hill Country Alliance", client_status: "current", display_order: 9 },
  { client_name: "Wood County Health Care", website_url: "https://www.wchcf.org", logo: "/assets/img/wood county health care.jpg", alt_text: "Wood County Health Care", client_status: "current", display_order: 10 },
];

export const clientDisclaimer =
  "A representative selection of current and past clients. Used with permission where required.";
