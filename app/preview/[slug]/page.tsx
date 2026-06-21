import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPageWithSections } from "@/lib/content/pages";
import { getServiceCards, getIndustryCards } from "@/lib/content/site";
import { listPublishedArticles } from "@/lib/content/insights";
import { HomeSections } from "@/components/site/HomeSections";
import { PreviewLiveBridge } from "@/components/site/PreviewLiveBridge";
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

  const body = await renderBody(slug);
  if (body === null) notFound();
  return (
    <>
      {body}
      {/* Patches plain-text fields in-place when the parent admin posts
          a preview-overlay message — gives admins typing-fast feedback
          without a save round-trip. */}
      <PreviewLiveBridge />
    </>
  );
}

async function renderBody(slug: string): Promise<React.ReactNode | null> {
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
  switch (slug) {
    case "about":      return <AboutPage />;
    case "services":   return <ServicesPage />;
    case "industries": return <IndustriesPage />;
    case "experience": return <ExperiencePage />;
    case "insights":   return <InsightsIndexPage />;
    case "contact":    return <ContactPage />;
    case "privacy":    return <PrivacyPage />;
    default:           return null;
  }
}
