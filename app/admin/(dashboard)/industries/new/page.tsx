import type { Metadata } from "next";
import { IndustryForm } from "@/components/admin/forms/IndustryForm";
import { createIndustryAction } from "@/lib/admin/actions/industries";

export const metadata: Metadata = { title: "Add industry" };

export default function AdminIndustryNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Industries / Add</p>
        <h1>Add an industry</h1>
        <p>Create a new industry card. Save as hidden first if still drafting.</p>
      </div>
      <IndustryForm action={createIndustryAction} cancelHref="/admin/industries" />
    </>
  );
}
