import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "reorder"
  | "reset"
  | "bulk";

export type AuditActor = { id: string; email?: string | null };

// Fire-and-forget. We never want a failed audit write to break the
// underlying action, so we log + swallow errors here.
export async function recordAudit(
  actor: AuditActor | null,
  args: {
    table: string;
    rowId?: string | null;
    action: AuditAction;
    detail?: string;
  }
): Promise<void> {
  if (!supabaseServerConfigured) return;
  try {
    const sb = serverSupabase();
    await sb.from("cms_audit_log").insert({
      actor_id: actor?.id ?? null,
      actor_email: actor?.email ?? null,
      table_name: args.table,
      row_id: args.rowId ?? null,
      action: args.action,
      detail: args.detail ?? null,
    } as never);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("audit write failed:", (e as Error).message);
  }
}

export type AuditLogRow = {
  id: string;
  actor_email: string | null;
  table_name: string;
  row_id: string | null;
  action: AuditAction;
  detail: string | null;
  created_at: string;
};

export async function listRecentAudit(limit = 12): Promise<AuditLogRow[]> {
  if (!supabaseServerConfigured) return [];
  try {
    const sb = serverSupabase();
    const { data } = await sb
      .from("cms_audit_log")
      .select("id, actor_email, table_name, row_id, action, detail, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as unknown as AuditLogRow[];
  } catch {
    return [];
  }
}
