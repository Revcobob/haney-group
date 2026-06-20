import { UtilityBar } from "@/components/site/UtilityBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SiteScripts } from "@/components/site/SiteScripts";

// Preview pages render with the full public site chrome (utility bar,
// header, footer, mobile-nav scripts) so what the admin sees in the
// iframe matches what visitors actually see — minus the editing outlines
// added by EditableRegion when ?edit=1 is set.
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
