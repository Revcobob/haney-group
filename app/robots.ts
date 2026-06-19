import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/preview/"],
      },
    ],
    sitemap: "https://www.haney-group.com/sitemap.xml",
  };
}
