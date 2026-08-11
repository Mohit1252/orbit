import type { MetadataRoute } from "next";

/**
 * robots.txt — tells search engine crawlers what to index.
 * Allowing all major bots (Google, Bing, Ahrefs, etc.) full access.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Explicitly allow major search + SEO bots
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
      },
    ],
    sitemap: "https://myaipicker.com/sitemap.xml",
    host: "https://myaipicker.com",
  };
}
