import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Inquiries" };

export default function AdminInquiriesPage() {
  return (
    <ComingSoon
      eyebrow="Inbox"
      title="Contact inquiries"
      body="Notes submitted through the public Contact form. Filter, mark status, export, and email notifications to info@haney-group.com."
      phase="Phase 6"
    />
  );
}
