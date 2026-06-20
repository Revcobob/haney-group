# content/fallbacks

Typed static content the public site renders when CMS (Supabase) content is
missing or unavailable. This guarantees the site never breaks if the database
is empty or offline.

Populated starting in **Phase 2** alongside the page-by-page port.

Shape mirrors the `cms_pages` + `cms_page_sections` schema so the same React
components can render either source without branching logic at call sites.
