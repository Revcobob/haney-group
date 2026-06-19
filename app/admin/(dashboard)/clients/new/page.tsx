import type { Metadata } from "next";
import { ClientLogoForm } from "@/components/admin/forms/ClientLogoForm";
import { createClientLogoAction } from "@/lib/admin/actions/clients";

export const metadata: Metadata = { title: "Add client logo" };

export default function AdminClientsNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Clients / Add</p>
        <h1>Add a client logo</h1>
        <p>Alt text is required. Save as hidden first if waiting on client approval.</p>
      </div>
      <ClientLogoForm action={createClientLogoAction} cancelHref="/admin/clients" />
    </>
  );
}
