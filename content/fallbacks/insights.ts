// Static fallback content for /insights and /insights/[slug].
// Used until Phase 5 moves these into cms_articles (Supabase).
// The CMS will produce body_html via Tiptap and write back to this shape.

export type InsightArticle = {
  slug: string;
  title: string;
  lede: string;
  summary: string;
  category: string;
  article_label: string;
  hero_image: string;
  author: string;
  date_label: string;
  read_time: string;
  body_html: string;
};

export const insightArticles: InsightArticle[] = [
  {
    slug: "preparing-early-for-the-next-legislative-session",
    title: "Preparing Early for the Next Legislative Session",
    lede: "In Texas, outcomes in January are often decided by work done in the spring and summer before a session convenes. A practical framework for interim preparation.",
    summary:
      "The work that decides session outcomes happens long before opening day. A practical framework for interim preparation — calendar review, member mapping, message work, and LBB engagement that has to start in the spring.",
    category: "Interim",
    article_label: "Article · Interim",
    hero_image: "/assets/img/article-preparing-early.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>In Texas, outcomes in January are often determined by decisions made in the spring and summer before a session convenes. The interim is not downtime; it is the most controllable window for shaping policy, building alignment, and avoiding reactive positioning when the pace accelerates. Effective advocacy during the session is typically the product of disciplined preparation across four core areas: <strong>calendar management</strong>, <strong>member mapping</strong>, <strong>message development</strong>, and <strong>early engagement with the Legislative Budget Board (LBB)</strong>.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Calendar discipline.</strong> Mapping the full rhythm of the cycle, not just statutory deadlines.</li>
          <li><strong>Member &amp; committee mapping.</strong> Understanding who matters on your issue, and why.</li>
          <li><strong>Message refinement.</strong> Pressure-testing your narrative before the calendar tightens.</li>
          <li><strong>Early LBB engagement.</strong> Positioning a fiscal issue inside baseline discussions.</li>
          <li><strong>Momentum building.</strong> How the four streams reinforce one another into session.</li>
        </ul>
      </div>

      <h2>Start with the Calendar</h2>
      <p>A serious interim plan begins with a working calendar that looks beyond statutory deadlines and tracks the full rhythm of the legislative cycle.</p>
      <p><strong>Key milestones to map include:</strong></p>
      <ul>
        <li>Interim committee charges and hearing schedules.</li>
        <li>Bill pre-filing windows and drafting timelines.</li>
        <li>LBB budget instructions, agency requests, and submission deadlines.</li>
        <li>Political calendar events, including primary filing periods and election cycles.</li>
        <li>Industry or stakeholder developments that may influence legislative attention.</li>
      </ul>
      <p>Building this calendar early allows clients to align internal decision-making with external opportunities. It also creates space to resolve complex issues, legal, fiscal, or political, before they become time-sensitive during session.</p>

      <h2>Map the Members and Committees</h2>
      <p>Interim is the time to develop a precise understanding of who will matter on your issue and why.</p>
      <p>This goes beyond basic committee assignments. A useful member map should incorporate:</p>
      <ul>
        <li>Likely committee jurisdictions and leadership dynamics.</li>
        <li>Individual member priorities, district-specific concerns, and past voting behavior.</li>
        <li>Relationships between members, including informal influence networks.</li>
        <li>Staff roles and turnover, particularly committee directors and policy aides.</li>
      </ul>
      <p>This analysis should be dynamic. Committee assignments may shift, and emerging issues can quickly change a member&rsquo;s level of engagement. Early mapping allows for targeted outreach that is informed, credible, and appropriately timed.</p>

      <h2>Refine the Message Before It Is Tested</h2>
      <p>The interim provides a critical opportunity to develop and pressure-test your policy narrative.</p>
      <p><strong>Strong message work includes:</strong></p>
      <ul>
        <li>Translating complex policy goals into concise, legislatively actionable language.</li>
        <li>Identifying fiscal implications and preparing defensible cost assumptions.</li>
        <li>Anticipating counterarguments and areas of resistance.</li>
        <li>Aligning internal stakeholders around a consistent position.</li>
      </ul>
      <p>This is also the stage to begin drafting bill language or amendments where appropriate. Early drafting often reveals practical constraints or unintended consequences that are easier to address months before filing deadlines.</p>

      <h2>Engage the LBB Early</h2>
      <p>For any issue with a fiscal dimension, early engagement with the Legislative Budget Board is essential.</p>
      <p>Waiting until session to address budget implications significantly limits options. During the interim, clients should:</p>
      <ul>
        <li>Understand how their priorities align with or diverge from agency requests.</li>
        <li>Evaluate potential riders, exceptional items, or statutory changes needed to support funding.</li>
        <li>Develop credible cost estimates and supporting data.</li>
        <li>Identify where flexibility may exist within the budget structure.</li>
      </ul>
      <p>Constructive LBB engagement in the interim can position an issue for inclusion in baseline discussions rather than as a late-session addition competing for limited resources.</p>

      <h2>Build Momentum Before Session Begins</h2>
      <p>The most effective interim strategies are not siloed. Calendar discipline, member mapping, message development, and budget engagement should reinforce one another.</p>
      <p>For example, a well-timed interim hearing can be used to introduce a refined message, supported by preliminary fiscal analysis, to members already identified as key decision-makers. That same groundwork can then inform bill drafting and budget requests as session approaches.</p>
      <p><strong>By the time the Legislature convenes, the goal is to have:</strong></p>
      <ul>
        <li>A clearly defined policy objective.</li>
        <li>Identified legislative champions and informed stakeholders.</li>
        <li>Drafted language ready for filing or negotiation.</li>
        <li>A realistic path through both policy and budget processes.</li>
      </ul>

      <h2>Closing Perspective</h2>
      <p>The interim is where leverage is built. Clients who invest early are better positioned to move from reaction to strategy, from introduction to passage. In a compressed 140-day session, preparation is not an advantage, it is a prerequisite.</p>
    `,
  },

  {
    slug: "what-makes-a-budget-rider-viable",
    title: "What Makes a Budget Rider Viable",
    lede: "Durable rider language is the product of early design, disciplined drafting, and alignment with both policy and fiscal constraints. The interim is where viable riders are built.",
    summary:
      "Most riders that survive conference look obvious in retrospect. A close read of what distinguishes durable rider language from short-lived language, and why the work begins in interim.",
    category: "Appropriations",
    article_label: "Article · Appropriations",
    hero_image: "/assets/img/article-budget-rider.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "9 min read",
    body_html: `
      <p>The General Appropriations Act is where the State of Texas chooses what it actually does. Budget riders, the directive language attached to appropriations, often decide how, when, and whether those choices reach the public. A viable rider is not simply a good idea inserted into the right article. It is a piece of language that fits the structure of the bill, withstands procedural review, and reflects a realistic understanding of how the agency will execute it.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Structural fit.</strong> Tying a rider cleanly to existing appropriations and authority.</li>
          <li><strong>Drafting durability.</strong> Precise, defensible language that survives procedural review.</li>
          <li><strong>Agency execution reality.</strong> Aligning language with how the agency actually operates.</li>
          <li><strong>Fiscal credibility.</strong> Cost story, funding source, and stress-testing against scenarios.</li>
          <li><strong>Champions and conference design.</strong> Positioning for negotiation from the start.</li>
          <li><strong>Article-by-article norms.</strong> How Articles II, III, V, VI, VII, and IX each shape what works.</li>
        </ul>
      </div>

      <h2>Start with Fit, Not Just Need</h2>
      <p>A rider must do more than address a problem, it must fit cleanly within the structure and purpose of the General Appropriations Act.</p>
      <p><strong>Viable riders typically:</strong></p>
      <ul>
        <li>Tie directly to an existing appropriation, strategy, or agency function.</li>
        <li>Avoid creating new programs that lack a clear budgetary anchor.</li>
        <li>Operate within, or clearly relate to, the authority already granted to the agency.</li>
        <li>Respect limitations on general law, steering clear of language that reads as standalone statutory change.</li>
      </ul>
      <p>Early evaluation of &ldquo;fit&rdquo; forces refinement. If a proposal cannot be expressed as a natural extension of an existing appropriation, it is less likely to survive points of order or conference scrutiny.</p>

      <h2>Draft for Durability</h2>
      <p>Rider language must be precise, limited, and defensible under procedural review.</p>
      <p><strong>Durable drafting tends to:</strong></p>
      <ul>
        <li>Use clear, directive language tied to specific line items or strategies.</li>
        <li>Define scope narrowly enough to avoid unintended expansion.</li>
        <li>Anticipate procedural challenges, particularly under rules restricting riders that attempt to legislate.</li>
        <li>Align terminology with existing statute and agency usage.</li>
      </ul>
      <p>Ambiguity is often fatal. Language that invites interpretation can trigger objections from budget writers, agencies, or opposing stakeholders, any of which can stall or strip a rider late in the process.</p>

      <h2>Align with Agency Reality</h2>
      <p>A rider that cannot be implemented in practice will not last long in negotiations.</p>
      <p>During the interim, viable proposals:</p>
      <ul>
        <li>Account for how the agency actually operates, including administrative constraints.</li>
        <li>Reflect input from agency staff where appropriate, even if informally obtained.</li>
        <li>Avoid imposing requirements that are operationally infeasible within the biennium.</li>
        <li>Consider reporting, oversight, or performance measures that are realistic and measurable.</li>
      </ul>
      <p>This alignment reduces friction when the rider is reviewed by budget staff and conferees, who are often focused on execution as much as policy intent.</p>

      <h2>Build Fiscal Credibility Early</h2>
      <p>Even modest riders carry fiscal implications, and those implications must be understood in advance.</p>
      <p><strong>Strong interim preparation includes:</strong></p>
      <ul>
        <li>Developing credible cost estimates or confirming cost neutrality where applicable.</li>
        <li>Identifying the funding source within the bill, including relevant strategies or methods of finance.</li>
        <li>Anticipating how the rider interacts with base appropriations and exceptional items.</li>
        <li>Stress-testing assumptions against different budget scenarios.</li>
      </ul>
      <p>Riders that arrive without a clear fiscal story are more likely to be sidelined as the budget tightens and priorities compete.</p>

      <h2>Identify Champions and Pressure Points</h2>
      <p>No rider moves on drafting quality alone. Viability depends on who supports it and where it sits in the process.</p>
      <p><strong>Effective interim work includes:</strong></p>
      <ul>
        <li>Securing interest from members with jurisdiction over the relevant article of the budget.</li>
        <li>Understanding the perspectives of key budget writers and staff.</li>
        <li>Identifying potential opposition early and narrowing points of disagreement.</li>
        <li>Positioning the rider within broader negotiations, where it may serve as leverage or compromise.</li>
      </ul>
      <p>By the time conference begins, the most successful riders already have advocates in both chambers and a defined path through competing priorities.</p>

      <h2>Design for Conference from the Start</h2>
      <p>Conference committee is where many riders are narrowed, merged, or eliminated. Viable riders are drafted with that stage in mind.</p>
      <p><strong>This means:</strong></p>
      <ul>
        <li>Keeping language concise enough to be easily defended and explained.</li>
        <li>Avoiding unnecessary complexity that invites revision.</li>
        <li>Ensuring the rider can withstand reconciliation between House and Senate versions.</li>
        <li>Preparing fallback positions or scaled versions if compromise is required.</li>
      </ul>
      <p>Riders that depend on perfect conditions rarely survive. Those that are adaptable, without losing their core purpose, are far more likely to remain intact.</p>

      <h2>Technical Breakdown by Budget Article</h2>
      <p>Understanding where a rider lives in the General Appropriations Act, and how that article is typically treated, can materially affect drafting strategy and survival.</p>

      <h3>Article II, Health and Human Services</h3>
      <ul>
        <li>Largest and most complex article; high scrutiny from both policy and fiscal perspectives.</li>
        <li>Riders often focus on eligibility, service delivery, reporting, or program limitations.</li>
        <li>Viability hinges on tight alignment with federal requirements and existing program structures (e.g., Medicaid constraints).</li>
        <li>Broad or policy-heavy riders are more likely to be challenged as attempts to legislate.</li>
      </ul>

      <h3>Article III, Education (TEA and Higher Education)</h3>
      <ul>
        <li>Riders frequently address formula funding, grant conditions, or institutional accountability.</li>
        <li>Successful riders tend to be data-driven and tied to performance or reporting metrics.</li>
        <li>Political sensitivity is high; even small funding directives can trigger statewide stakeholder response.</li>
        <li>Drafting must account for interaction with formulas and avoid unintended redistribution effects.</li>
      </ul>

      <h3>Article V, Public Safety and Criminal Justice</h3>
      <ul>
        <li>Riders often relate to operational directives, grant programs, or interagency coordination.</li>
        <li>Agencies in this article are typically execution-focused, so feasibility and clarity are critical.</li>
        <li>Riders that impose new duties without corresponding resources face resistance.</li>
        <li>Coordination with existing statutory authority (e.g., Code of Criminal Procedure) is closely examined.</li>
      </ul>

      <h3>Article VI, Natural Resources</h3>
      <ul>
        <li>Common rider subjects include water, energy, and environmental programs.</li>
        <li>Viability often depends on alignment with existing funds (e.g., dedicated accounts) and long-term planning frameworks.</li>
        <li>Riders may intersect with quasi-independent entities or boards, requiring careful jurisdictional drafting.</li>
        <li>Technical precision matters, particularly where federal or environmental standards are implicated.</li>
      </ul>

      <h3>Article VII, Business, Economic Development, and Transportation</h3>
      <ul>
        <li>Riders frequently address project prioritization, funding allocation, or reporting for large-scale infrastructure programs.</li>
        <li>Coordination with TxDOT planning documents and federal funding streams is essential.</li>
        <li>Riders that attempt to earmark specific projects face higher scrutiny unless clearly justified within existing frameworks.</li>
        <li>Timing matters, alignment with planning and funding cycles can determine practicality.</li>
      </ul>

      <h3>Article IX, General Provisions</h3>
      <ul>
        <li>Houses statewide riders that apply across agencies.</li>
        <li>Highly scrutinized for attempts to enact broad policy through appropriations language.</li>
        <li>Viable riders here are typically administrative, procedural, or clarifying in nature.</li>
        <li>Overreach in Article IX is a common source of points of order and conference removal.</li>
      </ul>

      <p>Each article has its own norms, pressure points, and drafting expectations. Tailoring rider language to those conditions during the interim significantly improves the likelihood that it will move cleanly through both chambers and survive conference.</p>

      <h2>Closing Perspective</h2>
      <p>What appears &ldquo;obvious&rdquo; at the end of session is usually the result of deliberate interim work, aligning policy goals with budget structure, drafting with precision, and building support before the process accelerates. A viable rider is not just a good idea; it is an idea that fits, functions, and can withstand the pressures of the appropriations process.</p>
    `,
  },

  {
    slug: "why-legislative-timing-matters",
    title: "Why Legislative Timing Matters",
    lede: "Substantive ideas compete within a fixed calendar. The procedural milestones that govern bill movement quietly determine which proposals receive hearings, advance to calendars, or never surface at all.",
    summary:
      "Calendars, deadlines, and the difference between a bill that moves and a bill that waits. The procedural milestones that quietly decide what gets a hearing.",
    category: "Procedure",
    article_label: "Article · Procedure",
    hero_image: "/assets/img/article-legislative-timing.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "7 min read",
    body_html: `
      <p>In Texas, when a bill moves often matters as much as what it says. The legislative process is shaped by a fixed 140-day session and a series of procedural milestones that quietly determine which proposals receive hearings, advance to calendars, or never surface at all. Understanding that timing, and using the interim to position legislation accordingly, is essential to effective advocacy.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Structural scarcity.</strong> What a 140-day session actually means for bill volume and hearing time.</li>
          <li><strong>Procedural milestones.</strong> The gates that quietly decide what moves and what waits.</li>
          <li><strong>The 90th session timeline.</strong> The dates every interim plan should be built around.</li>
          <li><strong>Hearing &amp; calendar bottlenecks.</strong> Why early-filed bills move and late ones stall.</li>
          <li><strong>Timing as substance.</strong> How a bill&rsquo;s position in the calendar shapes its content.</li>
        </ul>
      </div>

      <h2>The Reality of a Compressed Session</h2>
      <p>Texas&rsquo; 140-day regular session creates structural scarcity. Committees face high bill volume, limited hearing time, and competing priorities set by leadership.</p>
      <p><strong>As a result:</strong></p>
      <ul>
        <li>Not all filed bills will receive a hearing.</li>
        <li>Committee chairs exercise significant discretion over agenda setting.</li>
        <li>Early momentum often determines whether a bill remains viable as deadlines approach.</li>
      </ul>
      <p>A bill that misses early windows may still be technically alive, but practically sidelined.</p>

      <h2>Key Procedural Milestones</h2>
      <p>Understanding the calendar is essential, but effective advocacy requires understanding how those dates function in practice.</p>
      <p><strong>Critical milestones include:</strong></p>
      <ul>
        <li>Bill filing deadlines and the early pre-filing period.</li>
        <li>Committee hearing windows, which narrow quickly after the first weeks of session.</li>
        <li>Committee report deadlines, after which bills cannot advance out of committee.</li>
        <li>Calendars Committee scheduling in the House and intent calendar practices in the Senate.</li>
        <li>Floor deadlines and &ldquo;last days&rdquo; for consideration of various bill categories.</li>
      </ul>
      <p>Each milestone creates a gate. Missing one often ends a bill&rsquo;s path, regardless of support.</p>

      <aside class="article__timeline" aria-labelledby="timeline-label">
        <p class="article__timeline-eyebrow">Reference Timeline</p>
        <p class="article__timeline-title" id="timeline-label">Texas 90th Legislature, key dates</p>
        <ol>
          <li><strong>Nov. 9, 2026</strong>Bill filing begins.</li>
          <li><strong>Jan. 12, 2027</strong>Regular session convenes at noon.</li>
          <li><strong>Mar. 12, 2027</strong>Last day to file bills.</li>
          <li><strong>May 14, 2027</strong>House last day to consider House bills on third reading.</li>
          <li><strong>May 26, 2027</strong>House last day to consider Senate bills on third reading.</li>
          <li><strong>May 30, 2027</strong>Last day for either chamber to consider conference committee reports.</li>
          <li><strong>May 31, 2027</strong>Sine die.</li>
        </ol>
      </aside>

      <h2>The Hearing Bottleneck</h2>
      <p>For most bills, the decisive moment is whether, and when, they receive a committee hearing.</p>
      <p>Timing affects hearings in several ways:</p>
      <ul>
        <li>Early-filed bills are more likely to be noticed and scheduled while calendars are still flexible.</li>
        <li>Bills with identified authorship priorities or leadership support move to the front of the line.</li>
        <li>Late-emerging issues must compete against a backlog of already-positioned legislation.</li>
        <li>Committee bandwidth tightens as deadlines approach, reducing opportunities for new hearings.</li>
      </ul>
      <p>In practice, a bill without a hearing early enough to be voted out of committee before deadlines is unlikely to advance.</p>

      <h2>Calendars and Floor Access</h2>
      <p>Even after a bill leaves committee, timing continues to shape outcomes.</p>
      <p><strong>In the House:</strong></p>
      <ul>
        <li>Placement on a calendar is selective and influenced by deadline pressure and political priority.</li>
        <li>Bills reported later in the process compete for diminishing floor time.</li>
      </ul>
      <p><strong>In the Senate:</strong></p>
      <ul>
        <li>The intent calendar and floor recognition practices create similar constraints.</li>
        <li>Timing affects whether a bill is brought up individually or left pending.</li>
      </ul>
      <p>Late-moving bills face higher hurdles, including increased scrutiny and reduced flexibility for amendments.</p>

      <h2>Strategic Use of the Interim</h2>
      <p>The most reliable way to manage timing constraints is to begin before session.</p>
      <p><strong>Effective interim preparation:</strong></p>
      <ul>
        <li>Secures authors and co-authors early, increasing the likelihood of prompt referral and attention.</li>
        <li>Aligns stakeholders to minimize delays once a bill is filed.</li>
        <li>Develops committee-specific strategies based on anticipated jurisdiction and workload.</li>
        <li>Identifies potential bottlenecks and builds contingency plans.</li>
      </ul>
      <p>By the time session begins, well-prepared bills are positioned to move quickly through early stages, when opportunities are greatest.</p>

      <h2>Timing as a Substantive Advantage</h2>
      <p>Timing is not merely procedural, it can shape the substance of a bill.</p>
      <p><strong>Early-moving legislation:</strong></p>
      <ul>
        <li>Has greater flexibility to absorb amendments and negotiate terms.</li>
        <li>Faces less competition for attention from members and staff.</li>
        <li>Is more likely to influence related proposals moving through the process.</li>
      </ul>
      <p><strong>Late-moving legislation:</strong></p>
      <ul>
        <li>Is often forced into narrower pathways, including amendments or omnibus vehicles.</li>
        <li>May be reshaped significantly to fit available opportunities.</li>
      </ul>
      <p>Understanding this dynamic allows clients to decide whether to advance a standalone bill, pursue a rider, or position language for amendment.</p>

      <h2>Closing Perspective</h2>
      <p>Legislative success in Texas is governed as much by the calendar as by policy. The milestones that structure the session, filing, hearings, reporting, and floor access, quietly determine what moves and what waits. Clients who treat timing as a core strategic element, rather than an afterthought, are far more likely to see their priorities advance.</p>
    `,
  },

  {
    slug: "when-to-say-nothing",
    title: "When To Say Nothing",
    lede: "Sometimes the most effective move in a moving bill is restraint. Silence can preserve leverage, avoid unnecessary opposition, and keep a proposal from being defined by someone else.",
    summary:
      "Message discipline during a moving bill. The handful of moments in a session when the right move is silence — and how to know which moments those are.",
    category: "Communications",
    article_label: "Article · Communications",
    hero_image: "/assets/img/article-when-to-say-nothing.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>Effective advocacy is built as much on what is not said as on what is. In a Texas session that moves fast and turns on relationships, the wrong word at the wrong moment can cost momentum, weaken a coalition, or define a bill on someone else&rsquo;s terms. Knowing when to stay quiet is a discipline that takes time to develop, but it is one of the most important skills in serious legislative work.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Message discipline.</strong> Why saying the right thing at the wrong time costs momentum.</li>
          <li><strong>Moments to stay quiet.</strong> The five situations where silence is the better move.</li>
          <li><strong>Letting a moving bill move.</strong> Reducing friction once a proposal has momentum.</li>
          <li><strong>Who actually needs a voice.</strong> Choosing the single best speaker over a chorus.</li>
          <li><strong>Protecting the record.</strong> How unnecessary commentary creates interpretive risk.</li>
        </ul>
      </div>

      <h2>Message Discipline Matters</h2>
      <p>The danger in a fast-moving session is not only saying the wrong thing, but saying the right thing at the wrong time. A bill can be strong on substance and still lose momentum if the message shifts midstream. Once a proposal is filed, amended, or under active negotiation, every public comment can affect how other members, staff, agencies, and stakeholders interpret the bill&rsquo;s direction.</p>
      <p>That is why disciplined advocacy often means limiting the number of voices speaking at once. A clear position delivered through the right channel is usually more effective than multiple explanations offered too early or too often.</p>

      <h2>Moments That Call For Silence</h2>
      <p>There are several points in the process where silence is often the better strategy:</p>
      <ul>
        <li>When a bill is under active negotiation and positions are still fluid.</li>
        <li>When committee staff are working through draft language and public commentary could complicate the process.</li>
        <li>When a coalition is not yet aligned and premature statements could expose internal differences.</li>
        <li>When an amendment is being discussed and any public reaction could harden opposition.</li>
        <li>When leadership, conferees, or agency staff are signaling that they need space to work.</li>
      </ul>
      <p>In these moments, even well-intended comments can close options. Silence does not mean disengagement, it means allowing the process to work without unnecessary interference.</p>

      <h2>Let The Bill Move</h2>
      <p>Once a bill has momentum, the goal is often to reduce friction rather than add commentary. Members and staff want clarity, not noise. A proposal that is still taking shape can be slowed by overexplaining, overdefending, or repeatedly restating the same points to different audiences.</p>
      <p>This is especially true when a bill is already understood by the key decision-makers. At that stage, the best advocacy may be quiet support: confirming the ask, answering direct questions, and staying available without trying to dominate the conversation.</p>

      <h2>Know Who Needs A Voice</h2>
      <p>Silence is not the same as absence. It is a decision about who should speak, when they should speak, and for what purpose. In many cases, one legislator, one agency representative, or one trusted advocate can do more for the bill than a larger chorus of competing voices.</p>
      <p>A useful question is not &ldquo;Should we say something?&rdquo; but <strong>&ldquo;Who is best positioned to say it, and when?&rdquo;</strong> That discipline keeps the message coherent and prevents the proposal from being pulled in multiple directions.</p>

      <h2>When Silence Protects The Record</h2>
      <p>There are also times when saying nothing protects the long-term record. A rushed comment can be used later to argue that the bill intended something broader, narrower, or different than the text actually shows. In a session where language matters, unnecessary explanation can create ambiguity where none existed before.</p>
      <p>Careful teams understand that the legislative record is not built only in hearings and floor debates. It is shaped by the surrounding conversation as well. When the text is still fluid, it is often wiser to preserve interpretive space than to narrow it prematurely.</p>

      <h2>A Discipline For Serious Work</h2>
      <p>The hardest part of legislative communication is often knowing when not to communicate. That judgment is usually learned over time, through experience with deadlines, committee dynamics, and the pace of negotiations. In a moving bill, silence can be a strategic tool that keeps the proposal alive, keeps allies aligned, and keeps the record clean.</p>
      <p>The right words still matter. But in the right moment, the absence of words can matter more.</p>
    `,
  },

  {
    slug: "member-meetings-that-move-a-bill",
    title: "Member Meetings That Move A Bill",
    lede: "A well-prepared member meeting can do more for a bill than a long hearing memo. Fifteen focused minutes with the right legislator can clarify the issue, test the message, and quietly change the bill's trajectory.",
    summary:
      "Preparation for a member meeting. What to bring, what to leave out, and how a fifteen-minute conversation can quietly change the trajectory of a bill.",
    category: "Lobbying",
    article_label: "Article · Lobbying",
    hero_image: "/assets/img/article-member-meetings.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>Some of the most important conversations of a Texas session happen in short, quiet meetings, often in a member&rsquo;s Capitol office or in a hallway between hearings. These conversations can shape committee priorities, build trust, and quietly move a bill forward without anyone outside the room noticing. The teams that prepare for those meetings carefully tend to make far more progress than those that rely on volume.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Preparation.</strong> A clear, narrow ask before the meeting starts.</li>
          <li><strong>What to bring.</strong> The few materials that actually earn their place.</li>
          <li><strong>What to leave out.</strong> The noise that dilutes a short meeting.</li>
          <li><strong>Listening as a diagnostic.</strong> Using questions to surface the real pressure point.</li>
          <li><strong>Follow-up.</strong> Converting the conversation into action without losing momentum.</li>
        </ul>
      </div>

      <h2>Prepare For The Conversation</h2>
      <p>A member meeting works best when the goal is narrow and concrete. The team should know exactly what it wants from the meeting: support, a referral, a vote, an author, a coauthor, or simply a better understanding of the issue.</p>
      <p><strong>Preparation should include:</strong></p>
      <ul>
        <li>A clear one-sentence ask.</li>
        <li>A concise explanation of why the bill matters now.</li>
        <li>Anticipated objections and short responses.</li>
        <li>A basic understanding of the member&rsquo;s district, committee roles, and prior positions.</li>
      </ul>
      <p>The best meetings feel organized without feeling scripted. Members appreciate a conversation that respects their time and gets to the point quickly.</p>

      <h2>Bring Only What Helps</h2>
      <p>In a short meeting, less is usually more. Bring materials that support the ask without overwhelming the room.</p>
      <p><strong>Useful items often include:</strong></p>
      <ul>
        <li>A one-page summary.</li>
        <li>The current draft or a short redline if language matters.</li>
        <li>A brief fiscal explanation if the proposal has budget implications.</li>
        <li>A short list of facts, examples, or local impacts that make the issue tangible.</li>
      </ul>
      <p>Each piece should earn its place. If a document does not help the member understand the ask faster, it probably does not need to be in the packet.</p>

      <h2>Leave Out The Noise</h2>
      <p>A member meeting is not the place for an everything-at-once presentation. Too much material can distract from the main point and make the issue harder to remember.</p>
      <p><strong>Leave out:</strong></p>
      <ul>
        <li>Long slide decks.</li>
        <li>Dense statutory background unless specifically requested.</li>
        <li>Internal disagreements that are not relevant to the ask.</li>
        <li>Side issues that can wait for another conversation.</li>
        <li>Overly aggressive language that sounds more like advocacy theater than problem-solving.</li>
      </ul>
      <p>The meeting should create clarity, not expose every possible angle at once. A focused presentation is more persuasive than a comprehensive one.</p>

      <h2>Listen As Much As You Talk</h2>
      <p>The most valuable part of a member meeting is often the questions. Those questions reveal what the member actually sees as the pressure point, which may be different from what the bill sponsor expected.</p>
      <p><strong>Listen for:</strong></p>
      <ul>
        <li>Whether the member understands the issue as framed.</li>
        <li>Which parts of the bill create hesitation.</li>
        <li>Whether a committee, agency, or constituency concern is driving the response.</li>
        <li>What kind of follow-up would move the conversation forward.</li>
      </ul>
      <p>A good meeting is not a monologue. It is a diagnostic tool that helps refine the bill before it reaches a more public stage.</p>

      <h2>Use The Meeting To Test The Bill</h2>
      <p>Member meetings are one of the best places to find out whether the bill&rsquo;s message is holding up under real-world scrutiny. A fifteen-minute conversation can reveal whether the proposal is too broad, too complicated, too technical, or simply not yet well framed.</p>
      <p>That feedback is useful even when it is not immediately favorable. A difficult question now is easier to solve than a procedural objection later. The interim and early session are the right time to adjust language, sharpen the narrative, or re-order the priorities.</p>

      <h2>Follow Up With Purpose</h2>
      <p>The meeting itself is only part of the work. The follow-up should reinforce the ask, answer any open questions, and preserve momentum.</p>
      <p><strong>A good follow-up usually includes:</strong></p>
      <ul>
        <li>A short thank-you note.</li>
        <li>Any promised materials.</li>
        <li>A clear restatement of the requested action.</li>
        <li>A timeline for the next step.</li>
      </ul>
      <p>The goal is to make it easy for the member and staff to move from conversation to action without having to reconstruct the meeting from memory.</p>

      <h2>Quiet Influence Matters</h2>
      <p>The meetings that move a bill are often the ones that seem uneventful from the outside. There is no speech, no vote, and no public drama. But those short conversations shape committee priorities, identify allies, and build the trust that matters when deadlines begin to tighten.</p>
      <p>A strong member meeting does not try to do everything. It does one thing well: <strong>it gives the right person the right information at the right time.</strong></p>
    `,
  },

  {
    slug: "points-of-order-explained",
    title: "Points Of Order, Explained",
    lede: "A point of order is one of the quietest but most consequential tools in the legislative process. It is a formal objection that, once sustained, can stop a bill midstream and change the political perception of the proposal itself.",
    summary:
      "A non-procedural guide to points of order — what they are, when they matter, and why the moment one is sustained on the floor it changes what the chamber is doing.",
    category: "Procedure",
    article_label: "Article · Procedure",
    hero_image: "/assets/img/article-points-of-order.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "5 min read",
    body_html: `
      <p>In a Texas session that turns on procedure as much as policy, the point of order is one of the most consequential tools available to a member. It does not change a bill&rsquo;s substance, but it can determine whether the bill survives the floor at all. Understanding what a point of order does, and when it matters, is essential to serious legislative work.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>What a point of order does.</strong> A procedural challenge, not a policy debate.</li>
          <li><strong>When they matter most.</strong> The floor and deadline moments where procedure becomes strategy.</li>
          <li><strong>Why the floor changes.</strong> The practical shift once one is sustained.</li>
          <li><strong>Why drafting matters.</strong> The interim work that prevents most points of order.</li>
          <li><strong>Procedural power.</strong> How rules shape outcomes as much as votes do.</li>
        </ul>
      </div>

      <h2>What A Point Of Order Does</h2>
      <p>At its core, a point of order is a challenge to procedure, not a debate over policy. It asks whether the chamber has followed the rules governing notice, germaneness, timing, drafting, or another required step.</p>
      <p><strong>When one is raised and sustained:</strong></p>
      <ul>
        <li>The bill or amendment may be delayed, amended, or removed from consideration.</li>
        <li>The chamber&rsquo;s attention shifts from substance to procedure.</li>
        <li>The operative language on the floor can change immediately.</li>
      </ul>
      <p>That is why a point of order can alter the trajectory of a bill even when the underlying policy still has support.</p>

      <h2>When They Matter Most</h2>
      <p>Points of order matter most when a bill is moving quickly and the margins are thin. They are especially important during floor debate, during amendment consideration, and at moments when the chamber is trying to move multiple items under pressure.</p>
      <p><strong>They also matter when:</strong></p>
      <ul>
        <li>A bill has not been drafted carefully enough to comply with chamber rules.</li>
        <li>An amendment reaches beyond the bill&rsquo;s scope.</li>
        <li>Timing rules or notice requirements have not been satisfied.</li>
        <li>The chamber is close to a deadline and cannot easily recover lost time.</li>
      </ul>
      <p>In those moments, procedure becomes strategy.</p>

      <h2>Why The Floor Changes</h2>
      <p>The moment a point of order is sustained, the chamber is no longer operating in ordinary debate mode. Members shift from discussing whether they like the proposal to deciding what the rules allow.</p>
      <p><strong>That change matters because it can:</strong></p>
      <ul>
        <li>Stop a bill midstream.</li>
        <li>Force a rewrite or substitute.</li>
        <li>Expose weaknesses that were not obvious during earlier stages.</li>
        <li>Signal to other members that the proposal may not be as ready as it appeared.</li>
      </ul>
      <p>A sustained point of order can do more than defeat a technical flaw. It can also change the political perception of the bill itself.</p>

      <h2>Why Drafting Matters</h2>
      <p>Most points of order are not surprises to people who have worked closely on the bill. They often arise from issues that could have been identified earlier through careful drafting and review.</p>
      <p><strong>Good interim preparation reduces risk by:</strong></p>
      <ul>
        <li>Keeping language tightly tied to the bill&rsquo;s purpose.</li>
        <li>Checking for conflicts with chamber rules.</li>
        <li>Reviewing amendments before they reach the floor.</li>
        <li>Thinking ahead to likely objections rather than reacting to them later.</li>
      </ul>
      <p>A clean bill is not one that avoids scrutiny entirely. It is one that can survive scrutiny when it comes.</p>

      <h2>Procedural Power</h2>
      <p>Points of order are procedural, but their effect is practical and immediate. They can reshape the floor debate, influence negotiations, and determine whether a proposal advances at all.</p>
      <p>That is why they deserve attention long before the floor vote. Understanding them early helps clients and advocates appreciate that in a legislative session, <strong>the rules are not background material, they are part of the substance of the outcome.</strong></p>
    `,
  },
];

export function getArticleBySlug(slug: string): InsightArticle | undefined {
  return insightArticles.find((a) => a.slug === slug);
}
