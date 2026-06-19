import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { getServiceCards } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six capabilities and four specialized practice areas — legislative strategy, appropriations, public affairs, and parliamentary procedure — for organizations whose Texas priorities cannot afford to be misunderstood.",
  alternates: { canonical: "/services" },
};

const practiceAreas = [
  {
    href: "/services/legislative-strategy",
    icon: "/assets/img/icon-legislative-strategy.png",
    title: "Legislative Strategy",
    body: "Read the calendar, map the path, time the engagement. The work that decides whether a bill moves.",
  },
  {
    href: "/services/appropriations",
    icon: "/assets/img/icon-appropriations.png",
    title: "Appropriations & Riders",
    body: "Article posture, rider language, LBB engagement, and interim work that protects funding cycle to cycle.",
  },
  {
    href: "/services/public-affairs",
    icon: "/assets/img/icon-public-affairs.png",
    title: "Public Affairs",
    body: "Message development, media posture, and board-ready communications for clients whose issues are public.",
  },
  {
    href: "/services/parliamentary",
    icon: "/assets/img/icon-procedural-2.png",
    title: "Parliamentary Procedure",
    body: "The institutional advisory practice. House Rules, modernization, and procedural counsel to legislatures.",
  },
];

export default async function ServicesPage() {
  const capabilities = await getServiceCards();
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/services-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Services</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Services
          </p>
          <h1 className="h1" id="ph-h1">
            Services built around how Texas policy actually moves.
          </h1>
          <p className="lede">
            Six capabilities and four specialized practice areas, organized for
            the way the Legislature, the appropriations process, the executive
            agencies, and the press cycle interact during a session.
          </p>
        </div>
      </section>

      <section className="caps" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Capabilities</p>
            <h2 className="h2">
              Six capabilities, organized around how policy gets made.
            </h2>
          </div>
          <div className="caps__grid">
            {capabilities.map((cap) => (
              <article key={cap.title} className="cap">
                <img
                  className="cap__icon"
                  src={cap.icon}
                  alt=""
                  loading="lazy"
                  width={480}
                  height={480}
                />
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="srbreak" aria-labelledby="srbreak-h" data-reveal>
        <div className="container">
          <div className="srbreak__inner">
            <figure className="srbreak__media">
              <img
                src="/assets/img/banner-services-page.png"
                alt="Professionals in conversation at a conference table"
                loading="lazy"
                width={1600}
                height={686}
              />
            </figure>
            <div className="srbreak__copy">
              <p className="eyebrow">Senior-Level Representation</p>
              <h2 id="srbreak-h">
                Experienced representation when the process starts moving.
              </h2>
              <p>
                The Haney Group provides direct principal-level guidance through
                the legislative, appropriations, and procedural decisions that
                shape outcomes. We help clients prepare early, navigate key
                decision points, and execute with discipline when timing matters.
              </p>
              <div className="srbreak__cta">
                <Link className="btn btn--primary" href="/contact">
                  Discuss Your Legislative Strategy{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="approach" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Practice Areas</p>
            <h2 className="h2">Four practice areas, each led by a principal.</h2>
          </div>
          <div className="tilegrid">
            {practiceAreas.map((p) => (
              <Link key={p.href} className="tile" href={p.href}>
                <img
                  className="tile__icon"
                  src={p.icon}
                  alt=""
                  loading="lazy"
                  width={480}
                  height={480}
                />
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span className="tile__more">
                  Read more{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
