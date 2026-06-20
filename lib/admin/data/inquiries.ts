import "server-only";
import { serverSupabase } from "@/lib/supabase/server";
import { supabaseServerConfigured } from "@/lib/env";

export type InquiryStatus = "new" | "reviewed" | "responded" | "archived" | "spam";

export type AdminInquiryRow = {
  id: string;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  inquiry_type: string | null;
  message: string;
  consent: boolean;
  source_page: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryFilter = {
  status?: InquiryStatus | "all";
  search?: string;
};

export async function listAdminInquiries(
  filter: InquiryFilter = {}
): Promise<AdminInquiryRow[]> {
  if (!supabaseServerConfigured) return [];
  const sb = serverSupabase();
  let q = sb.from("cms_contact_inquiries").select("*");
  if (filter.status && filter.status !== "all") {
    q = q.eq("status", filter.status);
  }
  if (filter.search && filter.search.trim()) {
    const s = `%${filter.search.trim()}%`;
    q = q.or(`name.ilike.${s},email.ilike.${s},organization.ilike.${s},message.ilike.${s}`);
  }
  const { data, error } = await q.order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminInquiryRow[];
}

export async function getAdminInquiry(id: string): Promise<AdminInquiryRow | null> {
  if (!supabaseServerConfigured) return null;
  const sb = serverSupabase();
  const { data, error } = await sb
    .from("cms_contact_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as AdminInquiryRow | null) ?? null;
}

export async function countNewInquiries(): Promise<number> {
  if (!supabaseServerConfigured) return 0;
  const sb = serverSupabase();
  const { count, error } = await sb
    .from("cms_contact_inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return 0;
  return count ?? 0;
}
