import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Score AI Tools — Methodology | My AI Picker",
  description: "Learn how My AI Picker ranks AI tools using a transparent weighted scoring system based on real benchmarks, pricing, and capabilities.",
  alternates: { canonical: "https://myaipicker.com/how-we-score" },
};

export default function HowWeScore() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        How We Score AI Tools
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 29, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <section>
          <p>
            Most AI tool comparison sites rank by whoever pays the most. We don&apos;t.
            Our scoring is fully transparent — no black boxes, no paid placements influencing rankings.
            Here&apos;s exactly how it works.
          </p>
        </section>

        {/* Formula */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">The Formula</h2>
          <div className="mt-4 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
            <code className="font-display text-lg font-bold text-aurora">
              Score = (Capability × 0.4) + (Quality × 0.3) + (Price × 0.2) + (Breadth × 0.1)
            </code>
          </div>
          <p className="mt-3">
            Each tool gets a score from 0 to 100. Higher is better. The weights reflect what matters most
            when choosing an AI tool — does it do the job, how well, at what cost, and how versatile is it.
          </p>
        </section>

        {/* Components */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Score Breakdown</h2>

          <div className="mt-4 space-y-4">
            {/* Capability */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-aurora">Capability Match (40%)</h3>
                <span className="text-2xl">🔍</span>
              </div>
              <p className="mt-2">
                The heaviest weight. We check if the tool actually supports the features relevant to your
                chosen use-case (General, Coding, Images, Video, Voice, Research). Only applicable features
                are counted — an image tool isn&apos;t penalized for lacking code execution.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                N/A vs Fail: Features not relevant to a tool&apos;s category are marked N/A (grey), not
                counted as a fail. This prevents image generators from being unfairly penalized for lacking
                coding features.
              </p>
            </div>

            {/* Quality */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-star">Quality Rating (30%)</h3>
                <span className="text-2xl">⭐</span>
              </div>
              <p className="mt-2">
                Based on real public benchmarks and community consensus:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li><strong className="text-foreground">LLMs:</strong> LMArena ELO, MMLU, SWE-bench, HumanEval, GSM8K scores from public leaderboards</li>
                <li><strong className="text-foreground">Image tools:</strong> Aesthetic ELO from Hugging Face leaderboards</li>
                <li><strong className="text-foreground">Other tools:</strong> Aggregated user ratings and expert reviews</li>
              </ul>
              <p className="mt-2">
                Rating is mapped to 0-100 scale (5.0★ = 100, 4.0★ = 80, etc.)
              </p>
            </div>

            {/* Price */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-teal">Price Value (20%)</h3>
                <span className="text-2xl">💰</span>
              </div>
              <p className="mt-2">
                Cheaper doesn&apos;t automatically mean better. We score value-for-money:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Free = 100 (best value)</li>
                <li>Freemium = 85 (has free tier)</li>
                <li>$ = 70 (under $15/mo)</li>
                <li>$$ = 55 ($15-50/mo)</li>
                <li>$$$ = 40 ($50+/mo)</li>
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                LLM API pricing is auto-updated daily from OpenRouter API.
              </p>
            </div>

            {/* Breadth */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-nebula">Breadth (10%)</h3>
                <span className="text-2xl">🎛️</span>
              </div>
              <p className="mt-2">
                A small bonus for tools that cover more capabilities (image gen + voice + coding = more
                versatile). This is intentionally the lowest weight — a specialist tool that&apos;s great at
                one thing shouldn&apos;t lose to a mediocre generalist.
              </p>
            </div>
          </div>
        </section>

        {/* Category Winners */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Category Winners</h2>
          <p className="mt-2">
            We don&apos;t crown a single &quot;overall winner.&quot; Instead, tools can win multiple
            categories:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>🏆 Best for General Chat</li>
            <li>🏆 Best for Coding</li>
            <li>🏆 Best for Value / Price</li>
            <li>🏆 Best for Quality</li>
            <li>🏆 Most Versatile</li>
          </ul>
          <p className="mt-2">
            A tool that&apos;s amazing at one thing (like Midjourney for images) can win its category
            even if it&apos;s not a great all-rounder.
          </p>
        </section>

        {/* Data Sources */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Data Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li><strong className="text-foreground">LLM API Pricing:</strong> OpenRouter API (auto-updated daily via GitHub Actions)</li>
            <li><strong className="text-foreground">Benchmark Scores:</strong> Public leaderboards (LMArena, OpenAI, Anthropic, Hugging Face)</li>
            <li><strong className="text-foreground">Tool Features & Specs:</strong> Manually curated from official vendor websites</li>
            <li><strong className="text-foreground">Non-LLM Pricing:</strong> Manually verified from vendor pricing pages</li>
          </ul>
        </section>

        {/* Affiliate */}
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Affiliate Disclosure</h2>
          <p className="mt-2">
            Some links on our site may be affiliate links. This means we may earn a commission if you
            click through and make a purchase — at no additional cost to you. Affiliate relationships
            <strong className="text-foreground"> do not</strong> influence our benchmark scores or rankings.
            The scoring formula is applied identically to all tools regardless of affiliate status.
          </p>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
          <h3 className="font-display text-lg font-bold">Questions about our methodology?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Email us at support@myaipicker.com or check our tools yourself:
          </p>
          <Link
            href="/#compare"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
          >
            Try the Compare Deck →
          </Link>
        </div>
      </div>
    </div>
  );
}
