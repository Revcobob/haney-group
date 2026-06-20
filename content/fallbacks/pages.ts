// Page + section fallback data. Used when cms_pages / cms_page_sections
// haven't been seeded yet, and as the safety net when Supabase queries
// return empty. Mirrors the structure the admin saves.

export type PageSectionFallback = {
  section_key: string;
  section_label: string;
  section_type: string;
  content_json: Record<string, unknown>;
  display_order: number;
};

export type PageFallback = {
  slug: string;
  title: string;
  page_type: string;
  sections: PageSectionFallback[];
};

export const pageFallbacks: PageFallback[] = [
  {
    slug: "home",
    title: "Homepage",
    page_type: "home",
    sections: [
      {
        section_key: "hero",
        section_label: "Hero",
        section_type: "hero",
        display_order: 1,
        content_json: {
          eyebrow: "Texas Government Relations · Est. Austin",
          headline: "Strategic government relations for complex Texas policy challenges.",
          lede:
            "The Haney Group helps clients navigate the Texas Capitol with legislative strategy, procedural expertise, appropriations knowledge, and disciplined advocacy. Senior-led representation for the priorities that cannot afford to be misunderstood.",
          primary_cta: { label: "Schedule a Consultation", href: "/contact" },
          secondary_cta: { label: "Explore Our Services", href: "/services" },
          background_image_url: "/assets/img/capitol-hero-web2.jpg",
          meta_text_html:
            'Led by <strong>Robert Haney</strong>, former Chief Clerk of the Texas House of Representatives, and <strong>Julie Freeman Haney</strong>, senior appropriations and communications strategist. <a class="linkarrow" href="/about" style="margin-left:4px">Meet the principals <span class="arrow" aria-hidden="true">→</span></a>',
          credit_text: "Texas State Capitol · Austin",
        },
      },
      {
        section_key: "problem",
        section_label: "The Challenge",
        section_type: "problem",
        display_order: 2,
        content_json: {
          eyebrow: "The Challenge",
          heading: "The legislative process is complex. Your strategy should not be.",
          body_paragraphs: [
            "Clients come to The Haney Group when the stakes are high, the process is complicated, and timing matters. We help organizations understand the legislative landscape, prepare a defensible policy position, identify the right path forward, and execute with discipline from interim planning through session deadlines.",
            "We do not promise access. We deliver judgment, preparation, and clear communication, grounded in decades of work inside the Texas Capitol.",
          ],
        },
      },
      {
        section_key: "capabilities_intro",
        section_label: "Capabilities intro",
        section_type: "capabilities_intro",
        display_order: 3,
        content_json: {
          eyebrow: "What We Do",
          heading: "Six capabilities, organized around how Texas policy actually gets made.",
          lede: "",
        },
      },
      {
        section_key: "processbreak",
        section_label: "Inside the Process",
        section_type: "processbreak",
        display_order: 4,
        content_json: {
          eyebrow: "Inside The Process",
          heading: "Strategy is built before the vote is taken.",
          body:
            "From bill drafting and budget riders to author strategy, committee movement, and floor procedure, The Haney Group helps clients prepare for the moments when timing, judgment, and process matter most.",
          primary_cta: {
            label: "Discuss Your Legislative Strategy",
            href: "/contact",
          },
          image_url: "/assets/img/inline-d0832550da.jpg",
          image_alt: "Professionals in conversation inside a Capitol-style hallway",
        },
      },
      {
        section_key: "proof",
        section_label: "Why Clients Choose Us",
        section_type: "proof",
        display_order: 5,
        content_json: {
          eyebrow: "Why Clients Choose Us",
          heading: "Experience matters when the process moves quickly.",
          items: [
            {
              image_url: "/assets/img/inline-7589971e7e.png",
              title: "Texas Capitol Experience",
              body:
                "Decades of hands-on legislative experience inside and around the Texas Capitol, across multiple sessions and Speakers.",
            },
            {
              image_url: "/assets/img/inline-86b56cc282.png",
              title: "Procedural Judgment",
              body:
                "Practical understanding of House Rules, committee process, amendments, deadlines, and the floor procedure that decides outcomes.",
            },
            {
              image_url: "/assets/img/inline-425e9a13a6.png",
              title: "Appropriations Knowledge",
              body:
                "Strategic guidance on budget riders, funding requests, and the realities of how Article II and Article III actually move.",
            },
            {
              image_url: "/assets/img/inline-1ec1420b3e.png",
              title: "Client-Focused Execution",
              body:
                "Clear communication, preparation, and follow-through from interim planning to sine die, briefed for boards and members alike.",
            },
          ],
        },
      },
      {
        section_key: "approach",
        section_label: "How We Work",
        section_type: "approach",
        display_order: 6,
        content_json: {
          eyebrow: "How We Work",
          heading: "A disciplined approach to legislative strategy.",
          steps: [
            {
              image_url: "/assets/img/inline-835345f38e.png",
              title: "Understand the Objective",
              body: "Clarify the client’s policy, funding, regulatory, or legislative goal, and the constraints that surround it.",
            },
            {
              image_url: "/assets/img/inline-abdda0b7c7.png",
              title: "Map the Process",
              body: "Identify deadlines, committees, authors, stakeholders, procedural risks, and the viable paths forward.",
            },
            {
              image_url: "/assets/img/inline-73a36ce4aa.png",
              title: "Build the Strategy",
              body: "Prepare messaging, bill language, budget posture, coalition support, and an engagement plan tied to the calendar.",
            },
            {
              image_url: "/assets/img/inline-1c2fbe3ffe.png",
              title: "Execute with Discipline",
              body: "Track movement, communicate clearly, adjust quickly, and stay focused on the result the client engaged us to deliver.",
            },
          ],
        },
      },
      {
        section_key: "principals_intro",
        section_label: "Principals intro",
        section_type: "principals_intro",
        display_order: 7,
        content_json: {
          eyebrow: "The Principals",
          heading: "Proven expertise. Focused results. Unmatched influence.",
          lede:
            "The Haney Group is intentionally senior-led. Clients work directly with principals who bring more than 40 years of combined Texas Capitol experience to legislative strategy, parliamentary procedure, and disciplined communication.",
        },
      },
      {
        section_key: "issues",
        section_label: "Industries we serve",
        section_type: "issues",
        display_order: 8,
        content_json: {
          eyebrow: "Experience",
          heading: "Experience across the issues that shape Texas.",
          lede:
            "Our work spans the sectors where Texas policy is most actively contested, for corporate clients, statewide associations, public entities, and policy organizations.",
          quote:
            "“When the calendar tightened and the bill we had been working on for a year was suddenly in play, The Haney Group did not flinch. They told us what to do, who to call, and what to say. And they were right on every count.”",
          quote_attribution: "General Counsel · Statewide Trade Association",
        },
      },
      {
        section_key: "insights_intro",
        section_label: "Insights teaser",
        section_type: "insights_intro",
        display_order: 9,
        content_json: {
          eyebrow: "Insights",
          heading: "Legislative perspective for clients preparing ahead.",
          lede:
            "The Session Briefing is a candid read on what moved at the Texas Capitol, written by the firm during session and monthly during interim.",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 10,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: {
            label: "Contact The Haney Group",
            href: "/contact",
          },
          secondary_cta: {
            label: "Or call (512) 925-5000",
            href: "tel:+15129255000",
          },
        },
      },
    ],
  },
];

export function getPageFallback(slug: string): PageFallback | undefined {
  return pageFallbacks.find((p) => p.slug === slug);
}
