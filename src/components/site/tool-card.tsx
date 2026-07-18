"use client";

import { Star, ArrowUpRight, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AiTool } from "@/lib/ai-data";
import { accentClasses, AccentChip } from "./block";
import { useOrbitStore } from "@/lib/orbit-store";

export function ToolCard({
  tool,
  selected,
  onToggle,
}: {
  tool: AiTool;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const a = accentClasses[tool.accent];
  const openDetail = useOrbitStore((s) => s.openDetail);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-x-0.5 hover:-translate-y-0.5",
        a.border,
        a.shadow
      )}
    >
      {/* clickable area opens detail */}
      <button
        onClick={() => openDetail(tool.id)}
        className="flex flex-1 flex-col text-left"
        aria-label={`View ${tool.name} details`}
      >
        {/* top: logo block + badges */}
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-lg border font-display text-xl font-bold",
                a.bgSoft,
                a.border,
                a.text
              )}
            >
              {tool.logo}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-bold tracking-tight">
                {tool.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {tool.vendor}
              </p>
            </div>
          </div>
          {tool.badge && (
            <span
              className={cn(
                "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                a.bgSoft,
                a.border,
                a.text
              )}
            >
              {tool.badge}
            </span>
          )}
        </div>

        {/* tagline */}
        <div className="px-4">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {tool.tagline}
          </p>
        </div>

        {/* tags */}
        <div className="mt-3 flex flex-wrap gap-1.5 px-4">
          {tool.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-ink/40 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* meta row */}
        <div className="mt-4 flex items-center gap-3 px-4">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-star text-star" />
            <span className="text-sm font-semibold">{tool.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({(tool.reviews / 1000).toFixed(1)}k)
            </span>
          </div>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            {tool.tasks.slice(0, 2).map((t) => (
              <AccentChip key={t} accent={tool.accent}>
                {t}
              </AccentChip>
            ))}
          </div>
        </div>

        {/* price teaser */}
        <div className="mt-auto flex items-end justify-between gap-2 px-4 pb-4 pt-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Pricing
            </div>
            <div className="truncate text-sm font-semibold text-foreground">
              {tool.priceNote}
            </div>
          </div>
          <span
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold",
              a.bgSoft,
              a.border,
              a.text
            )}
          >
            <ArrowUpRight className="h-3 w-3" />
            Details
          </span>
        </div>
      </button>

      {/* compare action footer */}
      <div className="border-t border-border/60 bg-ink/30 p-4">
        <button
          onClick={() => onToggle?.(tool.id)}
          aria-pressed={selected}
          className={cn(
            "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all",
            selected
              ? "border-aurora/60 bg-aurora/15 text-aurora"
              : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
          )}
        >
          {selected ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added to compare
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> Add to compare
            </>
          )}
        </button>
      </div>

      {/* hover accent line */}
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
          a.bg
        )}
      />
    </article>
  );
}
