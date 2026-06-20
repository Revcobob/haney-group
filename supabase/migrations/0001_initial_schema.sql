-- =========================================================================
-- The Haney Group CMS — initial schema
-- =========================================================================
-- All tables prefixed cms_ to keep CMS state distinct from anything Supabase
-- adds later (auth schema, edge functions, storage internals).
-- Generates one updated_at trigger and reuses it across every table.
-- =========================================================================

set search_path = public, extensions;

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------- updated_at trigger ----------
create or replace function cms_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- cms_pages ----------
create table if not exists cms_pages (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  page_type   text not null default 'standard',
  status      text not null default 'published'
              check (status in ('draft', 'published')),
  updated_by  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger cms_pages_set_updated_at before update on cms_pages
  for each row execute function cms_set_updated_at();

-- ---------- cms_page_sections ----------
-- Each section has a fixed section_type whose schema is enforced by zod on
-- the application side. content_json holds friendly fields (hero_headline,
-- primary_cta_label, etc.), never developer-style keys.
create table if not exists cms_page_sections (
  id            uuid primary key default gen_random_uuid(),
  page_id       uuid not null references cms_pages(id) on delete cascade,
  section_key   text not null,
  section_label text not null,
  section_type  text not null,
  content_json  jsonb not null default '{}'::jsonb,
  display_order int  not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (page_id, section_key)
);
create index if not exists cms_page_sections_page_idx
  on cms_page_sections(page_id, display_order);
create trigger cms_page_sections_set_updated_at before update on cms_page_sections
  for each row execute function cms_set_updated_at();

-- ---------- cms_media ----------
create table if not exists cms_media (
  id          uuid primary key default gen_random_uuid(),
  file_name   text not null,
  file_path   text not null,
  bucket      text not null,
  public_url  text not null,
  mime_type   text not null,
  size_bytes  bigint not null default 0,
  width       int,
  height      int,
  alt_text    text,
  caption     text,
  category    text,
  uploaded_by text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists cms_media_category_idx on cms_media(category);
create trigger cms_media_set_updated_at before update on cms_media
  for each row execute function cms_set_updated_at();

-- ---------- cms_articles ----------
create table if not exists cms_articles (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  category          text,
  article_label     text,
  summary           text,
  lede              text,
  body_html         text,
  body_json         jsonb,        -- Tiptap doc
  featured_image_id uuid references cms_media(id) on delete set null,
  author            text,
  read_time_minutes int,
  status            text not null default 'draft'
                    check (status in ('draft', 'published')),
  published_at      timestamptz,
  scheduled_for     timestamptz,
  date_label        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists cms_articles_status_idx
  on cms_articles(status, published_at desc);
create trigger cms_articles_set_updated_at before update on cms_articles
  for each row execute function cms_set_updated_at();

-- ---------- cms_seo ----------
create table if not exists cms_seo (
  id               uuid primary key default gen_random_uuid(),
  entity_type      text not null
                   check (entity_type in ('page', 'article', 'path', 'global')),
  entity_id        uuid,
  path             text,
  meta_title       text,
  meta_description text,
  og_title         text,
  og_description   text,
  og_image_id      uuid references cms_media(id) on delete set null,
  canonical_path   text,
  noindex          boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (entity_type, entity_id, path)
);
create trigger cms_seo_set_updated_at before update on cms_seo
  for each row execute function cms_set_updated_at();

-- ---------- cms_contact_inquiries ----------
create table if not exists cms_contact_inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  organization  text,
  email         citext not null,
  phone         text,
  inquiry_type  text,
  message       text not null,
  consent       boolean not null default false,
  source_page   text,
  ip_hash       text,
  user_agent    text,
  status        text not null default 'new'
                check (status in ('new', 'reviewed', 'responded', 'archived', 'spam')),
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists cms_contact_inquiries_status_idx
  on cms_contact_inquiries(status, created_at desc);
create trigger cms_contact_inquiries_set_updated_at before update on cms_contact_inquiries
  for each row execute function cms_set_updated_at();

-- ---------- cms_site_settings ----------
create table if not exists cms_site_settings (
  id                uuid primary key default gen_random_uuid(),
  setting_key       text unique not null,
  setting_value_json jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger cms_site_settings_set_updated_at before update on cms_site_settings
  for each row execute function cms_set_updated_at();

-- ---------- cms_navigation_items ----------
create table if not exists cms_navigation_items (
  id            uuid primary key default gen_random_uuid(),
  nav_area      text not null
                check (nav_area in ('header', 'footer_primary', 'footer_utility', 'utility_bar')),
  label         text not null,
  href          text not null,
  display_order int not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists cms_navigation_items_area_idx
  on cms_navigation_items(nav_area, display_order);
create trigger cms_navigation_items_set_updated_at before update on cms_navigation_items
  for each row execute function cms_set_updated_at();

-- ---------- cms_services ----------
create table if not exists cms_services (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique,
  title         text not null,
  description   text,
  long_html     text,
  icon_media_id uuid references cms_media(id) on delete set null,
  hero_image_id uuid references cms_media(id) on delete set null,
  href          text,
  display_order int not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists cms_services_visible_idx
  on cms_services(is_visible, display_order);
create trigger cms_services_set_updated_at before update on cms_services
  for each row execute function cms_set_updated_at();

-- ---------- cms_industries ----------
create table if not exists cms_industries (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text,
  illustration_media_id uuid references cms_media(id) on delete set null,
  display_order         int not null default 0,
  is_visible            boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists cms_industries_visible_idx
  on cms_industries(is_visible, display_order);
create trigger cms_industries_set_updated_at before update on cms_industries
  for each row execute function cms_set_updated_at();

-- ---------- cms_experience_items ----------
create table if not exists cms_experience_items (
  id                       uuid primary key default gen_random_uuid(),
  title                    text not null,
  client_type              text,
  leading_line             text,
  body                     text,
  image_media_id           uuid references cms_media(id) on delete set null,
  pull_quote               text,
  pull_quote_attribution   text,
  display_order            int not null default 0,
  is_visible               boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists cms_experience_items_visible_idx
  on cms_experience_items(is_visible, display_order);
create trigger cms_experience_items_set_updated_at before update on cms_experience_items
  for each row execute function cms_set_updated_at();

-- ---------- cms_client_logos ----------
create table if not exists cms_client_logos (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  logo_media_id uuid references cms_media(id) on delete set null,
  website_url   text,
  alt_text      text,
  client_status text not null default 'current'
                check (client_status in ('current', 'past')),
  display_order int not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists cms_client_logos_visible_idx
  on cms_client_logos(is_visible, display_order);
create trigger cms_client_logos_set_updated_at before update on cms_client_logos
  for each row execute function cms_set_updated_at();

-- ---------- cms_redirects (optional, low cost) ----------
create table if not exists cms_redirects (
  id          uuid primary key default gen_random_uuid(),
  from_path   text unique not null,
  to_path     text not null,
  status_code int not null default 301,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger cms_redirects_set_updated_at before update on cms_redirects
  for each row execute function cms_set_updated_at();
