import type { MetadataRoute } from "next";
import { tools, categories } from "@/lib/ai-data";
import { blogArticles } from "@/lib/blog-data";

/**
 * Sitemap — auto-generated.
 * Includes: homepage, all tool detail pages, all category pages, top comparison pairs.
 * Submit at: https://search.google.com/search-console
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://myaipicker.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Homepage + Legal Pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/how-we-score`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/best-ai-tools-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // 1b. Blog articles
  for (const a of blogArticles) {
    routes.push({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 2. Tool detail pages (80 pages)
  for (const t of tools) {
    routes.push({
      url: `${SITE_URL}/tools/${t.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 3. Category / "Best AI for X" pages (9 pages)
  for (const c of categories) {
    routes.push({
      url: `${SITE_URL}/best/${c.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // 4. Top comparison pairs (top 12 tools by reviews → ~50 pairs)
  const top = [...tools].sort((a, b) => b.reviews - a.reviews).slice(0, 12);
  let pairCount = 0;
  for (let i = 0; i < top.length && pairCount < 50; i++) {
    for (let j = i + 1; j < top.length && pairCount < 50; j++) {
      routes.push({
        url: `${SITE_URL}/compare/${top[i].id}-vs-${top[j].id}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      pairCount++;
    }
  }

  return routes;
}
