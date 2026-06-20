-- Section drafts: a section row can carry an unpublished "draft" copy
-- of its content alongside the live one. Public reads ignore it; the
-- visual editor preview prefers the draft so admins can stage a change
-- and only commit when ready.

alter table if exists cms_page_sections
  add column if not exists draft_content_json jsonb,
  add column if not exists has_draft boolean not null default false,
  add column if not exists draft_updated_at timestamptz;

create index if not exists cms_page_sections_has_draft_idx
  on cms_page_sections (page_id) where has_draft = true;
