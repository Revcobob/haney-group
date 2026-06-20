import type { Metadata } from "next";
import { resolveMetadata } from "@/lib/content/seo";
import { getPageWithSections } from "@/lib/content/pages";
import { getServiceCards, getIndustryCards } from "@/lib/content/site";
import { listPublishedArticles } from "@/lib/content/insights";
import { HomeSections } from "@/components/site/HomeSections";

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    path: "/",
    fallback: {
      title: "The Haney Group · Texas Government Relations & Legislative Strategy",
      description:
        "A senior-led Austin government relations firm with deep Texas Capitol experience. Legislative strategy, appropriations, parliamentary procedure, and disciplined advocacy for associations, corporations, public entities, and policy organizations.",
    },
  });
}

export default async function HomePage() {
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
