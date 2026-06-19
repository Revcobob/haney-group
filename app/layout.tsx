import type { Metadata, Viewport } from "next";
import "../styles/main.css";
import { UtilityBar } from "@/components/site/UtilityBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteScripts } from "@/components/site/SiteScripts";

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
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <UtilityBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <SiteScripts />
      </body>
    </html>
  );
}
