import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../styles/main.css";
import { clerkConfigured } from "@/lib/env";

// Self-hosted at build time: no render-blocking round trip to fonts.googleapis
// and no second connection to fonts.gstatic. Next also generates a
// size-adjusted local fallback from the real font's metrics, so the swap
// costs no layout shift. Weights match what main.css actually asks for.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-public-sans",
  fallback: ["Söhne", "GT America", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haney-group.com"),
  title: {
    default: "The Haney Group · Texas Government Relations & Legislative Strategy",
    template: "%s · The Haney Group",
  },
  description:
    "Austin government relations counsel for Texas legislation, appropriations, House procedure, bill drafting, and advocacy.",
  openGraph: {
    title: "The Haney Group · Texas Government Relations",
    description:
      "Direct counsel on Texas legislation, appropriations, House procedure, bill drafting, and advocacy.",
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
    <html lang="en" className={publicSans.variable} suppressHydrationWarning>
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
