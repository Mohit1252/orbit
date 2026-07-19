"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  GitCompareArrows,
  Crown,
  Plus,
  Sparkles,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./categories";
import { accentClasses } from "./block";
import {
  getToolById,
  getMergedSpec,
  getSelectedModelName,
  specKeys,
  type AccentColor,
} from "@/lib/ai-data";
import { useOrbitStore, MAX_COMPARE_TOOLS } from "@/lib/orbit-store";

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-ink/40 text-muted-foreground">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export function Comparison() {
  const compareIds = useOrbitStore((s) => s.compareIds);
  const compareModelSelections = useOrbitStore((s) => s.compareModelSelections);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const setCompareModel = useOrbitStore((s) => s.setCompareModel);
  const openDetail = useOrbitStore((s) => s.openDetail);

  const selected = compareIds
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  // pick a "winner" = highest rating among selected (for the crown)
  const winnerId =
    selected.length > 0
      ? selected.reduce((best, t) => (t.rating > best.rating ? t : best)).id
      : null;

  // dynamic grid columns: 1 label col + N tool cols
  const colCount = Math.max(selected.length, 1);
  const gridTemplate = `1.1fr repeat(${colCount}, minmax(0, 1fr))`;

  return (
    <section id="compare" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Side by side"
        title="Compare before you commit"
        description="Add up to three tools from the directory above and they line up here against the specs that matter — capability, context, price."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral"
      >
        <AnimatePresence mode="wait">
          {selected.length === 0 ? (
            <EmptyCompare key="empty" />
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* column headers */}
              <div
                className="grid gap-2 border-b border-border bg-ink/40 p-4"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <GitCompareArrows className="h-4 w-4 text-aurora" />
                  Spec
                </div>
                {selected.map((t) => {
                  const a = accentClasses[t.accent];
                  const isWinner = t.id === winnerId;
                  const modelIdx = compareModelSelections[t.id] ?? 0;
                  const hasModels = !!(t.models && t.models.length > 0);
                  return (
                    <div key={t.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(t.id)}
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-lg border font-display text-sm font-bold transition-transform hover:-translate-y-0.5",
                            a.bgSoft,
                            a.border,
                            a.text
                          )}
                          aria-label={`View ${t.name} details`}
                        >
                          {t.logo}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-bold">{t.name}</span>
                            {isWinner && <Crown className="h-3.5 w-3.5 shrink-0 text-star" />}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {t.vendor}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleCompare(t.id)}
                          aria-label={`Remove ${t.name}`}
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-coral/40 hover:text-coral"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {/* model variant selector */}
                      {hasModels && (
                        <div className="relative">
                          <select
                            value={modelIdx}
                            onChange={(e) => setCompareModel(t.id, Number(e.target.value))}
                            aria-label={`Select ${t.name} model`}
                            className={cn(
                              "h-8 w-full cursor-pointer rounded-md border bg-ink/60 px-2 pr-7 text-[11px] font-semibold outline-none transition-colors focus:ring-2",
                              a.border,
                              a.text,
                              "focus:ring-aurora/30"
                            )}
                          >
                            {t.models!.map((m, i) => (
                              <option key={m.name} value={i} className="bg-ink text-foreground">
                                {m.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* rows */}
              <div>
                {specKeys.map((sk, idx) => (
                  <div
                    key={sk.key}
                    className={cn(
                      "grid items-center gap-2 px-4 py-3",
                      idx % 2 === 1 && "bg-ink/20",
                      sk.highlight && "bg-aurora/[0.04]"
                    )}
                    style={{ gridTemplateColumns: gridTemplate }}
                  >
                    <div
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wide",
                        sk.highlight ? "text-aurora" : "text-muted-foreground"
                      )}
                    >
                      {sk.label}
                    </div>
                    {selected.map((t) => {
                      const modelIdx = compareModelSelections[t.id] ?? 0;
                      const merged = getMergedSpec(t, modelIdx);
                      return (
                        <div key={t.id} className="flex items-center">
                          <Cell value={merged[sk.key]} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* winner banner */}
              {winnerId && selected.length > 1 && (
                <div className="flex items-center gap-3 border-t border-border bg-star/[0.06] p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-star/40 bg-star/10 text-star">
                    <Trophy className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {selected.find((t) => t.id === winnerId)?.name}
                    </span>{" "}
                    edges ahead on rating in your shortlist. Adjust your picks to
                    see how the winner changes.
                  </p>
                </div>
              )}

              {/* footer cta */}
              <div className="flex flex-col gap-3 border-t border-border bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {selected.length}/{MAX_COMPARE_TOOLS} slots used · highlighted
                  rows are weighted heaviest in your match score.
                </p>
                <a
                  href="#tools"
                  className="inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-lg border border-aurora/50 bg-aurora px-4 text-xs font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft sm:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another tool
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function EmptyCompare() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-xl border border-dashed border-border bg-ink/40 text-muted-foreground">
        <Sparkles className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold">Your compare deck is empty</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Head up to the directory and tap{" "}
        <span className="font-semibold text-foreground">Add to compare</span> on
        any tool. They&apos;ll line up here side-by-side.
      </p>
      <a
        href="#tools"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft"
      >
        <Plus className="h-4 w-4" />
        Browse tools
      </a>
    </motion.div>
  );
}

// keep the AccentColor import referenced for type clarity in some bundlers
export type { AccentColor };
