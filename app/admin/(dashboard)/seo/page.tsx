import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "SEO" };

export default function AdminSEOPage() {
  return (
    <ComingSoon
      eyebrow="SEO"
      title="SEO manager"
      body="Per-page meta titles, descriptions, social previews, canonical paths. Global defaults that fill in when a page leaves a field blank."
      phase="Phase 7"
    />
  );
}
