"use client";

import { usePathname } from "next/navigation";

/**
 * Route-aware presentation wrapper for the header.
 *
 * The homepage presents the same navigation differently: brand on the left,
 * a MENU control on the right, and the links in a drawer rather than inline.
 * That is a presentation concern, so it is the only thing this component
 * decides. <Header /> stays an async server component and keeps doing its own
 * getNavigation() fetch — it is passed through as children, so nothing about
 * the data layer moves to the client.
 *
 * The wrapper is display:contents (see .headerctx in main.css). It must not
 * generate a box: .header is position:sticky, and a real wrapper element
 * would become its containing block and strand it at the top of the page.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";
  return (
    <div className={`headerctx${isHome ? " headerctx--home" : ""}`}>
      {children}
    </div>
  );
}
