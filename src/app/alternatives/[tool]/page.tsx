import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { tools, getToolById, getSimilarTools, type AiTool } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import { ArrowRight, Star, Check, X, GitCompareArrows } from "lucide-react";

/**
 * Alternatives Page — /alternatives/[tool]
 * SEO target: "[tool name] alternatives", "[tool name] alternatives free", "tools like [tool name]"
 * Auto-generates pages for top 20 tools.
 */

const TOP_TOOLS_FOR_ALTERNATIVES = new Set([
  "chatgpt", "claude", "gemini", "midjourney", "dalle3", "stable-diffusion",
  "cursor", "github-copilot", "notion-ai", "perplexity", "elevenlabs",
  "runway", "suno", "grok", "deepseek", "llama", "mistral", "windsurf",
  "firefly", "pika",
]);

export function generateStaticParams() {
  return tools
    .filter((t) => TOP_TOOLS_FOR_ALTERNATIVES.has(t.id))
    .map((t) => ({ tool: t.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  return params.then(({ tool }) => {
    const t = getToolById(tool);
    if (!t) return { title: "Alternatives not found" };

    const title = `10 Best ${t.name} Alternatives in 2026 (Free & Paid) | My AI Picker`;
    const description = `Looking for ${t.name} alternatives? We compare the 10 best alternatives to ${t.name} by price, features, and ratings. Find free ${t.name} alternatives and cheaper options for ${t.spec.bestFor.toLowerCase()}.`;

    return {
      title,
      description,
      keywords: [
        `${t.name} alternatives`,
        `${t.name} alternatives free`,
        `${t.name} alternatives 2026`,
        `tools like ${t.name}`,
        `${t.name} competitors`,
        `free ${t.name} alternative`,
        `cheaper than ${t.name}`,
        `${t.name} vs alternatives`,
        `best ${t.name} alternative`,
        `similar to ${t.name}`,
      ],
      openGraph: {
        title,
        description,
        url: `https://myaipicker.com/alternatives/${t.id}`,
        type: "article",
        siteName: "My AI Picker",
      },
      alternates: { canonical: `https://myaipicker.com/alternatives/${t.id}` },
    };
  });
}

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const t = getToolById(tool);
  if (!t) notFound();

  const a = accentClasses[t.accent];

  // Get similar tools + same-category tools
  const similar = getSimilarTools(t, 10);
  const sameCategory = tools
    .filter(x => x.category === t.category && x.id !== t.id)
    .sort((x, y) => y.rating - x.rating)
    .slice(0, 10);

  // Merge and dedupe
  const seen = new Set<string>();
  const allAlts: AiTool[] = [];
  for (const alt of [...similar, ...sameCategory]) {
    if (!seen.has(alt.id) && alt.id !== t.id) {
      seen.add(alt.id);
      allAlts.push(alt);
    }
  }
  const alternatives = allAlts.slice(0, 10);

  const freeAlts = alternatives.filter(x => x.priceNote.toLowerCase().includes("free"));
  const cheaperAlts = alternatives.filter(x => {
    const m1 = t.priceNote.match(/\$(\d+)/);
    const m2 = x.priceNote.match(/\$(\d+)/);
    if (m1 && m2) return parseInt(m2[1]) < parseInt(m1[1]);
    return false;
  });

  const faqs = [
    {
      question: `What are the best ${t.name} alternatives in 2026?`,
      answer: `The best ${t.name} alternatives in 2026 are ${alternatives.slice(0, 5).map(a => a.name).join(", ")}. Compare their pricing, features, and ratings above to find the right one for your use case.`,
    },
    {
      question: `Is there a free ${t.name} alternative?`,
      answer: freeAlts.length > 0
        ? `Yes — the best free ${t.name} alternatives are ${freeAlts.slice(0, 3).map(a => a.name).join(", ")}. These offer free tiers or are completely free and open-source.`
        : `Most ${t.name} alternatives are paid, but you can explore open-source options like DeepSeek or Llama for free alternatives in related categories.`,
    },
    {
      question: `What is cheaper than ${t.name}?`,
      answer: cheaperAlts.length > 0
        ? `Cheaper alternatives to ${t.name} (${t.priceNote}) include ${cheaperAlts.slice(0, 3).map(a => `${a.name} (${a.priceNote})`).join(", ")}.`
        : `${t.name} is already priced competitively at ${t.priceNote}. Most alternatives are in the same price range.`,
    },
    {
      question: `Which ${t.name} alternative is best for ${t.spec.bestFor.toLowerCase()}?`,
      answer: alternatives.length > 0
        ? `For ${t.spec.bestFor.toLowerCase()}, the best ${t.name} alternative is ${alternatives[0].name} (rated ${alternatives[0].rating.toFixed(1)}/5). It offers similar capabilities at ${alternatives[0].priceNote}.`
        : `There are several alternatives — compare them in the table above.`,
    },
    {
      question: `Can I switch from ${t.name} to an alternative?`,
      answer: `Yes — most ${t.name} alternatives offer similar core features. Before switching, compare pricing, features, and your specific use case. Many tools offer free trials or free tiers to test before committing.`,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Alternatives" }, { label: `${t.name} Alternatives` }]} />

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            10 Best {t.name} Alternatives in 2026 (Free & Paid)
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Looking for {t.name} alternatives? We compare the 10 best alternatives by price,
            features, and ratings. Find free {t.name} alternatives and cheaper options for{" "}
            {t.spec.bestFor.toLowerCase()}.
          </p>

          {/* Original tool summary */}
          <div className={cn("mt-6 rounded-xl border p-5", a.border, a.bgSoft)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original Tool
                </p>
                <h2 className="mt-1 font-display text-xl font-bold">{t.name}</h2>
                <p className="text-sm text-muted-foreground">{t.tagline}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{t.priceNote}</p>
                <p className="text-xs text-muted-foreground">
                  <Star className="inline h-3 w-3 fill-star text-star" /> {t.rating.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>

          {/* Alternatives table */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Top 10 {t.name} Alternatives Compared</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="border border-border p-2.5 text-left font-bold">Alternative</th>
                    <th className="border border-border p-2.5 text-left font-bold">Best For</th>
                    <th className="border border-border p-2.5 text-left font-bold">Price</th>
                    <th className="border border-border p-2.5 text-left font-bold">Rating</th>
                    <th className="border border-border p-2.5 text-left font-bold">Free?</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt, idx) => {
                    const altA = accentClasses[alt.accent];
                    const isFree = alt.priceNote.toLowerCase().includes("free");
                    return (
                      <tr key={alt.id} className="hover:bg-card/50">
                        <td className="border border-border p-2.5">
                          <span className="text-xs text-muted-foreground">#{idx + 1}</span>{" "}
                          <Link href={`/tools/${alt.id}`} className="font-semibold text-aurora hover:underline">
                            {alt.name}
                          </Link>
                        </td>
                        <td className="border border-border p-2.5 text-muted-foreground">{alt.spec.bestFor}</td>
                        <td className="border border-border p-2.5 text-muted-foreground">{alt.priceNote}</td>
                        <td className="border border-border p-2.5">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-star text-star" />
                            {alt.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="border border-border p-2.5">
                          {isFree ? (
                            <Check className="h-4 w-4 text-aurora" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detailed alternatives */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Detailed {t.name} Alternatives</h2>
            <div className="mt-4 space-y-4">
              {alternatives.slice(0, 5).map((alt, idx) => {
                const altA = accentClasses[alt.accent];
                return (
                  <div key={alt.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("grid h-8 w-8 place-items-center rounded-lg border font-display text-sm font-bold", altA.bgSoft, altA.border, altA.text)}>
                            {alt.logo}
                          </span>
                          <h3 className="font-display text-lg font-bold">
                            <Link href={`/tools/${alt.id}`} className="hover:text-aurora">
                              {idx + 1}. {alt.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{alt.description.slice(0, 180)}...</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-md border border-border bg-ink/30 px-2 py-0.5">
                            <strong>Price:</strong> {alt.priceNote}
                          </span>
                          <span className="rounded-md border border-border bg-ink/30 px-2 py-0.5">
                            <strong>Rating:</strong> {alt.rating.toFixed(1)}/5
                          </span>
                          <span className="rounded-md border border-border bg-ink/30 px-2 py-0.5">
                            <strong>Best for:</strong> {alt.spec.bestFor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/tools/${alt.id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-aurora/40 bg-aurora/10 px-3 text-xs font-semibold text-aurora hover:bg-aurora/20"
                      >
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/compare/${t.id}-vs-${alt.id}`}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-semibold hover:border-aurora/40"
                      >
                        <GitCompareArrows className="h-3 w-3" />
                        Compare with {t.name}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">{t.name} Alternatives FAQs</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-display text-base font-bold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <FAQSchema faqs={faqs} />
          </section>

          {/* CTA */}
          <section className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6 text-center">
            <h3 className="font-display text-lg font-bold">Compare {t.name} with Any Alternative</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use our interactive comparison deck for side-by-side specs.
            </p>
            <Link
              href="/compare"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
            >
              Compare AI Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
