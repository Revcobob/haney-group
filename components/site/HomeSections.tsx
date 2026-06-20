import Link from "next/link";
import { EditableRegion } from "./EditableRegion";
import type {
  HeroContent,
  ProblemContent,
  ProcessBreakContent,
  ProofContent,
  ApproachContent,
  SectionHeaderContent,
  IssuesContent,
  ClosingCtaContent,
} from "@/lib/sections/types";
import type { PageSection } from "@/lib/content/pages";
import type { ServiceCard } from "@/content/fallbacks/services";
import type { IndustryCard } from "@/content/fallbacks/industries";
import type { InsightArticle } from "@/lib/content/insights";

type RenderProps = {
  sections: PageSection[];
  capabilities: ServiceCard[];
  industries: IndustryCard[];
  articles: InsightArticle[];
};

function findSection<T = Record<string, unknown>>(
  sections: PageSection[],
  key: string
): { section: PageSection; content: T } | null {
  const s = sections.find((sec) => sec.section_key === key);
  if (!s) return null;
  return { section: s, content: s.content_json as T };
}

function Region({
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

function HeroBlock({ s, c }: { s: PageSection; c: HeroContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="hero" aria-labelledby="hero-h1">
        <div
          className="hero__bg"
          aria-hidden="true"
          style={
            c.background_image_url
              ? { backgroundImage: `url('${c.background_image_url}')` }
              : undefined
          }
        ></div>
        <div className="container">
          <div className="hero__inner" data-reveal>
            <div className="hero__copy">
              <p className="eyebrow" style={{ marginBottom: 22 }}>
                {c.eyebrow}
              </p>
              <h1 className="h1" id="hero-h1">
                {c.headline}
              </h1>
              <p className="lede hero__sub">{c.lede}</p>
              <div className="hero__ctas">
                {c.primary_cta.label ? (
                  <Link className="btn btn--primary" href={c.primary_cta.href || "#"}>
                    {c.primary_cta.label}
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                ) : null}
                {c.secondary_cta.label ? (
                  <Link className="btn btn--ghost" href={c.secondary_cta.href || "#"}>
                    {c.secondary_cta.label}
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>

              {c.meta_text_html ? (
                <div className="hero__meta">
                  <div className="bar" aria-hidden="true"></div>
                  <p dangerouslySetInnerHTML={{ __html: c.meta_text_html }} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {c.credit_text ? (
          <span className="hero__credit" aria-hidden="true">
            {c.credit_text}
          </span>
        ) : null}
      </section>
    </Region>
  );
}

function ProblemBlock({ s, c }: { s: PageSection; c: ProblemContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="problem" data-reveal>
        <div className="container">
          <div className="problem__inner">
            <div>
              <p className="eyebrow eyebrow--plain" style={{ marginBottom: 18 }}>
                {c.eyebrow}
              </p>
              <h2 className="h2">{c.heading}</h2>
            </div>
            <div>
              {c.body_paragraphs.map((p, i) => (
                <p className="body" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Region>
  );
}

function CapabilitiesBlock({
  s,
  c,
  capabilities,
}: {
  s: PageSection;
  c: SectionHeaderContent;
  capabilities: ServiceCard[];
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="caps" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
            {c.lede ? <p className="lede" style={{ marginTop: 0 }}>{c.lede}</p> : null}
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
          <div className="caps__foot">
            <Link className="linkarrow" href="/services">
              View all services <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Region>
  );
}

function ProcessBreakBlock({ s, c }: { s: PageSection; c: ProcessBreakContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="processbreak" aria-labelledby="processbreak-h2" data-reveal>
        <div className="container processbreak__inner">
          <div className="processbreak__media">
            {c.image_url ? (
              <img src={c.image_url} alt={c.image_alt} loading="lazy" />
            ) : null}
          </div>
          <div className="processbreak__copy">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 id="processbreak-h2">{c.heading}</h2>
            <p>{c.body}</p>
            {c.primary_cta.label ? (
              <Link className="btn btn--primary processbreak__cta" href={c.primary_cta.href || "#"}>
                {c.primary_cta.label}
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </Region>
  );
}

function ProofBlock({ s, c }: { s: PageSection; c: ProofContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="proof" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
          </div>
          <div className="proof__grid">
            {c.items.map((item, i) => (
              <div className="proof__item" key={i}>
                {item.image_url ? (
                  <img
                    className="proof__illo"
                    src={item.image_url}
                    alt=""
                    width={320}
                    height={320}
                    loading="lazy"
                  />
                ) : null}
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Region>
  );
}

function ApproachBlock({ s, c }: { s: PageSection; c: ApproachContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="approach" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
          </div>
          <div className="approach__grid">
            {c.steps.map((step, i) => (
              <article className="step" key={i}>
                {step.image_url ? (
                  <img
                    className="step__illo"
                    src={step.image_url}
                    alt={step.title}
                    width={320}
                    height={320}
                    loading="lazy"
                  />
                ) : null}
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Region>
  );
}

function PrincipalsBlock({ s, c }: { s: PageSection; c: SectionHeaderContent }) {
  // Principal cards themselves are hardcoded for now (Phase 4 punted on them
  // intentionally). The editable section is the intro heading + lede.
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="firm" data-reveal>
        <div className="container">
          <div className="firm__top">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
            <p className="lede">{c.lede}</p>
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
              <p className="principal__role">Principal · Former Chief Clerk, Texas House</p>
              <p className="principal__bio">
                Twenty-five years inside the Texas House of Representatives,
                including service as Chief Clerk under five Speakers. From the
                rostrum he managed calendars, certified votes, and oversaw the
                procedural backbone that thousands of bills moved through. Past
                President of the American Society of Legislative Clerks and
                Secretaries and a nationally recognized parliamentary expert.
              </p>
              <Link className="linkarrow principal__link" href="/about#robert">
                Read Robert’s full biography <span className="arrow" aria-hidden="true">→</span>
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
              <p className="principal__role">Principal · Appropriations &amp; Communications</p>
              <p className="principal__bio">
                Two decades of Texas legislative and public-relations experience,
                built as an aide to the House Appropriations Chair, as chief of
                staff to a state legislator, and across communications engagements
                where client priorities had to land at the Capitol and at the
                board table in the same week. Specializes in message development
                and legislative communication.
              </p>
              <Link className="linkarrow principal__link" href="/about#julie">
                Read Julie’s full biography <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>
    </Region>
  );
}

function IssuesBlock({
  s,
  c,
  industries,
}: {
  s: PageSection;
  c: IssuesContent;
  industries: IndustryCard[];
}) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="issues" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
            {c.lede ? <p className="lede" style={{ marginTop: 0 }}>{c.lede}</p> : null}
          </div>
          <div className="issues__grid">
            {industries.slice(0, 8).map((ind) => (
              <Link key={ind.title} className="issue" href="/industries">
                <span className="issue__mark" aria-hidden="true"></span>
                <div>
                  <h3>{ind.title}</h3>
                  <p>{ind.description}</p>
                </div>
              </Link>
            ))}
          </div>
          {c.quote ? (
            <blockquote className="issues__quote">
              <p>{c.quote}</p>
              {c.quote_attribution ? <cite>{c.quote_attribution}</cite> : null}
            </blockquote>
          ) : null}
        </div>
      </section>
    </Region>
  );
}

function InsightsTeaserBlock({
  s,
  c,
  articles,
}: {
  s: PageSection;
  c: SectionHeaderContent;
  articles: InsightArticle[];
}) {
  const top = articles.slice(0, 3);
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="insights" data-reveal>
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h2">{c.heading}</h2>
            {c.lede ? <p className="lede" style={{ marginTop: 0 }}>{c.lede}</p> : null}
          </div>
          <div className="insights__grid">
            {top.map((a) => (
              <Link key={a.slug} className="insight" href={`/insights/${a.slug}`}>
                <div className="insight__band" aria-hidden="true">
                  <img src={a.hero_image} alt="" loading="lazy" />
                </div>
                <div className="insight__body">
                  <p className="insight__meta">{a.article_label}</p>
                  <h3>{a.title}</h3>
                  <p>{a.summary}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="insights__foot">
            <Link className="linkarrow" href="/insights">
              See all insights <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Region>
  );
}

function ClosingCtaBlock({ s, c }: { s: PageSection; c: ClosingCtaContent }) {
  return (
    <Region sectionKey={s.section_key} sectionLabel={s.section_label}>
      <section className="closing" data-reveal>
        <div className="container">
          <div className="closing__inner">
            <div>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                {c.eyebrow}
              </p>
              <h2 className="h2">{c.heading}</h2>
            </div>
            <div>
              <p>{c.body}</p>
              <div className="closing__ctas" style={{ marginTop: 28 }}>
                {c.primary_cta.label ? (
                  <Link className="btn btn--primary" href={c.primary_cta.href || "#"}>
                    {c.primary_cta.label}
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                ) : null}
                {c.secondary_cta.label ? (
                  <a className="btn btn--ghost" href={c.secondary_cta.href || "#"}>
                    {c.secondary_cta.label}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Region>
  );
}

export function HomeSections({
  sections,
  capabilities,
  industries,
  articles,
}: RenderProps) {
  const order = sections.slice().sort((a, b) => a.display_order - b.display_order);
  return (
    <>
      {order.map((s) => {
        switch (s.section_type) {
          case "hero": {
            const f = findSection<HeroContent>([s], s.section_key);
            return f ? <HeroBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "problem": {
            const f = findSection<ProblemContent>([s], s.section_key);
            return f ? <ProblemBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "capabilities_intro": {
            const f = findSection<SectionHeaderContent>([s], s.section_key);
            return f ? (
              <CapabilitiesBlock
                key={s.section_key}
                s={s}
                c={f.content}
                capabilities={capabilities}
              />
            ) : null;
          }
          case "processbreak": {
            const f = findSection<ProcessBreakContent>([s], s.section_key);
            return f ? <ProcessBreakBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "proof": {
            const f = findSection<ProofContent>([s], s.section_key);
            return f ? <ProofBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "approach": {
            const f = findSection<ApproachContent>([s], s.section_key);
            return f ? <ApproachBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "principals_intro": {
            const f = findSection<SectionHeaderContent>([s], s.section_key);
            return f ? <PrincipalsBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          case "issues": {
            const f = findSection<IssuesContent>([s], s.section_key);
            return f ? (
              <IssuesBlock key={s.section_key} s={s} c={f.content} industries={industries} />
            ) : null;
          }
          case "insights_intro": {
            const f = findSection<SectionHeaderContent>([s], s.section_key);
            return f ? (
              <InsightsTeaserBlock
                key={s.section_key}
                s={s}
                c={f.content}
                articles={articles}
              />
            ) : null;
          }
          case "closing_cta": {
            const f = findSection<ClosingCtaContent>([s], s.section_key);
            return f ? <ClosingCtaBlock key={s.section_key} s={s} c={f.content} /> : null;
          }
          default:
            return null;
        }
      })}
    </>
  );
}
