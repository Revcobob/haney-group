import type { Metadata } from "next";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import { createExperienceAction } from "@/lib/admin/actions/experience";

export const metadata: Metadata = { title: "Add engagement" };

export default function AdminExperienceNewPage() {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Experience / Add</p>
        <h1>Add an engagement</h1>
        <p>Save as hidden first if you’re still drafting or awaiting client approval.</p>
      </div>
      <ExperienceForm action={createExperienceAction} cancelHref="/admin/experience" />
    </>
  );
}
