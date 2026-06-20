import { UtilityBar } from "@/components/site/UtilityBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteScripts } from "@/components/site/SiteScripts";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <UtilityBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SiteScripts />
    </>
  );
}
