import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Client Logos" };

export default function AdminClientsPage() {
  return (
    <ComingSoon
      eyebrow="Structure"
      title="Selected client logos"
      body="The Clients page logo strip. Add logos, set display order, mark current or past, hide and show, and edit the disclaimer text."
      phase="Phase 4"
    />
  );
}
