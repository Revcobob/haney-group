import Link from "next/link";
import { EditableRegion } from "./EditableRegion";
import type {
  PageHeroContent,
  RichTextBlockContent,
  HtmlBlockContent,
  StatStripContent,
  PrinciplesGridContent,
  FirmIntroContent,
  PersonBioContent,
  ClientLogosStripContent,
  ContactLeftColContent,
  ContactRightColContent,
  QuoteCardContent,
} from "@/lib/sections/types";
import type { PageSection } from "@/lib/content/pages";

// Generic wrapper that adds click-to-edit affordances when the page is
// loaded inside the visual editor iframe (?edit=1). A no-op in normal
// public rendering.
export function Region({
  sectionKey,
  sectionLabel,
  children,
}: {
  sectionKey: string;
  sectionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <EditableRegion sectionKey={sectionKey} sectionLabel={sectionLabel}>
      {children}
    </EditableRegion>
  );
}

export function PageHeroBlock({ s, c }: { s: PageSection; c: PageHeroContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="pagehero pagehero--photo" aria-labelledby={`hero-${s.section_key}`}>
        <div
          className="pagehero__bg"
          style={
            c.background_image_url
              ? { backgroundImage: `url('${c.background_image_url}')` }
              : undefined
          }
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>{c.crumb_label}</span>
          </p>
          {c.eyebrow ? (
            <p className="eyebrow" style={{ marginBottom: 22 }}>
              {c.eyebrow}
            </p>
          ) : null}
          <h1 className="h1" id={`hero-${s.section_key}`}>
            {c.headline}
          </h1>
          {c.lede ? <p className="lede">{c.lede}</p> : null}
        </div>
      </section>
    </Region>
  );
}

