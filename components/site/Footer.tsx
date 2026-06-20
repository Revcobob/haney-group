import Link from "next/link";
import { getSiteSettings, getNavigation } from "@/lib/content/site";

export async function Footer() {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()]);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="brand" href="/" aria-label={`${settings.firm_name}, Home`}>
              <img
                className="brand__logo brand__logo--footer"
                src="/assets/img/inline-1c87817066.png"
                alt={settings.firm_name}
                width={911}
                height={690}
                loading="lazy"
              />
            </Link>
            <p>
              <em>{settings.footer_tagline}</em> {settings.footer_description}
            </p>
            <div className="footer__social">
              {settings.linkedin_url ? (
                <a href={settings.linkedin_url} aria-label="LinkedIn" rel="noopener">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 11.02 5 2.5 2.5 0 01-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.86V21H10z" />
                  </svg>
                </a>
              ) : null}
              <a href={`mailto:${settings.email}`} aria-label="Email">
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
              {nav.footer_primary.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>The Firm</h4>
            <ul>
              {nav.utility_bar.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col footer__addr">
            <h4>Contact</h4>
            <p>
              {settings.mailing_address_line_1}
              <br />
              {settings.mailing_address_line_2}
              <br />
              {settings.mailing_address_line_3}
            </p>
            <p style={{ marginTop: 14 }}>
              <a href={settings.phone_link}>{settings.phone}</a>
              <br />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {settings.copyright_text}
          </span>
          <span>
            {nav.footer_utility.map((item, idx) => (
              <span key={`${item.href}-${item.label}`}>
                {idx > 0 ? " · " : null}
                {item.href.startsWith("/") ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <a href={item.href}>{item.label}</a>
                )}
              </span>
            ))}
            {" · "}
            <Link href="/admin/login">Site Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
