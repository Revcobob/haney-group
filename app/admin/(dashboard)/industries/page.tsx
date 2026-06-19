import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Industries" };

export default function AdminIndustriesPage() {
  return (
    <ComingSoon
      eyebrow="Structure"
      title="Industry cards"
      body="The nine industry cards on the Clients page. Edit title, description, illustration, alt text, order."
      phase="Phase 4"
    />
  );
}
