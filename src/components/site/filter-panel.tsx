"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  PenLine,
  Code2,
  Image as ImageIcon,
  Clapperboard,
  AudioLines,
  Database,
  Bot,
  Search as SearchIcon,
  Blocks,
  Rocket,
  Check,
  X,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { budgetTiers, taskOptions, type BudgetTier } from "@/lib/ai-data";
import { useOrbitStore, filterAndSortTools } from "@/lib/orbit-store";

const taskIcons: Record<string, typeof PenLine> = {
  Writing: PenLine,
  Coding: Code2,
  Images: ImageIcon,
  Video: Clapperboard,
  Voice: AudioLines,
  Data: Database,
  Agents: Bot,
  Search: SearchIcon,
  Build: Blocks,
};

export function FilterPanel() {
  const searchQuery = useOrbitStore((s) => s.searchQuery);
  const activeTasks = useOrbitStore((s) => s.activeTasks);
  const budget = useOrbitStore((s) => s.budget);
  const setSearch = useOrbitStore((s) => s.setSearch);
  const toggleTask = useOrbitStore((s) => s.toggleTask);
  const clearTasks = useOrbitStore((s) => s.clearTasks);
  const setBudget = useOrbitStore((s) => s.setBudget);
  const resetFilters = useOrbitStore((s) => s.resetFilters);
  const favoritesOnly = useOrbitStore((s) => s.favoritesOnly);
  const toggleFavoritesOnly = useOrbitStore((s) => s.toggleFavoritesOnly);
  const favoriteIds = useOrbitStore((s) => s.favoriteIds);
  const list = useMemo(
    () =>
      filterAndSortTools({
        searchQuery,
        activeTasks,
        budget,
        sort: "all",
        favoritesOnly,
        favoriteIds,
      }),
    [searchQuery, activeTasks, budget, favoritesOnly, favoriteIds]
  );
  const matchCount = list.length;

  const filterCount =
    activeTasks.length + (budget ? 1 : 0) + (searchQuery ? 1 : 0) + (favoritesOnly ? 1 : 0);
  const hasFilters = filterCount > 0;

  const scrollToTools = () => {
    document.querySelector("#tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="explore" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl block-shadow-neutral sm:p-7"
      >
        {/* header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-aurora/40 bg-aurora/10">
              <SlidersHorizontal className="h-4.5 w-4.5 text-aurora" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Mission control
              </h2>
              <p className="text-xs text-muted-foreground">
                Tell us your task &amp; budget — we&apos;ll narrow the universe.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-ink/60 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <span className={cn("h-1.5 w-1.5 rounded-full", hasFilters ? "bg-aurora animate-twinkle" : "bg-muted-foreground")} />
              {filterCount} filter{filterCount === 1 ? "" : "s"} active
            </div>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-ink/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-coral/40 hover:text-coral"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* search */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Describe what you want to do… e.g. “summarize PDFs” or “logo design”"
            className="h-12 w-full rounded-xl border border-border bg-ink/50 py-3 pl-12 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
          />
          {searchQuery && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md border border-border bg-ink/60 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* favorites-only quick toggle */}
        {favoriteIds.length > 0 && (
          <div className="mt-5">
            <button
              onClick={toggleFavoritesOnly}
              aria-pressed={favoritesOnly}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                favoritesOnly
                  ? "border-nebula/60 bg-nebula/15 text-nebula block-shadow-nebula"
                  : "border-border bg-ink/40 text-muted-foreground hover:border-nebula/40 hover:text-nebula"
              )}
            >
              <Heart className={cn("h-4 w-4", favoritesOnly && "fill-nebula")} />
              {favoritesOnly ? "Showing favorites" : `Show my favorites (${favoriteIds.length})`}
              {favoritesOnly && <X className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        {/* task selector */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What do you need help with?
            </span>
            {activeTasks.length > 0 && (
              <button
                onClick={clearTasks}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear ({activeTasks.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {taskOptions.map((t) => {
              const Icon = taskIcons[t];
              const active = activeTasks.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTask(t)}
                  aria-pressed={active}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-aurora/60 bg-aurora/15 text-aurora block-shadow-aurora"
                      : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t}
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* budget selector */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Max budget
            </span>
            {budget && (
              <button
                onClick={() => setBudget(null)}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Any budget
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {budgetTiers.map((b) => {
              const active = budget === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => setBudget(active ? null : b.label as BudgetTier)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-all",
                    active
                      ? "border-star/60 bg-star/12 text-star block-shadow-star"
                      : "border-border bg-ink/40 text-muted-foreground hover:border-star/40 hover:text-foreground"
                  )}
                >
                  <span className="font-display text-sm font-bold">{b.label}</span>
                  <span className="text-[11px] opacity-80">{b.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Matching{" "}
            <span className="font-semibold text-foreground">{matchCount}</span>{" "}
            tool{matchCount === 1 ? "" : "s"} right now
            {matchCount > 0 && " — scroll to see them below."}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              disabled={!hasFilters}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-ink/40 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              Reset
            </button>
            <button
              onClick={scrollToTools}
              disabled={matchCount === 0}
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-aurora-soft disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-40"
            >
              <Rocket className="h-4 w-4" />
              {matchCount > 0 ? `Show ${matchCount} tools` : "No matches"}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
