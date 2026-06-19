import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Pages" };

export default function AdminPagesPage() {
  return (
    <ComingSoon
      eyebrow="Pages"
      title="Edit website pages"
      body="Pick a page to update its hero, sections, cards, CTAs, and images. Changes preview before publishing."
      phase="Phase 4"
    />
  );
}
