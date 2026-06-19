import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Insights" };

export default function AdminInsightsPage() {
  return (
    <ComingSoon
      eyebrow="Insights"
      title="The Session Briefing"
      body="Draft, edit, and publish posts. Tiptap-based editor with friendly toolbar and image insertion."
      phase="Phase 5"
    />
  );
}
