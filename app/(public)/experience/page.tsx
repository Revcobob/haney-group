import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { getExperienceItems } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Selected anonymized engagements: regulatory bills, Article II budget riders, preemption defense, permit reform, public-affairs programs, and parliamentary consults across the Texas Capitol.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const engagements = await getExperienceItems();
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
                  <img src={e.image} alt={e.image_alt} loading="lazy" />
                </div>
                <div className="tile__body">
                  <h3>{e.title}</h3>
                  <p>
                    <strong>{e.leading_line}</strong>
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
