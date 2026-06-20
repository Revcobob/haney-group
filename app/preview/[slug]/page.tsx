import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPageWithSections } from "@/lib/content/pages";
import { getServiceCards, getIndustryCards } from "@/lib/content/site";
import { listPublishedArticles } from "@/lib/content/insights";
import { HomeSections } from "@/components/site/HomeSections";
import AboutPage from "@/app/(public)/about/page";
import ServicesPage from "@/app/(public)/services/page";
import IndustriesPage from "@/app/(public)/industries/page";
import ExperiencePage from "@/app/(public)/experience/page";
import InsightsIndexPage from "@/app/(public)/insights/page";
import ContactPage from "@/app/(public)/contact/page";
import PrivacyPage from "@/app/(public)/privacy/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  if (slug === "home") {
    const [page, capabilities, industries, articles] = await Promise.all([
      getPageWithSections("home"),
      getServiceCards(),
      getIndustryCards(),
      listPublishedArticles(),
    ]);
    return (
      <HomeSections
        sections={page?.sections ?? []}
        capabilities={capabilities}
        industries={industries}
        articles={articles}
      />
    );
  }

  // For every other slug, reuse the public page component directly so the
  // preview always matches what visitors see. Each page reads sections via
  // getPageWithSections and wraps editable regions in EditableRegion — that
  // wrapper auto-detects the visual editor iframe and turns on click-to-edit.
  switch (slug) {
    case "about":
      return <AboutPage />;
    case "services":
      return <ServicesPage />;
    case "industries":
      return <IndustriesPage />;
    case "experience":
      return <ExperiencePage />;
    case "insights":
      return <InsightsIndexPage />;
    case "contact":
      return <ContactPage />;
    case "privacy":
      return <PrivacyPage />;
    default:
      notFound();
  }
}
