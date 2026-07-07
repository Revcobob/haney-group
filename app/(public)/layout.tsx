import { UtilityBar } from "@/components/site/UtilityBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteScripts } from "@/components/site/SiteScripts";
import { SiteMotion } from "@/components/site/SiteMotion";

// Runs before first paint. Opts the page into JS-driven scroll reveals
// (html.js-anim) only when IntersectionObserver exists and the visitor
// hasn't asked for reduced motion. A fallback timer strips the class if
// hydration never arrives so content is never stranded hidden; SiteMotion
// clears the timer when it mounts.
const motionBoot = `(function(){try{var d=document.documentElement;if(!("IntersectionObserver" in window))return;if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-anim");window.__haneyRevealFallback=window.setTimeout(function(){d.classList.remove("js-anim")},4000)}catch(e){}})();`;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <UtilityBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SiteScripts />
      <SiteMotion />
    </>
  );
}
