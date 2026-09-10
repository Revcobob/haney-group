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
    lede: "The work done during the interim often determines whether a proposal is ready when the Legislature convenes. Start with the calendar, Members, message, and budget.",
    summary:
      "Four jobs for the interim: map the calendar, identify the Members who matter, test the message, and address the budget with the LBB.",
    category: "Interim",
    article_label: "Article · Interim",
    hero_image: "/assets/img/article-preparing-early.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>The interim is when clients have the most control over preparation. Before session, there is time to fix bill language, resolve internal disagreements, test cost assumptions, and meet with the people who will handle the issue. Four jobs matter most: <strong>map the calendar</strong>, <strong>identify the Members</strong>, <strong>test the message</strong>, and <strong>engage the Legislative Budget Board (LBB)</strong> when funding is involved.</p>

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
      <p>An interim plan begins with a working calendar. It should include statutory deadlines and the practical dates that control drafting, hearings, budgets, and internal approvals.</p>
      <p><strong>Key milestones to map include:</strong></p>
      <ul>
        <li>Interim committee charges and hearing schedules.</li>
        <li>Bill pre-filing windows and drafting timelines.</li>
        <li>LBB budget instructions, agency requests, and submission deadlines.</li>
        <li>Political calendar events, including primary filing periods and election cycles.</li>
        <li>Industry or stakeholder developments that may influence legislative attention.</li>
      </ul>
      <p>An early calendar gives the client time to secure internal decisions and fix legal, fiscal, or political problems before session compresses the choices.</p>

      <h2>Map the Members and Committees</h2>
      <p>Use the interim to identify who will handle the issue and what each person will need to know.</p>
      <p>This goes beyond basic committee assignments. A useful member map should incorporate:</p>
      <ul>
        <li>Likely committee jurisdictions and leadership dynamics.</li>
        <li>Individual member priorities, district-specific concerns, and past voting behavior.</li>
        <li>Relationships between members, including informal influence networks.</li>
        <li>Staff roles and turnover, particularly committee directors and policy aides.</li>
      </ul>
      <p>Update the map as committee assignments, staff, and Member priorities change. It should guide who gets contacted, by whom, and when.</p>

      <h2>Refine the Message Before It Is Tested</h2>
      <p>Test the policy message before it appears in a hearing or fiscal note.</p>
      <p><strong>Strong message work includes:</strong></p>
      <ul>
        <li>Turning policy goals into concise language that can be drafted and defended.</li>
        <li>Identifying fiscal implications and preparing defensible cost assumptions.</li>
        <li>Anticipating counterarguments and areas of resistance.</li>
        <li>Aligning internal stakeholders around a consistent position.</li>
      </ul>
      <p>Draft the bill or amendment now. Drafting often exposes legal conflicts, costs, and unintended effects that can still be fixed before filing.</p>

      <h2>Engage the LBB Early</h2>
      <p>If the proposal has a cost, address it with the LBB during the interim.</p>
      <p>Waiting until session limits the available funding options. During the interim:</p>
      <ul>
        <li>Understand how their priorities align with or diverge from agency requests.</li>
        <li>Evaluate potential riders, exceptional items, or statutory changes needed to support funding.</li>
        <li>Develop credible cost estimates and supporting data.</li>
        <li>Identify where flexibility may exist within the budget structure.</li>
      </ul>
      <p>Early LBB work can put the issue into baseline discussions instead of leaving it to compete as a late addition.</p>

      <h2>Build Momentum Before Session Begins</h2>
      <p>The calendar, Member map, message, and budget work should support the same plan.</p>
      <p>An interim hearing, for example, can test the message and cost estimate with the Members who will later consider the bill. Their questions should inform the next draft and any budget request.</p>
      <p><strong>By the time the Legislature convenes, the goal is to have:</strong></p>
      <ul>
        <li>A clearly defined policy objective.</li>
        <li>Identified legislative champions and informed stakeholders.</li>
        <li>Drafted language ready for filing or negotiation.</li>
        <li>A realistic path through both policy and budget processes.</li>
      </ul>

      <h2>Before Session Begins</h2>
      <p>By opening day, the objective, draft, cost, authors, likely opponents, and committee path should be known. A 140-day session leaves little time to answer those questions from scratch.</p>
    `,
  },

  {
    slug: "what-makes-a-budget-rider-viable",
    title: "What Makes a Budget Rider Viable",
    lede: "A budget rider must fit the appropriation, survive procedural review, work for the agency, and retain support through conference. That work starts during the interim.",
    summary:
      "What makes a Texas budget rider workable: article placement, precise language, agency execution, a credible cost, and support in both chambers.",
    category: "Appropriations",
    article_label: "Article · Appropriations",
    hero_image: "/assets/img/article-budget-rider.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "9 min read",
    body_html: `
      <p>Budget riders direct how an appropriation may be spent. A workable rider fits the structure of the General Appropriations Act, survives procedural review, and gives the agency instructions it can carry out.</p>

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
      <p>A rider must address the problem without exceeding the purpose or structure of the General Appropriations Act.</p>
      <p><strong>Viable riders typically:</strong></p>
      <ul>
        <li>Tie directly to an existing appropriation, strategy, or agency function.</li>
        <li>Avoid creating new programs that lack a clear budgetary anchor.</li>
        <li>Operate within, or clearly relate to, the authority already granted to the agency.</li>
        <li>Respect limitations on general law, steering clear of language that reads as standalone statutory change.</li>
      </ul>
      <p>If the proposal cannot be tied to an existing appropriation, agency function, or strategy, it is more vulnerable to a point of order or removal in conference.</p>

      <h2>Draft for Durability</h2>
      <p>Rider language must be precise, limited, and defensible under procedural review.</p>
      <p><strong>Durable drafting tends to:</strong></p>
      <ul>
        <li>Use clear, directive language tied to specific line items or strategies.</li>
        <li>Define scope narrowly enough to avoid unintended expansion.</li>
        <li>Anticipate procedural challenges, particularly under rules restricting riders that attempt to legislate.</li>
        <li>Align terminology with existing statute and agency usage.</li>
      </ul>
      <p>Ambiguous language invites objections from budget staff, the agency, or opponents. Those objections are harder to resolve late in the process.</p>

      <h2>Align with Agency Reality</h2>
      <p>A rider that cannot be implemented in practice will not last long in negotiations.</p>
      <p>During the interim, viable proposals:</p>
      <ul>
        <li>Account for how the agency actually operates, including administrative constraints.</li>
        <li>Reflect input from agency staff where appropriate, even if informally obtained.</li>
        <li>Avoid imposing requirements that are operationally infeasible within the biennium.</li>
        <li>Consider reporting, oversight, or performance measures that are realistic and measurable.</li>
      </ul>
      <p>Budget staff and conferees will ask how the agency can execute the rider. The draft should answer that question.</p>

      <h2>Build Fiscal Credibility Early</h2>
      <p>Even a modest rider may affect costs, methods of finance, or an agency&rsquo;s base appropriation.</p>
      <p><strong>Strong interim preparation includes:</strong></p>
      <ul>
        <li>Developing credible cost estimates or confirming cost neutrality where applicable.</li>
        <li>Identifying the funding source within the bill, including relevant strategies or methods of finance.</li>
        <li>Anticipating how the rider interacts with base appropriations and exceptional items.</li>
        <li>Stress-testing assumptions against different budget scenarios.</li>
      </ul>
      <p>A rider without a clear cost and funding source is easy to set aside when the budget tightens.</p>

      <h2>Identify Champions and Pressure Points</h2>
      <p>No rider moves on drafting quality alone. Viability depends on who supports it and where it sits in the process.</p>
      <p><strong>Effective interim work includes:</strong></p>
      <ul>
        <li>Securing interest from members with jurisdiction over the relevant article of the budget.</li>
        <li>Understanding the perspectives of key budget writers and staff.</li>
        <li>Identifying potential opposition early and narrowing points of disagreement.</li>
        <li>Positioning the rider within broader negotiations, where it may serve as leverage or compromise.</li>
      </ul>
      <p>Before conference, the rider should have an advocate in each chamber and a clear answer to likely objections.</p>

      <h2>Design for Conference from the Start</h2>
      <p>Conference committee is where many riders are narrowed, merged, or eliminated. Viable riders are drafted with that stage in mind.</p>
      <p><strong>This means:</strong></p>
      <ul>
        <li>Keeping language concise enough to be easily defended and explained.</li>
        <li>Avoiding unnecessary complexity that invites revision.</li>
        <li>Ensuring the rider can withstand reconciliation between House and Senate versions.</li>
        <li>Preparing fallback positions or scaled versions if compromise is required.</li>
      </ul>
      <p>Prepare narrower language and fallback positions before conference. A rider that allows no compromise is easier to remove.</p>

      <h2>Technical Breakdown by Budget Article</h2>
      <p>Each article has different agencies, subcommittees, staff, and drafting conventions. Placement changes how a rider should be written and defended.</p>

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

      <p>Draft for the article in which the rider will live. The same language may be treated differently in Article II, Article III, or Article IX.</p>

      <h2>A Workable Rider</h2>
      <p>A workable rider fits the appropriation, gives the agency clear direction, has a credible cost, and can be defended in both chambers. Those conditions are easier to establish during the interim than in conference.</p>
    `,
  },

  {
    slug: "why-legislative-timing-matters",
    title: "Why Legislative Timing Matters",
    lede: "A bill can have the votes and still run out of time. Filing, hearing, reporting, calendar, and floor deadlines determine the available path.",
    summary:
      "How filing, committee, calendar, and floor deadlines determine whether a Texas bill can move.",
    category: "Procedure",
    article_label: "Article · Procedure",
    hero_image: "/assets/img/article-legislative-timing.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "7 min read",
    body_html: `
      <p>Texas has a 140-day regular session. A bill must be filed, referred, heard, reported, placed on a calendar, and considered on the floor before the applicable deadlines. Missing one step can end the bill even when the policy has support.</p>

      <div class="article__keypoints" aria-labelledby="article-keypoints-label">
        <h2 id="article-keypoints-label">What this article covers</h2>
        <ul>
          <li><strong>Structural scarcity.</strong> What a 140-day session actually means for bill volume and hearing time.</li>
          <li><strong>Procedural milestones.</strong> The deadlines that decide what moves and what waits.</li>
          <li><strong>The 90th session timeline.</strong> The dates every interim plan should be built around.</li>
          <li><strong>Hearing &amp; calendar bottlenecks.</strong> Why early-filed bills move and late ones stall.</li>
          <li><strong>Timing as substance.</strong> How a bill&rsquo;s position in the calendar shapes its content.</li>
        </ul>
      </div>

      <h2>The Reality of a Compressed Session</h2>
      <p>Committees receive more bills than they can hear. Chairs have limited hearing time, and leadership sets competing priorities.</p>
      <p><strong>As a result:</strong></p>
      <ul>
        <li>Not all filed bills will receive a hearing.</li>
        <li>Committee chairs exercise significant discretion over agenda setting.</li>
        <li>Early momentum often determines whether a bill remains viable as deadlines approach.</li>
      </ul>
      <p>A bill that misses early windows may still be technically alive, but practically sidelined.</p>

      <h2>Key Procedural Milestones</h2>
      <p>The published deadlines matter, but so do the earlier practical cutoffs created by hearing schedules and floor time.</p>
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
      <p>A late bill has less floor time and fewer ways to recover from an adverse amendment or procedural problem.</p>

      <h2>Use the Interim</h2>
      <p>The best way to protect time during session is to finish basic work before it begins.</p>
      <p><strong>Effective interim preparation:</strong></p>
      <ul>
        <li>Secures authors and co-authors early, increasing the likelihood of prompt referral and attention.</li>
        <li>Aligns stakeholders to minimize delays once a bill is filed.</li>
        <li>Develops committee-specific strategies based on anticipated jurisdiction and workload.</li>
        <li>Identifies potential bottlenecks and builds contingency plans.</li>
      </ul>
      <p>By opening day, the draft, author, committee case, fiscal analysis, and initial support should be ready.</p>

      <h2>Timing as a Substantive Advantage</h2>
      <p>Timing can also change the substance of the proposal.</p>
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
      <p>The calendar is part of the legislative plan. It tells the client when a standalone bill remains viable and when a rider, amendment, or interim approach is more realistic.</p>
    `,
  },

  {
    slug: "when-to-say-nothing",
    title: "When To Say Nothing",
    lede: "A public statement can narrow options while a bill is being drafted or negotiated. Sometimes the better course is to let one person speak, or to say nothing yet.",
    summary:
      "When public comment can disrupt negotiations, expose coalition differences, or create an unhelpful legislative record.",
    category: "Communications",
    article_label: "Article · Communications",
    hero_image: "/assets/img/article-when-to-say-nothing.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>Public comment can affect a bill that is still being drafted, amended, or negotiated. A premature statement may harden opposition, expose coalition differences, or commit the client to language that later changes.</p>

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
      <p>The right statement at the wrong time can still hurt the bill. Once negotiations begin, each comment affects how Members, staff, agencies, and opponents read the proposal.</p>
      <p>Decide who is authorized to speak and through which channel. Several versions of the same position create avoidable questions.</p>

      <h2>Moments That Call For Silence</h2>
      <p>There are several points in the process where silence is often the better strategy:</p>
      <ul>
        <li>When a bill is under active negotiation and positions are still fluid.</li>
        <li>When committee staff are working through draft language and public commentary could complicate the process.</li>
        <li>When a coalition is not yet aligned and premature statements could expose internal differences.</li>
        <li>When an amendment is being discussed and any public reaction could harden opposition.</li>
        <li>When leadership, conferees, or agency staff are signaling that they need space to work.</li>
      </ul>
      <p>In those situations, public silence can preserve options while the client continues to work privately.</p>

      <h2>Let The Bill Move</h2>
      <p>Once the bill is moving, repeated explanations can create new issues. Members and staff usually need a clear ask and prompt answers to direct questions.</p>
      <p>If the decision-makers understand the proposal, stay available, confirm the ask, and avoid adding commentary that does not help them act.</p>

      <h2>Know Who Needs A Voice</h2>
      <p>One legislator, agency representative, or advocate may be better placed to make the case than a group of competing speakers.</p>
      <p>Ask: <strong>Who needs to say this, to whom, and at what point in the process?</strong></p>

      <h2>When Silence Protects The Record</h2>
      <p>A rushed comment may later be cited as evidence that the bill meant more or less than the text says. Unnecessary explanation can create ambiguity.</p>
      <p>Hearings and floor debate are not the only sources people use to interpret legislation. While the text is changing, public statements should be deliberate.</p>

      <h2>Make the Decision Deliberately</h2>
      <p>Silence should be a choice, not an absence of preparation. Confirm the private work that continues, decide what would trigger a statement, and identify who will deliver it.</p>
    `,
  },

  {
    slug: "member-meetings-that-move-a-bill",
    title: "Member Meetings That Move A Bill",
    lede: "A short meeting with the right Member can test the bill, surface an objection, or secure the next action. Preparation matters more than the size of the packet.",
    summary:
      "How to prepare a clear ask, choose useful materials, listen for the real objection, and follow up after a Member meeting.",
    category: "Lobbying",
    article_label: "Article · Lobbying",
    hero_image: "/assets/img/article-member-meetings.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "6 min read",
    body_html: `
      <p>Many useful legislative meetings last fifteen minutes or less. A Member or staffer should leave knowing the issue, the requested action, and why it matters to the district or committee.</p>

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
      <p>Prepare enough to be concise, but do not script every exchange. Leave time for questions.</p>

      <h2>Bring Only What Helps</h2>
      <p>Bring only the material needed to explain or document the ask.</p>
      <p><strong>Useful items often include:</strong></p>
      <ul>
        <li>A one-page summary.</li>
        <li>The current draft or a short redline if language matters.</li>
        <li>A brief fiscal explanation if the proposal has budget implications.</li>
        <li>A short list of facts, examples, or local impacts that make the issue tangible.</li>
      </ul>
      <p>If a document does not help the Member understand or act on the request, leave it out.</p>

      <h2>Leave Out The Noise</h2>
      <p>A short meeting cannot carry every fact, legal argument, and internal concern. Extra material can obscure the request.</p>
      <p><strong>Leave out:</strong></p>
      <ul>
        <li>Long slide decks.</li>
        <li>Dense statutory background unless specifically requested.</li>
        <li>Internal disagreements that are not relevant to the ask.</li>
        <li>Side issues that can wait for another conversation.</li>
        <li>Overly aggressive language that sounds more like advocacy theater than problem-solving.</li>
      </ul>
      <p>Cover the issue in enough detail to support the requested action. Save secondary issues for follow-up.</p>

      <h2>Listen As Much As You Talk</h2>
      <p>The Member&rsquo;s questions may reveal an objection that the sponsor or client has not considered.</p>
      <p><strong>Listen for:</strong></p>
      <ul>
        <li>Whether the member understands the issue as framed.</li>
        <li>Which parts of the bill create hesitation.</li>
        <li>Whether a committee, agency, or constituency concern is driving the response.</li>
        <li>What kind of follow-up would move the conversation forward.</li>
      </ul>
      <p>Use those questions to revise the language, cost estimate, or explanation before the hearing.</p>

      <h2>Use The Meeting To Test The Bill</h2>
      <p>A short conversation can show that a proposal is too broad, too technical, or difficult to explain. Treat that response as information about the bill.</p>
      <p>An objection during the interim is easier to address than a problem raised in committee or on the floor. Revise early.</p>

      <h2>Follow Up With Purpose</h2>
      <p>Follow up promptly with the requested material and a clear restatement of the action sought.</p>
      <p><strong>A good follow-up usually includes:</strong></p>
      <ul>
        <li>A short thank-you note.</li>
        <li>Any promised materials.</li>
        <li>A clear restatement of the requested action.</li>
        <li>A timeline for the next step.</li>
      </ul>
      <p>The follow-up should let the Member and staff act without reconstructing the meeting from memory.</p>

      <h2>Keep the Meeting to One Job</h2>
      <p>A Member meeting does not need to resolve the whole issue. It should give the right person enough information to take the next requested step.</p>
    `,
  },

  {
    slug: "points-of-order-explained",
    title: "Points Of Order, Explained",
    lede: "A point of order asks whether the chamber has followed its rules. If sustained, it can stop or delay a bill regardless of the support for its policy.",
    summary:
      "What a point of order does, when it can threaten a bill or amendment, and how drafting and review reduce the risk.",
    category: "Procedure",
    article_label: "Article · Procedure",
    hero_image: "/assets/img/article-points-of-order.jpg",
    author: "Robert Haney",
    date_label: "Interim 2026",
    read_time: "5 min read",
    body_html: `
      <p>A point of order is a formal challenge under the chamber&rsquo;s rules. It can affect notice, germaneness, timing, drafting, or another required step. If the presiding officer sustains it, the bill or amendment may be delayed, changed, or stopped.</p>

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
      <p>The question is procedural, not whether the underlying policy is sound. Did the bill, amendment, committee report, or notice comply with the applicable rule?</p>
      <p><strong>When one is raised and sustained:</strong></p>
      <ul>
        <li>The bill or amendment may be delayed, amended, or removed from consideration.</li>
        <li>The chamber&rsquo;s attention shifts from substance to procedure.</li>
        <li>The operative language on the floor can change immediately.</li>
      </ul>
      <p>The policy may still have support, but the available vehicle or timing can change immediately.</p>

      <h2>When They Matter Most</h2>
      <p>Points of order matter most during floor debate, amendment consideration, and the final days when there may be no time to repair the problem.</p>
      <p><strong>They also matter when:</strong></p>
      <ul>
        <li>A bill has not been drafted carefully enough to comply with chamber rules.</li>
        <li>An amendment reaches beyond the bill&rsquo;s scope.</li>
        <li>Timing rules or notice requirements have not been satisfied.</li>
        <li>The chamber is close to a deadline and cannot easily recover lost time.</li>
      </ul>
      <p>A correct procedural objection can end that version of the proposal.</p>

      <h2>Why The Floor Changes</h2>
      <p>Once a point of order is sustained, the immediate question is what the rules allow next: delay, correction, substitution, or removal.</p>
      <p><strong>That change matters because it can:</strong></p>
      <ul>
        <li>Stop a bill midstream.</li>
        <li>Force a rewrite or substitute.</li>
        <li>Expose weaknesses that were not obvious during earlier stages.</li>
        <li>Signal to other members that the proposal may not be as ready as it appeared.</li>
      </ul>
      <p>It may also signal that the bill was not ready for the floor, which can affect later negotiations.</p>

      <h2>Why Drafting Matters</h2>
      <p>Many risks can be found before floor debate through careful drafting, committee-report review, and amendment analysis.</p>
      <p><strong>Good interim preparation reduces risk by:</strong></p>
      <ul>
        <li>Keeping language tightly tied to the bill&rsquo;s purpose.</li>
        <li>Checking for conflicts with chamber rules.</li>
        <li>Reviewing amendments before they reach the floor.</li>
        <li>Thinking ahead to likely objections rather than reacting to them later.</li>
      </ul>
      <p>The goal is a bill and record that comply with the rules when challenged.</p>

      <h2>Procedural Power</h2>
      <p>A point of order can stop the bill, force a rewrite, or change the negotiation. Review the procedural record and proposed amendments before the floor vote, when there is still time to address a problem.</p>
    `,
  },
];

export function getArticleBySlug(slug: string): InsightArticle | undefined {
  return insightArticles.find((a) => a.slug === slug);
}
