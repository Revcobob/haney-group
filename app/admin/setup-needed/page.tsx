import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/admin/BrandMark";

export const metadata: Metadata = { title: "Admin setup" };

export default function SetupNeededPage() {
  return (
    <div className="admin__authshell">
      <div className="admin__authcard">
        <div className="admin__authcard-brand" style={{ color: "var(--paper)" }}>
          <BrandMark size="lg" />
        </div>
        <div className="admin__authcard-rule" aria-hidden="true"></div>
        <div>
          <h1>Admin is not yet configured.</h1>
          <p>
            The public website is live and serving content. The admin sign-in is
            waiting on Clerk + Supabase credentials in this environment&rsquo;s
            secrets.
          </p>
          <p style={{ marginTop: 14 }}>
            Add the values from <code>.env.example</code> to <code>.env.local</code>{" "}
            (locally) or to the project&rsquo;s deploy environment variables, then
            redeploy:
          </p>
        </div>
        <code className="admin__codeblock">{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
ADMIN_EMAILS=info@haney-group.com

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...`}</code>
        <p style={{ color: "rgba(245,241,232,0.7)", fontSize: 14 }}>
          Without these, the public site continues to render fine from the
          built-in fallback content.
        </p>
        <div className="admin__authcard-foot">
          <span>Awaiting Credentials</span>
          <Link href="/">← Return to haney-group.com</Link>
        </div>
      </div>
    </div>
  );
}
