import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Site Settings" };

export default function AdminSettingsPage() {
  return (
    <ComingSoon
      eyebrow="Site"
      title="Site settings"
      body="Firm name, phone, email, mailing address, LinkedIn, footer copy, copyright text, compliance links, and the default social-sharing image."
      phase="Phase 4"
    />
  );
}
