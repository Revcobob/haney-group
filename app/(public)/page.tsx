import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ===================== Hero ===================== */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="hero__bg" aria-hidden="true"></div>
        <div className="container">
          <div className="hero__inner" data-reveal>
            <div className="hero__copy">
              <p className="eyebrow" style={{ marginBottom: 22 }}>
                Texas Government Relations · Est. Austin
              </p>
              <h1 className="h1" id="hero-h1">
                Strategic government relations for complex Texas policy challenges.
              </h1>
              <p className="lede hero__sub">
                The Haney Group helps clients navigate the Texas Capitol with
                legislative strategy, procedural expertise, appropriations
                knowledge, and disciplined advocacy. Senior-led representation for
                the priorities that cannot afford to be misunderstood.
              </p>
              <div className="hero__ctas">
                <Link className="btn btn--primary" href="/contact">
                  Schedule a Consultation
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <Link className="btn btn--ghost" href="/services">
                  Explore Our Services
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>

              <div className="hero__meta">
                <div className="bar" aria-hidden="true"></div>
                <p>
                  Led by <strong>Robert Haney</strong>, former Chief Clerk of the
                  Texas House of Representatives, and{" "}
                  <strong>Julie Freeman Haney</strong>, senior appropriations and
                  communications strategist.{" "}
                  <Link className="linkarrow" href="/about" style={{ marginLeft: 4 }}>
                    Meet the principals{" "}
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="hero__credit" aria-hidden="true">
          Texas State Capitol · Austin
        </span>
      </section>

      {/* ===================== Problem framing ===================== */}
      <section className="problem" data-reveal>
        <div className="container">
          <div className="problem__inner">
            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                The Challenge
              </p>
              <h2 className="h2">
                The legislative process is complex. Your strategy should not be.
              </h2>
            </div>
            <div>
              <p className="body">
                Clients come to The Haney Group when the stakes are high, the
                process is complicated, and timing matters. We help organizations
                understand the legislative landscape, prepare a defensible policy
                position, identify the right path forward, and execute with
                discipline from interim planning through session deadlines.
              </p>
              <p className="body">
                We do not promise access. We deliver judgment, preparation, and
                clear communication, grounded in decades of work inside the Texas
                Capitol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Capabilities ===================== */}
      <section className="caps" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">What We Do</p>
            <h2 className="h2">
              Six capabilities, organized around how Texas policy actually gets
              made.
            </h2>
          </div>

          <div className="caps__grid">
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-legislative-strategy.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Legislative Strategy</h3>
              <p>
                Translate a policy objective into a practical, member-by-member
                path through committee, calendar, floor, and conference.
              </p>
            </article>
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-lobbying-advocacy.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Lobbying &amp; Advocacy</h3>
              <p>
                Represent client interests at the Capitol with preparation,
                credibility, and direct communication grounded in long-standing
                member relationships.
              </p>
            </article>
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-bill-drafting.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Bill Drafting &amp; Analysis</h3>
              <p>
                Review, draft, and refine legislative language with close
                attention to process, timing, germaneness, and downstream risk.
              </p>
            </article>
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-appropriations.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Appropriations &amp; Budget Riders</h3>
              <p>
                Article and rider strategy, LBB engagement, agency coordination,
                and interim work where the state budget is actually decided.
              </p>
            </article>
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-procedural-2.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Parliamentary Procedure</h3>
              <p>
                House Rules, points of order, amendments, germaneness, and floor
                process, advised by the firm’s former Chief Clerk of the Texas
                House.
              </p>
            </article>
            <article className="cap">
              <img
                className="cap__icon"
                src="/assets/img/icon-coalitions.png"
                alt=""
                loading="lazy"
                width={480}
                height={480}
              />
              <h3>Coalition &amp; Stakeholder Management</h3>
              <p>
                Build durable support, manage organized opposition, and align
                boards, members, and partners around achievable outcomes.
              </p>
            </article>
          </div>

          <div className="caps__foot">
            <Link className="linkarrow" href="/services">
              View all services{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== Process break ===================== */}
      <section className="processbreak" aria-labelledby="processbreak-h2" data-reveal>
        <div className="container processbreak__inner">
          <div className="processbreak__media">
            <img
              src="/assets/img/inline-d0832550da.jpg"
              alt="Professionals in conversation inside a Capitol-style hallway"
              loading="lazy"
            />
          </div>
          <div className="processbreak__copy">
            <p className="eyebrow">Inside The Process</p>
            <h2 id="processbreak-h2">Strategy is built before the vote is taken.</h2>
            <p>
              From bill drafting and budget riders to author strategy, committee
              movement, and floor procedure, The Haney Group helps clients
              prepare for the moments when timing, judgment, and process matter
              most.
            </p>
            <Link className="btn btn--primary processbreak__cta" href="/contact">
              Discuss Your Legislative Strategy
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== Credibility / proof ===================== */}
      <section className="proof" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Why Clients Choose Us</p>
            <h2 className="h2">
              Experience matters when the process moves quickly.
            </h2>
          </div>

          <div className="proof__grid">
            <div className="proof__item">
              <img
                className="proof__illo"
                src="/assets/img/inline-7589971e7e.png"
                alt=""
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Texas Capitol Experience</h3>
              <p>
                Decades of hands-on legislative experience inside and around the
                Texas Capitol, across multiple sessions and Speakers.
              </p>
            </div>
            <div className="proof__item">
              <img
                className="proof__illo"
                src="/assets/img/inline-86b56cc282.png"
                alt=""
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Procedural Judgment</h3>
              <p>
                Practical understanding of House Rules, committee process,
                amendments, deadlines, and the floor procedure that decides
                outcomes.
              </p>
            </div>
            <div className="proof__item">
              <img
                className="proof__illo"
                src="/assets/img/inline-425e9a13a6.png"
                alt=""
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Appropriations Knowledge</h3>
              <p>
                Strategic guidance on budget riders, funding requests, and the
                realities of how Article II and Article III actually move.
              </p>
            </div>
            <div className="proof__item">
              <img
                className="proof__illo"
                src="/assets/img/inline-1ec1420b3e.png"
                alt=""
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Client-Focused Execution</h3>
              <p>
                Clear communication, preparation, and follow-through from interim
                planning to sine die, briefed for boards and members alike.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Approach ===================== */}
      <section className="approach" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">How We Work</p>
            <h2 className="h2">A disciplined approach to legislative strategy.</h2>
          </div>

          <div className="approach__grid">
            <article className="step">
              <img
                className="step__illo"
                src="/assets/img/inline-835345f38e.png"
                alt="Step 1"
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Understand the Objective</h3>
              <p>
                Clarify the client’s policy, funding, regulatory, or legislative
                goal, and the constraints that surround it.
              </p>
            </article>
            <article className="step">
              <img
                className="step__illo"
                src="/assets/img/inline-abdda0b7c7.png"
                alt="Step 2"
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Map the Process</h3>
              <p>
                Identify deadlines, committees, authors, stakeholders, procedural
                risks, and the viable paths forward.
              </p>
            </article>
            <article className="step">
              <img
                className="step__illo"
                src="/assets/img/inline-73a36ce4aa.png"
                alt="Step 3"
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Build the Strategy</h3>
              <p>
                Prepare messaging, bill language, budget posture, coalition
                support, and an engagement plan tied to the calendar.
              </p>
            </article>
            <article className="step">
              <img
                className="step__illo"
                src="/assets/img/inline-1c2fbe3ffe.png"
                alt="Step 4"
                width={320}
                height={320}
                loading="lazy"
              />
              <h3>Execute with Discipline</h3>
              <p>
                Track movement, communicate clearly, adjust quickly, and stay
                focused on the result the client engaged us to deliver.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== Principals ===================== */}
      <section className="firm" data-reveal>
        <div className="container">
          <div className="firm__top">
            <p className="eyebrow">The Principals</p>
            <h2 className="h2">
              Proven expertise. Focused results. Unmatched influence.
            </h2>
            <p className="lede">
              The Haney Group is intentionally senior-led. Clients work directly
              with principals who bring more than 40 years of combined Texas
              Capitol experience to legislative strategy, parliamentary procedure,
              and disciplined communication.
            </p>
          </div>

          <div className="principals__grid">
            <article className="principal">
              <div className="principal__portrait">
                <img
                  src="/assets/img/inline-634aab4058.jpg"
                  alt="Portrait of Robert Haney"
                  width={768}
                  height={768}
                  loading="lazy"
                />
              </div>
              <h3 className="principal__name">Robert Haney</h3>
              <p className="principal__role">
                Principal · Former Chief Clerk, Texas House
              </p>
              <p className="principal__bio">
                Twenty-five years inside the Texas House of Representatives,
                including service as Chief Clerk under five Speakers. From the
                rostrum he managed calendars, certified votes, and oversaw the
                procedural backbone that thousands of bills moved through. Past
                President of the American Society of Legislative Clerks and
                Secretaries and a nationally recognized parliamentary expert.
              </p>
              <Link className="linkarrow principal__link" href="/about#robert">
                Read Robert’s full biography{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>

            <article className="principal">
              <div className="principal__portrait">
                <img
                  src="/assets/img/inline-fab1dc790d.jpg"
                  alt="Portrait of Julie Freeman Haney"
                  width={531}
                  height={531}
                  loading="lazy"
                />
              </div>
              <h3 className="principal__name">Julie Freeman Haney</h3>
              <p className="principal__role">
                Principal · Appropriations &amp; Communications
              </p>
              <p className="principal__bio">
                Two decades of Texas legislative and public-relations experience,
                built as an aide to the House Appropriations Chair, as chief of
                staff to a state legislator, and across communications engagements
                where client priorities had to land at the Capitol and at the
                board table in the same week. Specializes in message development
                and legislative communication.
              </p>
              <Link className="linkarrow principal__link" href="/about#julie">
                Read Julie’s full biography{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ===================== Issues / client experience ===================== */}
      <section className="issues" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Experience</p>
            <h2 className="h2">Experience across the issues that shape Texas.</h2>
            <p className="lede" style={{ marginTop: 0 }}>
              Our work spans the sectors where Texas policy is most actively
              contested, for corporate clients, statewide associations, public
              entities, and policy organizations.
            </p>
          </div>

          <div className="issues__grid">
            {[
              ["Healthcare", "Managed care, hospitals, physician groups, and Medicaid policy."],
              ["Local Government", "Cities, counties, special districts, and preemption defense."],
              [
                "Infrastructure & Water",
                "Capital appropriations, permitting, and the regulators of the next decade.",
              ],
              [
                "Real Estate & Land Use",
                "Property rights, housing policy, and association-led advocacy.",
              ],
              [
                "Economic Development",
                "Incentive programs, regional priorities, and statewide growth policy.",
              ],
              [
                "Regulated Industries",
                "High-visibility issues that turn on member relationships and disciplined communications.",
              ],
              [
                "Appropriations",
                "Article and rider strategy across state agency budgets and interim charges.",
              ],
              [
                "Public Policy & Procedure",
                "Associations, coalitions, and policy organizations preparing for session.",
              ],
            ].map(([title, body]) => (
              <Link key={title} className="issue" href="/industries">
                <span className="issue__mark" aria-hidden="true"></span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </Link>
            ))}
          </div>

          <blockquote className="issues__quote">
            <p>
              “When the calendar tightened and the bill we had been working on
              for a year was suddenly in play, The Haney Group did not flinch.
              They told us what to do, who to call, and what to say. And they
              were right on every count.”
            </p>
            <cite>General Counsel · Statewide Trade Association</cite>
          </blockquote>
        </div>
      </section>

      {/* ===================== Insights ===================== */}
      <section className="insights" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Insights</p>
            <h2 className="h2">
              Legislative perspective for clients preparing ahead.
            </h2>
            <p className="lede" style={{ marginTop: 0 }}>
              The Session Briefing is a candid read on what moved at the Texas
              Capitol, written by the firm during session and monthly during
              interim.
            </p>
          </div>

          <div className="insights__grid">
            <Link className="insight" href="/insights">
              <div className="insight__band" aria-hidden="true">
                <img
                  src="/assets/img/inline-9e9828773d.jpg"
                  alt=""
                  width={768}
                  height={768}
                  loading="lazy"
                />
              </div>
              <div className="insight__body">
                <p className="insight__meta">Article · Interim</p>
                <h3>Preparing Early for the Next Legislative Session</h3>
                <p>
                  The work that decides session outcomes happens long before
                  opening day. A practical framework for interim preparation.
                </p>
              </div>
            </Link>
            <Link className="insight" href="/insights">
              <div className="insight__band" aria-hidden="true">
                <img
                  src="/assets/img/inline-1367b1c67c.jpg"
                  alt=""
                  width={768}
                  height={768}
                  loading="lazy"
                />
              </div>
              <div className="insight__body">
                <p className="insight__meta">Article · Appropriations</p>
                <h3>What Makes a Budget Rider Viable</h3>
                <p>
                  Most riders that survive conference look obvious in retrospect.
                  A close read of what distinguishes durable language from
                  short-lived language.
                </p>
              </div>
            </Link>
            <Link className="insight" href="/insights">
              <div className="insight__band" aria-hidden="true">
                <img
                  src="/assets/img/inline-e97cb4df21.jpg"
                  alt=""
                  width={349}
                  height={349}
                  loading="lazy"
                />
              </div>
              <div className="insight__body">
                <p className="insight__meta">Article · Procedure</p>
                <h3>Why Legislative Timing Matters</h3>
                <p>
                  Calendars, deadlines, and the difference between a bill that
                  moves and a bill that waits.
                </p>
              </div>
            </Link>
          </div>

          <div className="insights__foot">
            <Link className="linkarrow" href="/insights">
              See all insights{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== Closing CTA ===================== */}
      <section className="closing" data-reveal>
        <div className="container">
          <div className="closing__inner">
            <div>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                Contact
              </p>
              <h2 className="h2">Preparing for the next legislative session?</h2>
            </div>
            <div>
              <p>
                Start early, with a strategy grounded in experience, timing, and
                practical knowledge of the Texas legislative process. Every
                engagement begins with a short, confidential conversation.
              </p>
              <div className="closing__ctas" style={{ marginTop: 28 }}>
                <Link className="btn btn--primary" href="/contact">
                  Contact The Haney Group{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
                <a className="btn btn--ghost" href="tel:+15129255000">
                  Or call (512) 925-5000
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
