import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import {
  getServiceBySlug,
  serviceDetails,
} from "@/content/fallbacks/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
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
    alternates: { canonical: `/services/${service.slug}` },
  };
}

const capabilities = [
  { icon: "/assets/img/icon-legislative-strategy.png", title: "Legislative Strategy", body: "Translate a policy objective into a practical, member-by-member path through committee, calendar, floor, and conference." },
  { icon: "/assets/img/icon-lobbying-advocacy.png", title: "Lobbying & Advocacy", body: "Represent client interests at the Capitol with preparation, credibility, and direct communication grounded in long-standing member relationships." },
  { icon: "/assets/img/icon-bill-drafting.png", title: "Bill Drafting & Analysis", body: "Review, draft, and refine legislative language with close attention to process, timing, germaneness, and downstream risk." },
  { icon: "/assets/img/icon-appropriations.png", title: "Appropriations & Budget Riders", body: "Article and rider strategy, LBB engagement, agency coordination, and interim work where the state budget is actually decided." },
  { icon: "/assets/img/icon-procedural-2.png", title: "Parliamentary Procedure", body: "House Rules, points of order, amendments, germaneness, and floor process, advised by the firm’s former Chief Clerk of the Texas House." },
  { icon: "/assets/img/icon-coalitions.png", title: "Coalition & Stakeholder Management", body: "Build durable support, manage organized opposition, and align boards, members, and partners around achievable outcomes." },
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: `url('${service.hero_image}')` }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/services">Services</Link>
            <span className="sep">/</span>
            <span>{service.crumb}</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Practice Area · {service.number}
          </p>
          <h1 className="h1" id="ph-h1">
            {service.title}
          </h1>
          <p className="lede">{service.lede}</p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="prose">
            {service.body_sections.map((s) => (
              <div key={s.heading}>
                <h2>{s.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.html }} />
              </div>
            ))}

            <div className="illoblock">
              <img className="illoblock__img" src={service.illoblock.image} alt="" loading="lazy" />
              <p className="illoblock__text">
                <strong>{service.illoblock.lead}</strong>
                {service.illoblock.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="caps" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Related Capabilities</p>
            <h2 className="h2">The capabilities this practice draws on.</h2>
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
                <p>{cap.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
