import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/main.css";
import { clerkConfigured } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haney-group.com"),
  title: {
    default: "The Haney Group · Texas Government Relations & Legislative Strategy",
    template: "%s · The Haney Group",
  },
  description:
    "A senior-led Austin government relations firm with deep Texas Capitol experience. Legislative strategy, appropriations, parliamentary procedure, and disciplined advocacy for associations, corporations, public entities, and policy organizations.",
  openGraph: {
    title: "The Haney Group · Texas Government Relations",
    description:
      "Senior-led legislative strategy, appropriations, and procedural expertise for organizations whose Texas priorities cannot afford to be misunderstood.",
    type: "website",
    url: "https://www.haney-group.com/",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B1228",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    // suppressHydrationWarning: the public layout's motion boot script adds
    // a class to <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );

  // Only wrap in ClerkProvider when Clerk is configured. Otherwise the
  // provider throws at runtime over missing keys and breaks the public site.
  if (clerkConfigured) {
    return <ClerkProvider>{body}</ClerkProvider>;
  }
  return body;
}
