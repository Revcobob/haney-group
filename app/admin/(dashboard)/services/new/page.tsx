import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { createServiceAction } from "@/lib/admin/actions/services";

export const metadata: Metadata = { title: "Add service" };

export default function AdminServicesNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Services / Add</p>
        <h1>Add a service</h1>
        <p>Create a new capability card. Save as hidden first if you’re still drafting.</p>
      </div>
      <ServiceForm action={createServiceAction} cancelHref="/admin/services" />
    </>
  );
}
