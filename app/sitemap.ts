import type { MetadataRoute } from "next";
import { serviceDetails } from "@/content/fallbacks/services";
import { listArticleSlugs } from "@/lib/content/insights";

const SITE = "https://www.haney-group.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/about",
    "/services",
    "/experience",
    "/industries",
    "/insights",
    "/contact",
    "/privacy",
  ];

  const articleSlugs = await listArticleSlugs();

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...serviceDetails.map((s) => ({
      url: `${SITE}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articleSlugs.map((slug) => ({
      url: `${SITE}/insights/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
