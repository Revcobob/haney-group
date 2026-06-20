import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/env";

// Admin gate. Clerk handles session detection at the edge;
// requireAdmin() inside server components handles the email allowlist
// (Clerk doesn't surface email at middleware time without a server round trip).

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/preview/(.*)",
]);
const isPublicAdminRoute = createRouteMatcher([
  "/admin/login(.*)",
  "/admin/setup-needed",
  "/admin/forbidden",
]);

const clerkMw = clerkMiddleware(async (authFn, req) => {
  if (!isAdminRoute(req)) return;
  if (isPublicAdminRoute(req)) return;
  const { userId, redirectToSignIn } = await authFn();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
});

// /preview/* requests are the visual editor's iframe — we want the page
// rendering to prefer draft_content_json over the live copy so admins
// see their staged edits. Set a request header that getPageWithSections
// reads via next/headers; public visitors never go through this branch
// so they only ever see published content.
function withPreviewHeader(req: NextRequest): NextResponse {
  const headers = new Headers(req.headers);
  headers.set("x-preview-drafts", "1");
  return NextResponse.next({ request: { headers } });
}

const isPreviewRoute = createRouteMatcher(["/preview/(.*)"]);

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // When Clerk env is not configured, redirect admin routes to a setup page
  // so the public site still works and admins see a useful message.
  if (!clerkConfigured) {
    if (!isAdminRoute(req)) return NextResponse.next();
    if (req.nextUrl.pathname === "/admin/setup-needed") return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/setup-needed";
    return NextResponse.redirect(url);
  }
  const result = await clerkMw(req, event);
  // Clerk returned a response (e.g. redirect to sign in) — pass it through.
  if (result) return result;
  // Otherwise add the preview-draft header on /preview/* requests so
  // server components downstream can render drafts.
  if (isPreviewRoute(req)) return withPreviewHeader(req);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next internals and static asset extensions
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
