-- Service capability rows can carry a short hint that tells the admin
-- what kind of visual the icon slot expects (e.g., "Bill draft",
-- "Capitol hallway"). Surfaced as helper text on the icon picker in
-- /admin/services so the slot is meaningful even before the artwork
-- ships. Optional; existing rows keep working with a null value.
alter table if exists cms_services
  add column if not exists icon_hint text;
