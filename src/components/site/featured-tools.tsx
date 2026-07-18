"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Flame,
  Sparkles,
  Star,
  SearchX,
  GitCompareArrows,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolCard } from "./tool-card";
import { SectionHeading } from "./categories";
import { useOrbitStore, filterAndSortTools, MAX_COMPARE_TOOLS } from "@/lib/orbit-store";

const sortTabs = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "popular", label: "Most popular", icon: Flame },
  { id: "rating", label: "Top rated", icon: Star },
  { id: "all", label: "All tools", icon: LayoutGrid },
] as const;

export function FeaturedTools() {
  const sort = useOrbitStore((s) => s.sort);
  const setSort = useOrbitStore((s) => s.setSort);
  const compareIds = useOrbitStore((s) => s.compareIds);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const clearCompare = useOrbitStore((s) => s.clearCompare);
  const searchQuery = useOrbitStore((s) => s.searchQuery);
  const activeTasks = useOrbitStore((s) => s.activeTasks);
  const budget = useOrbitStore((s) => s.budget);
  const list = useMemo(
    () => filterAndSortTools({ searchQuery, activeTasks, budget, sort }),
    [searchQuery, activeTasks, budget, sort]
  );

  return (
    <section id="tools" className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="The directory"
          title="Featured AI tools"
          description="Hand-picked models worth your attention. Add up to three to compare them side-by-side below."
        />

        {/* sort tabs */}
        <div className="inline-flex w-full gap-1 overflow-x-auto rounded-lg border border-border bg-card/60 p-1 lg:w-auto">
          {sortTabs.map((t) => {
            const Icon = t.icon;
            const active = sort === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSort(t.id)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap lg:flex-none",
                  active
                    ? "bg-aurora/15 text-aurora"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* compare tray */}
      <CompareTray count={compareIds.length} ids={compareIds} onClear={clearCompare} onRemove={toggleCompare} />

      {/* grid / empty state */}
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((tool, i) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.04 }}
              >
                <ToolCard
                  tool={tool}
                  selected={compareIds.includes(tool.id)}
                  onToggle={toggleCompare}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-aurora/40 block-shadow-sm">
          Browse all 500+ tools
        </button>
      </div>
    </section>
  );
}

function CompareTray({
  count,
  ids,
  onClear,
  onRemove,
}: {
  count: number;
  ids: string[];
  onClear: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-ink/40 px-4 py-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <GitCompareArrows className="h-4 w-4" />
      </span>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {count}/{MAX_COMPARE_TOOLS}
        </span>{" "}
        tools queued for comparison — head to the{" "}
        <a href="#compare" className="text-aurora hover:underline">
          compare deck
        </a>
        .
      </p>
      {ids.length > 0 && (
        <div className="ml-auto flex items-center gap-1.5">
          {ids.map((id) => (
            <button
              key={id}
              onClick={() => onRemove(id)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-coral/40 hover:text-coral"
            >
              {id}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={onClear}
            className="ml-1 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  const resetFilters = useOrbitStore((s) => s.resetFilters);
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-xl border border-border bg-ink/60 text-muted-foreground">
        <SearchX className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">No tools match your filters</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try widening your budget, removing a task, or clearing your search to
        see more of the universe.
      </p>
      <button
        onClick={resetFilters}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft"
      >
        Reset filters
      </button>
    </div>
  );
}
