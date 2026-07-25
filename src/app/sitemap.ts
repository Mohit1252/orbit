import type { MetadataRoute } from "next";

/**
 * Sitemap — auto-generated at build time.
 * Google Search Console mein submit karna hai jab domain live ho.
 *
 * Abhi sirf homepage hai. Jab naye pages add honge (tool detail pages,
 * comparison pages, category pages), yahan unke URLs add karne hain.
 */

// Apna domain yahan set karo jab live ho.
// Production mein NEXT_PUBLIC_SITE_URL env var set karna.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://myaipicker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // TODO (kal): jab /tools/[slug] pages banenge, yahan add karna:
    // ...tools.map((t) => ({
    //   url: `${SITE_URL}/tools/${t.id}`,
    //   lastModified: now,
    //   changeFrequency: "weekly" as const,
    //   priority: 0.8,
    // })),
    // TODO: jab /best/[category] pages banenge:
    // ...categories.map((c) => ({
    //   url: `${SITE_URL}/best/${c.id}`,
    //   lastModified: now,
    //   changeFrequency: "weekly" as const,
    //   priority: 0.7,
    // })),
  ];
}
