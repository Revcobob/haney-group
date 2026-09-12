// Static fallback for service detail pages + the services list shown on
// /services. Used until Phase 4 seeds Supabase, then as backstop if the
// DB is unreachable.

export type ServiceDetail = {
  slug: string;
  number: string;
  crumb: string;
  title: string;
  lede: string;
  hero_image: string;
  body_sections: Array<{ heading: string; html: string }>;
  illoblock: { image: string; lead: string; body: string };
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "legislative-strategy",
    number: "01",
    crumb: "Legislative Strategy",
    title: "A legislative plan built around the calendar.",
    lede: "A bill needs an author, a committee path, the votes, a defensible cost, and enough time to clear each deadline. We map those requirements and work the plan member by member.",
    hero_image: "/assets/img/capitol-house-chamber.jpg",
    body_sections: [
      {
        heading: "Build the path",
        html: "<p>We identify the Members active on the issue, the right author, committee jurisdiction, likely deadlines, and the interim work needed before filing.</p>",
      },
      {
        heading: "Member-by-member",
        html: "<p>We work through Members and staff, in district and at the Capitol, based on what each decision requires.</p><p>We tell the client where a Member appears to stand and why.</p>",
      },
      {
        heading: "Use the calendar",
        html: "<p>Committee hearings, Calendars Committee, second reading, conference, and filing deadlines are decision points. We plan for each one and tell clients what is moving and what is at risk.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-86b56cc282.png",
      lead: "Procedural deadlines determine the available path.",
      body: "We build each plan around the hearings, reports, calendars, and floor deadlines that determine whether a bill can move.",
    },
  },
  {
    slug: "appropriations",
    number: "02",
    crumb: "Appropriations & Riders",
    title: "Budget riders drafted to make it through conference.",
    lede: "We advise on article placement, rider language, LBB engagement, agency concerns, and the House and Senate work required before conference.",
    hero_image: "/assets/img/capitol-rotunda-gallery.jpg",
    body_sections: [
      {
        heading: "Article strategy",
        html: "<p>Article placement affects jurisdiction, timing, and the people who review a request. We identify the right article and prepare the request for that process.</p>",
      },
      {
        heading: "Rider language",
        html: "<p>We draft rider language that fits the appropriation, can be defended in conference, and gives the agency workable direction.</p>",
      },
      {
        heading: "Interim engagement",
        html: "<p>Much of the work happens during the interim: LBB hearings, agency briefings, interim charges, cost estimates, and early discussions with budget staff.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-425e9a13a6.png",
      lead: "Article placement changes who reviews the request.",
      body: "Rider work begins with article placement, jurisdiction, cost, agency operations, and the budget calendar.",
    },
  },
  {
    slug: "public-affairs",
    number: "03",
    crumb: "Public Affairs",
    title: "Public affairs for the Capitol and the boardroom.",
    lede: "We prepare legislative messages, media responses, executive briefings, and board materials for issues that may become public.",
    hero_image: "/assets/img/capitol-corridor-star.jpg",
    body_sections: [
      {
        heading: "Message development",
        html: "<p>We put the issue in language that is accurate and defensible. Then we adapt it for Members, staff, regulators, boards, and reporters.</p>",
      },
      {
        heading: "Media posture",
        html: "<p>We advise whether to comment, who should speak, and when silence protects the client&rsquo;s options. We also prepare principals and draft statements.</p>",
      },
      {
        heading: "Board readiness",
        html: "<p>We prepare board briefings, presentation decks, and questions and answers so directors understand the issue and the decisions ahead.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-1ec1420b3e.png",
      lead: "The client should know who will speak and when.",
      body: "We help the client decide what to say, who should say it, and what is better left unsaid.",
    },
  },
  {
    slug: "parliamentary",
    number: "04",
    crumb: "Parliamentary Procedure",
    title: "Parliamentary and procedural counsel.",
    lede: "Robert Haney, a former Chief Clerk of the Texas House and past president of ASLCS, advises legislative bodies and private clients on rules, chamber operations, and floor procedure.",
    hero_image: "/assets/img/capitol-dome-interior.jpg",
    body_sections: [
      {
        heading: "Counsel to chambers",
        html: "<p>The firm advises chambers on rules, electronic filing, journals, technology, and the procedures used to conduct business.</p>",
      },
      {
        heading: "Procedural counsel for private clients",
        html: "<p>Private clients call us about points of order, germaneness, amendments, and other questions that can determine what reaches the floor or survives debate.</p>",
      },
      {
        heading: "Training and reference",
        html: "<p>We brief boards and executive teams on how a session is structured, how a bill moves, and how the state budget is written.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-7589971e7e.png",
      lead: "Chamber rules determine what can happen next.",
      body: "Rules, calendars, journals, technology, and floor practice determine how a chamber conducts its work.",
    },
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return serviceDetails.find((s) => s.slug === slug);
}

// ---------------------------------------------------------------------------
// Six capabilities shown on the homepage + services page (cms_services rows).
// ---------------------------------------------------------------------------
export type ServiceCard = {
  title: string;
  description: string;
  icon: string;
  href?: string;
  display_order: number;
  /** Short description of the concrete visual the icon slot expects.
   *  Surfaced as helper text in the admin so the slot is meaningful
   *  even before the artwork has been delivered. */
  icon_hint?: string;
};

export const serviceCards: ServiceCard[] = [
  {
    title: "Legislative Strategy",
    description: "Turn a policy objective into a bill, an author strategy, a committee path, a vote plan, and a conference position.",
    icon: "/assets/img/icon-legislative-strategy.png",
    href: "/services/legislative-strategy",
    display_order: 1,
    icon_hint: "Calendar — timing and scheduling cues for the legislative arc.",
  },
  {
    title: "Lobbying & Advocacy",
    description: "Meet with Members and staff, present the client’s case, report where support stands, and adjust the ask when needed.",
    icon: "/assets/img/icon-lobbying-advocacy.png",
    display_order: 2,
    icon_hint: "Capitol hallway — direct, in-person representation imagery.",
  },
  {
    title: "Bill Drafting & Analysis",
    description: "Draft and review bills and amendments for legal effect, germaneness, procedural risk, and unintended consequences.",
    icon: "/assets/img/icon-bill-drafting.png",
    display_order: 3,
    icon_hint: "Bill draft — a printed bill or markup document.",
  },
  {
    title: "Appropriations & Budget Riders",
    description: "Place and draft riders, work with the LBB and agencies, and prepare the request before the budget takes shape.",
    icon: "/assets/img/icon-appropriations.png",
    href: "/services/appropriations",
    display_order: 4,
    icon_hint: "Budget document — appropriations ledger, rider sheet, or article header.",
  },
  {
    title: "Parliamentary Procedure",
    description: "Advice on House Rules, points of order, germaneness, amendments, and floor procedure from a former Chief Clerk.",
    icon: "/assets/img/icon-procedural-2.png",
    href: "/services/parliamentary",
    display_order: 5,
    icon_hint: "Hearing room — committee chamber, gavel, or rostrum motif.",
  },
  {
    title: "Coalition & Stakeholder Management",
    description: "Identify supporters and opponents, resolve internal differences, and coordinate testimony, outreach, and amendments.",
    icon: "/assets/img/icon-coalitions.png",
    display_order: 6,
    icon_hint: "Coalition map — connected nodes or stakeholder network.",
  },
];
