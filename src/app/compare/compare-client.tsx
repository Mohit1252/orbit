"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tools, getMergedSpec, specKeys, type AiTool } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { useOrbitStore } from "@/lib/orbit-store";
import {
  Search,
  X,
  Check,
  GitCompareArrows,
  ArrowRight,
  Plus,
  Trophy,
  ChevronDown,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const MAX_COMPARE = 3;

// Popular comparison suggestions
const popularComparisons = [
  { a: "chatgpt", b: "claude" },
  { a: "chatgpt", b: "gemini" },
  { a: "claude", b: "gemini" },
  { a: "midjourney", b: "dalle3" },
  { a: "midjourney", b: "flux" },
  { a: "cursor", b: "github-copilot" },
  { a: "elevenlabs", b: "murf" },
  { a: "runway", b: "veo" },
  { a: "perplexity", b: "google-ai-mode" },
];

export function CompareClient() {
  const compareIds = useOrbitStore((s) => s.compareIds);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const clearCompare = useOrbitStore((s) => s.clearCompare);
  const compareUseCase = useOrbitStore((s) => s.compareUseCase);
  const setCompareUseCase = useOrbitStore((s) => s.setCompareUseCase);
  const compareModelSelections = useOrbitStore((s) => s.compareModelSelections);
  const setCompareModel = useOrbitStore((s) => s.setCompareModel);

  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selected = compareIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is AiTool => !!t);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools.filter((t) => !compareIds.includes(t.id));
    const q = searchQuery.toLowerCase();
    return tools.filter(
      (t) =>
        !compareIds.includes(t.id) &&
        (t.name.toLowerCase().includes(q) ||
          t.vendor.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tasks.some((task) => task.toLowerCase().includes(q)))
    );
  }, [searchQuery, compareIds]);

  const addTool = (id: string) => {
    if (compareIds.length < MAX_COMPARE && !compareIds.includes(id)) {
      toggleCompare(id);
    }
    setSearchOpen(null);
    setSearchQuery("");
  };

  const removeTool = (id: string) => {
    toggleCompare(id);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">Compare</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-xl border border-aurora/40 bg-aurora/10">
              <GitCompareArrows className="h-7 w-7 text-aurora" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Compare AI Tools
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Side-by-side benchmarks, pricing, and capabilities. Select up to {MAX_COMPARE} tools below.
              </p>
            </div>
          </div>

          <Link
            href="/#tools"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools Directory
          </Link>
        </div>
      </section>

      {/* Model Selectors */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: MAX_COMPARE }).map((_, slotIdx) => {
            const tool = selected[slotIdx];
            const isSearchOpen = searchOpen === slotIdx;

            return (
              <div key={slotIdx} className="relative">
                {tool ? (
                  // Selected tool card
                  <div className={cn("rounded-xl border bg-card p-4", accentClasses[tool.accent].border, accentClasses[tool.accent].shadow)}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Slot {slotIdx + 1}
                      </span>
                      <button
                        onClick={() => removeTool(tool.id)}
                        className="grid h-6 w-6 place-items-center rounded-md border border-border text-muted-foreground hover:border-coral/40 hover:text-coral"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <span className={cn("grid h-12 w-12 place-items-center rounded-lg border font-display text-xl font-bold", accentClasses[tool.accent].bgSoft, accentClasses[tool.accent].border, accentClasses[tool.accent].text)}>
                        {tool.logo}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-display text-base font-bold">{tool.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{tool.vendor}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Search box for selecting a tool
                  <div>
                    {isSearchOpen ? (
                      <div className="rounded-xl border border-aurora/40 bg-card p-3">
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search AI tools..."
                            className="h-10 w-full rounded-lg border border-border bg-ink/50 pl-9 pr-3 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
                          />
                          <button
                            onClick={() => { setSearchOpen(null); setSearchQuery(""); }}
                            className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {/* Search results */}
                        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border">
                          {filteredTools.length === 0 ? (
                            <div className="p-4 text-center text-xs text-muted-foreground">No tools found</div>
                          ) : (
                            filteredTools.slice(0, 20).map((t) => {
                              const a = accentClasses[t.accent];
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => addTool(t.id)}
                                  className="flex w-full items-center gap-3 border-b border-border/60 p-2.5 text-left transition-colors hover:bg-ink/20"
                                >
                                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", a.bgSoft, a.border, a.text)}>
                                    {t.logo}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-bold">{t.name}</div>
                                    <div className="truncate text-[10px] text-muted-foreground">{t.vendor} · {t.priceNote.split("·")[0]}</div>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ) : (
                      // Empty slot — click to search
                      <button
                        onClick={() => { setSearchOpen(slotIdx); setSearchQuery(""); }}
                        className="flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-4 text-muted-foreground transition-all hover:border-aurora/40 hover:bg-aurora/[0.04] hover:text-aurora"
                      >
                        <Plus className="h-6 w-6" />
                        <span className="text-xs font-semibold">Add tool {slotIdx + 1}</span>
                        <span className="text-[10px]">Click to search</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* VS indicator between slots (desktop) */}
        {selected.length >= 2 && (
          <div className="mt-2 hidden justify-center sm:flex">
            <span className="font-display text-xs font-bold text-muted-foreground">
              {selected.length} tools selected · {MAX_COMPARE - selected.length} slots remaining
            </span>
          </div>
        )}

        {/* Clear all + Popular comparisons */}
        {selected.length === 0 && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold tracking-tight">Popular Comparisons</h2>
            <p className="mt-1 text-xs text-muted-foreground">Click to instantly compare</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {popularComparisons.map((pair) => {
                const ta = tools.find((t) => t.id === pair.a);
                const tb = tools.find((t) => t.id === pair.b);
                if (!ta || !tb) return null;
                return (
                  <button
                    key={`${pair.a}-${pair.b}`}
                    onClick={() => { toggleCompare(pair.a); toggleCompare(pair.b); }}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-aurora/40"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", accentClasses[ta.accent].bgSoft, accentClasses[ta.accent].border, accentClasses[ta.accent].text)}>
                        {ta.logo}
                      </span>
                      <span className="truncate text-sm font-bold">{ta.name}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">vs</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-bold">{tb.name}</span>
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", accentClasses[tb.accent].bgSoft, accentClasses[tb.accent].border, accentClasses[tb.accent].text)}>
                        {tb.logo}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison Table (only when 2+ tools selected) */}
        {selected.length >= 2 && (
          <ComparisonTable
            selected={selected}
            compareModelSelections={compareModelSelections}
            setCompareModel={setCompareModel}
            compareUseCase={compareUseCase}
            setCompareUseCase={setCompareUseCase}
            clearCompare={clearCompare}
          />
        )}

        {selected.length === 1 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Add at least 1 more tool to compare</p>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Comparison Table ────────────────────────────────────────────

function ComparisonTable({
  selected,
  compareModelSelections,
  setCompareModel,
  compareUseCase,
  setCompareUseCase,
  clearCompare,
}: {
  selected: AiTool[];
  compareModelSelections: Record<string, number>;
  setCompareModel: (id: string, idx: number) => void;
  compareUseCase: string;
  setCompareUseCase: (uc: any) => void;
  clearCompare: () => void;
}) {
  const colCount = selected.length;
  const gridTemplate = `1.1fr repeat(${colCount}, minmax(0, 1fr))`;

  // Simple winner: highest rating
  const winner = [...selected].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="mt-8">
      {/* Clear button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold tracking-tight">Head-to-Head Comparison</h2>
        <button
          onClick={clearCompare}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-foreground hover:border-coral/40 hover:text-coral"
        >
          <X className="h-3 w-3" />
          Clear all
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
        {/* Column headers */}
        <div className="grid gap-2 border-b border-border bg-ink/40 p-4" style={{ gridTemplateColumns: gridTemplate }}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <GitCompareArrows className="h-4 w-4 text-aurora" />
            Spec
          </div>
          {selected.map((t) => {
            const a = accentClasses[t.accent];
            const isWinner = t.id === winner.id;
            return (
              <div key={t.id} className="flex flex-col items-center gap-1">
                <span className={cn("grid h-10 w-10 place-items-center rounded-lg border font-display text-lg font-bold", a.bgSoft, a.border, a.text)}>
                  {t.logo}
                </span>
                <span className="text-sm font-bold">{t.name}</span>
                <span className="text-[10px] text-muted-foreground">{t.vendor}</span>
                {isWinner && <span className="text-[10px] font-bold text-star">★ Top rated</span>}
              </div>
            );
          })}
        </div>

        {/* Spec rows */}
        <div>
          {specKeys.map((sk, idx) => (
            <div
              key={sk.key}
              className={cn("grid items-center gap-2 px-4 py-3", idx % 2 === 1 && "bg-ink/20", sk.highlight && "bg-aurora/[0.04]")}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <div className={cn("text-xs font-semibold uppercase tracking-wide", sk.highlight ? "text-aurora" : "text-muted-foreground")}>
                {sk.label}
              </div>
              {selected.map((t) => {
                const modelIdx = compareModelSelections[t.id] ?? 0;
                const merged = getMergedSpec(t, modelIdx);
                const v = merged[sk.key];
                const isBool = typeof v === "boolean";
                return (
                  <div key={t.id} className="flex items-center justify-center">
                    {isBool ? (
                      v ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-ink/40 text-muted-foreground">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )
                    ) : (
                      <span className="text-sm font-medium text-foreground">{v}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Winner banner */}
        <div className="flex items-center justify-center gap-2 border-t border-border bg-star/[0.06] p-4 text-center">
          <Trophy className="h-4 w-4 text-star" />
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{winner.name}</span> edges ahead on overall rating ({winner.rating.toFixed(1)}★).
          </span>
        </div>
      </div>
    </div>
  );
}
