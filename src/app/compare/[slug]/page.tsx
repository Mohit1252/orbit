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
 */

const MAX_PAIRS = 50; // pre-generate top 50 pairs to keep build fast

// Generate top comparison pairs (most popular tools)
export function generateStaticParams() {
  // pick top tools by reviews for comparison pairs
  const top = [...tools].sort((a, b) => b.reviews - a.reviews).slice(0, 12);
  const pairs: { a: string; b: string }[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      pairs.push({ a: top[i].id, b: top[j].id });
      if (pairs.length >= MAX_PAIRS) break;
    }
    if (pairs.length >= MAX_PAIRS) break;
  }
  return pairs.map((p) => ({ slug: `${p.a}-vs-${p.b}` }));
}

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
    const description = `Detailed comparison of ${ta.name} vs ${tb.name}. See pricing, context window, capabilities, and real benchmark scores side by side. Find out which AI tool wins for your use case.`;

    return {
      title,
      description,
      keywords: [`${ta.name} vs ${tb.name}`, `${ta.name} or ${tb.name}`, `${ta.name} comparison`, `${tb.name} comparison`],
      openGraph: {
        title,
        description,
        type: "article",
        url: `https://myaipicker.com/compare/${slug}`,
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
    </div>
  );
}
