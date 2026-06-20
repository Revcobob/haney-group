import type { Metadata } from "next";
import Link from "next/link";
import { resolveMetadata } from "@/lib/content/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/privacy",
    fallback: {
      title: "Privacy & Legal",
      description:
        "How The Haney Group handles information collected through our website, and the terms that govern your use of haney-group.com.",
    },
  });
}

export default function PrivacyPage() {
  return (
    <>
      <section className="pagehero pagehero--photo" aria-labelledby="ph-h1">
        <div
          className="pagehero__bg"
          style={{ backgroundImage: "url('/assets/img/privacy-hero-web.jpg')" }}
          aria-hidden="true"
        ></div>
        <div className="container pagehero__inner">
          <p className="pagehero__crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Privacy &amp; Legal</span>
          </p>
          <p className="eyebrow" style={{ marginBottom: 22 }}>
            Privacy &amp; Legal Notice
          </p>
          <h1 className="h1" id="ph-h1">
            Privacy and legal notice.
          </h1>
          <p className="lede">
            How The Haney Group handles information collected through our
            website, and the terms that govern your use of haney-group.com.
          </p>
        </div>
      </section>

      <section data-reveal>
        <div className="container">
          <div className="prose">
            <div className="legal__toc" aria-label="On this page">
              <p className="legal__toc-eyebrow">On this page</p>
              <div className="legal__toc-grid">
                <a href="#privacy-policy">
                  <strong>Privacy Policy</strong>
                </a>
                <a href="#legal-notice">
                  <strong>Legal Notice</strong>
                </a>
                <a href="#privacy-information-we-collect">Information we collect</a>
                <a href="#legal-intellectual-property">Intellectual property</a>
                <a href="#privacy-how-we-use">How we use information</a>
                <a href="#legal-disclaimers">Disclaimers</a>
                <a href="#privacy-sharing">Information sharing</a>
                <a href="#legal-liability">Limitation of liability</a>
                <a href="#privacy-cookies">Cookies</a>
                <a href="#legal-governing-law">Governing law</a>
                <a href="#privacy-rights">Your rights</a>
                <a href="#legal-contact">Contact us</a>
              </div>
            </div>

            <article className="legal__doc" id="privacy-policy">
              <p className="legal__effective">Effective Date · June 18, 2026</p>
              <h2>Privacy Policy</h2>

              <h3>1. Introduction</h3>
              <p>
                At The Haney Group, we are committed to protecting your privacy.
                This Privacy Policy outlines how we collect, use, disclose, and
                protect your information when you visit{" "}
                <a href="https://www.haney-group.com">www.haney-group.com</a> or
                engage with our services.
              </p>

              <h3 id="privacy-information-we-collect">
                2. Information We Collect
              </h3>
              <p>We may collect personal information that you provide to us directly, such as:</p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <p>
                We also collect non-personal information automatically when you
                visit our website, including:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Pages viewed</li>
                <li>Time spent on the site</li>
                <li>Referring website</li>
              </ul>

              <h3 id="privacy-how-we-use">3. How We Use Your Information</h3>
              <p>We may use the information we collect for various purposes, including:</p>
              <ul>
                <li>To respond to your inquiries and provide services</li>
                <li>To improve our website and services</li>
                <li>
                  To send you newsletters, marketing communications, or other
                  information that may interest you
                </li>
                <li>To analyze website usage and enhance user experience</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>

              <h3 id="privacy-sharing">4. Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                required by law or to provide our services. We may share your
                information with trusted service providers who assist us in
                operating our website and conducting our business.
              </p>

              <h3>5. Data Security</h3>
              <p>
                We implement a variety of security measures to protect your
                personal information. However, no method of transmission over
                the Internet or electronic storage is 100% secure. While we
                strive to protect your information, we cannot guarantee its
                absolute security.
              </p>

              <h3 id="privacy-cookies">6. Cookies</h3>
              <p>
                Our website may use cookies to enhance user experience. You can
                choose to accept or decline cookies. Most web browsers
                automatically accept cookies, but you can modify your browser
                settings to decline cookies if you prefer.
              </p>

              <h3>7. Third-Party Links</h3>
              <p>
                Our website may contain links to third-party websites. We do not
                have control over the content and practices of these websites
                and are not responsible for their privacy policies. We encourage
                you to review the privacy policies of any third-party sites you
                visit.
              </p>

              <h3 id="privacy-rights">8. Your Rights</h3>
              <p>
                You have the right to request access to the personal information
                we hold about you and to request correction or deletion of that
                information. To exercise these rights, please contact us using
                the information provided below.
              </p>

              <h3>9. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                our website with an updated effective date.
              </p>

              <h3>10. Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="legal__contact">
                <p>
                  <strong>The Haney Group</strong>
                  P.O. Box 521, Austin, TX 78767
                  <br />
                  <a href="tel:+15129255000">(512) 925-5000</a>
                  <br />
                  <a href="mailto:info@haney-group.com">info@haney-group.com</a>
                </p>
              </div>
            </article>

            <hr className="legal__divider" aria-hidden="true" />

            <article className="legal__doc" id="legal-notice">
              <p className="legal__effective">Effective Date · June 18, 2026</p>
              <h2>Legal Notice</h2>

              <h3>1. Introduction</h3>
              <p>
                This legal notice governs your use of the website{" "}
                <a href="https://www.haney-group.com">www.haney-group.com</a> (the
                “Site”) operated by Haney Group LLC (“we,” “us,” or “our”). By
                accessing or using our Site, you agree to comply with and be
                bound by this legal notice. If you do not agree with these terms,
                please do not use our Site.
              </p>

              <h3 id="legal-intellectual-property">2. Intellectual Property</h3>
              <p>
                All content, materials, and information on the Site, including
                but not limited to text, graphics, logos, images, and software,
                are the property of Haney Group LLC or our content suppliers and
                are protected by applicable copyright, trademark, and other
                intellectual property laws. You may not reproduce, distribute,
                or create derivative works from any content on the Site without
                our prior written consent.
              </p>

              <h3>3. Use of the Site</h3>
              <p>
                You may use the Site for lawful purposes only. You agree not to
                use the Site in any way that violates any applicable federal,
                state, or local law or regulation. You may not use the Site to
                transmit or send any advertising or promotional material without
                our prior written consent.
              </p>

              <h3 id="legal-disclaimers">4. Disclaimers</h3>
              <p>
                The information provided on this Site is for general
                informational purposes only and should not be considered legal
                advice. We make no representations or warranties of any kind,
                express or implied, about the completeness, accuracy,
                reliability, or availability of the information on the Site. Any
                reliance you place on such information is strictly at your own
                risk.
              </p>

              <h3 id="legal-liability">5. Limitation of Liability</h3>
              <p>
                In no event shall Haney Group LLC, its directors, employees, or
                agents be liable for any direct, indirect, incidental, special,
                consequential, or punitive damages arising out of or in
                connection with your use of the Site or inability to use the
                Site, even if we have been advised of the possibility of such
                damages.
              </p>

              <h3>6. Links to Third-Party Websites</h3>
              <p>
                Our Site may contain links to third-party websites. We do not
                control and are not responsible for the content or practices of
                these websites. The inclusion of any link does not imply
                endorsement by us of the website or the information contained
                therein. We encourage you to review the terms and conditions and
                privacy policies of any third-party websites you visit.
              </p>

              <h3 id="legal-governing-law">7. Governing Law</h3>
              <p>
                This legal notice shall be governed by and construed in
                accordance with the laws of the State of Texas, without regard
                to its conflict of law principles. Any disputes arising from or
                related to this legal notice shall be resolved in the state or
                federal courts located in Texas.
              </p>

              <h3>8. Changes to This Legal Notice</h3>
              <p>
                We reserve the right to update or modify this legal notice at
                any time without prior notice. Your continued use of the Site
                following the posting of any changes constitutes your
                acceptance of those changes.
              </p>

              <h3 id="legal-contact">9. Contact Us</h3>
              <p>If you have any questions about this legal notice, please contact us at:</p>
              <div className="legal__contact">
                <p>
                  <strong>Haney Group LLC</strong>
                  P.O. Box 521, Austin, TX 78767
                  <br />
                  <a href="tel:+15129255000">(512) 925-5000</a>
                  <br />
                  <a href="mailto:info@haney-group.com">info@haney-group.com</a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
