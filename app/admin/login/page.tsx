import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { clerkConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (!clerkConfigured) redirect("/admin/setup-needed");
  const { userId } = await auth();
  if (userId) redirect("/admin/dashboard");

  return (
    <div className="admin__authshell">
      <div className="admin__authcard">
        <div className="admin__authcard-brand">
          <img src="/assets/img/inline-1c87817066.png" alt="The Haney Group" />
          <div className="admin__authcard-brand-meta">
            <span className="admin__authcard-eyebrow">The Haney Group</span>
            <span className="admin__authcard-meta-label">Site Admin</span>
          </div>
        </div>
        <div className="admin__authcard-rule" aria-hidden="true"></div>
        <div>
          <h1>Sign in to the firm site.</h1>
          <p>
            Access is restricted to approved principals at The Haney Group. Use
            the email address you were added with.
          </p>
        </div>

        <SignIn
          routing="hash"
          fallbackRedirectUrl="/admin/dashboard"
          signUpUrl="/admin/login"
          appearance={{
            elements: {
              rootBox: "cl-rootBox",
              card: "cl-card",
              headerTitle: { display: "none" },
              headerSubtitle: { display: "none" },
              socialButtonsBlockButton: {
                borderColor: "rgba(255,255,255,0.18)",
                color: "#F5F1E8",
                backgroundColor: "rgba(255,255,255,0.04)",
              },
              socialButtonsBlockButton__hover: {
                backgroundColor: "rgba(255,255,255,0.08)",
              },
              formFieldLabel: {
                color: "rgba(245,241,232,0.78)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              },
              formFieldInput: {
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.18)",
                color: "#F5F1E8",
                fontSize: "15px",
              },
              formButtonPrimary: {
                backgroundColor: "#C9892A",
                color: "#06091A",
                fontSize: "14.5px",
                fontWeight: 600,
                borderRadius: "4px",
                textTransform: "none",
              },
              formButtonPrimary__hover: { backgroundColor: "#D69C40" },
              dividerLine: { backgroundColor: "rgba(255,255,255,0.10)" },
              dividerText: { color: "rgba(245,241,232,0.5)" },
              footer: { display: "none" },
              footerAction: { display: "none" },
              footerActionLink: { color: "#D69C40" },
              identityPreviewText: { color: "#F5F1E8" },
              identityPreviewEditButton: { color: "#D69C40" },
            },
            variables: {
              colorPrimary: "#C9892A",
              colorBackground: "transparent",
              colorText: "#F5F1E8",
              colorTextSecondary: "rgba(245,241,232,0.78)",
              colorInputBackground: "rgba(255,255,255,0.04)",
              colorInputText: "#F5F1E8",
              fontFamily: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              borderRadius: "4px",
            },
          }}
        />

        <div className="admin__authcard-foot">
          <span>Restricted Access</span>
          <Link href="/">← Return to haney-group.com</Link>
        </div>
      </div>
    </div>
  );
}
