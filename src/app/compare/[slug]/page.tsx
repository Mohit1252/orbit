import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tools, getToolById, getMergedSpec, specKeys, type AccentColor } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { Check, X, Minus, ArrowRight, GitCompareArrows } from "lucide-react";

/**
 * Comparison Page — /compare/[a]-vs-[b]
 * SEO target: "X vs Y", "X vs Y for coding", "X or Y"
 *
 * Strategy: Generate MEANINGFUL comparison pairs only.
 * - Within-category pairs (LLM vs LLM, Image vs Image, etc.)
 * - A few curated cross-category pairs that people actually search
 * - Skip nonsense pairs (DeepL vs ChatGPT, Remove.bg vs Cursor, etc.)
 * - Utility tools (DeepL, QuillBot, Grammarly, Remove.bg) excluded —
 *   people don't comparison-shop these, they just use them.
 */

const MAX_PAIRS = 200;

// Curated list of "comparison-worthy" tool IDs.
// These are tools people actually search "X vs Y" for.
// Excludes utility tools (translators, grammar checkers, bg removers).
const COMPARISON_WORTHY = new Set([
  // LLMs / Writing assistants (people compare these heavily)
  "chatgpt", "claude", "gemini", "grok", "perplexity", "llama",
  "deepseek", "mistral", "ms-copilot", "notion-ai", "poe", "jasper",
  "writesonic", "rytr",
  // Image generators
  "midjourney", "dalle3", "stable-diffusion", "firefly", "leonardo",
  "ideogram", "flux", "recraft", "playground", "imagen",
  // Video generators
  "runway", "pika", "luma", "veo", "kling",
  // Voice / TTS
  "elevenlabs", "murf", "play-ht", "speechify",
  // Coding assistants
  "cursor", "github-copilot", "windsurf", "claude-code",
  // Music
  "suno", "udio",
]);

// Meaningful cross-category pairs (curated — people actually search these)
const CROSS_CATEGORY_PAIRS: [string, string][] = [
  // LLM ↔ Coding (people ask "ChatGPT or Copilot for coding?")
  ["chatgpt", "github-copilot"],
  ["claude", "claude-code"],
  ["gemini", "github-copilot"],
  // LLM ↔ Image (same vendor comparisons)
  ["chatgpt", "dalle3"],
  // LLM ↔ Search (assistant vs answer engine)
  ["chatgpt", "perplexity"],
  ["gemini", "perplexity"],
  ["claude", "perplexity"],
];

export function generateStaticParams() {
  // Filter to comparison-worthy tools only
  const worthy = tools.filter((t) => COMPARISON_WORTHY.has(t.id));

  // Group by category for within-category pairs
  const byCategory = new Map<string, typeof worthy>();
  for (const t of worthy) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }

  const pairs: { a: string; b: string }[] = [];
  const seen = new Set<string>();

  const addPair = (a: string, b: string) => {
    const key = `${a}-vs-${b}`;
    if (seen.has(key) || a === b) return;
    seen.add(key);
    pairs.push({ a, b });
  };

  // 1. Within-category pairs (most meaningful — e.g., ChatGPT vs Claude)
  for (const [, group] of byCategory) {
    const sorted = [...group].sort((x, y) => y.reviews - x.reviews);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        addPair(sorted[i].id, sorted[j].id);
      }
    }
  }

  // 2. Curated cross-category pairs (meaningful only)
  for (const [a, b] of CROSS_CATEGORY_PAIRS) {
    if (getToolById(a) && getToolById(b)) addPair(a, b);
  }

  // Cap at MAX_PAIRS
  return pairs.slice(0, MAX_PAIRS).map((p) => ({ slug: `${p.a}-vs-${p.b}` }));
}

