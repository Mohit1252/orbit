"use client";

import { motion } from "framer-motion";
import {
  Star,
  ArrowUpRight,
  Plus,
  Check,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CalendarDays,
  Check as CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getToolById, specKeys } from "@/lib/ai-data";
import { useOrbitStore } from "@/lib/orbit-store";
import { accentClasses, AccentChip } from "./block";

export function ToolDetailDialog() {
  const detailToolId = useOrbitStore((s) => s.detailToolId);
  const closeDetail = useOrbitStore((s) => s.closeDetail);
  const compareIds = useOrbitStore((s) => s.compareIds);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);

  const tool = detailToolId ? getToolById(detailToolId) : undefined;
  const open = !!tool;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDetail()}>
      <DialogContent
        className="max-h-[90vh] gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        {tool && (
          <DetailBody
            tool={tool}
            onClose={closeDetail}
            selected={compareIds.includes(tool.id)}
            onToggle={toggleCompare}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({
  tool,
  onClose,
  selected,
  onToggle,
}: {
  tool: NonNullable<ReturnType<typeof getToolById>>;
  onClose: () => void;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const a = accentClasses[tool.accent];

  return (
    <DialogTitle asChild>
      <div className="max-h-[90vh] overflow-y-auto">
        {/* header banner */}
        <div className={cn("relative overflow-hidden border-b border-border p-6", a.bgSoft)}>
          <div className={cn("absolute inset-x-0 top-0 h-1", a.bg)} />
          {/* decorative orbit */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/5 animate-spin-slow">
            <span className={cn("absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full", a.bg)} />
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md border border-border bg-ink/60 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex items-start gap-4">
            <span
              className={cn(
                "grid h-16 w-16 shrink-0 place-items-center rounded-xl border font-display text-3xl font-bold",
                a.bgSoft,
                a.border,
                a.text
              )}
            >
              {tool.logo}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {tool.name}
                </h2>
                {tool.badge && (
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      a.bgSoft,
                      a.border,
                      a.text
                    )}
                  >
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{tool.vendor}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-star text-star" />
                  <span className="font-semibold text-foreground">{tool.rating.toFixed(1)}</span>
                  <span>({(tool.reviews / 1000).toFixed(1)}k reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Launched {tool.launched}
                </span>
              </div>
            </div>
          </div>

          <p className="relative mt-4 text-sm leading-relaxed text-foreground/90">
            {tool.description}
          </p>

          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {tool.tags.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-ink/50 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="space-y-6 p-6">
          {/* pricing tiers */}
          <section>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Pricing tiers
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {tool.pricing.map((p, i) => (
                <div
                  key={p.name}
                  className={cn(
                    "rounded-lg border bg-ink/30 p-3",
                    i === 0 ? cn(a.border) : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{p.name}</span>
                    {i === 0 && (
                      <span className={cn("text-[10px] font-semibold uppercase", a.text)}>
                        Best value
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold">{p.price}</div>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{p.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* spec grid */}
          <section>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Capabilities
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {specKeys.map((sk) => {
                const v = tool.spec[sk.key];
                const isBool = typeof v === "boolean";
                return (
                  <div
                    key={sk.key}
                    className={cn(
                      "rounded-lg border border-border bg-ink/30 p-3",
                      sk.highlight && "border-aurora/30 bg-aurora/[0.04]"
                    )}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {sk.label}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {isBool ? (
                        v ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-aurora/40 bg-aurora/10 text-aurora">
                            <CheckIcon className="h-3 w-3" />
                          </span>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-ink/50 text-muted-foreground">
                            <X className="h-3 w-3" />
                          </span>
                        )
                      ) : (
                        <span className="text-sm font-semibold text-foreground">{v}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* pros & cons */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-aurora/20 bg-aurora/[0.04] p-4">
              <h4 className="flex items-center gap-1.5 font-display text-sm font-bold text-aurora">
                <ThumbsUp className="h-4 w-4" /> Pros
              </h4>
              <ul className="mt-2 space-y-1.5">
                {tool.pros.map((p) => (
                  <li key={p} className="flex gap-2 text-xs text-foreground/90">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aurora" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-coral/20 bg-coral/[0.04] p-4">
              <h4 className="flex items-center gap-1.5 font-display text-sm font-bold text-coral">
                <ThumbsDown className="h-4 w-4" /> Cons
              </h4>
              <ul className="mt-2 space-y-1.5">
                {tool.cons.map((c) => (
                  <li key={c} className="flex gap-2 text-xs text-foreground/90">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* task chips */}
          <section>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Tasks it covers
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tool.tasks.map((t) => (
                <AccentChip key={t} accent={tool.accent}>
                  {t}
                </AccentChip>
              ))}
            </div>
          </section>
        </div>

        {/* footer actions */}
        <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card/95 p-4 backdrop-blur">
          <button
            onClick={() => onToggle(tool.id)}
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all",
              selected
                ? "border-aurora/60 bg-aurora/15 text-aurora"
                : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
            )}
          >
            {selected ? (
              <>
                <Check className="h-4 w-4" /> Added to compare
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add to compare
              </>
            )}
          </button>
          <a
            href={`https://${tool.website}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5",
              a.border,
              a.bg,
              a.shadow
            )}
          >
            <ExternalLink className="h-4 w-4" />
            Visit {tool.name}
          </a>
        </div>
      </div>
    </DialogTitle>
  );
}
