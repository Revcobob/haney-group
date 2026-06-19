import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Selected anonymized engagements: regulatory bills, Article II budget riders, preemption defense, permit reform, public-affairs programs, and parliamentary consults across the Texas Capitol.",
  alternates: { canonical: "/experience" },
};

const engagements = [
  {
    image: "/assets/img/inline-ff26d8af66.jpg",
    alt: "Member-by-member outreach at the Texas Capitol",
    title: "Statewide trade association",
    leading: "Regulatory bill, Senate-side push.",
    body: " Brought in late session when a long-shaped regulatory bill suddenly moved on the Senate side. We provided procedural counsel, member-by-member outreach plan, and a coordinated communications posture for the board. The bill was held in conference and amended in line with the client position.",
  },
  {
    image: "/assets/img/inline-9ecb5b5fee.jpg",
    alt: "Appropriations and budget rider work at the Texas Capitol",
    title: "Health care system",
    leading: "Article II budget rider, interim through session.",
    body: " Eighteen months of interim preparation across LBB, agency, and member staff resulted in a rider that survived conference. The client received the funding posture it needed without becoming the public face of the appropriations debate.",
  },
  {
    image: "/assets/img/inline-9a3ed06a64.jpg",
    alt: "Coalition meeting in a boardroom",
    title: "Local government coalition",
    leading: "Preemption defense across two sessions.",
    body: " A coalition of cities facing repeat preemption efforts engaged the firm for procedural strategy and message development. Outcome was a coordinated defense across two sessions and a narrower bill than the original draft.",
  },
  {
    image: "/assets/img/inline-7b2605a7a1.jpg",
    alt: "Strategy session at the chamber",
    title: "Energy infrastructure client",
    leading: "Permit reform, executive agency posture.",
    body: " Strategy and posture for a permit reform package, with significant executive agency engagement during interim. The package emerged from session with the structural changes the client needed and without the regulatory surprises competing proposals carried.",
  },
  {
    image: "/assets/img/inline-7ae05594c5.jpg",
    alt: "Drafting review across the table",
    title: "Policy nonprofit",
    leading: "Public affairs program, contested issue.",
    body: " Year-round message discipline, board readiness, op-ed strategy, and rapid response to opposition framing. The client became the credible voice on its issue at the Capitol and in the press.",
  },
  {
    image: "/assets/img/inline-c2276af506.jpg",
    alt: "Senate chamber discussion",
    title: "Professional association",
    leading: "Parliamentary consult, chamber modernization.",
    body: " A statewide professional association needed counsel on how to advocate for legislative process changes. The firm provided parliamentary background, comparative state research, and member-by-member discussion guides.",
  },
];

export default function ExperiencePage() {
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/experience2-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Experience</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Experience
          </p>
          <h1 className="h1" id="ph-h1">
            Selected engagements.
          </h1>
          <p className="lede">
            Anonymized work across the issues that shape Texas — for trade
            associations, public entities, regulated companies, health systems,
            and policy organizations. Specifics on request under a confidential
            conversation.
          </p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="tilegrid">
            {engagements.map((e) => (
              <article key={e.title} className="tile tile--banner">
                <div className="tile__banner">
                  <img src={e.image} alt={e.alt} loading="lazy" />
                </div>
                <div className="tile__body">
                  <h3>{e.title}</h3>
                  <p>
                    <strong>{e.leading}</strong>
                    {e.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <blockquote className="issues__quote" style={{ marginTop: 64 }}>
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

      <ClosingCTA />
    </>
  );
}
