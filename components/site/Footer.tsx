import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="brand" href="/" aria-label="The Haney Group, Home">
              <img
                className="brand__logo brand__logo--footer"
                src="/assets/img/inline-1c87817066.png"
                alt="The Haney Group"
                width={911}
                height={690}
                loading="lazy"
              />
            </Link>
            <p>
              <em>Proven expertise. Focused results. Unmatched influence.</em> A
              senior-led Austin government relations firm — Texas legislative
              strategy, appropriations, and procedural expertise for organizations
              with priorities at the Capitol.
            </p>
            <div className="footer__social">
              <a href="https://www.linkedin.com/" aria-label="LinkedIn" rel="noopener">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.86V21H10z" />
                </svg>
              </a>
              <a href="mailto:info@haney-group.com" aria-label="Email">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link href="/services/legislative-strategy">Legislative Strategy</Link>
              </li>
              <li>
                <Link href="/services/appropriations">Appropriations &amp; Riders</Link>
              </li>
              <li>
                <Link href="/services/public-affairs">Public Affairs</Link>
              </li>
              <li>
                <Link href="/services/parliamentary">Parliamentary Procedure</Link>
              </li>
              <li>
                <Link href="/services">All services</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>The Firm</h4>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/experience">Experience</Link>
              </li>
              <li>
                <Link href="/industries">Clients</Link>
              </li>
              <li>
                <Link href="/insights">Insights</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col footer__addr">
            <h4>Contact</h4>
            <p>
              The Haney Group
              <br />
              P.O. Box 521
              <br />
              Austin, Texas 78767
            </p>
            <p style={{ marginTop: 14 }}>
              <a href="tel:+15129255000">(512) 925-5000</a>
              <br />
              <a href="mailto:info@haney-group.com">info@haney-group.com</a>
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Haney Group LLC. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy</Link>
            {" · "}
            <a href="#">Texas Ethics Commission Lobby Registration</a>
            {" · "}
            <a href="#">Accessibility</a>
            {" · "}
            <Link href="/admin/login">Site Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