export function RichTextBlock({ s, c }: { s: PageSection; c: RichTextBlockContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section data-reveal>
        <div className="container">
          <div className="section__head">
            {c.eyebrow ? <p className="eyebrow">{c.eyebrow}</p> : null}
            {c.heading ? <h2 className="h2">{c.heading}</h2> : null}
          </div>
          {c.body_paragraphs.length > 0 ? (
            <div className="prose">
              {c.body_paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </Region>
  );
}

export function HtmlBlock({ s, c }: { s: PageSection; c: HtmlBlockContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <article className="legal__doc" id={s.section_key}>
        {c.eyebrow ? <p className="legal__effective">{c.eyebrow}</p> : null}
        {c.heading ? <h2>{c.heading}</h2> : null}
        <div dangerouslySetInnerHTML={{ __html: c.body_html }} />
      </article>
    </Region>
  );
}

export function StatStripBlock({ s, c }: { s: PageSection; c: StatStripContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="proofstrip" data-reveal aria-label="By the numbers">
        <div className="container">
          <div className="proofstrip__grid">
            {c.items.map((item, i) => (
              <div key={i}>
                <div className="stat__num">{item.num}</div>
                <div className="stat__label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Region>
  );
}

export function PrinciplesGridBlock({
  s,
  c,
}: {
  s: PageSection;
  c: PrinciplesGridContent;
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="howwework" data-reveal>
        <div className="container">
          <div className="section__head">
            {c.eyebrow ? <p className="eyebrow">{c.eyebrow}</p> : null}
            {c.heading ? <h2 className="h2">{c.heading}</h2> : null}
          </div>
          <div className="howwework__grid">
            {c.items.map((item, i) => (
              <article className="principle" key={i}>
                {item.num ? <p className="principle__num">{item.num}</p> : null}
                {item.title ? (
                  <h3 className="principle__title">{item.title}</h3>
                ) : null}
                {item.body ? (
                  <p className="principle__body">{item.body}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </Region>
  );
}

export function FirmIntroBlock({ s, c }: { s: PageSection; c: FirmIntroContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section data-reveal>
        <div className="container">
          <div className="section__head">
            {c.eyebrow ? <p className="eyebrow">{c.eyebrow}</p> : null}
            {c.heading ? <h2 className="h2">{c.heading}</h2> : null}
          </div>
          <div className="firmintro__grid">
            <div className="firmintro__copy">
              {c.body_paragraphs_html.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
            <div className="founders">
              {c.founders.map((f, i) => (
                <article className="founder" key={i}>
                  {f.name ? <h3 className="founder__name">{f.name}</h3> : null}
                  {f.role ? <p className="founder__role">{f.role}</p> : null}
                  {f.bio ? <p className="founder__bio">{f.bio}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Region>
  );
}

export function PersonBioBlock({ s, c }: { s: PageSection; c: PersonBioContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <article className="person" id={c.anchor || undefined}>
        <div className="person__portrait">
          {c.portrait_image_url ? (
            <img src={c.portrait_image_url} alt={`Portrait of ${c.name}`} loading="lazy" />
          ) : null}
        </div>
        <div>
          {c.name ? <h3 className="person__name">{c.name}</h3> : null}
          {c.role ? <p className="person__role">{c.role}</p> : null}
          {c.body_paragraphs.map((p, i) => (
            <p className="person__bio" key={i}>
              {p}
            </p>
          ))}
          {c.pull_quote ? (
            <p className="person__quote">“{c.pull_quote}”</p>
          ) : null}
          {c.link_url && c.link_label ? (
            <a className="linkarrow" href={c.link_url} rel="noopener">
              {c.link_label} <span className="arrow" aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </article>
    </Region>
  );
}

export function ClientLogosStripBlock({
  s,
  c,
  logos,
}: {
  s: PageSection;
  c: ClientLogosStripContent;
  logos: Array<{
    client_name: string;
    logo: string;
    alt_text: string;
    website_url?: string;
  }>;
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="clientlogos" data-reveal aria-label="Selected clients">
        <div className="clientlogos__head">
          {c.eyebrow ? <p className="eyebrow">{c.eyebrow}</p> : null}
          {c.heading ? <h2>{c.heading}</h2> : null}
        </div>
        <div className="clientlogos__viewport">
          <div className="clientlogos__track">
            {[...logos, ...logos].map((logo, idx) => (
              <a
                key={`${logo.client_name}-${idx}`}
                className="clientlogos__logo"
                href={logo.website_url || "#"}
                target="_blank"
                rel="noopener"
                tabIndex={idx >= logos.length ? -1 : undefined}
                aria-hidden={idx >= logos.length ? true : undefined}
              >
                <img
                  src={logo.logo}
                  alt={idx >= logos.length ? "" : logo.alt_text}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
        {c.disclaimer ? <p className="clientlogos__note">{c.disclaimer}</p> : null}
      </section>
    </Region>
  );
}

export function ContactLeftColBlock({
  s,
  c,
  phone,
  phoneLink,
  email,
  addrLine1,
  addrLine2,
  addrLine3,
}: {
  s: PageSection;
  c: ContactLeftColContent;
  phone: string;
  phoneLink: string;
  email: string;
  addrLine1: string;
  addrLine2: string;
  addrLine3: string;
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <div>
        {c.eyebrow ? (
          <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
            {c.eyebrow}
          </p>
        ) : null}
        {c.heading ? (
          <h2 className="h2" style={{ marginBottom: 24 }}>
            {c.heading}
          </h2>
        ) : null}
        <div className="prose" style={{ maxWidth: "48ch" }}>
          <div dangerouslySetInnerHTML={{ __html: c.body_html }} />
          <p>
            <strong>Phone</strong>
            <br />
            <a href={phoneLink}>{phone}</a>
          </p>
          <p>
            <strong>Email</strong>
            <br />
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p>
            <strong>Mailing address</strong>
            <br />
            {addrLine1}
            <br />
            {addrLine2}
            <br />
            {addrLine3}
          </p>
        </div>
      </div>
    </Region>
  );
}

export function ContactRightColBlock({
  s,
  c,
  contactForm,
}: {
  s: PageSection;
  c: ContactRightColContent;
  contactForm: React.ReactNode;
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <div>
        {c.eyebrow ? (
          <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
            {c.eyebrow}
          </p>
        ) : null}
        {c.heading ? (
          <h2 className="h2" style={{ marginBottom: 24 }}>
            {c.heading}
          </h2>
        ) : null}
        {contactForm}
      </div>
    </Region>
  );
}

export function QuoteCardBlock({ s, c }: { s: PageSection; c: QuoteCardContent }) {
  if (!c.quote) return null;
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <blockquote className="issues__quote" style={{ marginTop: 64 }}>
        <p>“{c.quote}”</p>
        {c.attribution ? <cite>{c.attribution}</cite> : null}
      </blockquote>
    </Region>
  );
}
