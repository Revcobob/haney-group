import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import {
  getServiceBySlug,
  serviceDetails,
} from "@/content/fallbacks/services";
import { blurProps } from "@/lib/images";

export const dynamicParams = false;

const servicePresentation: Record<
  string,
  { focus: string; outputs: string[] }
> = {
  "legislative-strategy": {
    focus: "Bills, amendments, committee and floor strategy",
    outputs: [
      "Bill and amendment drafts",
      "Committee referral and hearing preparation",
      "Member and staff briefing materials",
      "Vote counts and stakeholder plans",
      "Calendar, floor, and conference strategy",
    ],
  },
  appropriations: {
    focus: "State budget requests and rider language",
    outputs: [
      "Budget request and article strategy",
      "Rider and contingency language",
      "LBB and agency briefing materials",
      "Cost and implementation analysis",
      "House, Senate, and conference preparation",
    ],
  },
  "public-affairs": {
    focus: "Public issues before the Legislature, boards, and media",
    outputs: [
      "Legislative message and talking points",
      "Executive and board briefings",
      "Media statements and response plans",
      "Questions and answers for principals",
      "Stakeholder communication plans",
    ],
  },
  parliamentary: {
    focus: "Rules, chamber operations, and floor procedure",
    outputs: [
      "Points-of-order analysis",
      "Germaneness and amendment review",
      "Rules and procedure memoranda",
      "Chamber operations advice",
      "Board and executive training",
    ],
  },
};

const legislativeDocket = [
  {
    number: "01",
    stage: "Objective and drafting",
    detail:
      "Define the objective, draft the operative language, and test legal and procedural risk.",
  },
  {
    number: "02",
    stage: "Author strategy",
    detail:
      "Identify the Member best positioned to file, explain, and defend the bill.",
  },
  {
    number: "03",
    stage: "Committee referral",
    detail:
      "Assess jurisdiction, likely referral, and any fiscal note or agency issues.",
  },
  {
    number: "04",
    stage: "Hearing and committee action",
    detail:
      "Prepare testimony, witnesses, Member questions, and the committee substitute or amendments.",
  },
  {
    number: "05",
    stage: "Calendars Committee",
    detail:
      "Track the committee report, placement, posting deadlines, and opposition before floor action.",
  },
  {
    number: "06",
    stage: "Floor action",
    detail:
      "Prepare amendments, germaneness and points-of-order analysis, vote strategy, and responses for debate.",
  },
  {
    number: "07",
    stage: "Conference or concurrence",
    detail:
      "Protect the client’s position through concurrence or the conference committee process.",
  },
  {
    number: "08",
    stage: "Governor action",
    detail:
      "Plan for enrollment, agency input, signing or veto decisions, and implementation.",
  },
];

export function generateStaticParams() {
  return serviceDetails.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.crumb,
    description: service.lede,
    alternates: { canonical: "/services/" + service.slug },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const presentation = servicePresentation[service.slug];
  const relatedServices = serviceDetails
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <section className="service-hero" aria-labelledby="service-hero-title">
        <div className="container service-hero__grid">
          <div className="service-hero__copy">
            <p className="service-hero__crumbs">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href="/services">Services</Link>
              <span className="sep">/</span>
              <span>{service.crumb}</span>
            </p>
            <p className="eyebrow">Practice Area · {service.number}</p>
            <h1 className="h1" id="service-hero-title">
              {service.title}
            </h1>
            <p className="lede">{service.lede}</p>

            <dl className="service-hero__meta">
              <div>
                <dt>Practice</dt>
                <dd>{service.crumb}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>{presentation.focus}</dd>
              </div>
              <div>
                <dt>Counsel</dt>
                <dd>Direct principal involvement</dd>
              </div>
            </dl>
          </div>

          <figure className="service-hero__media" aria-hidden="true">
            <Image
              src={service.hero_image}
              {...blurProps(service.hero_image)}
              alt=""
              fill
              priority
              sizes="(max-width: 820px) 100vw, 38vw"
              style={
                service.hero_object_position
                  ? { objectPosition: service.hero_object_position }
                  : undefined
              }
            />
          </figure>
        </div>
      </section>

      <section className="service-brief" data-reveal>
        <div className="container service-brief__grid">
          <article className="prose service-brief__body">
            <p className="service-brief__label">Service brief · {service.number}</p>
            {service.body_sections.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: section.html }} />
              </div>
            ))}

            <div className="illoblock service-brief__note">
              <Image
                className="illoblock__img"
                src={service.illoblock.image}
                alt=""
                width={96}
                height={96}
              />
              <p className="illoblock__text">
                <strong>{service.illoblock.lead}</strong>{" "}
                {service.illoblock.body}
              </p>
            </div>
          </article>

          <aside className="in-practice" aria-labelledby="in-practice-title">
            <p className="in-practice__label">Working documents</p>
            <h2 id="in-practice-title">In practice</h2>
            <ul>
              {presentation.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {service.slug === "legislative-strategy" ? (
        <section
          className="legislative-docket"
          aria-labelledby="docket-title"
          data-reveal
        >
          <div className="container">
            <div className="legislative-docket__head">
              <div>
                <p className="eyebrow">Legislative Path Docket</p>
                <h2 className="h2" id="docket-title">
                  The route from draft to law.
                </h2>
              </div>
              <p>
                Open a stage to see the work behind it. The route changes with
                the bill, the chamber, and the calendar.
              </p>
            </div>
            <ol className="legislative-docket__list">
              {legislativeDocket.map((item) => (
                <li key={item.number}>
                  <details>
                    <summary>
                      <span className="legislative-docket__number">
                        {item.number}
                      </span>
                      <strong>{item.stage}</strong>
                      <span className="legislative-docket__toggle" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p>{item.detail}</p>
                  </details>
                </li>
              ))}
            </ol>
            <p className="legislative-docket__disclaimer">
              <strong>Procedural note.</strong> This is a common path, not a
              promise of sequence or result. Routes vary by bill, chamber,
              referral, deadline, and procedural posture.
            </p>
          </div>
        </section>
      ) : null}

      <section className="service-related" aria-labelledby="related-title" data-reveal>
        <div className="container">
          <div className="service-related__head">
            <p className="eyebrow">Related services</p>
            <h2 className="h2" id="related-title">
              Other work that may matter.
            </h2>
          </div>
          <div className="service-related__list">
            {relatedServices.map((item) => (
              <Link
                className="service-related__item"
                href={"/services/" + item.slug}
                key={item.slug}
              >
                <span className="service-related__number">{item.number}</span>
                <span>
                  <strong>{item.crumb}</strong>
                  <small>{item.lede}</small>
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
