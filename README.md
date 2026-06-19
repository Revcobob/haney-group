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
  layout.tsx             Root layout — header, footer, fonts, scripts
  page.tsx               Homepage (Phase 1)
  not-found.tsx          Branded 404
components/site/         Shared layout primitives (Header, Footer, UtilityBar, SiteScripts)
styles/main.css          Design system — single source of truth
public/assets/           Images, logos, SVGs (was /assets in the static build)
content/fallbacks/       Typed static content used when CMS data is missing
legacy-static/           Original hand-written HTML, kept for parity reference
  *.html                 Each public page in its pre-port form
  insights/, services/   Subpages
  CSS/, js/              Dead-code stylesheets/scripts from an earlier draft
haney-group-*.md         Strategy + content-plan docs
```

`legacy-static/` is excluded from the TS build and from Next's routing. It
exists so the visual design can be diffed against the new app during the port
and deleted once parity is signed off.

## Implementation phases

Tracked in the architecture proposal — current phase noted in the latest
commit message.

1. ✅ Next.js scaffold + design-system port (this commit)
2. Port remaining public pages (about, services, experience, industries,
   contact, privacy, insights index + article pages)
3. Supabase schema + Clerk admin gate + branded `/admin/login`
4. Admin dashboard editors (Pages, Settings, Navigation, Services, Industries,
   Experience, Clients, Media)
5. Insights system (articles list/new/edit + Tiptap + public dynamic rendering)
6. Contact form wired to Supabase + Inquiry manager
7. SEO manager + sitemap + robots
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
