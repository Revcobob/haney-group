-- =========================================================================
-- The Haney Group CMS — Row Level Security
-- =========================================================================
-- Policy: anon role can READ published content and INSERT inquiries.
-- All writes for everything else go through server code using the service
-- role key, which bypasses RLS. We never give anon any write access except
-- the single contact-form insert.
-- =========================================================================

-- Enable RLS on every cms_ table
alter table cms_pages              enable row level security;
alter table cms_page_sections      enable row level security;
alter table cms_articles           enable row level security;
alter table cms_seo                enable row level security;
alter table cms_media              enable row level security;
alter table cms_contact_inquiries  enable row level security;
alter table cms_site_settings      enable row level security;
alter table cms_navigation_items   enable row level security;
alter table cms_services           enable row level security;
alter table cms_industries         enable row level security;
alter table cms_experience_items   enable row level security;
alter table cms_client_logos       enable row level security;
alter table cms_redirects          enable row level security;

-- ---------- Public reads ----------
-- Pages: published only
drop policy if exists "anon reads published pages" on cms_pages;
create policy "anon reads published pages"
  on cms_pages for select
  to anon, authenticated
  using (status = 'published');

-- Page sections: visible-only AND attached to a published page
drop policy if exists "anon reads visible sections of published pages" on cms_page_sections;
create policy "anon reads visible sections of published pages"
  on cms_page_sections for select
  to anon, authenticated
  using (
    is_visible
    and exists (
      select 1 from cms_pages p
      where p.id = page_id and p.status = 'published'
    )
  );

-- Articles: published only
drop policy if exists "anon reads published articles" on cms_articles;
create policy "anon reads published articles"
  on cms_articles for select
  to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= now()));

-- Most other tables: visible/published rows readable
drop policy if exists "anon reads visible services" on cms_services;
create policy "anon reads visible services"
  on cms_services for select to anon, authenticated using (is_visible);

drop policy if exists "anon reads visible industries" on cms_industries;
create policy "anon reads visible industries"
  on cms_industries for select to anon, authenticated using (is_visible);

drop policy if exists "anon reads visible experience" on cms_experience_items;
create policy "anon reads visible experience"
  on cms_experience_items for select to anon, authenticated using (is_visible);

drop policy if exists "anon reads visible client logos" on cms_client_logos;
create policy "anon reads visible client logos"
  on cms_client_logos for select to anon, authenticated using (is_visible);

drop policy if exists "anon reads visible navigation" on cms_navigation_items;
create policy "anon reads visible navigation"
  on cms_navigation_items for select to anon, authenticated using (is_visible);

drop policy if exists "anon reads site settings" on cms_site_settings;
create policy "anon reads site settings"
  on cms_site_settings for select to anon, authenticated using (true);

drop policy if exists "anon reads seo" on cms_seo;
create policy "anon reads seo"
  on cms_seo for select to anon, authenticated using (true);

drop policy if exists "anon reads media" on cms_media;
create policy "anon reads media"
  on cms_media for select to anon, authenticated using (true);

drop policy if exists "anon reads redirects" on cms_redirects;
create policy "anon reads redirects"
  on cms_redirects for select to anon, authenticated using (true);

-- ---------- Contact inquiries: INSERT only ----------
-- Anon may create an inquiry. They may NOT select, update, or delete any.
-- The admin app reads them via service-role.
drop policy if exists "anon submits inquiries" on cms_contact_inquiries;
create policy "anon submits inquiries"
  on cms_contact_inquiries for insert
  to anon, authenticated
  with check (
    name is not null
    and email is not null
    and message is not null
    and consent = true
  );

-- Explicitly no other policies for cms_contact_inquiries.
-- Without a policy + RLS on, anon cannot select/update/delete.
