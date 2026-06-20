import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPageWithSections } from "@/lib/content/pages";
import { getServiceCards, getIndustryCards } from "@/lib/content/site";
import { listPublishedArticles } from "@/lib/content/insights";
import { HomeSections } from "@/components/site/HomeSections";

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

  // Today only the homepage has a section-driven renderer. Other pages would
  // hit this route once their section editor lands.
  if (slug !== "home") notFound();

  const [page, capabilities, industries, articles] = await Promise.all([
    getPageWithSections("home"),
    getServiceCards(),
    getIndustryCards(),
    listPublishedArticles(),
  ]);
  const sections = page?.sections ?? [];
  return (
    <HomeSections
      sections={sections}
      capabilities={capabilities}
      industries={industries}
      articles={articles}
    />
  );
}
