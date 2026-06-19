# Supabase seed

Phase 3 ships the schema; Phase 4 will add a TypeScript seed script that
reads `content/fallbacks/*.ts` and writes the rows into Supabase via the
service-role client. That keeps the seed in sync with the static fallback
the public site uses when the DB is empty.

For now, the schema migration files are sufficient. Apply them with:

```bash
# either via the Supabase CLI...
supabase db push

# ...or paste each file's contents into the Supabase SQL editor, in order:
#   0001_initial_schema.sql
#   0002_rls_policies.sql
#   0003_storage_buckets.sql
```

Once Phase 4 lands, the seed will be runnable with:

```bash
npm run seed
```
