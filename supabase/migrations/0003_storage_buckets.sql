-- =========================================================================
-- The Haney Group CMS — Storage buckets
-- =========================================================================
-- Buckets are created via the Supabase CLI/UI normally, but we keep the
-- spec here so it travels with the schema. Run this in the SQL editor or
-- replicate the equivalent in `supabase storage buckets create`.
-- =========================================================================

insert into storage.buckets (id, name, public)
values
  ('hero-images',   'hero-images',   true),
  ('site-media',    'site-media',    true),
  ('insight-images','insight-images',true),
  ('client-logos',  'client-logos',  true),
  ('og-images',     'og-images',     true),
  ('documents',     'documents',     false)
on conflict (id) do nothing;

-- ---------- Public read on public buckets ----------
-- Supabase Storage's RLS lives in storage.objects. Allow anon SELECT on
-- objects in the public buckets.
drop policy if exists "Public read on cms public buckets" on storage.objects;
create policy "Public read on cms public buckets"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id in ('hero-images','site-media','insight-images','client-logos','og-images')
  );

-- Writes go through the service role (which bypasses RLS), so no insert
-- policy is needed for anon. Documents bucket stays private; signed URLs
-- are minted server-side when needed.
