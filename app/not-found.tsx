import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pagehero">
      <div className="container">
        <div className="pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link> · Not Found
          </p>
          <h1 className="h1">This page is being ported.</h1>
          <p className="lede" style={{ marginTop: 24 }}>
            The Haney Group site is moving onto a new platform that supports
            in-place editing. A handful of inner pages are not yet wired up in
            this preview. They will return in the next phase of work.
          </p>
          <div className="hero__ctas" style={{ marginTop: 28 }}>
            <Link className="btn btn--primary" href="/">
              Return to the homepage
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
