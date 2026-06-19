import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Services" };

export default function AdminServicesPage() {
  return (
    <ComingSoon
      eyebrow="Structure"
      title="Services & capabilities"
      body="Edit the six capabilities and four practice areas. Reorder, replace icons, hide or show."
      phase="Phase 4"
    />
  );
}
