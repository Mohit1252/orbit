import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Model Leaderboard 2026 — Ranked by Benchmarks & Price | My AI Picker",
  description:
    "Live leaderboard of top AI models ranked by MMLU, SWE-bench, HumanEval, and LMArena ELO scores. Compare reasoning, coding, and price per million tokens.",
  keywords: [
    "AI leaderboard",
    "LLM benchmark ranking",
    "AI model comparison",
    "MMLU leaderboard",
    "SWE-bench ranking",
    "LMArena ELO",
  ],
  alternates: { canonical: "https://myaipicker.com/leaderboard" },
};

const benchmarkTabs = [
  { id: "overall", label: "Overall (LMArena ELO)", key: "lmarena_elo", max: 1400, unit: "" },
  { id: "reasoning", label: "Reasoning (MMLU)", key: "mmlu", max: 100, unit: "%" },
  { id: "coding", label: "Coding (HumanEval)", key: "humaneval", max: 100, unit: "%" },
  { id: "swe", label: "Software Eng (SWE-bench)", key: "swe_bench", max: 100, unit: "%" },
  { id: "math", label: "Math (GSM8K)", key: "gsm8k", max: 100, unit: "%" },
] as const;

export default function LeaderboardPage() {
  // Only LLMs with benchmarks
  const ranked = tools
    .filter((t) => t.benchmarks && t.benchmarks.lmarena_elo)
    .sort((a, b) => (b.benchmarks!.lmarena_elo || 0) - (a.benchmarks!.lmarena_elo || 0));

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">Leaderboard</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-xl border border-star/40 bg-star/10">
              <Trophy className="h-7 w-7 text-star" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                AI Model Leaderboard
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {ranked.length} LLMs ranked by benchmark performance & API pricing. Updated daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
          {/* Column headers */}
          <div className="grid grid-cols-[3rem_1fr_2fr_5rem] gap-2 border-b border-border bg-ink/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[3rem_1fr_2fr_5rem_6rem]">
            <div>Rank</div>
            <div>Model</div>
            <div>Benchmark Score</div>
            <div className="hidden text-right sm:block">Price/M</div>
            <div className="text-right">Score</div>
          </div>

          {/* Rows */}
          <div>
            {ranked.map((t, idx) => {
              const a = accentClasses[t.accent];
              const elo = t.benchmarks!.lmarena_elo || 0;
              const eloPct = Math.round((elo / 1400) * 100);
              const isTop3 = idx < 3;
              const priceStr = t.api_pricing?.prompt_per_million
                ? `$${t.api_pricing.prompt_per_million}`
                : t.budget === "Free"
                  ? "Free"
                  : "—";

              return (
                <Link
                  key={t.id}
                  href={`/tools/${t.id}`}
                  className={cn(
                    "group grid grid-cols-[3rem_1fr_2fr_5rem] items-center gap-2 px-4 py-3 transition-colors hover:bg-ink/20 sm:grid-cols-[3rem_1fr_2fr_5rem_6rem]",
                    idx % 2 === 1 && "bg-ink/10"
                  )}
                >
                  {/* Rank */}
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-md border font-display text-xs font-bold",
                        isTop3
                          ? cn(a.border, a.bgSoft, a.text)
                          : "border-border bg-ink/40 text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  {/* Model name + logo */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold",
                        a.bgSoft,
                        a.border,
                        a.text
                      )}
                    >
                      {t.logo}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold group-hover:text-aurora">{t.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{t.vendor}</div>
                    </div>
                  </div>

                  {/* Visual bar (LMArena ELO) */}
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-border bg-ink/60">
                      <div
                        className={cn("h-full rounded-full", a.bg)}
                        style={{ width: `${eloPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden text-right text-xs font-semibold text-muted-foreground sm:block">
                    {priceStr}
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className={cn("font-display text-base font-bold", a.text)}>
                      {elo}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="border-t border-border bg-ink/20 px-4 py-3">
            <p className="text-[10px] text-muted-foreground">
              Scores: LMArena Chatbot Arena ELO (higher = better). Pricing: per 1M input tokens from
              OpenRouter API (auto-updated daily).{" "}
              <Link href="/how-we-score" className="text-aurora hover:underline">
                How we score →
              </Link>
            </p>
          </div>
        </div>

        {/* Benchmark breakdown table */}
        <h2 className="mt-10 font-display text-xl font-bold tracking-tight">
          Full Benchmark Breakdown
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          All scores from public leaderboards. Higher is better.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-right">MMLU</th>
                <th className="px-4 py-2 text-right">HumanEval</th>
                <th className="px-4 py-2 text-right">SWE-bench</th>
                <th className="px-4 py-2 text-right">GSM8K</th>
                <th className="px-4 py-2 text-right">GPQA</th>
                <th className="px-4 py-2 text-right">IFEval</th>
                <th className="px-4 py-2 text-right">ELO</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((t, idx) => {
                const b = t.benchmarks!;
                const a = accentClasses[t.accent];
                return (
                  <tr key={t.id} className={cn(idx % 2 === 1 && "bg-ink/10")}>
                    <td className="px-4 py-2">
                      <Link href={`/tools/${t.id}`} className="flex items-center gap-2 hover:text-aurora">
                        <span className={cn("font-bold", a.text)}>{t.logo}</span>
                        <span className="font-semibold">{t.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.mmlu ? `${b.mmlu}%` : "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.humaneval ? `${b.humaneval}%` : "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.swe_bench ? `${b.swe_bench}%` : "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.gsm8k ? `${b.gsm8k}%` : "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.gpqa ? `${b.gpqa}%` : "—"}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{b.ifeval ? `${b.ifeval}%` : "—"}</td>
                    <td className={cn("px-4 py-2 text-right font-bold tabular-nums", a.text)}>{b.lmarena_elo || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
          <h3 className="font-display text-lg font-bold">Compare models side-by-side</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use our interactive comparison deck with weighted scoring.
          </p>
          <Link
            href="/#compare"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
          >
            Compare AI Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
