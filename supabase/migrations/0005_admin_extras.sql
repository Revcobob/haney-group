-- Round 3 schema additions
--   * articles can carry a scheduled publish date — public reads filter
--     this out of the list until the date has passed.
--   * a small audit log captures who changed what + when so the admin
--     dashboard can show a "Recent activity" panel.

alter table if exists cms_articles
  add column if not exists scheduled_publish_at timestamptz;

create table if not exists cms_audit_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    text,           -- Clerk user id or service identifier
  actor_email text,
  table_name  text not null,  -- which cms_* table
  row_id      text,           -- the affected row, when applicable
  action      text not null,  -- e.g. 'create', 'update', 'delete',
                              -- 'reorder', 'publish', 'unpublish'
  detail      text,           -- short human-readable description
  created_at  timestamptz not null default now()
);
create index if not exists cms_audit_log_recent_idx
  on cms_audit_log (created_at desc);
