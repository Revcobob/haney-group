export function UtilityBar() {
  return (
    <div className="utility">
      <div className="container utility__inner">
        <div className="utility__group">
          <span className="util util--loc">
            <svg
              className="util__icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="util__label">Austin, Texas</span>
          </span>
          <span className="dot">·</span>
          <a className="util" href="tel:+15129255000">
            <svg
              className="util__icon"
              width="13"
              height="13"
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
            <span className="util__label">(512) 925-5000</span>
          </a>
          <span className="dot">·</span>
          <a
            className="util util--mail"
            href="mailto:info@haney-group.com"
            aria-label="Email info@haney-group.com"
          >
            <svg
              className="util__icon"
              width="13"
              height="13"
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
            <span className="util__label">info@haney-group.com</span>
          </a>
        </div>
        <div className="utility__group">
          <a className="util" href="/insights">
            <svg
              className="util__icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
              <path d="M19 6h2v14a2 2 0 0 1-2 2" />
              <path d="M8 8h7M8 12h7M8 16h4" />
            </svg>
            <span className="util__label">The Session Briefing</span>
          </a>
          <span className="dot">·</span>
          <a
            className="util"
            href="https://www.linkedin.com/"
            rel="noopener"
            aria-label="LinkedIn"
          >
            <svg
              className="util__icon util__icon--brand"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.79-1.75-1.76S5.53 3.22 6.5 3.22s1.75.79 1.75 1.75-.78 1.76-1.75 1.76zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19z" />
            </svg>
            <span className="util__label">LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
