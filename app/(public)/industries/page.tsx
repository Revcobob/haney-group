import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCTA } from "@/components/site/ClosingCTA";
import { getIndustryCards, getClientLogos } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Nine sectors where The Haney Group's Texas legislative and regulatory work is concentrated — and a trusted roster of associations, providers, and operators who rely on principal-level representation.",
  alternates: { canonical: "/industries" },
};

export default async function IndustriesPage() {
  const [industries, { logos, disclaimer }] = await Promise.all([
    getIndustryCards(),
    getClientLogos(),
  ]);
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
                  <p>{i.description}</p>
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
            {[...logos, ...logos].map((c, idx) => (
              <a
                key={`${c.client_name}-${idx}`}
                className="clientlogos__logo"
                href={c.website_url || "#"}
                target="_blank"
                rel="noopener"
                tabIndex={idx >= logos.length ? -1 : undefined}
                aria-hidden={idx >= logos.length ? true : undefined}
              >
                <img
                  src={c.logo}
                  alt={idx >= logos.length ? "" : c.alt_text}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
        <p className="clientlogos__note">{disclaimer}</p>
      </section>

      <ClosingCTA />
    </>
  );
}
