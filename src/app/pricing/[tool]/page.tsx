import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { tools, getToolById, getSimilarTools } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import { ArrowRight, Star, Check, X, DollarSign, ExternalLink } from "lucide-react";

/**
 * Pricing Page — /pricing/[tool]
 * SEO target: "[tool name] pricing", "[tool name] cost", "[tool name] price"
 * Auto-generates 133 pricing pages (one per tool).
 */

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  return params.then(({ tool }) => {
    const t = getToolById(tool);
    if (!t) return { title: "Pricing not found" };

    const title = `${t.name} Pricing 2026 — Plans, Cost & Free Tier | My AI Picker`;
    const description = `${t.name} pricing breakdown for 2026. See all plans (${t.priceNote}), free tier limits, API costs, and whether it's worth it. Compare ${t.name} pricing with alternatives.`;

    return {
      title,
      description,
      keywords: [
        `${t.name} pricing`,
        `${t.name} cost`,
        `${t.name} price`,
        `${t.name} plans`,
        `${t.name} free tier`,
        `${t.name} api pricing`,
        `${t.name} subscription`,
        `how much is ${t.name}`,
        `is ${t.name} free`,
        `${t.name} pricing 2026`,
      ],
      openGraph: {
        title,
        description,
        url: `https://myaipicker.com/pricing/${t.id}`,
        type: "article",
        siteName: "My AI Picker",
      },
      alternates: { canonical: `https://myaipicker.com/pricing/${t.id}` },
    };
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool } = await params;
  const t = getToolById(tool);
  if (!t) notFound();

  const a = accentClasses[t.accent];
  const similar = getSimilarTools(t, 5);
  const hasFreeTier = t.priceNote.toLowerCase().includes("free") || t.priceNote.toLowerCase().includes("$0");

  const faqs = [
    {
      question: `How much does ${t.name} cost?`,
      answer: `${t.name} pricing: ${t.priceNote}. The free tier includes limited usage; paid plans unlock higher limits and premium features. See the pricing table above for full breakdown.`,
    },
    {
      question: `Is ${t.name} free?`,
      answer: hasFreeTier
        ? `Yes — ${t.name} has a free tier. ${t.priceNote}. The free tier is sufficient for trying the tool, but paid plans offer higher limits and more features.`
        : `No — ${t.name} does not have a free tier. Pricing starts at ${t.priceNote}. Consider alternatives like DeepSeek (free) or Llama (free open source) if you need a free option.`,
    },
    {
      question: `Does ${t.name} offer an API?`,
      answer: t.spec.api
        ? `Yes — ${t.name} has an API available for developers. API pricing is typically pay-per-use (per million tokens or per image). See the official website for current API rates.`
        : `No — ${t.name} does not currently offer a public API. You can only use it through the official app or website.`,
    },
    {
      question: `Is ${t.name} worth the price?`,
      answer: `${t.name} is rated ${t.rating.toFixed(1)}/5. It's worth the price if you need ${t.spec.bestFor.toLowerCase()}. Compare it with alternatives before deciding — see the alternatives section above.`,
    },
    {
      question: `What are the best ${t.name} alternatives?`,
      answer: similar.length > 0
        ? `The best alternatives to ${t.name} are ${similar.slice(0, 3).map(s => s.name).join(", ")}. Compare their pricing and features in the alternatives section above.`
        : `There are several alternatives to ${t.name} — explore them on our AI tools directory.`,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Pricing" }, { label: `${t.name} Pricing` }]} />

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.name} Pricing 2026 — Plans, Cost & Free Tier
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Complete {t.name} pricing breakdown for 2026. See all plans, free tier limits, API
            costs, and whether it's worth it. Compare with {similar.length} alternatives.
          </p>

          {/* Quick pricing summary */}
          <div className={cn("mt-6 rounded-xl border p-6", a.border, a.bgSoft)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Starting Price
                </p>
                <p className="mt-1 font-display text-3xl font-bold">{t.priceNote}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Free Tier
                </p>
                <p className="mt-1 font-display text-xl font-bold">
                  {hasFreeTier ? "✅ Yes" : "❌ No"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 text-sm">
                <Star className="h-4 w-4 fill-star text-star" />
                <strong>{t.rating.toFixed(1)}</strong>
                <span className="text-muted-foreground">/5 rating</span>
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">by {t.vendor}</span>
            </div>
          </div>

          {/* Pricing tiers */}
          {t.pricing && t.pricing.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold">{t.name} Plans & Pricing Tiers</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.pricing.map((tier, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl border p-5",
                      idx === 0 && hasFreeTier ? cn(a.border, a.bgSoft) : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold">{tier.name}</h3>
                      {idx === 1 && (
                        <span className="rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 text-[10px] font-bold text-aurora">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-display text-2xl font-bold">{tier.price}</p>
                    {tier.note && (
                      <p className="mt-1 text-xs text-muted-foreground">{tier.note}</p>
                    )}
                    {tier.features && tier.features.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {tier.features.slice(0, 5).map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-aurora" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* API pricing */}
          {t.spec.api && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold">{t.name} API Pricing</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.name} offers an API for developers. API pricing is typically pay-per-use
                (per million tokens, per image, or per second). Check the official website for
                current rates and rate limits.
              </p>
              <a
                href={`https://${t.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-aurora hover:underline"
              >
                Visit {t.name} API docs
                <ExternalLink className="h-3 w-3" />
              </a>
            </section>
          )}

          {/* Is it worth it */}
          <section className="mt-8 rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold">Is {t.name} Worth the Price?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.name} is rated <strong>{t.rating.toFixed(1)}/5</strong> and is best for{" "}
              <strong>{t.spec.bestFor.toLowerCase()}</strong>. At <strong>{t.priceNote}</strong>,
              it's {hasFreeTier ? "a good value — the free tier lets you try before you buy" : "priced in line with similar tools"}.
              Consider your use case: if you need {t.spec.bestFor.toLowerCase()}, {t.name} is a
              solid choice. Otherwise, check the alternatives below.
            </p>
          </section>

          {/* Alternatives */}
          {similar.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold">{t.name} Alternatives (Cheaper & Free)</h2>
              <div className="mt-4 space-y-3">
                {similar.map(alt => (
                  <Link
                    key={alt.id}
                    href={`/pricing/${alt.id}`}
                    className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-aurora/40"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold group-hover:text-aurora">
                        {alt.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{alt.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{alt.priceNote}</p>
                      <p className="text-xs text-muted-foreground">
                        <Star className="inline h-3 w-3 fill-star text-star" /> {alt.rating.toFixed(1)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">{t.name} Pricing FAQs</h2>
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
            <h3 className="font-display text-lg font-bold">Compare {t.name} with Alternatives</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              See side-by-side pricing and features comparison.
            </p>
            <Link
              href={`/tools/${t.id}`}
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
            >
              View {t.name} Full Specs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
