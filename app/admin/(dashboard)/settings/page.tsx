import type { Metadata } from "next";
import { getAdminSettings } from "@/lib/admin/data/settings";
import { saveSettingsAction } from "@/lib/admin/actions/settings";
import { SiteSettingsForm } from "@/components/admin/forms/SiteSettingsForm";
import { supabaseServerConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">Site</p>
        <h1>Site settings</h1>
        <p>
          Firm name, phone, email, mailing address, social links, footer copy,
          and compliance links. Changes save to the live site immediately.
        </p>
      </div>

      {!supabaseServerConfigured ? (
        <div className="admin__notice admin__notice--warning">
          <div>
            <strong>Supabase not connected.</strong>
            <p>
              You can view current values below, but saving is disabled until
              Supabase env vars are set. The site is rendering from built-in
              fallback content.
            </p>
          </div>
        </div>
      ) : null}

      <SiteSettingsForm action={saveSettingsAction} settings={settings} />
    </>
  );
}