// Common misspellings / variants for popular tools (helps capture typo traffic)
const SPELLING_VARIANTS: Record<string, string[]> = {
  quillbot: ["quill bot"],
  chatgpt: ["chat gpt"],
  "github-copilot": ["copilot"],
  "stable-diffusion": ["stable diffusion"],
  "dalle3": ["dall e", "dall-e"],
  "elevenlabs": ["eleven labs"],
  "notion-ai": ["notion ai"],
};

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const parts = slug.split("-vs-");
    if (parts.length !== 2) return { title: "Comparison not found" };
    const a = parts[0];
    const b = parts[1];
    const ta = getToolById(a);
    const tb = getToolById(b);
    if (!ta || !tb) return { title: "Comparison not found" };

    const title = `${ta.name} vs ${tb.name}: Which AI is Better? (2026)`;
    const description = `Detailed ${ta.name} vs ${tb.name} comparison. See pricing, context window, capabilities, and real benchmark scores side by side. Find out which AI tool wins for coding, writing, or your use case.`;

    // Use variant names in keywords to capture typo searches
    const aName = SPELLING_VARIANTS[a]?.[0] || ta.name;
    const bName = SPELLING_VARIANTS[b]?.[0] || tb.name;
    const keywords = [
      `${ta.name} vs ${tb.name}`,
      `${aName} vs ${bName}`,
      `${ta.name} or ${tb.name}`,
      `${ta.name} comparison`,
      `${tb.name} comparison`,
      `${ta.name} vs ${tb.name} for coding`,
      `${ta.name} vs ${tb.name} for writing`,
      `${ta.name} vs ${tb.name} 2026`,
      `${ta.name} vs ${tb.name} pricing`,
      `${ta.name} vs ${tb.name} reddit`,
      `is ${ta.name} better than ${tb.name}`,
    ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://myaipicker.com/compare/${slug}`,
        siteName: "My AI Picker",
        images: [
          {
            url: "https://myaipicker.com/og-image.png",
            width: 1024,
            height: 1024,
            alt: `${ta.name} vs ${tb.name} comparison (2026)`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://myaipicker.com/og-image.png"],
      },
      alternates: {
        canonical: `https://myaipicker.com/compare/${slug}`,
      },
    };
  });
}

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-ink/40 text-muted-foreground">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (value === "—" || value === "") {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-ink/20 px-1.5 text-[10px] font-bold uppercase text-muted-foreground/50">
        <Minus className="h-3 w-3" /> N/A
      </span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();
  const a = parts[0];
  const b = parts[1];
  const ta = getToolById(a);
  const tb = getToolById(b);
  if (!ta || !tb) notFound();

  const sa = accentClasses[ta.accent];
  const sb = accentClasses[tb.accent];
  const mergedA = getMergedSpec(ta, 0);
  const mergedB = getMergedSpec(tb, 0);

  // simple winner: higher rating
  const winner = ta.rating >= tb.rating ? ta : tb;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/#compare" className="hover:text-foreground">Compare</Link>
            <span>/</span>
            <span className="text-foreground">{ta.name} vs {tb.name}</span>
          </nav>

          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {/* Tool A */}
            <Link href={`/tools/${ta.id}`} className="group flex flex-col items-center gap-2 text-center">
              <span className={cn("grid h-16 w-16 place-items-center rounded-xl border font-display text-2xl font-bold transition-transform group-hover:-translate-y-1 sm:h-20 sm:w-20 sm:text-3xl", sa.bgSoft, sa.border, sa.text)}>
                {ta.logo}
              </span>
              <span className="font-display text-lg font-bold sm:text-xl">{ta.name}</span>
              <span className="text-xs text-muted-foreground">{ta.vendor}</span>
            </Link>

            <div className="flex flex-col items-center">
              <span className="font-display text-2xl font-bold text-muted-foreground sm:text-3xl">VS</span>
              <GitCompareArrows className="mt-1 h-5 w-5 text-aurora" />
            </div>

            {/* Tool B */}
            <Link href={`/tools/${tb.id}`} className="group flex flex-col items-center gap-2 text-center">
              <span className={cn("grid h-16 w-16 place-items-center rounded-xl border font-display text-2xl font-bold transition-transform group-hover:-translate-y-1 sm:h-20 sm:w-20 sm:text-3xl", sb.bgSoft, sb.border, sb.text)}>
                {tb.logo}
              </span>
              <span className="font-display text-lg font-bold sm:text-xl">{tb.name}</span>
              <span className="text-xs text-muted-foreground">{tb.vendor}</span>
            </Link>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
            Head-to-head comparison of <span className="font-semibold text-foreground">{ta.name}</span> vs <span className="font-semibold text-foreground">{tb.name}</span>. See specs, pricing, and capabilities side by side to pick the right AI for your task.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-border bg-ink/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spec</div>
            <div className="text-center text-sm font-bold">{ta.name}</div>
            <div className="text-center text-sm font-bold">{tb.name}</div>
          </div>

          {/* Spec rows */}
          <div>
            {specKeys.map((sk, idx) => (
              <div
                key={sk.key}
                className={cn(
                  "grid grid-cols-[1fr_1fr_1fr] items-center gap-2 px-4 py-3",
                  idx % 2 === 1 && "bg-ink/20",
                  sk.highlight && "bg-aurora/[0.04]"
                )}
              >
                <div className={cn("text-xs font-semibold uppercase tracking-wide", sk.highlight ? "text-aurora" : "text-muted-foreground")}>
                  {sk.label}
                </div>
                <div className="flex justify-center"><Cell value={mergedA[sk.key]} /></div>
                <div className="flex justify-center"><Cell value={mergedB[sk.key]} /></div>
              </div>
            ))}
          </div>

          {/* Winner banner */}
          <div className="flex items-center justify-center gap-2 border-t border-border bg-star/[0.06] p-4 text-center">
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{winner.name}</span> edges ahead on overall rating ({winner.rating.toFixed(1)}★).
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[ta, tb].map((t) => {
            const sa = accentClasses[t.accent];
            return (
              <div key={t.id} className={cn("rounded-xl border bg-card p-5", sa.border)}>
                <div className="flex items-center gap-3">
                  <span className={cn("grid h-12 w-12 place-items-center rounded-lg border font-display text-xl font-bold", sa.bgSoft, sa.border, sa.text)}>
                    {t.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold">{t.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{t.tagline}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/tools/${t.id}`}
                    className={cn("inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold", sa.border, sa.bgSoft, sa.text)}
                  >
                    Full Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={`https://${t.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-ink/40 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Visit Site
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to compare deck */}
        <div className="mt-8 text-center">
          <Link
            href="/#compare"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
          >
            <GitCompareArrows className="h-4 w-4" />
            Compare More AI Tools
          </Link>
        </div>
      </section>

      {/* JSON-LD Schemas for SEO */}
      <CompareSchemas ta={ta} tb={tb} winner={winner} slug={slug} />
    </div>
  );
}

function CompareSchemas({
  ta,
  tb,
  winner,
  slug,
}: {
  ta: ReturnType<typeof getToolById> extends infer T ? Exclude<T, undefined> : never;
  tb: ReturnType<typeof getToolById> extends infer T ? Exclude<T, undefined> : never;
  winner: ReturnType<typeof getToolById> extends infer T ? Exclude<T, undefined> : never;
  slug: string;
}) {
  const faqs = [
    {
      question: `Is ${ta.name} better than ${tb.name}?`,
      answer: `${winner.name} is better overall (rated ${winner.rating.toFixed(1)}/5). ${winner === ta ? `${ta.name} wins on ${ta.spec.bestFor.toLowerCase()}.` : `${tb.name} wins on ${tb.spec.bestFor.toLowerCase()}.`} For specific use cases, see our detailed comparison above.`,
    },
    {
      question: `Which is cheaper, ${ta.name} or ${tb.name}?`,
      answer: `${ta.name}: ${ta.priceNote}. ${tb.name}: ${tb.priceNote}. Compare the pricing tiers above for full breakdown.`,
    },
    {
      question: `Can I use ${ta.name} and ${tb.name} together?`,
      answer: `Yes — many users subscribe to both. Use ${ta.name} for ${ta.spec.bestFor.toLowerCase()} and ${tb.name} for ${tb.spec.bestFor.toLowerCase()}.`,
    },
    {
      question: `Which has a longer context, ${ta.name} or ${tb.name}?`,
      answer: `${ta.name}: ${ta.spec.context} context. ${tb.name}: ${tb.spec.context} context. ${ta.spec.context === tb.spec.context ? "Both are equal." : ta.spec.context > tb.spec.context ? `${ta.name} has a longer context window.` : `${tb.name} has a longer context window.`}`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://myaipicker.com" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://myaipicker.com/compare" },
      { "@type": "ListItem", position: 3, name: `${ta.name} vs ${tb.name}`, item: `https://myaipicker.com/compare/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ta.name} vs ${tb.name}: Which AI is Better? (2026)`,
    description: `Detailed comparison of ${ta.name} vs ${tb.name} — pricing, features, benchmarks, and verdict.`,
    datePublished: "2026-08-12",
    dateModified: "2026-08-12",
    author: { "@type": "Organization", name: "My AI Picker" },
    publisher: {
      "@type": "Organization",
      name: "My AI Picker",
      logo: { "@type": "ImageObject", url: "https://myaipicker.com/logo-myaipicker.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://myaipicker.com/compare/${slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
