"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

// A tiny shared registry of "this form has unsaved changes".
// Each form registers itself with a stable id (useDirtyRegistration);
// the registry stores a Set of currently-dirty ids.
//
// NavigationGuard reads from the registry and intercepts:
//   - clicks on internal anchors (sidebar, breadcrumbs, Cmd-K results,
//     Cancel links inside forms);
//   - programmatic in-app navigation via the returned confirmIfDirty()
//     helper (consumed by the visual editor's section dropdown).
//
// The browser's beforeunload guard from useUnsavedChangesGuard handles
// the other half: refresh, tab close, address-bar navigation.

type DirtyContextValue = {
  setDirty: (id: string, dirty: boolean) => void;
  isAnyDirty: () => boolean;
  // Returns true if it's safe to proceed (no dirty form OR the user
  // confirmed they're OK losing the changes). False = bail out of the
  // in-progress navigation.
  confirmIfDirty: () => boolean;
};

const DirtyFormContext = createContext<DirtyContextValue | null>(null);

const CONFIRM_MESSAGE =
  "You have unsaved changes that will be lost if you leave this section.\n\n" +
  "Continue without saving?";

export function DirtyFormProvider({ children }: { children: React.ReactNode }) {
  // Backed by a ref so reads inside an event handler always see the
  // current set without going through React's render cycle.
  const dirtyRef = useRef<Set<string>>(new Set());
  // Mirror state so children can re-render when something becomes dirty
  // (e.g. show a "you have unsaved changes" pill).
  const [, force] = useState(0);

  const setDirty = useCallback((id: string, dirty: boolean) => {
    const before = dirtyRef.current.has(id);
    if (dirty && !before) {
      dirtyRef.current.add(id);
      force((n) => n + 1);
    } else if (!dirty && before) {
      dirtyRef.current.delete(id);
      force((n) => n + 1);
    }
  }, []);

  const isAnyDirty = useCallback(() => dirtyRef.current.size > 0, []);

  const confirmIfDirty = useCallback(() => {
    if (dirtyRef.current.size === 0) return true;
    const ok = window.confirm(CONFIRM_MESSAGE);
    if (ok) {
      // The user accepted that they're throwing the changes away.
      // Clear the registry so the next nav doesn't ask again on the
      // same dirty state.
      dirtyRef.current.clear();
      force((n) => n + 1);
    }
    return ok;
  }, []);

  return (
    <DirtyFormContext.Provider value={{ setDirty, isAnyDirty, confirmIfDirty }}>
      {children}
      <NavigationGuard />
    </DirtyFormContext.Provider>
  );
}

export function useDirtyFormRegistration(formId: string, isDirty: boolean) {
  const ctx = useContext(DirtyFormContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setDirty(formId, isDirty);
    return () => ctx.setDirty(formId, false);
  }, [ctx, formId, isDirty]);
}

export function useDirtyConfirm(): () => boolean {
  const ctx = useContext(DirtyFormContext);
  return ctx?.confirmIfDirty ?? (() => true);
}

// Auto-id helper for forms that don't have a stable id of their own.
export function useDirtyFormId(): string {
  return useId();
}

// Intercept anchor clicks anywhere inside the admin shell. If any form
// is dirty and the link points somewhere internal that isn't the page
// we're already on, ask before letting the navigation through.
function NavigationGuard() {
  const ctx = useContext(DirtyFormContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ctx) return;
    function onClick(e: MouseEvent) {
      if (!ctx!.isAnyDirty()) return;
      // Respect modifier clicks (open in new tab / window).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Skip explicit new-tab links and external schemes.
      if (anchor.target === "_blank") return;
      if (/^(mailto:|tel:|https?:)/i.test(href) && !sameOrigin(anchor.href)) return;
      // Resolve the target path.
      let nextPath: string;
      try {
        nextPath = new URL(anchor.href, window.location.href).pathname;
      } catch {
        return;
      }
      if (nextPath === pathname) return;
      // Block first, then ask. If accepted, navigate manually via the
      // Next.js router so we keep client-side routing.
      e.preventDefault();
      if (ctx!.confirmIfDirty()) {
        const dest = anchor.href;
        // Use the router for same-origin paths; full URLs go through it
        // too and Next.js handles the fall-through to a hard nav if
        // needed.
        router.push(dest);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [ctx, router, pathname]);

  return null;
}

function sameOrigin(href: string): boolean {
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}
