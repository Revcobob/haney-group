import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { resolveMetadata } from "@/lib/content/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/about",
    fallback: {
      title: "About",
      description:
        "A senior-led Austin government relations firm built around procedural and budgetary fluency and disciplined communications. Led by Robert Haney, former Chief Clerk of the Texas House, and Julie Freeman Haney.",
    },
  });
}

export default function AboutPage() {
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/inline-80d647ef11.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>About</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            About the Firm
          </p>
          <h1 className="h1" id="ph-h1">
            A boutique firm built around procedural mastery and quiet results.
          </h1>
          <p className="lede">
            The Texas Capitol rewards a small number of disciplines: knowing the
            process, knowing the budget, knowing the people, and knowing how to
            talk about all three. The firm was built to keep those four
            disciplines in one room.
          </p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">The Firm</p>
            <h2 className="h2">A senior-led firm built around a deliberate combination.</h2>
          </div>
          <div className="firmintro__grid">
            <div className="firmintro__copy">
              <p>
                The Haney Group is a senior-led Austin government relations firm.
                We represent statewide associations, regulated companies, local
                governments, health care organizations, and policy nonprofits at
                the Texas Legislature and across the executive agencies that
                interpret what the Legislature passes.
              </p>
              <p>
                The combination is purposeful: the firm pairs{" "}
                <strong>procedural and budgetary fluency</strong> with the{" "}
                <strong>message discipline</strong> that decides how a bill is
                received, covered, and remembered.
              </p>
            </div>
            <div className="founders">
              <article className="founder">
                <h3 className="founder__name">Robert Haney</h3>
                <p className="founder__role">Former Chief Clerk, Texas House</p>
                <p className="founder__bio">
                  More than twenty-five years inside the Texas House of
                  Representatives, including service as Chief Clerk under five
                  Speakers across both parties.
                </p>
              </article>
              <article className="founder">
                <h3 className="founder__name">Julie Freeman Haney</h3>
                <p className="founder__role">Appropriations &amp; Communications</p>
                <p className="founder__bio">
                  Two decades of appropriations, communications, and chief-of-staff
                  experience on the legislative side, both in member offices and
                  senior committee roles.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="proofstrip" data-reveal aria-label="By the numbers">
        <div className="container">
          <div className="proofstrip__grid">
            <div>
              <div className="stat__num">40+ yrs</div>
              <div className="stat__label">
                Combined Texas Capitol experience.
              </div>
            </div>
            <div>
              <div className="stat__num">5</div>
              <div className="stat__label">
                Speakers under whom Robert served as Chief Clerk of the Texas
                House.
              </div>
            </div>
            <div>
              <div className="stat__num">20+ yrs</div>
              <div className="stat__label">
                Julie’s record in appropriations, chief-of-staff, and
                communications work.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="howwework" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">How we work</p>
            <h2 className="h2">Three principles that shape every engagement.</h2>
          </div>
          <div className="howwework__grid">
            <article className="principle">
              <p className="principle__num">01</p>
              <h3 className="principle__title">We do not start with a tactic.</h3>
              <p className="principle__body">
                We start with the question every legislator asks about an issue:
                who is for it, who is against it, where does it live, and what
                does it cost. Until those four questions have honest answers, no
                strategy can be trusted.
              </p>
            </article>
            <article className="principle">
              <p className="principle__num">02</p>
              <h3 className="principle__title">We tell clients the truth.</h3>
              <p className="principle__body">
                If your priority cannot be moved this session, we will say so,
                and tell you what the interim work looks like to give it a chance
                next time. If your bill is in trouble, we will tell you what it
                will take to save it, even if the answer is uncomfortable.
              </p>
            </article>
            <article className="principle">
              <p className="principle__num">03</p>
              <h3 className="principle__title">We work as principals.</h3>
              <p className="principle__body">
                The people you meet on the first call are the people who do your
                work. Robert and Julie are personally on every engagement.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="firm" data-reveal id="robert">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">The Principals</p>
            <h2 className="h2">Two careers, one Capitol.</h2>
          </div>

          <div className="peoplelist">
            <article className="person">
              <div className="person__portrait">
                <img
                  src="/assets/img/inline-634aab4058.jpg"
                  alt="Portrait of Robert Haney"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="person__name">Robert Haney</h3>
                <p className="person__role">
                  Principal · Former Chief Clerk, Texas House
                </p>
                <p className="person__bio">
                  Robert Haney worked inside the Texas House of Representatives
                  for more than twenty-five years. He served as Chief Clerk of
                  the Texas House under five different Speakers across both
                  parties — a level of bipartisan trust earned through
                  demonstrated competence on the floor.
                </p>
                <p className="person__bio">
                  As Chief Clerk, he managed the procedural backbone of every
                  bill the House considered: calendars, certifications, journals,
                  technology, and the rules under which Members debated. He led
                  the modernization of House operations, including the
                  transition to electronic bill filing, which retired a
                  century-old paper process.
                </p>
                <p className="person__bio">
                  Nationally, Robert served as President of the American Society
                  of Legislative Clerks and Secretaries (ASLCS), the
                  professional society of legislative procedural officers across
                  the United States. He continues to advise chambers nationwide
                  on modernization and parliamentary procedure.{" "}
                  <em>Texas Capitol Inside</em> named him a Rising Star in 2023.
                </p>
                <p className="person__quote">
                  “Most of what looks like influence in a session is actually
                  preparation done six months earlier. Our job is to be six
                  months earlier than the people across the table.”
                </p>
                <a
                  className="linkarrow"
                  href="https://www.linkedin.com/"
                  rel="noopener"
                >
                  LinkedIn{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>

            <article className="person" id="julie">
              <div className="person__portrait">
                <img
                  src="/assets/img/inline-fab1dc790d.jpg"
                  alt="Portrait of Julie Freeman Haney"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="person__name">Julie Freeman Haney</h3>
                <p className="person__role">
                  Principal · Appropriations &amp; Communications
                </p>
                <p className="person__bio">
                  Julie Freeman Haney built two decades of Texas politics on the
                  appropriations and communications sides of the Capitol. She
                  served as an aide to the Chair of the House Appropriations
                  Committee and later as chief of staff to a state legislator,
                  work that put her in the room for the trade-offs that define a
                  budget cycle.
                </p>
                <p className="person__bio">
                  In communications, she has led message development and
                  legislative communication for clients whose issues had to land
                  at the Capitol and at the board table in the same week. Her
                  work spans crisis posture, talking points, board briefings,
                  and reputation strengthening with officeholders.
                </p>
                <p className="person__bio">
                  Julie advises clients on what to say, when to say it, and to
                  whom — and on the harder discipline of what not to say in the
                  middle of a session that is still being written.
                </p>
                <p className="person__quote">
                  “The same fact can land three different ways depending on who
                  is hearing it. Our job is to know who is hearing it and to
                  make sure it lands the right way.”
                </p>
                <a
                  className="linkarrow"
                  href="https://www.linkedin.com/"
                  rel="noopener"
                >
                  LinkedIn{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
