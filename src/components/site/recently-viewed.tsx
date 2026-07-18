"use client";

import { motion } from "framer-motion";
import { History, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getToolById } from "@/lib/ai-data";
import { useOrbitStore } from "@/lib/orbit-store";
import { accentClasses } from "./block";

export function RecentlyViewed() {
  const recentlyViewedIds = useOrbitStore((s) => s.recentlyViewedIds);
  const openDetail = useOrbitStore((s) => s.openDetail);
  const clearRecentlyViewed = useOrbitStore((s) => s.clearRecentlyViewed);

  const recent = recentlyViewedIds
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  if (recent.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur block-shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-teal/40 bg-teal/10 text-teal">
              <History className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight">
                Recently viewed
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Pick up where you left off.
              </p>
            </div>
          </div>
          <button
            onClick={clearRecentlyViewed}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-ink/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-coral/40 hover:text-coral"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {recent.map((tool, i) => {
            const a = accentClasses[tool.accent];
            return (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => openDetail(tool.id)}
                className={cn(
                  "group flex w-[180px] shrink-0 items-center gap-2.5 rounded-lg border bg-ink/30 p-2.5 text-left transition-all hover:-translate-y-0.5",
                  a.border
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-md border font-display text-sm font-bold",
                    a.bgSoft,
                    a.border,
                    a.text
                  )}
                >
                  {tool.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold">{tool.name}</div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {tool.vendor}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
