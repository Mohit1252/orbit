"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { tools } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, List, BarChart3, ChevronDown } from "lucide-react";

type SortKey = "lmarena_elo" | "mmlu" | "humaneval" | "swe_bench" | "gsm8k" | "price" | "value";

const sortOptions: { key: SortKey; label: string; max: number; unit: string }[] = [
  { key: "lmarena_elo", label: "LMArena ELO", max: 1400, unit: "" },
  { key: "mmlu", label: "MMLU (Reasoning)", max: 100, unit: "%" },
  { key: "humaneval", label: "HumanEval (Coding)", max: 100, unit: "%" },
  { key: "swe_bench", label: "SWE-bench (SE)", max: 100, unit: "%" },
  { key: "gsm8k", label: "GSM8K (Math)", max: 100, unit: "%" },
  { key: "price", label: "Price (cheapest first)", max: 0, unit: "" },
  { key: "value", label: "💰 Value Score", max: 0, unit: "" },
];

export function LeaderboardContent() {
  const [view, setView] = useState<"list" | "chart">("list");
  const [sortBy, setSortBy] = useState<SortKey>("lmarena_elo");

  const ranked = useMemo(() => {
    const filtered = tools.filter((t) => t.benchmarks && t.benchmarks.lmarena_elo);
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        const pa = a.api_pricing?.prompt_per_million ?? 999;
        const pb = b.api_pricing?.prompt_per_million ?? 999;
        return pa - pb;
      }
      if (sortBy === "value") {
        // Value Score = ELO / Price per M tokens (higher = better value)
        const calcValue = (t: typeof a) => {
          const elo = t.benchmarks?.lmarena_elo || 0;
          const price = t.api_pricing?.prompt_per_million ?? 0;
          if (price === 0) return elo / 0.01; // Free models get best value
          return elo / price;
        };
        return calcValue(b) - calcValue(a);
      }
      return (b.benchmarks![sortBy] || 0) - (a.benchmarks![sortBy] || 0);
    });
    return sorted;
  }, [sortBy]);

  const currentSort = sortOptions.find((s) => s.key === sortBy)!;

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

      {/* Controls */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-card pr-8 pl-3 text-sm font-semibold outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
            >
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key} className="bg-ink">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* View toggle */}
          <div className="inline-flex gap-1 rounded-lg border border-border bg-card/60 p-1">
            <button
              onClick={() => setView("list")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                view === "list" ? "bg-aurora/15 text-aurora" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setView("chart")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
                view === "chart" ? "bg-aurora/15 text-aurora" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Chart
            </button>
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
            {/* Column headers */}
            <div className="grid grid-cols-[3rem_1fr_2fr_5rem] gap-2 border-b border-border bg-ink/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[3rem_1fr_2fr_5rem_6rem]">
              <div>Rank</div>
              <div>Model</div>
              <div>{currentSort.label}</div>
              <div className="hidden text-right sm:block">Price/M</div>
              <div className="text-right">Score</div>
            </div>

            {/* Rows */}
            <div>
              {ranked.map((t, idx) => {
                const a = accentClasses[t.accent];
                let score: number;
                let scorePct: number;
                let scoreDisplay: string;

                if (sortBy === "price") {
                  score = t.api_pricing?.prompt_per_million ?? 999;
                  scorePct = 100;
                  scoreDisplay = score === 999 ? "—" : `$${score}`;
                } else if (sortBy === "value") {
                  const elo = t.benchmarks?.lmarena_elo || 0;
                  const price = t.api_pricing?.prompt_per_million ?? 0;
                  score = price === 0 ? elo / 0.01 : elo / price;
                  scorePct = Math.min(100, Math.round((score / 200) * 100));
                  scoreDisplay = Math.round(score).toString();
                } else {
                  score = t.benchmarks![sortBy] || 0;
                  scorePct = Math.round((score / currentSort.max) * 100);
                  scoreDisplay = `${score}${currentSort.unit}`;
                }

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
                    <div className="flex items-center">
                      <span className={cn("grid h-7 w-7 place-items-center rounded-md border font-display text-xs font-bold", isTop3 ? cn(a.border, a.bgSoft, a.text) : "border-border bg-ink/40 text-muted-foreground")}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", a.bgSoft, a.border, a.text)}>
                        {t.logo}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold group-hover:text-aurora">{t.name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">{t.vendor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-border bg-ink/60">
                        <div className={cn("h-full rounded-full", a.bg)} style={{ width: `${scorePct}%` }} />
                      </div>
                    </div>
                    <div className="hidden text-right text-xs font-semibold text-muted-foreground sm:block">{priceStr}</div>
                    <div className="text-right">
                      <span className={cn("font-display text-base font-bold", a.text)}>
                        {scoreDisplay}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border bg-ink/20 px-4 py-3">
              <p className="text-[10px] text-muted-foreground">
                Scores from public leaderboards. Pricing: per 1M input tokens from OpenRouter API (auto-updated daily).{" "}
                <Link href="/how-we-score" className="text-aurora hover:underline">How we score →</Link>
              </p>
            </div>
          </div>
        )}

        {/* CHART VIEW (Scatter Plot) */}
        {view === "chart" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
            <div className="border-b border-border bg-ink/40 px-4 py-3">
              <h3 className="text-sm font-bold">Price vs Performance Scatter</h3>
              <p className="text-[10px] text-muted-foreground">X = Price per 1M tokens · Y = {currentSort.label}. Top-left = best value.</p>
            </div>

            {/* Scatter chart */}
            <div className="p-4">
              <ScatterChart tools={ranked} sortBy={sortBy} max={currentSort.max} unit={currentSort.unit} />
            </div>
          </div>
        )}

        {/* Full benchmark table (always visible below) */}
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
                <th className="cursor-pointer px-4 py-2 text-left hover:text-foreground" onClick={() => setSortBy("lmarena_elo")}>
                  Model
                </th>
                <th className="cursor-pointer px-4 py-2 text-right hover:text-foreground" onClick={() => setSortBy("mmlu")}>MMLU</th>
                <th className="cursor-pointer px-4 py-2 text-right hover:text-foreground" onClick={() => setSortBy("humaneval")}>HumanEval</th>
                <th className="cursor-pointer px-4 py-2 text-right hover:text-foreground" onClick={() => setSortBy("swe_bench")}>SWE-bench</th>
                <th className="cursor-pointer px-4 py-2 text-right hover:text-foreground" onClick={() => setSortBy("gsm8k")}>GSM8K</th>
                <th className="px-4 py-2 text-right">GPQA</th>
                <th className="px-4 py-2 text-right">IFEval</th>
                <th className="cursor-pointer px-4 py-2 text-right hover:text-foreground" onClick={() => setSortBy("lmarena_elo")}>ELO</th>
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
            href="/compare"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
          >
            Compare AI Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Scatter Chart Component ────────────────────────────────────────

function ScatterChart({
  tools,
  sortBy,
  max,
  unit,
}: {
  tools: typeof import("@/lib/ai-data").tools;
  sortBy: SortKey;
  max: number;
  unit: string;
}) {
  // Get max price for scaling X axis
  const prices = tools.map((t) => t.api_pricing?.prompt_per_million ?? 0).filter((p) => p > 0);
  const maxPrice = Math.max(...prices, 10);

  const chartHeight = 400;
  const chartWidth = 100; // percentage based
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  return (
    <div className="relative w-full" style={{ height: chartHeight }}>
      {/* Y-axis label */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" style={{ transformOrigin: "0 0", left: "10px", top: `${chartHeight / 2}px` }}>
        {sortOptions.find((s) => s.key === sortBy)?.label}
      </div>

      {/* Chart area */}
      <div className="ml-12 mr-2" style={{ height: chartHeight - 20 }}>
        {/* Grid lines */}
        <div className="relative h-full w-full">
          {[0, 25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute inset-x-0 border-t border-border/40"
              style={{ top: `${pct}%` }}
            >
              <span className="absolute -left-10 -translate-y-1/2 text-[9px] text-muted-foreground">
                {sortBy === "price"
                  ? ""
                  : `${Math.round((max * (100 - pct)) / 100)}${unit}`}
              </span>
            </div>
          ))}

          {/* X-axis labels */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] text-muted-foreground">
            <span>$0</span>
            <span>${(maxPrice / 2).toFixed(1)}</span>
            <span>${maxPrice.toFixed(1)}/M</span>
          </div>

          {/* Dots */}
          {tools.map((t) => {
            const score = sortBy === "price" ? 0 : t.benchmarks![sortBy] || 0;
            const price = t.api_pricing?.prompt_per_million ?? 0;
            if (price === 0 && sortBy !== "price") return null; // skip if no price

            const xPct = sortBy === "price" ? 50 : (price / maxPrice) * 100;
            const yPct = sortBy === "price" ? 50 : 100 - (score / max) * 100;
            const a = accentClasses[t.accent];

            return (
              <Link
                key={t.id}
                href={`/tools/${t.id}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
              >
                {/* Dot */}
                <span
                  className={cn(
                    "block h-3 w-3 rounded-full border transition-all group-hover:h-5 group-hover:w-5",
                    a.bg,
                    a.border,
                    "opacity-70 group-hover:opacity-100"
                  )}
                />
                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-md border border-border bg-ink/95 px-2 py-1 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                  {t.name} · {score}{unit} · ${price}/M
                </span>
              </Link>
            );
          })}

          {/* Trend line (Pareto frontier — connect top-left dots) */}
          <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
            <ParetoLine tools={tools} sortBy={sortBy} max={max} maxPrice={maxPrice} />
          </svg>
        </div>
      </div>

      {/* X-axis label */}
      <div className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Price per 1M tokens (USD) →
      </div>
    </div>
  );
}

function ParetoLine({
  tools,
  sortBy,
  max,
  maxPrice,
}: {
  tools: typeof import("@/lib/ai-data").tools;
  sortBy: SortKey;
  max: number;
  maxPrice: number;
}) {
  if (sortBy === "price") return null;

  // Get points and sort by price (ascending)
  const points = tools
    .filter((t) => {
      const price = t.api_pricing?.prompt_per_million ?? 0;
      const score = t.benchmarks![sortBy] || 0;
      return price > 0 && score > 0;
    })
    .map((t) => ({
      x: (t.api_pricing!.prompt_per_million! / maxPrice) * 100,
      y: 100 - ((t.benchmarks![sortBy] || 0) / max) * 100,
      score: t.benchmarks![sortBy] || 0,
    }))
    .sort((a, b) => a.x - b.x);

  if (points.length < 2) return null;

  // Build Pareto frontier (points where no other point is both cheaper AND better)
  const pareto: typeof points = [];
  let bestScore = 0;
  for (const p of points) {
    if (p.score > bestScore) {
      pareto.push(p);
      bestScore = p.score;
    }
  }

  if (pareto.length < 2) return null;

  const path = pareto
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <path
      d={path}
      fill="none"
      stroke="#34d399"
      strokeWidth="1.5"
      strokeDasharray="4 2"
      opacity="0.5"
      vectorEffect="non-scaling-stroke"
    />
  );
}
