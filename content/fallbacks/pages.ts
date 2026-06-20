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
        section_key: "audience_grid",
        section_label: "Who We Help",
        section_type: "audience_grid",
        display_order: 7,
        content_json: {
          eyebrow: "Who We Help",
          heading: "Built for the organizations that move policy in Texas.",
          lede:
            "The firm represents clients whose priorities require senior judgment, procedural fluency, and disciplined execution at the Capitol — from corporate boards to lobby firms that need an extra hand on the floor.",
          items: [
            {
              title: "Corporations",
              body:
                "Legislative risk analysis, issue advocacy, regulatory strategy, and appropriations positioning.",
            },
            {
              title: "Associations",
              body:
                "Member-driven policy agendas, coalition building, bill strategy, and Capitol representation.",
            },
            {
              title: "Lobby Firms",
              body:
                "Procedural analysis, House Rules guidance, amendment strategy, and backup capacity during session.",
            },
            {
              title: "Policy Shops & Think Tanks",
              body:
                "Bill development, legislative education, author strategy, and stakeholder alignment.",
            },
          ],
        },
      },
      {
        section_key: "principals_intro",
        section_label: "Principals intro",
        section_type: "principals_intro",
        display_order: 8,
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
        display_order: 9,
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
        display_order: 10,
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
        display_order: 11,
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

  // ---------- About ----------
  {
    slug: "about",
    title: "About",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "About",
          eyebrow: "About the Firm",
          headline:
            "A boutique firm built around procedural mastery and quiet results.",
          lede:
            "The Texas Capitol rewards a small number of disciplines: knowing the process, knowing the budget, knowing the people, and knowing how to talk about all three. The firm was built to keep those four disciplines in one room.",
          background_image_url: "/assets/img/inline-80d647ef11.jpg",
        },
      },
      {
        section_key: "firm_intro",
        section_label: "Firm intro",
        section_type: "firm_intro",
        display_order: 2,
        content_json: {
          eyebrow: "The Firm",
          heading: "A senior-led firm built around a deliberate combination.",
          body_paragraphs_html: [
            "The Haney Group is a senior-led Austin government relations firm. We represent statewide associations, regulated companies, local governments, health care organizations, and policy nonprofits at the Texas Legislature and across the executive agencies that interpret what the Legislature passes.",
            "The combination is purposeful: the firm pairs <strong>procedural and budgetary fluency</strong> with the <strong>message discipline</strong> that decides how a bill is received, covered, and remembered.",
          ],
          founders: [
            {
              name: "Robert Haney",
              role: "Former Chief Clerk, Texas House",
              bio:
                "More than twenty-five years inside the Texas House of Representatives, including service as Chief Clerk under five Speakers across both parties.",
            },
            {
              name: "Julie Freeman Haney",
              role: "Appropriations & Communications",
              bio:
                "Two decades of appropriations, communications, and chief-of-staff experience on the legislative side, both in member offices and senior committee roles.",
            },
          ],
        },
      },
      {
        section_key: "stat_strip",
        section_label: "By the numbers",
        section_type: "stat_strip",
        display_order: 3,
        content_json: {
          eyebrow: "",
          heading: "",
          items: [
            {
              num: "40+ yrs",
              label: "Combined Texas Capitol experience.",
            },
            {
              num: "5",
              label:
                "Speakers under whom Robert served as Chief Clerk of the Texas House.",
            },
            {
              num: "20+ yrs",
              label:
                "Julie's record in appropriations, chief-of-staff, and communications work.",
            },
          ],
        },
      },
      {
        section_key: "principles_grid",
        section_label: "How we work",
        section_type: "principles_grid",
        display_order: 4,
        content_json: {
          eyebrow: "How we work",
          heading: "Three principles that shape every engagement.",
          items: [
            {
              num: "01",
              title: "We do not start with a tactic.",
              body:
                "We start with the question every legislator asks about an issue: who is for it, who is against it, where does it live, and what does it cost. Until those four questions have honest answers, no strategy can be trusted.",
            },
            {
              num: "02",
              title: "We tell clients the truth.",
              body:
                "If your priority cannot be moved this session, we will say so, and tell you what the interim work looks like to give it a chance next time. If your bill is in trouble, we will tell you what it will take to save it, even if the answer is uncomfortable.",
            },
            {
              num: "03",
              title: "We work as principals.",
              body:
                "The people you meet on the first call are the people who do your work. Robert and Julie are personally on every engagement.",
            },
          ],
        },
      },
      {
        section_key: "principals_section_head",
        section_label: "Principals section heading",
        section_type: "principals_intro",
        display_order: 5,
        content_json: {
          eyebrow: "The Principals",
          heading: "Two careers, one Capitol.",
          lede: "",
        },
      },
      {
        section_key: "principal_robert",
        section_label: "Robert Haney bio",
        section_type: "person_bio",
        display_order: 6,
        content_json: {
          anchor: "robert",
          name: "Robert Haney",
          role: "Principal · Former Chief Clerk, Texas House",
          portrait_image_url: "/assets/img/inline-634aab4058.jpg",
          body_paragraphs: [
            "Robert Haney worked inside the Texas House of Representatives for more than twenty-five years. He served as Chief Clerk of the Texas House under five different Speakers across both parties — a level of bipartisan trust earned through demonstrated competence on the floor.",
            "As Chief Clerk, he managed the procedural backbone of every bill the House considered: calendars, certifications, journals, technology, and the rules under which Members debated. He led the modernization of House operations, including the transition to electronic bill filing, which retired a century-old paper process.",
            "Nationally, Robert served as President of the American Society of Legislative Clerks and Secretaries (ASLCS), the professional society of legislative procedural officers across the United States. He continues to advise chambers nationwide on modernization and parliamentary procedure. Texas Capitol Inside named him a Rising Star in 2023.",
          ],
          pull_quote:
            "Most of what looks like influence in a session is actually preparation done six months earlier. Our job is to be six months earlier than the people across the table.",
          link_url: "https://www.linkedin.com/",
          link_label: "LinkedIn",
        },
      },
      {
        section_key: "principal_julie",
        section_label: "Julie Freeman Haney bio",
        section_type: "person_bio",
        display_order: 7,
        content_json: {
          anchor: "julie",
          name: "Julie Freeman Haney",
          role: "Principal · Appropriations & Communications",
          portrait_image_url: "/assets/img/inline-fab1dc790d.jpg",
          body_paragraphs: [
            "Julie Freeman Haney built two decades of Texas politics on the appropriations and communications sides of the Capitol. She served as an aide to the Chair of the House Appropriations Committee and later as chief of staff to a state legislator, work that put her in the room for the trade-offs that define a budget cycle.",
            "In communications, she has led message development and legislative communication for clients whose issues had to land at the Capitol and at the board table in the same week. Her work spans crisis posture, talking points, board briefings, and reputation strengthening with officeholders.",
            "Julie advises clients on what to say, when to say it, and to whom — and on the harder discipline of what not to say in the middle of a session that is still being written.",
          ],
          pull_quote:
            "The same fact can land three different ways depending on who is hearing it. Our job is to know who is hearing it and to make sure it lands the right way.",
          link_url: "https://www.linkedin.com/",
          link_label: "LinkedIn",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 8,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Services ----------
  {
    slug: "services",
    title: "Services",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Services",
          eyebrow: "Services",
          headline: "Services built around how Texas policy actually moves.",
          lede:
            "Six capabilities and four specialized practice areas, organized for the way the Legislature, the appropriations process, the executive agencies, and the press cycle interact during a session.",
          background_image_url: "/assets/img/services-hero-web.jpg",
        },
      },
      {
        section_key: "capabilities_intro",
        section_label: "Capabilities heading",
        section_type: "capabilities_intro",
        display_order: 2,
        content_json: {
          eyebrow: "Capabilities",
          heading: "Six capabilities, organized around how policy gets made.",
          lede: "",
        },
      },
      {
        section_key: "srbreak",
        section_label: "Senior representation band",
        section_type: "processbreak",
        display_order: 3,
        content_json: {
          eyebrow: "Senior-Level Representation",
          heading: "Experienced representation when the process starts moving.",
          body:
            "The Haney Group provides direct principal-level guidance through the legislative, appropriations, and procedural decisions that shape outcomes. We help clients prepare early, navigate key decision points, and execute with discipline when timing matters.",
          primary_cta: {
            label: "Discuss Your Legislative Strategy",
            href: "/contact",
          },
          image_url: "/assets/img/banner-services-page.png",
          image_alt: "Professionals in conversation at a conference table",
        },
      },
      {
        section_key: "practice_areas_intro",
        section_label: "Practice areas heading",
        section_type: "capabilities_intro",
        display_order: 4,
        content_json: {
          eyebrow: "Practice Areas",
          heading: "Four practice areas, each led by a principal.",
          lede: "",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 5,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Industries ----------
  {
    slug: "industries",
    title: "Clients · Industries",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Clients",
          eyebrow: "Clients",
          headline: "Industries we serve.",
          lede:
            "The firm represents organizations whose Texas priorities cannot afford to be misunderstood — nine sectors where our work is concentrated, and a trusted roster of associations, providers, and operators who rely on principal-level representation when the stakes are real.",
          background_image_url: "/assets/img/clients-hero-web.jpg",
        },
      },
      {
        section_key: "client_logos_strip",
        section_label: "Client logos strip",
        section_type: "client_logos_strip",
        display_order: 2,
        content_json: {
          eyebrow: "Selected Clients",
          heading: "Trusted by associations, providers, and operators across Texas.",
          disclaimer:
            "Selected client logos shown with permission. Full roster on request.",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 3,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Experience ----------
  {
    slug: "experience",
    title: "Experience",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Experience",
          eyebrow: "Experience",
          headline: "Selected engagements.",
          lede:
            "Anonymized work across the issues that shape Texas — for trade associations, public entities, regulated companies, health systems, and policy organizations. Specifics on request under a confidential conversation.",
          background_image_url: "/assets/img/experience2-hero-web.jpg",
        },
      },
      {
        section_key: "engagements_quote",
        section_label: "Closing quote",
        section_type: "quote_card",
        display_order: 2,
        content_json: {
          quote:
            "When the calendar tightened and the bill we had been working on for a year was suddenly in play, The Haney Group did not flinch. They told us what to do, who to call, and what to say. And they were right on every count.",
          attribution: "General Counsel · Statewide Trade Association",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 3,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Insights ----------
  {
    slug: "insights",
    title: "Insights · The Session Briefing",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Insights",
          eyebrow: "Insights",
          headline: "The Session Briefing.",
          lede:
            "A candid read on what moved at the Texas Capitol, written by the firm during session and monthly during interim.",
          background_image_url: "/assets/img/insights-hero-web.jpg",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 2,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Contact ----------
  {
    slug: "contact",
    title: "Contact",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Contact",
          eyebrow: "Contact",
          headline: "Start a confidential conversation.",
          lede:
            "Tell us a little about the issue, the timing, and what success would look like. We will be in touch within one business day.",
          background_image_url: "/assets/img/contact-us-hero-web.jpg",
        },
      },
      {
        section_key: "contact_left_col",
        section_label: "Left column",
        section_type: "contact_left_col",
        display_order: 2,
        content_json: {
          eyebrow: "Reach The Firm",
          heading: "Talk directly to a principal.",
          body_html:
            "<p>The Haney Group is a small firm. Inquiries reach a principal directly. We respond inside one business day, often the same day during session.</p><p>For urgent procedural questions during session, please call.</p>",
        },
      },
      {
        section_key: "contact_right_col",
        section_label: "Right column",
        section_type: "contact_right_col",
        display_order: 3,
        content_json: {
          eyebrow: "Send a Note",
          heading: "A few details help us prepare.",
          submit_label: "Send Message",
          consent_language:
            "I understand my message will be reviewed by The Haney Group and consent to being contacted about my inquiry.",
        },
      },
      {
        section_key: "closing_cta",
        section_label: "Closing CTA",
        section_type: "closing_cta",
        display_order: 4,
        content_json: {
          eyebrow: "Contact",
          heading: "Preparing for the next legislative session?",
          body:
            "Start early, with a strategy grounded in experience, timing, and practical knowledge of the Texas legislative process. Every engagement begins with a short, confidential conversation.",
          primary_cta: { label: "Contact The Haney Group", href: "/contact" },
          secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
        },
      },
    ],
  },

  // ---------- Privacy ----------
  {
    slug: "privacy",
    title: "Privacy & Legal",
    page_type: "interior",
    sections: [
      {
        section_key: "page_hero",
        section_label: "Hero",
        section_type: "page_hero",
        display_order: 1,
        content_json: {
          crumb_label: "Privacy & Legal",
          eyebrow: "Privacy & Legal Notice",
          headline: "Privacy and legal notice.",
          lede:
            "How The Haney Group handles information collected through our website, and the terms that govern your use of haney-group.com.",
          background_image_url: "/assets/img/privacy-hero-web.jpg",
        },
      },
      {
        section_key: "privacy_policy",
        section_label: "Privacy Policy article",
        section_type: "html_block",
        display_order: 2,
        content_json: {
          eyebrow: "Effective Date · June 18, 2026",
          heading: "Privacy Policy",
          body_html:
            "<h3>1. Introduction</h3><p>At The Haney Group, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you visit <a href=\"https://www.haney-group.com\">www.haney-group.com</a> or engage with our services.</p><h3>2. Information We Collect</h3><p>We may collect personal information that you provide to us directly, such as:</p><ul><li>Name</li><li>Email address</li><li>Phone number</li><li>Company name</li><li>Any other information you choose to provide</li></ul><p>We also collect non-personal information automatically when you visit our website, including:</p><ul><li>IP address</li><li>Browser type</li><li>Operating system</li><li>Pages viewed</li><li>Time spent on the site</li><li>Referring website</li></ul><h3>3. How We Use Your Information</h3><p>We may use the information we collect for various purposes, including:</p><ul><li>To respond to your inquiries and provide services</li><li>To improve our website and services</li><li>To send you newsletters, marketing communications, or other information that may interest you</li><li>To analyze website usage and enhance user experience</li><li>To comply with legal obligations and protect our rights</li></ul><h3>4. Information Sharing</h3><p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to provide our services. We may share your information with trusted service providers who assist us in operating our website and conducting our business.</p><h3>5. Data Security</h3><p>We implement a variety of security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.</p><h3>6. Cookies</h3><p>Our website may use cookies to enhance user experience. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.</p><h3>7. Third-Party Links</h3><p>Our website may contain links to third-party websites. We do not have control over the content and practices of these websites and are not responsible for their privacy policies. We encourage you to review the privacy policies of any third-party sites you visit.</p><h3>8. Your Rights</h3><p>You have the right to request access to the personal information we hold about you and to request correction or deletion of that information. To exercise these rights, please contact us using the information provided below.</p><h3>9. Changes to This Privacy Policy</h3><p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website with an updated effective date.</p><h3>10. Contact Us</h3><p>If you have any questions about this Privacy Policy, please contact us at: <strong>The Haney Group</strong>, P.O. Box 521, Austin, TX 78767. <a href=\"tel:+15129255000\">(512) 925-5000</a>. <a href=\"mailto:info@haney-group.com\">info@haney-group.com</a></p>",
        },
      },
      {
        section_key: "legal_notice",
        section_label: "Legal Notice article",
        section_type: "html_block",
        display_order: 3,
        content_json: {
          eyebrow: "Effective Date · June 18, 2026",
          heading: "Legal Notice",
          body_html:
            "<h3>1. Introduction</h3><p>This legal notice governs your use of the website <a href=\"https://www.haney-group.com\">www.haney-group.com</a> (the “Site”) operated by Haney Group LLC (“we,” “us,” or “our”). By accessing or using our Site, you agree to comply with and be bound by this legal notice. If you do not agree with these terms, please do not use our Site.</p><h3>2. Intellectual Property</h3><p>All content, materials, and information on the Site, including but not limited to text, graphics, logos, images, and software, are the property of Haney Group LLC or our content suppliers and are protected by applicable copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Site without our prior written consent.</p><h3>3. Use of the Site</h3><p>You may use the Site for lawful purposes only. You agree not to use the Site in any way that violates any applicable federal, state, or local law or regulation. You may not use the Site to transmit or send any advertising or promotional material without our prior written consent.</p><h3>4. Disclaimers</h3><p>The information provided on this Site is for general informational purposes only and should not be considered legal advice. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the information on the Site. Any reliance you place on such information is strictly at your own risk.</p><h3>5. Limitation of Liability</h3><p>In no event shall Haney Group LLC, its directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Site or inability to use the Site, even if we have been advised of the possibility of such damages.</p><h3>6. Links to Third-Party Websites</h3><p>Our Site may contain links to third-party websites. We do not control and are not responsible for the content or practices of these websites. The inclusion of any link does not imply endorsement by us of the website or the information contained therein. We encourage you to review the terms and conditions and privacy policies of any third-party websites you visit.</p><h3>7. Governing Law</h3><p>This legal notice shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of law principles. Any disputes arising from or related to this legal notice shall be resolved in the state or federal courts located in Texas.</p><h3>8. Changes to This Legal Notice</h3><p>We reserve the right to update or modify this legal notice at any time without prior notice. Your continued use of the Site following the posting of any changes constitutes your acceptance of those changes.</p><h3>9. Contact Us</h3><p>If you have any questions about this legal notice, please contact us at: <strong>Haney Group LLC</strong>, P.O. Box 521, Austin, TX 78767. <a href=\"tel:+15129255000\">(512) 925-5000</a>. <a href=\"mailto:info@haney-group.com\">info@haney-group.com</a></p>",
        },
      },
    ],
  },
];

export function getPageFallback(slug: string): PageFallback | undefined {
  return pageFallbacks.find((p) => p.slug === slug);
}
