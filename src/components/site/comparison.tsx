"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Minus,
  GitCompareArrows,
  Crown,
  Plus,
  Sparkles,
  Trophy,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./categories";
import { accentClasses } from "./block";
import {
  getToolById,
  getMergedSpec,
  specKeys,
  type AccentColor,
} from "@/lib/ai-data";
import { useOrbitStore, MAX_COMPARE_TOOLS } from "@/lib/orbit-store";
import {
  useCases,
  scoreTool,
  computeCategoryWinners,
  isSpecApplicable,
  isBooleanCap,
  type UseCase,
} from "@/lib/scoring";

/**
 * Cell renderer — now distinguishes N/A (grey dash) from Fail (red X).
 *  - boolean true  → green check
 *  - boolean false → red X (only if the capability is APPLICABLE to this tool)
 *  - N/A           → grey dash (capability not relevant to this tool)
 *  - string        → text value
 */
function Cell({
  value,
  applicable,
}: {
  value: string | boolean;
  applicable: boolean;
}) {
  if (typeof value === "boolean") {
    if (!applicable) {
      // N/A — not relevant to this tool
      return (
        <span
          className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-ink/20 px-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/50"
          title="Not applicable to this tool type"
        >
          <Minus className="h-3 w-3" />
          N/A
        </span>
      );
    }
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-coral/40 bg-coral/10 text-coral" title="Applicable but not supported">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (!applicable && (value === "—" || value === "")) {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 bg-ink/20 px-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/50">
        <Minus className="h-3 w-3" />
        N/A
      </span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

/** Small score-bar segment for the breakdown panel. */
function ScoreBar({
  label,
  value,
  weight,
  accent,
}: {
  label: string;
  value: number;
  weight: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-[11px] text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-border bg-ink/60">
        <div className={cn("h-full rounded-full", accent)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-16 shrink-0 text-right text-[11px] font-bold text-foreground">
        {value}
        <span className="ml-1 text-muted-foreground/70">×{weight}</span>
      </span>
    </div>
  );
}

export function Comparison() {
  const compareIds = useOrbitStore((s) => s.compareIds);
  const compareModelSelections = useOrbitStore((s) => s.compareModelSelections);
  const compareUseCase = useOrbitStore((s) => s.compareUseCase);
  const setCompareUseCase = useOrbitStore((s) => s.setCompareUseCase);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const setCompareModel = useOrbitStore((s) => s.setCompareModel);
  const openDetail = useOrbitStore((s) => s.openDetail);

  const selected = compareIds
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  // Score every selected tool for the current use-case.
  const scored = useMemo(
    () =>
      selected.map((t) =>
        scoreTool(t, compareModelSelections[t.id] ?? 0, compareUseCase)
      ),
    [selected, compareModelSelections, compareUseCase]
  );

  // Per-category winners (a tool can win multiple).
  const categoryWinners = useMemo(
    () => computeCategoryWinners(scored),
    [scored]
  );

  // The overall top scorer (for the crown).
  const topScorer = scored.length > 0 ? scored[0] : null;
  const topId = topScorer?.tool.id ?? null;

  // dynamic grid columns: 1 label col + N tool cols
  const colCount = Math.max(selected.length, 1);
  const gridTemplate = `1.1fr repeat(${colCount}, minmax(0, 1fr))`;

  return (
    <section id="compare" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Side by side"
        title="Compare before you commit"
        description="Pick your use-case, add up to three tools, and we score them on capability, quality, price and breadth — with N/A properly distinguished from fails."
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
              {/* === USE-CASE SELECTOR === */}
              <div className="border-b border-border bg-ink/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-aurora" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What are you using it for?
                  </span>
                  <span className="ml-auto hidden text-[10px] text-muted-foreground/70 sm:inline">
                    Scoring is weighted to this use-case
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {useCases.map((uc) => {
                    const active = uc.id === compareUseCase;
                    return (
                      <button
                        key={uc.id}
                        onClick={() => setCompareUseCase(uc.id as UseCase)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                          active
                            ? "border-aurora/60 bg-aurora/15 text-aurora block-shadow-aurora"
                            : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
                        )}
                      >
                        <span className="text-sm">{uc.icon}</span>
                        {uc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* === COLUMN HEADERS === */}
              <div
                className="grid gap-2 border-b border-border bg-ink/40 p-4"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <GitCompareArrows className="h-4 w-4 text-aurora" />
                  Spec
                </div>
                {scored.map((s) => {
                  const t = s.tool;
                  const a = accentClasses[t.accent];
                  const isTop = t.id === topId;
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
                            {isTop && <Crown className="h-3.5 w-3.5 shrink-0 text-star" />}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {t.vendor} · <span className="font-semibold text-foreground">{s.breakdown.total}</span>/100
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
                                {m.access === "limited" ? " · limited" : ""}
                                {m.access === "private" ? " · private" : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      )}
                      {/* access badge for limited/private models */}
                      {hasModels &&
                        t.models![modelIdx]?.access &&
                        t.models![modelIdx].access !== "public" && (
                          <span
                            className={cn(
                              "inline-flex w-fit items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                              t.models![modelIdx].access === "limited"
                                ? "border-star/40 bg-star/10 text-star"
                                : "border-coral/40 bg-coral/10 text-coral"
                            )}
                          >
                            {t.models![modelIdx].access === "limited" ? "Limited access" : "Private"}
                          </span>
                        )}
                    </div>
                  );
                })}
              </div>

              {/* === SPEC ROWS (with N/A vs Fail) === */}
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
                    {scored.map((s) => {
                      const applicable = isSpecApplicable(s.tool, sk.key, s.mergedSpec);
                      return (
                        <div key={s.tool.id} className="flex items-center">
                          <Cell value={s.mergedSpec[sk.key]} applicable={applicable} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* === SCORE BREAKDOWN ROW === */}
              <div className="border-t border-border bg-ink/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-star" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Score breakdown — weighted for {useCases.find((u) => u.id === compareUseCase)?.label}
                  </span>
                </div>
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: gridTemplate }}
                >
                  <div className="text-[11px] text-muted-foreground">
                    Formula: <span className="font-semibold text-foreground">cap×0.4 + rating×0.3 + price×0.2 + breadth×0.1</span>
                  </div>
                  {scored.map((s) => {
                    const a = accentClasses[s.tool.accent];
                    const isTop = s.tool.id === topId;
                    return (
                      <ScoreBreakdownCard
                        key={s.tool.id}
                        scored={s}
                        accentBar={a.bg}
                        isTop={isTop}
                      />
                    );
                  })}
                </div>
              </div>

              {/* === CATEGORY WINNERS (not a single overall winner) === */}
              {selected.length > 1 && (
                <div className="border-t border-border bg-star/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-star" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category winners
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground/70">
                      One tool can win multiple categories
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryWinners.map((w) => {
                      const winner = scored.find((s) => s.tool.id === w.winnerId);
                      if (!winner) return null;
                      const a = accentClasses[winner.tool.accent];
                      return (
                        <span
                          key={w.category}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold",
                            a.bgSoft,
                            a.border,
                            a.text
                          )}
                          title={`${winner.tool.name} scored ${w.score}/100 in this category`}
                        >
                          <Trophy className="h-3 w-3" />
                          {w.label}
                          <span className="opacity-70">·</span>
                          <span className="font-bold">{winner.tool.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* === LEGEND (N/A vs Fail) === */}
              <div className="flex flex-wrap items-center gap-4 border-t border-border bg-ink/20 px-4 py-3 text-[10px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wide">Legend:</span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-aurora/40 bg-aurora/10 text-aurora">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  Supported
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-coral/40 bg-coral/10 text-coral">
                    <X className="h-2.5 w-2.5" />
                  </span>
                  Applicable but missing
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex h-4 items-center gap-0.5 rounded border border-border/60 bg-ink/20 px-1 text-muted-foreground/60">
                    <Minus className="h-2.5 w-2.5" />N/A
                  </span>
                  Not relevant to this tool type (not penalized)
                </span>
              </div>

              {/* footer cta */}
              <div className="flex flex-col gap-3 border-t border-border bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {selected.length}/{MAX_COMPARE_TOOLS} slots used · scores are
                  weighted to your chosen use-case.
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

/** Expandable "Why this won?" breakdown card per tool. */
function ScoreBreakdownCard({
  scored,
  accentBar,
  isTop,
}: {
  scored: ReturnType<typeof scoreTool>;
  accentBar: string;
  isTop: boolean;
}) {
  const [open, setOpen] = useState(false);
  const b = scored.breakdown;

  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left"
      >
        <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-border bg-ink/60">
          <div className={cn("h-full rounded-full", accentBar)} style={{ width: `${b.total}%` }} />
        </div>
        <span className="text-sm font-bold text-foreground">{b.total}</span>
        {isTop && <Crown className="h-3.5 w-3.5 shrink-0 text-star" />}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1.5">
              <ScoreBar label="Capability" value={Math.round(b.capability)} weight={0.4} accent="bg-aurora" />
              <ScoreBar label="Quality" value={Math.round(b.rating)} weight={0.3} accent="bg-star" />
              <ScoreBar label="Price value" value={Math.round(b.price)} weight={0.2} accent="bg-teal" />
              <ScoreBar label="Breadth" value={Math.round(b.breadth)} weight={0.1} accent="bg-nebula" />
              {b.reasons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-border/60 pt-2">
                  {b.reasons.map((r) => (
                    <span
                      key={r}
                      className="rounded border border-border bg-ink/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-start gap-1 text-[10px] text-muted-foreground/70">
                <Info className="mt-0.5 h-2.5 w-2.5 shrink-0" />
                N/A capabilities are excluded from the capability score — only relevant features count.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
