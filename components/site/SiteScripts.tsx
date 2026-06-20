"use client";

import { useEffect } from "react";

export function SiteScripts() {
  useEffect(() => {
    const toggle = document.querySelector<HTMLButtonElement>(".nav__toggle");
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!nav || !toggle) return;

    type NavState = HTMLElement & {
      _originalParent?: HTMLElement | null;
      _originalNext?: ChildNode | null;
    };
    const navEl = nav as NavState;

    const reparentNav = () => {
      const inHeader = navEl.parentElement?.closest(".header");
      const mobile = window.matchMedia("(max-width: 1024px)").matches;
      if (mobile && inHeader) {
        navEl._originalParent = navEl.parentElement;
        navEl._originalNext = navEl.nextSibling;
        document.body.appendChild(navEl);
      } else if (
        !mobile &&
        navEl._originalParent &&
        navEl.parentElement === document.body
      ) {
        navEl._originalParent.insertBefore(navEl, navEl._originalNext ?? null);
      }
    };
    reparentNav();
    window.addEventListener("resize", reparentNav);

    const closeBtn = document.querySelector<HTMLButtonElement>(".nav__close");

    const setMenu = (open: boolean) => {
      navEl.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    const onToggle = () => setMenu(!navEl.classList.contains("is-open"));
    toggle.addEventListener("click", onToggle);

    const linkHandlers: Array<() => void> = [];
    navEl.querySelectorAll("a").forEach((a) => {
      const h = () => setMenu(false);
      a.addEventListener("click", h);
      linkHandlers.push(() => a.removeEventListener("click", h));
    });

    const onClose = () => setMenu(false);
    closeBtn?.addEventListener("click", onClose);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && navEl.classList.contains("is-open")) setMenu(false);
    };
    document.addEventListener("keydown", onKey);

    let sx: number | null = null;
    let sy: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (!navEl.classList.contains("is-open")) return;
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (sx == null || sy == null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = Math.abs(t.clientY - sy);
      if (dx > 60 && dy < 60) setMenu(false);
      sx = sy = null;
    };
    navEl.addEventListener("touchstart", onTouchStart, { passive: true });
    navEl.addEventListener("touchend", onTouchEnd, { passive: true });

    // Reveal animation was removed — [data-reveal] is always visible via
    // CSS now. Kept the attribute so future JS-driven polish can hook
    // onto it without changing markup.

    return () => {
      window.removeEventListener("resize", reparentNav);
      toggle.removeEventListener("click", onToggle);
      closeBtn?.removeEventListener("click", onClose);
      document.removeEventListener("keydown", onKey);
      navEl.removeEventListener("touchstart", onTouchStart);
      navEl.removeEventListener("touchend", onTouchEnd);
      linkHandlers.forEach((unsub) => unsub());
    };
  }, []);

  return null;
}
