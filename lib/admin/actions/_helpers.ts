import "server-only";
import { z, ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Wraps a server action with admin gate + Supabase config check + zod parsing.
// Server actions read a FormData and return ActionResult.
export async function adminFormAction<S extends z.ZodTypeAny>(
  schema: S,
  formData: FormData,
  handler: (
    input: z.infer<S>,
    supabase: ReturnType<typeof serverSupabase>,
    adminId: string
  ) => Promise<ActionResult>
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (!supabaseServerConfigured) {
    return {
      ok: false,
      error:
        "Supabase is not yet connected. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local to enable saving.",
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const err = parsed.error as ZodError;
    const fieldErrors: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  try {
    return await handler(parsed.data, serverSupabase(), admin.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error saving changes.";
    return { ok: false, error: msg };
  }
}
