import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Navigation" };

export default function AdminNavigationPage() {
  return (
    <ComingSoon
      eyebrow="Site"
      title="Navigation"
      body="Header, footer, and utility-bar links. Add, reorder, hide. Changes appear everywhere the nav renders."
      phase="Phase 4"
    />
  );
}
