import type { Metadata } from "next";
import { NavItemForm } from "@/components/admin/forms/NavItemForm";
import { createNavItemAction } from "@/lib/admin/actions/navigation";

export const metadata: Metadata = { title: "Add nav link" };

export default function AdminNavNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Navigation / Add</p>
        <h1>Add a navigation link</h1>
      </div>
      <NavItemForm action={createNavItemAction} cancelHref="/admin/navigation" />
    </>
  );
}
