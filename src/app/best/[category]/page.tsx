import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { categories, getCategoryCounts, type Category } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { ArrowRight, Star } from "lucide-react";

/**
 * Category Landing Page — /best/[category]
 * SEO target: "best AI for [category]", "top AI [category] tools"
 */

const categorySeo: Record<
  string,
  { title: string; desc: string; keywords: string[] }
> = {
  writing: {
    title: "Best AI Writing Tools (2026) — Free & Paid",
    desc: "Compare the best AI writing tools for blog posts, copywriting, and long-form content. See pricing, features, and real ratings to pick the right writing AI.",
    keywords: ["best ai writing tools", "ai for writing", "ai copywriting", "ai for blog posts"],
  },
  coding: {
    title: "Best AI Coding Tools (2026) — Copilots & Agents",
    desc: "Compare the best AI coding assistants and dev agents. See features, pricing, and benchmark scores for Cursor, Copilot, Claude Code, and more.",
    keywords: ["best ai for coding", "ai coding tools", "ai copilots", "ai dev agents"],
  },
  images: {
    title: "Best AI Image Generators (2026) — Free & Paid",
    desc: "Compare the best AI image generation tools. See quality benchmarks, pricing, and features for Midjourney, DALL-E 3, FLUX.1, and more.",
    keywords: ["best ai image generators", "ai art tools", "free ai image gen", "ai logo design"],
  },
  video: {
    title: "Best AI Video Generators (2026) — Text-to-Video",
    desc: "Compare the best AI video generation tools. See quality, clip length, pricing for Runway, Veo, Kling, Sora, and more.",
    keywords: ["best ai video generators", "text to video ai", "ai video tools"],
  },
  voice: {
    title: "Best AI Voice & TTS Tools (2026) — Text-to-Speech",
    desc: "Compare the best AI voice generators and text-to-speech tools. See pricing, voice quality, and cloning features for ElevenLabs, Murf, and more.",
    keywords: ["best ai voice generators", "ai tts tools", "ai voice cloning", "text to speech ai"],
  },
  data: {
    title: "Best AI for Data Analysis & Research (2026)",
    desc: "Compare the best AI tools for data analysis, research, and RAG. See pricing and features for enterprise data AI tools.",
    keywords: ["best ai for data analysis", "ai research tools", "ai rag models"],
  },
  agents: {
    title: "Best AI Agents (2026) — Autonomous Workflows",
    desc: "Compare the best AI agent platforms for autonomous workflows, task automation, and multi-step reasoning.",
    keywords: ["best ai agents", "autonomous ai tools", "ai agent platforms"],
  },
  search: {
    title: "Best AI Search Engines (2026) — Answer Engines",
    desc: "Compare the best AI search and answer engines. See pricing and features for Perplexity, Google AI Mode, and more.",
    keywords: ["best ai search engines", "ai answer engines", "ai research search"],
  },
  build: {
    title: "Best AI App & Website Builders (2026) — No-Code",
    desc: "Compare the best AI app builders and website generators. See pricing and features for v0, Bolt, Lovable, and more.",
    keywords: ["best ai app builders", "ai website builders", "no-code ai tools", "ai for building apps"],
  },
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  return params.then(({ category }) => {
    const cat = categories.find((c) => c.id === category);
    if (!cat) return { title: "Category not found" };
    const seo = categorySeo[category] || {
      title: `Best AI for ${cat.label}`,
      desc: cat.blurb,
      keywords: [],
    };
    return {
      title: seo.title,
      description: seo.desc,
      keywords: seo.keywords,
      openGraph: {
        title: seo.title,
        description: seo.desc,
        url: `https://myaipicker.com/best/${category}`,
      },
      alternates: {
        canonical: `https://myaipicker.com/best/${category}`,
      },
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  if (!cat) notFound();

  const counts = getCategoryCounts();
  const seo = categorySeo[category] || { title: `Best AI for ${cat.label}`, desc: cat.blurb, keywords: [] };
  const a = accentClasses[cat.accent];
  const Icon = cat.icon;

  // Get tools in this category (import lazily inside component to avoid circular)
  const { tools } = await import("@/lib/ai-data");
  const catTools = tools
    .filter((t) => t.category === category)
    .sort((x, y) => y.rating - x.rating);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <section className={cn("relative overflow-hidden border-b border-border", a.bgSoft)}>
        <div className={cn("absolute inset-x-0 top-0 h-1", a.bg)} />
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/#categories" className="hover:text-foreground">Categories</Link>
            <span>/</span>
            <span className="text-foreground">{cat.label}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-2xl border", a.bgSoft, a.border)}>
              <Icon className={cn("h-8 w-8", a.text)} strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {seo.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {counts[cat.id] || 0} tools · {cat.blurb}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-base text-foreground/90">
            {seo.desc}
          </p>
        </div>
      </section>

      {/* Tools list */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4">
          {catTools.map((t, idx) => {
            const ta = accentClasses[t.accent];
            return (
              <Link
                key={t.id}
                href={`/tools/${t.id}`}
                className={cn(
                  "group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5",
                  ta.border,
                  idx === 0 && ta.shadow
                )}
              >
                {/* Rank */}
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-display text-sm font-bold", idx === 0 ? cn(ta.border, ta.bgSoft, ta.text) : "border-border bg-ink/40 text-muted-foreground")}>
                  {idx + 1}
                </span>

                {/* Logo */}
                <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-lg border font-display text-xl font-bold", ta.bgSoft, ta.border, ta.text)}>
                  {t.logo}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-display text-lg font-bold">{t.name}</h2>
                    {t.badge && (
                      <span className={cn("hidden rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase sm:inline-block", ta.bgSoft, ta.border, ta.text)}>
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">{t.tagline}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 fill-star text-star" />
                      <span className="font-semibold text-foreground">{t.rating.toFixed(1)}</span>
                    </span>
                    <span>{t.priceNote.split("·")[0]}</span>
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>

        {catTools.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
            <p className="text-muted-foreground">No tools in this category yet. Check back soon!</p>
          </div>
        )}

        {/* Other categories */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold tracking-tight">Explore Other Categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.id !== category)
              .map((c) => {
                const ca = accentClasses[c.accent];
                const CIcon = c.icon;
                return (
                  <Link
                    key={c.id}
                    href={`/best/${c.id}`}
                    className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5", ca.border, ca.bgSoft, ca.text)}
                  >
                    <CIcon className="h-4 w-4" />
                    {c.label}
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
