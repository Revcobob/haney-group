import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Nine sectors where The Haney Group's Texas legislative and regulatory work is concentrated — and a trusted roster of associations, providers, and operators who rely on principal-level representation.",
  alternates: { canonical: "/industries" },
};

const industries = [
  {
    image: "/assets/img/card-healthcare-policy.png",
    title: "Healthcare",
    body: "Managed care, hospitals, physician groups, and Medicaid policy. The firm supports clients across health care reimbursement, scope of practice, and access policy.",
  },
  {
    image: "/assets/img/card-local-government.png",
    title: "Local Government",
    body: "Cities, counties, special districts, and the recurring preemption questions that shape what local entities can and cannot do.",
  },
  {
    image: "/assets/img/card-infrastructrure-water.png",
    title: "Infrastructure & Water",
    body: "Capital appropriations, permitting, and the regulators of the next decade. Long-cycle issues that require interim and session work in equal measure.",
  },
  {
    image: "/assets/img/card-real-estate-land.png",
    title: "Real Estate & Land Use",
    body: "Property rights, housing policy, and association-led advocacy. Sector posture that has to balance member alignment with achievable legislation.",
  },
  {
    image: "/assets/img/card-economic-development.png",
    title: "Economic Development",
    body: "Incentive programs, regional priorities, and statewide growth policy. Including the interim work that determines what is even introduced.",
  },
  {
    image: "/assets/img/card-regulated-industries.png",
    title: "Regulated Industries",
    body: "High-visibility issues that turn on member relationships and disciplined communications across the session arc.",
  },
  {
    image: "/assets/img/card-education.png",
    title: "Education",
    body: "Higher education, public schools, and the budget riders that decide policy in practice. Communications discipline for issues that arrive with public attention.",
  },
  {
    image: "/assets/img/card-public-policy.png",
    title: "Public Policy & Procedure",
    body: "Associations, coalitions, and policy organizations preparing for session — and for institutional process work on how chambers operate.",
  },
  {
    image: "/assets/img/card-transportation.png",
    title: "Transportation",
    body: "Transportation issues across the Capitol and the agencies that implement them, including funding, automobiles, infrastructure, and commuter rail.",
  },
];

const clientLogos = [
  { name: "BlueCross BlueShield of Texas", url: "https://www.bcbstx.com", logo: "/assets/img/blue-cross-blue-shield-texas-logo.jpg" },
  { name: "Superior HealthPlan", url: "https://www.superiorhealthplan.com", logo: "/assets/img/superior.jpg" },
  { name: "Texas Managed Care Alliance", url: "https://www.texasmanagedcarealliance.org", logo: "/assets/img/managed health care alliance.webp" },
  { name: "Texas REALTORS", url: "https://www.texasrealestate.com", logo: "/assets/img/TRA logo.png" },
  { name: "Wholesale Beer Distributors of Texas", url: "https://www.wbdt.com", logo: "/assets/img/Beer Distrib logo.png" },
  { name: "Sports Betting Alliance", url: "https://www.sportsbettingalliance.org", logo: "/assets/img/Sports-Betting-Alliance_color.webp" },
  { name: "Trinity Metro", url: "https://www.ridetrinitymetro.org", logo: "/assets/img/Trinity_Metro_Logo.png" },
  { name: "Reagan Outdoor Advertising", url: "https://www.reaganoutdoor.com", logo: "/assets/img/ReaganLogo_NEW-1_.png" },
  { name: "Hill Country Alliance", url: "https://www.hillcountryalliance.org", logo: "/assets/img/hillcountryalliance-300x300.png" },
  { name: "Wood County Health Care", url: "https://www.wchcf.org", logo: "/assets/img/wood county health care.jpg" },
];

export default function IndustriesPage() {
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/clients-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Clients</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Clients
          </p>
          <h1 className="h1" id="ph-h1">
            Industries we serve.
          </h1>
          <p className="lede">
            The firm represents organizations whose Texas priorities cannot
            afford to be misunderstood — nine sectors where our work is
            concentrated, and a trusted roster of associations, providers, and
            operators who rely on principal-level representation when the stakes
            are real.
          </p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="tilegrid">
            {industries.map((i) => (
              <article key={i.title} className="tile tile--banner tile--illo">
                <div className="tile__banner">
                  <img src={i.image} alt="" loading="lazy" width={960} height={540} />
                </div>
                <div className="tile__body">
                  <h3>{i.title}</h3>
                  <p>{i.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="clientlogos" data-reveal aria-label="Selected clients">
        <div className="clientlogos__head">
          <p className="eyebrow">Selected Clients</p>
          <h2>Trusted by associations, providers, and operators across Texas.</h2>
        </div>
        <div className="clientlogos__viewport">
          <div className="clientlogos__track">
            {[...clientLogos, ...clientLogos].map((c, idx) => (
              <a
                key={`${c.name}-${idx}`}
                className="clientlogos__logo"
                href={c.url}
                target="_blank"
                rel="noopener"
                tabIndex={idx >= clientLogos.length ? -1 : undefined}
                aria-hidden={idx >= clientLogos.length ? true : undefined}
              >
                <img
                  src={c.logo}
                  alt={idx >= clientLogos.length ? "" : c.name}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
        <p className="clientlogos__note">
          A representative selection of current and past clients. Used with
          permission where required.
        </p>
      </section>

      <ClosingCTA />
    </>
  );
}
