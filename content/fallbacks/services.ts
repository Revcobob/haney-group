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
    title: "Legislative strategy that reads the calendar before it tightens.",
    lede: "A bill is moved by preparation: who carries it, who chairs it, who votes for it, who covers it, what it costs, and when. We assemble that picture in advance and run a member-by-member plan against it.",
    hero_image: "/assets/img/inline-7b2605a7a1.jpg",
    body_sections: [
      {
        heading: "Reading the room",
        html: "<p>Every session has a tempo and a vocabulary. Our work begins with understanding both: which Members are active on the issue, where the bill needs to start, who chairs the relevant committee, what the calendar will do to it, and which interim work needs to happen now to give it a chance later.</p>",
      },
      {
        heading: "Member-by-member",
        html: "<p>Lobbying credibility is built one conversation at a time. We work issues with Members the way Members work them — through staff, in district, on the floor, and at the right moment.</p><p>The client never has to wonder where a Member stands; we say so plainly, with the reasoning.</p>",
      },
      {
        heading: "The discipline of timing",
        html: "<p>The legislative calendar decides outcomes. Conference, calendar committee, second reading, deadlines — these are not formalities. We watch them, plan for them, and brief clients on what is moving and what is at risk.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-86b56cc282.png",
      lead: "Process drives the plan.",
      body: "Every legislative strategy is built around the procedural milestones that quietly decide what gets a hearing and what runs out of clock.",
    },
  },
  {
    slug: "appropriations",
    number: "02",
    crumb: "Appropriations & Riders",
    title: "Appropriations and budget riders that survive conference.",
    lede: "The Texas budget is the bill that becomes every other bill. We work Article posture, rider language, LBB engagement, and the agency coordination that decides whether a rider lasts beyond conference or dies a quiet death in the spring.",
    hero_image: "/assets/img/inline-231e1beae5.jpg",
    body_sections: [
      {
        heading: "Article strategy",
        html: "<p>Where in the budget your priority belongs is a strategic question, not a clerical one. Articles have different politics, different chairs, and different windows. We map the right Article for a request and prepare it for that posture.</p>",
      },
      {
        heading: "Rider language",
        html: "<p>A rider that survives looks obvious in retrospect; the work that gets it there is not. We draft riders that read cleanly, hold up in conference, and align with agency operations so the language actually does what the client intends.</p>",
      },
      {
        heading: "Interim engagement",
        html: "<p>Most appropriations work happens between sessions. LBB hearings, agency briefings, interim charges, and the gradual posture-setting that determines how a request is received eighteen months later.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-425e9a13a6.png",
      lead: "Article posture is strategy.",
      body: "Rider work begins with knowing which Article your request belongs in, who chairs it, and what the budget cycle will tolerate eighteen months out.",
    },
  },
  {
    slug: "public-affairs",
    number: "03",
    crumb: "Public Affairs",
    title: "Public affairs that lands at the Capitol and the board table in the same week.",
    lede: "Message development, media posture, and board-ready communications for clients whose issues are public. We work message discipline as carefully as we work legislative strategy.",
    hero_image: "/assets/img/inline-9a3ed06a64.jpg",
    body_sections: [
      {
        heading: "Message development",
        html: "<p>What an issue is called shapes how it is debated. We do the careful work of finding language that is honest, defensible, durable, and persuasive to the audiences who actually matter — Members, staff, regulators, boards, and reporters.</p>",
      },
      {
        heading: "Media posture",
        html: "<p>When and how to comment, and just as important, when to say nothing. We coach principals and prepare statements that hold up in a fast cycle and that do not foreclose tomorrow&rsquo;s options.</p>",
      },
      {
        heading: "Board readiness",
        html: "<p>The toughest audience for a client communicator is often the board. We prepare briefings, decks, and Q&amp;A that let leadership govern the issue with confidence — not react to it.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-1ec1420b3e.png",
      lead: "Discipline beats volume.",
      body: "A communications program survives a session through clarity, not noise. Our work is built around what the client should say, when, and to whom — and what is better left unsaid.",
    },
  },
  {
    slug: "parliamentary",
    number: "04",
    crumb: "Parliamentary Procedure",
    title: "Parliamentary procedure: the institutional advisory practice.",
    lede: "Through Robert Haney’s national role as a parliamentary authority and Past President of the American Society of Legislative Clerks and Secretaries, the firm consults to legislative bodies on rules, technology, and the procedures that make modern chambers work.",
    hero_image: "/assets/img/inline-c2276af506.jpg",
    body_sections: [
      {
        heading: "Counsel to chambers",
        html: "<p>Modernization of chamber operations, electronic filing, journals, and the rules under which Members debate. The firm advises chambers nationwide on procedure and process design.</p>",
      },
      {
        heading: "Procedural counsel for private clients",
        html: "<p>The same fluency benefits private clients in procedurally complex Texas engagements. Points of order, germaneness, amendments, and the floor moments that turn on rules.</p>",
      },
      {
        heading: "Training and reference",
        html: "<p>“Legislature 101” briefings for boards and senior teams who need to understand the institution before engaging it — including how a session is structured, how a bill moves, and how the budget is built.</p>",
      },
    ],
    illoblock: {
      image: "/assets/img/inline-7589971e7e.png",
      lead: "The chamber is a system.",
      body: "Parliamentary work treats a legislature as the institution it is — rules, calendars, journals, technology, and the procedures that make session after session possible.",
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
    description: "Translate a policy objective into a practical, member-by-member path through committee, calendar, floor, and conference.",
    icon: "/assets/img/icons/legislative-strategy.svg",
    href: "/services/legislative-strategy",
    display_order: 1,
    icon_hint: "Calendar — timing and scheduling cues for the legislative arc.",
  },
  {
    title: "Lobbying & Advocacy",
    description: "Represent client interests at the Capitol with preparation, credibility, and direct communication grounded in long-standing member relationships.",
    icon: "/assets/img/icons/lobbying-advocacy.svg",
    display_order: 2,
    icon_hint: "Capitol hallway — direct, in-person representation imagery.",
  },
  {
    title: "Bill Drafting & Analysis",
    description: "Review, draft, and refine legislative language with close attention to process, timing, germaneness, and downstream risk.",
    icon: "/assets/img/icons/bill-drafting.svg",
    display_order: 3,
    icon_hint: "Bill draft — a printed bill or markup document.",
  },
  {
    title: "Appropriations & Budget Riders",
    description: "Article and rider strategy, LBB engagement, agency coordination, and interim work where the state budget is actually decided.",
    icon: "/assets/img/icons/appropriations.svg",
    href: "/services/appropriations",
    display_order: 4,
    icon_hint: "Budget document — appropriations ledger, rider sheet, or article header.",
  },
  {
    title: "Parliamentary Procedure",
    description: "House Rules, points of order, amendments, germaneness, and floor process, advised by the firm’s former Chief Clerk of the Texas House.",
    icon: "/assets/img/icons/parliamentary.svg",
    href: "/services/parliamentary",
    display_order: 5,
    icon_hint: "Hearing room — committee chamber, gavel, or rostrum motif.",
  },
  {
    title: "Coalition & Stakeholder Management",
    description: "Build durable support, manage organized opposition, and align boards, members, and partners around achievable outcomes.",
    icon: "/assets/img/icons/coalitions.svg",
    display_order: 6,
    icon_hint: "Coalition map — connected nodes or stakeholder network.",
  },
];
