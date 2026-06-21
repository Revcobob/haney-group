import { requireAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CommandPalette } from "@/components/admin/CommandPalette";

// Every page rendered through this layout is gated by requireAdmin().
// Unauthorized requests redirect to /admin/login or /admin/forbidden
// before any UI renders.
export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="admin">
      <AdminHeader user={user} />
      <AdminSidebar role={user.role} />
      <div className="admin__main">{children}</div>
      <CommandPalette />
    </div>
  );
}
