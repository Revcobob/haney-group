# The Haney Group — Website & CMS

Production website for The Haney Group plus a custom in-app CMS for the firm's
principals to edit page content, publish insight articles, manage SEO, and
triage contact inquiries without touching code.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **Styling:** hand-written CSS in `styles/main.css` (lifted from the original
  static HTML). Tokens at the top of that file. Public Sans loaded from Google
  Fonts.
- **Auth (CMS):** Clerk — added in Phase 3
- **Data + storage (CMS):** Supabase — added in Phase 3
- **Hosting:** Vercel

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Repo layout

```
app/                     App Router routes
  layout.tsx             Root layout — html/body/fonts + ClerkProvider
  (public)/              Public site (route group, no admin chrome)
    layout.tsx           UtilityBar, Header, Footer, SiteScripts
    page.tsx, about/, services/, services/[slug]/, experience/,
    industries/, insights/, insights/[slug]/, contact/, privacy/
  admin/                 CMS admin
    layout.tsx           Bare wrapper (force-dynamic, no chrome)
    page.tsx             Redirects to /admin/dashboard
    login/, setup-needed/, forbidden/    Self-contained .admin__authshell
    (dashboard)/         Route group, requireAdmin() gated
      layout.tsx         Admin header + sidebar
      dashboard/, pages/, insights/, media/, inquiries/, seo/,
      services/, industries/, experience/, clients/,
      navigation/, settings/
  api/contact/route.ts   Public contact submission (Phase 6 wires to DB)
  not-found.tsx          Branded 404
  sitemap.ts, robots.ts  Generated from CMS content sources

components/
  site/                  Public layout primitives + ContactForm + ClosingCTA
  admin/                 AdminHeader, AdminSidebar, ComingSoon

styles/main.css          Design system — single source of truth
                         (public tokens + admin chrome)

lib/
  env.ts                 Centralized env access + clerkConfigured /
                         supabasePublicConfigured / supabaseServerConfigured
  auth.ts                requireAdmin() + maybeAdmin() — Clerk + email allowlist
  supabase/public.ts     Anon client (safe in server components, read-only)
  supabase/server.ts     Service-role client (server-only, write access)
  content/insights.ts    Typed accessor that falls back to /content/fallbacks

content/fallbacks/       Typed static content the public site uses when
                         Supabase content is missing

supabase/
  migrations/            0001_initial_schema, 0002_rls_policies,
                         0003_storage_buckets — apply via Supabase SQL editor
                         or `supabase db push`
  seed/                  Seed script lands in Phase 4

public/assets/           Images, logos, SVGs

middleware.ts            Clerk session gate on /admin/* and /api/admin/*;
                         falls through gracefully when Clerk env is missing

legacy-static/           Original hand-written HTML, kept for parity reference
haney-group-*.md         Strategy + content-plan docs
```

`legacy-static/` is excluded from the TS build and from Next's routing. It
exists so the visual design can be diffed against the new app during the port
and deleted once parity is signed off.

## Configuration

The site renders fine with NO environment variables — admin and CMS just
degrade to a "configuration needed" splash. To unlock real admin + CMS,
copy `.env.example` to `.env.local` and fill in:

- Clerk publishable + secret keys (auth)
- `ADMIN_EMAILS` — comma-separated allowlist
- Supabase URL + anon key + service-role key (data + storage)
- Optional: `RESEND_API_KEY` for inquiry email notifications (Phase 6)

## Implementation phases

1. ✅ Next.js scaffold + design-system port
2. ✅ Port remaining public pages
3. ✅ Supabase schema + Clerk admin gate + branded `/admin/login`
4. Admin dashboard editors (Pages, Settings, Navigation, Services, Industries,
   Experience, Clients, Media)
5. Insights system (articles list/new/edit + Tiptap + public dynamic rendering)
6. Contact form wired to Supabase + Inquiry manager + email notifications
7. SEO manager + sitemap + robots (per-page editor; sitemap/robots done)
8. Visual click-to-edit editor (`/admin/pages/[slug]/visual`)

## Design tokens

Defined in `:root` in `styles/main.css`:

- Navy: `--navy-900` `#0B1228` (primary brand)
- Ink: `--ink-1000` `#06091A`
- Paper neutrals: `--paper` / `--paper-2` / `--paper-3` / `--ivory`
- Amber accent: `--amber-500` `#C9892A` (with 400/600/700 variants)
- Type: `--font-sans` (Public Sans)
- Layout: `--maxw` `1240px`, fluid `--gutter`, 4/8 px radii
- Motion: `--ease: cubic-bezier(0.22, 0.61, 0.36, 1)`
```
