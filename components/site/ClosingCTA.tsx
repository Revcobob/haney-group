import Link from "next/link";
import { EditableRegion } from "./EditableRegion";
import type { PageSection } from "@/lib/content/pages";
import type { ClosingCtaContent } from "@/lib/sections/types";

type ClosingProps = {
  section?: PageSection | null;
  heading?: string;
};

const DEFAULT_CONTENT: ClosingCtaContent = {
  eyebrow: "Contact",
  heading: "Ready to start a conversation?",
  body:
    "Every engagement begins with a short, confidential discussion of the issue, the timing, and what success would look like. Reach us in Austin to talk it through.",
  primary_cta: { label: "Contact The Haney Group", href: "/contact" },
  secondary_cta: { label: "Or call (512) 925-5000", href: "tel:+15129255000" },
};

export function ClosingCTA({ section, heading }: ClosingProps) {
  const c = (section?.content_json as ClosingCtaContent | undefined) ?? null;
  const eyebrow = c?.eyebrow ?? DEFAULT_CONTENT.eyebrow;
  const heading_ = heading ?? c?.heading ?? DEFAULT_CONTENT.heading;
  const body = c?.body ?? DEFAULT_CONTENT.body;
  const primary = c?.primary_cta ?? DEFAULT_CONTENT.primary_cta;
  const secondary = c?.secondary_cta ?? DEFAULT_CONTENT.secondary_cta;

  const inner = (
    <section className="closing" data-reveal>
      <div className="container">
        <div className="closing__inner">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              {eyebrow}
            </p>
            <h2 className="h2">{heading_}</h2>
          </div>
          <div>
            <p>{body}</p>
            <div className="closing__ctas" style={{ marginTop: 28 }}>
              {primary?.label ? (
                <Link className="btn btn--primary" href={primary.href || "#"}>
                  {primary.label}{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : null}
              {secondary?.label ? (
                <a className="btn btn--ghost" href={secondary.href || "#"}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (!section) return inner;

  return (
    <EditableRegion
      sectionKey={section.section_key}
      sectionLabel={section.section_label}
    >
      {inner}
    </EditableRegion>
  );
}
