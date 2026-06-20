// Centralized env access with feature-flag helpers.
// The site renders fine with NO env vars set — admin and CMS just degrade
// to "configuration needed" states. Each helper makes that explicit.

function read(key: string): string | undefined {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v : undefined;
}

export const clerkConfigured = Boolean(
  read("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") && read("CLERK_SECRET_KEY")
);

export const supabasePublicConfigured = Boolean(
  read("NEXT_PUBLIC_SUPABASE_URL") && read("NEXT_PUBLIC_SUPABASE_ANON_KEY")
);

export const supabaseServerConfigured = Boolean(
  read("NEXT_PUBLIC_SUPABASE_URL") && read("SUPABASE_SERVICE_ROLE_KEY")
);

export const env = {
  CLERK_PUBLISHABLE_KEY: read("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: read("CLERK_SECRET_KEY"),
  CLERK_SIGN_IN_URL: read("NEXT_PUBLIC_CLERK_SIGN_IN_URL") ?? "/admin/login",
  SUPABASE_URL: read("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: read("SUPABASE_SERVICE_ROLE_KEY"),
  CONTACT_NOTIFICATION_EMAIL:
    read("CONTACT_NOTIFICATION_EMAIL") ?? "info@haney-group.com",
  RESEND_API_KEY: read("RESEND_API_KEY"),
};

export function getAdminEmails(): string[] {
  const raw = read("ADMIN_EMAILS");
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Editors can edit content (cards, sections, articles, media) but
// cannot touch Site Settings, Navigation, page publish status, or
// delete rows. Empty list means "no editor-only users".
export function getEditorEmails(): string[] {
  const raw = read("ADMIN_EDITORS");
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}
