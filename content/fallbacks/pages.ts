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
          eyebrow: "Texas Legislative Strategy · Austin",
          headline: "We help clients move policy through the Texas Legislature.",
          lede:
            "The Haney Group advises public entities, associations, companies, and policy organizations on legislation, appropriations, House procedure, and advocacy. Clients work directly with Robert and Julie Haney.",
          primary_cta: { label: "Discuss a Legislative Priority", href: "/contact" },
          secondary_cta: { label: "View Services", href: "/services" },
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
          heading: "A good objective still needs a workable path through the Legislature.",
          body_paragraphs: [
            "Clients call us when a bill needs an author and a committee path, a funding request needs a viable rider, or late-session language creates a procedural problem. We assess the facts, the votes, the calendar, and the available routes.",
            "We tell clients what can move, what is likely to fail, and what work should begin during the interim.",
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
          heading: "What we do at the Capitol.",
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
          heading: "The work starts before the vote is scheduled.",
          body:
            "We draft the bill, identify the author and committee path, test amendments, track deadlines, and prepare for floor and conference decisions.",
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
          heading: "Why clients bring us in.",
          items: [
            {
              image_url: "/assets/img/inline-7589971e7e.png",
              title: "Texas Capitol Experience",
              body:
                "More than 40 years of combined work in the Texas Capitol, including service under five House Speakers.",
            },
            {
              image_url: "/assets/img/inline-86b56cc282.png",
              title: "Procedural Judgment",
              body:
                "House Rules, committee procedure, germaneness, points of order, amendments, deadlines, and floor practice.",
            },
            {
              image_url: "/assets/img/inline-425e9a13a6.png",
              title: "Appropriations Knowledge",
              body:
                "Rider drafting, article placement, LBB engagement, agency coordination, and House and Senate budget strategy.",
            },
            {
              image_url: "/assets/img/inline-1ec1420b3e.png",
              title: "Direct Principal Counsel",
              body:
                "Robert and Julie stay involved from interim planning through sine die and brief executives, boards, and members directly.",
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
          heading: "How we build a legislative plan.",
          steps: [
            {
              image_url: "/assets/img/inline-835345f38e.png",
              title: "Define the Objective",
              body: "Set the policy, funding, or regulatory goal. Identify legal, fiscal, political, and timing constraints.",
            },
            {
              image_url: "/assets/img/inline-abdda0b7c7.png",
              title: "Map the Process",
              body: "Identify authors, committees, deadlines, votes, stakeholders, and procedural risks.",
            },
            {
              image_url: "/assets/img/inline-73a36ce4aa.png",
              title: "Build the Strategy",
              body: "Draft the language, prepare the budget position, line up support, and tie each decision to the calendar.",
            },
            {
              image_url: "/assets/img/inline-1c2fbe3ffe.png",
              title: "Work the Plan",
              body: "Track the bill, brief the client, and change course when the votes, language, or calendar require it.",
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
          heading: "Who we represent.",
          lede:
            "Our clients usually have a specific bill, funding request, regulatory issue, or procedural question that requires direct attention from the principals.",
          items: [
            {
              title: "Public Entities",
              body:
                "Cities, counties, transit systems, utilities, special districts, and public-sector boards.",
            },
            {
              title: "Associations",
              body:
                "Member-driven policy agendas, coalition building, bill strategy, and Capitol representation.",
            },
            {
              title: "Companies & Regulated Organizations",
              body:
                "Legislative risk, regulatory matters, appropriations, and advocacy on a defined Texas issue.",
            },
            {
              title: "Policy & Professional Partners",
              body:
                "Policy organizations, nonprofits, law firms, and advocacy teams that need drafting or procedural help.",
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
          heading: "Clients work directly with Robert and Julie Haney.",
          lede:
            "They set the strategy, handle key conversations, and brief executives and boards. The work is not handed off after the first meeting.",
        },
      },
      {
        section_key: "issues",
        section_label: "Industries we serve",
        section_type: "issues",
        display_order: 9,
        content_json: {
          eyebrow: "Experience",
          heading: "Work across Texas policy and public institutions.",
          lede:
            "The firm represents public entities, statewide associations, companies, health care organizations, and policy groups.",
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
          heading: "Notes on how the Texas Legislature works.",
          lede:
            "The Session Briefing covers procedure, appropriations, deadlines, and the work that should happen before session begins.",
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
            "Tell us the objective, the timing, and where the matter stands. We will give you a direct assessment of the next step.",
          primary_cta: {
            label: "Discuss a Legislative Priority",
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
            "Texas legislative counsel from people who have worked inside the process.",
          lede:
            "Robert Haney served as Chief Clerk of the Texas House. Julie Freeman Haney worked in appropriations, a member office, and legislative communications. They bring that experience to every engagement.",
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
          heading: "Legislative procedure, appropriations, and communications in one firm.",
          body_paragraphs_html: [
            "The Haney Group represents statewide associations, regulated companies, local governments, health care organizations, and policy nonprofits before the Texas Legislature and executive agencies.",
            "Robert leads work on <strong>House procedure and legislative strategy</strong>. Julie leads work on <strong>appropriations and communications</strong>. Both remain involved throughout the engagement.",
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
          heading: "What clients can expect.",
          items: [
            {
              num: "01",
              title: "We do not start with a tactic.",
              body:
                "We first ask who is for the proposal, who is against it, which committee has jurisdiction, and what it costs. Those answers determine the plan.",
            },
            {
              num: "02",
              title: "We tell clients the truth.",
              body:
                "If a priority is unlikely to move this session, we say so. If a bill is in trouble, we explain what can still be done and what should wait for the interim.",
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
          heading: "Meet the principals.",
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
          portrait_image_url: "/assets/img/robert-haney.png",
          body_paragraphs: [
            "Robert Haney worked in the Texas House of Representatives for more than twenty-five years. He served as Chief Clerk under five Speakers from both parties.",
            "As Chief Clerk, he managed the procedural backbone of every bill the House considered: calendars, certifications, journals, technology, and the rules under which Members debated. He led the modernization of House operations, including the transition to electronic bill filing, which retired a century-old paper process.",
            "Robert served as President of the American Society of Legislative Clerks and Secretaries (ASLCS). He continues to advise legislative chambers on modernization and parliamentary procedure. Texas Capitol Inside named him a Rising Star in 2023.",
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
          portrait_image_url: "/assets/img/julie-haney.png",
          body_paragraphs: [
            "Julie Freeman Haney has two decades of experience in Texas appropriations and legislative communications. She served as an aide to the Chair of the House Appropriations Committee and later as chief of staff to a state legislator.",
            "She develops legislative messages, prepares talking points and board briefings, and advises clients responding to public or political pressure.",
            "Julie tells clients what to say, who needs to hear it, and when public comment would do more harm than good.",
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
          heading: "Need counsel on a matter before the Legislature?",
          body:
            "If you need legislative, appropriations, procedural, or communications counsel, tell us where the matter stands and what decision comes next.",
          primary_cta: { label: "Talk With the Principals", href: "/contact" },
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
            "We develop legislative plans, draft and analyze bills, work appropriations, advise on House procedure, represent clients at the Capitol, and organize stakeholder support.",
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
          heading: "Six ways we help clients move an issue.",
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
          heading: "The principals stay on the work.",
          body:
            "Robert and Julie set the plan, handle key meetings, and brief the client. During session, they can make informed calls quickly because they know the matter from the start.",
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
          heading: "Detailed counsel in four practice areas.",
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
          heading: "Bring us the issue early.",
          body:
            "Bring us the bill, funding request, procedural question, or communications problem. We will help identify the next workable step.",
          primary_cta: { label: "Discuss Your Texas Strategy", href: "/contact" },
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
          headline: "Who we represent.",
          lede:
            "The firm represents associations, public entities, providers, companies, and policy organizations across nine areas of Texas law and regulation.",
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
          heading: "A selection of clients.",
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
          heading: "Does your organization have a Texas priority?",
          body:
            "If your organization has a Texas legislative or regulatory priority, tell us what is at issue and when a decision is expected.",
          primary_cta: { label: "Discuss Your Texas Priority", href: "/contact" },
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
            "Examples of work for trade associations, public entities, regulated companies, health systems, and policy organizations. Client names are withheld where the matter was confidential.",
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
          heading: "Working on a similar matter?",
          body:
            "If one of these matters resembles yours, we can discuss the work and the limits of what can be shared.",
          primary_cta: { label: "Discuss a Similar Matter", href: "/contact" },
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
            "Short explanations of procedure, appropriations, deadlines, and preparation for the next session.",
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
          heading: "Have a question about the process?",
          body:
            "Have a question about how one of these issues applies to your organization? Tell us the facts and the timing.",
          primary_cta: { label: "Ask the Firm", href: "/contact" },
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
            "Tell us the issue, the next deadline, and the result you need. A principal will reply within one business day.",
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
            "<p>Your inquiry goes directly to a principal. We reply within one business day and often sooner during session.</p><p>For an urgent procedural question, please call.</p>",
        },
      },
      {
        section_key: "contact_right_col",
        section_label: "Right column",
        section_type: "contact_right_col",
        display_order: 3,
        content_json: {
          eyebrow: "Send a Note",
          heading: "Tell us what is at issue.",
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
          heading: "Is the matter already moving?",
          body:
            "If the deadline is close or the matter is already moving, call the firm directly.",
          primary_cta: { label: "Call (512) 925-5000", href: "tel:+15129255000" },
          secondary_cta: { label: "Email the firm", href: "mailto:info@haney-group.com" },
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
