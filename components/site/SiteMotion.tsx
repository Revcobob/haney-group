"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Motion & scroll polish for the public site.
//
// Works with the `js-anim` class that an inline boot script in the public
// layout adds to <html> before first paint (only when IntersectionObserver
// exists and the visitor hasn't asked for reduced motion). The boot script
// also arms a fallback timer that strips the class if hydration never
// lands, so content can never be stranded hidden. This component clears
// that timer once it mounts and takes over.

declare global {
  interface Window {
    __haneyRevealFallback?: number;
  }
}

// Grid containers whose direct children stagger in behind their section.
const STAGGER_GRIDS = [
  ".caps__grid",
  ".proof__grid",
  ".approach__grid",
  ".principals__grid",
  ".issues__grid",
  ".insights__grid",
  ".tilegrid",
  ".howwework__grid",
  ".audience__grid",
  ".proofstrip__grid",
  ".founders",
].join(", ");

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runCounter(el: HTMLElement) {
  // "25+", "2,000+", "5" → count the numeric part up from zero,
  // preserving any prefix/suffix and comma grouping.
  const raw = el.textContent ?? "";
  const m = raw.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
  if (!m) return;
  const target = parseInt(m[2].replace(/,/g, ""), 10);
  if (!Number.isFinite(target) || target <= 0) return;
  const grouped = m[2].includes(",");
  const prefix = m[1];
  const suffix = m[3];
  const duration = 1400;
  let start: number | null = null;
  const step = (now: number) => {
    if (start === null) start = now;
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent =
      prefix + (grouped ? val.toLocaleString("en-US") : String(val)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function SiteMotion() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const isArticle = /^\/insights\/.+/.test(pathname);

  // The boot script's safety timer is only needed until we mount.
  useEffect(() => {
    if (typeof window.__haneyRevealFallback === "number") {
      window.clearTimeout(window.__haneyRevealFallback);
      delete window.__haneyRevealFallback;
    }
  }, []);

  // Scroll-triggered reveals for sections and staggered grid children.
  useEffect(() => {
    if (!document.documentElement.classList.contains("js-anim")) return;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-reveal], ${STAGGER_GRIDS}`)
    ).filter(
      (el) =>
        !el.classList.contains("is-inview") &&
        // The home hero is above the fold; its first-paint CSS animation
        // stays in charge so the page never waits on hydration.
        !el.classList.contains("hero__inner")
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Stat strip counters ("25+ sessions" etc.) count up when seen.
  useEffect(() => {
    if (reducedMotion()) return;
    const nums = Array.from(
      document.querySelectorAll<HTMLElement>(".stat__num")
    ).filter((el) => !el.dataset.counted);
    if (nums.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.dataset.counted) continue;
          el.dataset.counted = "1";
          runCounter(el);
        }
      },
      { threshold: 0.4 }
    );
    nums.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // One rAF-throttled scroll handler drives the condensed header, the
  // back-to-top button, and the article reading-progress bar.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      document.querySelector(".header")?.classList.toggle("is-scrolled", y > 12);
      setShowTop(y > 680);
      const bar = barRef.current;
      if (bar) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Highlight the nav link for the section the visitor is in.
  useEffect(() => {
    const clean = (p: string) =>
      p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
    const current = clean(pathname);
    document
      .querySelectorAll<HTMLAnchorElement>(".nav__link")
      .forEach((a) => {
        const href = clean(new URL(a.href, window.location.origin).pathname);
        const active =
          href === "/"
            ? current === "/"
            : current === href || current.startsWith(`${href}/`);
        a.classList.toggle("is-active", active);
        if (active) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
  }, [pathname]);

  return (
    <>
      {isArticle ? (
        <div className="readbar" ref={barRef} aria-hidden="true"></div>
      ) : null}
      <button
        type="button"
        className={`totop${showTop ? " is-visible" : ""}`}
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: reducedMotion() ? "auto" : "smooth",
          })
        }
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
