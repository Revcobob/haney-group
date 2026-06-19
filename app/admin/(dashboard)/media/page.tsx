import type { Metadata } from "next";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Media Library" };

export default function AdminMediaPage() {
  return (
    <ComingSoon
      eyebrow="Media"
      title="Media library"
      body="Upload, replace, and organize images. Required alt text, category tags, file-type and size validation."
      phase="Phase 4"
    />
  );
}
