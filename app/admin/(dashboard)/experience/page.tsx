import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Experience" };

export default function AdminExperiencePage() {
  return (
    <ComingSoon
      eyebrow="Structure"
      title="Engagement cards"
      body="The anonymized engagement cards on the Experience page. Use anonymized descriptions unless the client has approved public identification."
      phase="Phase 4"
    />
  );
}
