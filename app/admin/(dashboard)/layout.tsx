import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { DirtyFormProvider } from "@/components/admin/DirtyFormProvider";
import { countNewInquiries } from "@/lib/admin/data/inquiries";
import { supabaseServerConfigured } from "@/lib/env";

// Every page rendered through this layout is gated by requireAdmin().
// Unauthorized requests redirect to /admin/login or /admin/forbidden
// before any UI renders.
export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  // Initial inquiry count for the sidebar badge. The sidebar then
  // polls /api/admin/inquiries/count on a timer + on tab focus so it
  // stays fresh while the admin is on a long-lived page.
  const newInquiryCount = supabaseServerConfigured
    ? await countNewInquiries()
    : 0;
  return (
    <DirtyFormProvider>
      <div className="admin">
        <AdminHeader user={user} />
        <AdminSidebar
          role={user.role}
          initialNewInquiryCount={newInquiryCount}
        />
        <div className="admin__main">{children}</div>
        <CommandPalette />
      </div>
    </DirtyFormProvider>
  );
}
