import Link from "next/link";

export function ClosingCTA({ heading }: { heading?: string }) {
  return (
    <section className="closing" data-reveal>
      <div className="container">
        <div className="closing__inner">
          <div>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              Contact
            </p>
            <h2 className="h2">{heading ?? "Ready to start a conversation?"}</h2>
          </div>
          <div>
            <p>
              Every engagement begins with a short, confidential discussion of
              the issue, the timing, and what success would look like. Reach us
              in Austin to talk it through.
            </p>
            <div className="closing__ctas" style={{ marginTop: 28 }}>
              <Link className="btn btn--primary" href="/contact">
                Contact The Haney Group{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <a className="btn btn--ghost" href="tel:+15129255000">
                Or call (512) 925-5000
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
