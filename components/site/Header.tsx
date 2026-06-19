import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link className="brand" href="/" aria-label="The Haney Group, Home">
          <img
            className="brand__logo"
            src="/assets/img/inline-e9e661e302.png"
            alt="The Haney Group"
            width={384}
            height={157}
          />
        </Link>

        <button
          className="nav__toggle"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          <span></span>
        </button>

        <nav className="nav" id="primary-nav" aria-label="Primary">
          <div className="nav__head">
            <Link className="nav__brand" href="/" aria-label="The Haney Group, Home">
              <img src="/assets/img/inline-e9e661e302.png" alt="The Haney Group" />
            </Link>
            <button className="nav__close" aria-label="Close menu" type="button">
              ✕
            </button>
          </div>
          <ul className="nav__list">
            <li>
              <Link className="nav__link" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="nav__link" href="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="nav__link" href="/experience">
                Experience
              </Link>
            </li>
            <li>
              <Link className="nav__link" href="/industries">
                Clients
              </Link>
            </li>
            <li>
              <Link className="nav__link" href="/insights">
                Insights
              </Link>
            </li>
            <li>
              <Link className="nav__link" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <Link className="btn btn--primary nav__cta" href="/contact">
            Schedule a Consultation
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <div className="nav__foot">
            <a
              className="nav__foot-link"
              href="tel:+15129255000"
              aria-label="Call (512) 925-5000"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a
              className="nav__foot-link"
              href="mailto:info@haney-group.com"
              aria-label="Email info@haney-group.com"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
            </a>
            <a
              className="nav__foot-link"
              href="https://www.linkedin.com/"
              rel="noopener"
              aria-label="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.79-1.75-1.76S5.53 3.22 6.5 3.22s1.75.79 1.75 1.75-.78 1.76-1.75 1.76zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19z" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
