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
    {
      url: `${SITE_URL}/ai-resume-writer`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
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

  // 4. Comparison pairs — must match generateStaticParams in compare/[slug]/page.tsx
  // Generate meaningful pairs only (within-category + curated cross-category).
  // See COMPARISON_WORTHY + CROSS_CATEGORY_PAIRS in compare/[slug]/page.tsx.
  const COMPARISON_WORTHY = new Set([
    "chatgpt", "claude", "gemini", "grok", "perplexity", "llama",
    "deepseek", "mistral", "ms-copilot", "notion-ai", "poe", "jasper",
    "writesonic", "rytr",
    "midjourney", "dalle3", "stable-diffusion", "firefly", "leonardo",
    "ideogram", "flux", "recraft", "playground", "imagen",
    "runway", "pika", "luma", "veo", "kling",
    "elevenlabs", "murf", "play-ht", "speechify",
    "cursor", "github-copilot", "windsurf", "claude-code",
    "suno", "udio",
  ]);
  const CROSS_CATEGORY_PAIRS: [string, string][] = [
    ["chatgpt", "github-copilot"],
    ["claude", "claude-code"],
    ["gemini", "github-copilot"],
    ["chatgpt", "dalle3"],
    ["chatgpt", "perplexity"],
    ["gemini", "perplexity"],
    ["claude", "perplexity"],
  ];
  const worthy = tools.filter((t) => COMPARISON_WORTHY.has(t.id));
  const byCategory = new Map<string, typeof worthy>();
  for (const t of worthy) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }
  const seenPairs = new Set<string>();
  const addPairToSitemap = (a: string, b: string) => {
    const key = `${a}-vs-${b}`;
    if (seenPairs.has(key) || a === b) return;
    seenPairs.add(key);
    routes.push({
      url: `${SITE_URL}/compare/${a}-vs-${b}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  };
  for (const [, group] of byCategory) {
    const sorted = [...group].sort((x, y) => y.reviews - x.reviews);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        addPairToSitemap(sorted[i].id, sorted[j].id);
      }
    }
  }
  for (const [a, b] of CROSS_CATEGORY_PAIRS) {
    if (tools.find((t) => t.id === a) && tools.find((t) => t.id === b)) {
      addPairToSitemap(a, b);
    }
  }

  return routes;
}
