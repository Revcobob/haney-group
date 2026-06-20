# Supabase seed

Pushes the static `content/fallbacks/*.ts` content into Supabase so the
admin UI has rows to edit on day one. Idempotent — re-running is safe.

## Prerequisites

1. Apply the migrations in `supabase/migrations/000*.sql` (Supabase SQL
   editor, or `supabase db push`).
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local`.

## Run

```bash
npm run seed              # idempotent insert/update
npm run seed -- --reset   # destructive: truncates each cms_ table first
```

## What it does

- Inserts `cms_site_settings` keys for every value in `siteSettings`,
  plus a `client_disclaimer` key for the Clients page strip.
- Inserts `cms_navigation_items` for header, footer, and utility links.
- Inserts `cms_services` (6 capabilities), `cms_industries` (9 cards),
  `cms_experience_items` (6 engagements), `cms_client_logos` (10 logos).
- For each image referenced in those rows, creates a `cms_media` row
  whose `public_url` points to the existing `/assets/...` path under
  `bucket = "static"`. This keeps existing static files working with
  zero re-uploads.
- Pull-quote text and rich body content land as plain strings.

Re-upload images through `/admin/media` to migrate them into real
Supabase Storage buckets.
