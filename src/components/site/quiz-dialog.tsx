"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Trophy,
  Sparkles,
  PenLine,
  Code2,
  Image as ImageIcon,
  Clapperboard,
  AudioLines,
  Database,
  Bot,
  Search as SearchIcon,
  Blocks,
  Star,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  taskOptions,
  budgetTiers,
  type BudgetTier,
} from "@/lib/ai-data";
import {
  computeMatches,
  quizPriorities,
  quizTeamSizes,
} from "@/lib/recommend";
import { useOrbitStore } from "@/lib/orbit-store";
import { accentClasses } from "./block";
import { FavoriteButton } from "./favorite-button";

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

const STEPS = ["task", "budget", "priority", "team"] as const;
const STEP_LABELS = ["Task", "Budget", "Priority", "Team"] as const;

export function QuizDialog() {
  const quizOpen = useOrbitStore((s) => s.quizOpen);
  const closeQuiz = useOrbitStore((s) => s.closeQuiz);

  return (
    <Dialog open={quizOpen} onOpenChange={(o) => !o && closeQuiz()}>
      <DialogContent
        className="max-h-[92vh] gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Find my AI tool — quiz</DialogTitle>
        <DialogDescription className="sr-only">
          Answer a few questions and we&apos;ll match you with the best AI tools.
        </DialogDescription>
        <QuizBody />
      </DialogContent>
    </Dialog>
  );
}

function QuizBody() {
  const quizStep = useOrbitStore((s) => s.quizStep);
  const setQuizStep = useOrbitStore((s) => s.setQuizStep);
  const closeQuiz = useOrbitStore((s) => s.closeQuiz);
  const answers = useOrbitStore((s) => s.quizAnswers);

  // step 0-3 are questions, step 4 is results
  const isResults = quizStep >= STEPS.length;
  const canProceed =
    (quizStep === 0 && answers.task) ||
    (quizStep === 1 && answers.budget) ||
    (quizStep === 2 && answers.priority) ||
    (quizStep === 3 && answers.teamSize);

  return (
    <div className="flex max-h-[92vh] flex-col">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border bg-ink/40 p-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-aurora/40 bg-aurora/10">
            <Sparkles className="h-4.5 w-4.5 text-aurora" />
          </span>
          <div>
            <div className="font-display text-sm font-bold tracking-tight">
              Find my AI tool
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isResults ? "Your matches" : `Step ${quizStep + 1} of ${STEPS.length}`}
            </div>
          </div>
        </div>
        <button
          onClick={closeQuiz}
          aria-label="Close quiz"
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-ink/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* progress bar */}
      {!isResults && (
        <div className="flex gap-1 px-4 pt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= quizStep ? "bg-aurora" : "bg-border"
              )}
            />
          ))}
        </div>
      )}

      {/* body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <AnimatePresence mode="wait">
          {!isResults ? (
            <motion.div
              key={quizStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {quizStep === 0 && <TaskStep />}
              {quizStep === 1 && <BudgetStep />}
              {quizStep === 2 && <PriorityStep />}
              {quizStep === 3 && <TeamStep />}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ResultsStep />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* footer nav */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-ink/40 p-4">
        {!isResults ? (
          <>
            <button
              onClick={() => setQuizStep(Math.max(0, quizStep - 1))}
              disabled={quizStep === 0}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-ink/40 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={() => setQuizStep(quizStep + 1)}
              disabled={!canProceed}
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-aurora-soft disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-40"
            >
              {quizStep === STEPS.length - 1 ? "See matches" : "Continue"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => useOrbitStore.getState().resetQuiz()}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-ink/40 px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
            <button
              onClick={closeQuiz}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft"
            >
              <Check className="h-4 w-4" />
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function TaskStep() {
  const task = useOrbitStore((s) => s.quizAnswers.task);
  const setQuizAnswer = useOrbitStore((s) => s.setQuizAnswer);
  return (
    <StepShell
      title="What do you need help with?"
      subtitle="Pick the task closest to what you want to achieve."
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {taskOptions.map((t) => {
          const Icon = taskIcons[t];
          const active = task === t;
          return (
            <button
              key={t}
              onClick={() => setQuizAnswer("task", t)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                active
                  ? "border-aurora/60 bg-aurora/15 text-aurora block-shadow-aurora"
                  : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-semibold">{t}</span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function BudgetStep() {
  const budget = useOrbitStore((s) => s.quizAnswers.budget);
  const setQuizAnswer = useOrbitStore((s) => s.setQuizAnswer);
  return (
    <StepShell
      title="What's your max budget?"
      subtitle="We'll only show tools at or below this tier."
    >
      <div className="grid gap-2 sm:grid-cols-5">
        {budgetTiers.map((b) => {
          const active = budget === b.label;
          return (
            <button
              key={b.label}
              onClick={() => setQuizAnswer("budget", b.label as BudgetTier)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
                active
                  ? "border-star/60 bg-star/12 text-star block-shadow-star"
                  : "border-border bg-ink/40 text-muted-foreground hover:border-star/40 hover:text-foreground"
              )}
            >
              <span className="font-display text-base font-bold">{b.label}</span>
              <span className="text-[11px] opacity-80">{b.hint}</span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function PriorityStep() {
  const priority = useOrbitStore((s) => s.quizAnswers.priority);
  const setQuizAnswer = useOrbitStore((s) => s.setQuizAnswer);
  return (
    <StepShell
      title="What matters most?"
      subtitle="This weights your match scores."
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {quizPriorities.map((p) => {
          const a = accentClasses[p.accent];
          const active = priority === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setQuizAnswer("priority", p.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                active
                  ? cn(a.border, a.bgSoft, a.text, a.shadow)
                  : "border-border bg-ink/40 text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn("font-display text-sm font-bold", active && a.text)}>
                {p.label}
              </span>
              <span className="ml-auto text-[11px] opacity-80">{p.hint}</span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function TeamStep() {
  const teamSize = useOrbitStore((s) => s.quizAnswers.teamSize);
  const setQuizAnswer = useOrbitStore((s) => s.setQuizAnswer);
  return (
    <StepShell
      title="Who's using it?"
      subtitle="So we can favor tools with the right plans."
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {quizTeamSizes.map((t) => {
          const active = teamSize === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setQuizAnswer("teamSize", t.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-all",
                active
                  ? "border-nebula/60 bg-nebula/15 text-nebula block-shadow-nebula"
                  : "border-border bg-ink/40 text-muted-foreground hover:border-nebula/40 hover:text-foreground"
              )}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="font-display text-sm font-bold">{t.label}</span>
              <span className="text-[11px] opacity-80">{t.hint}</span>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function ResultsStep() {
  const answers = useOrbitStore((s) => s.quizAnswers);
  const openDetail = useOrbitStore((s) => s.openDetail);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const compareIds = useOrbitStore((s) => s.compareIds);

  const matches = useMemo(() => computeMatches(answers), [answers]);
  const top = matches.slice(0, 5);

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-star/40 bg-star/10 text-star">
          <Trophy className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Your top matches
          </h2>
          <p className="text-sm text-muted-foreground">
            Ranked by how well each tool fits your answers.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {top.map((m, i) => {
          const a = accentClasses[m.tool.accent];
          const selected = compareIds.includes(m.tool.id);
          const isTop = i === 0;
          return (
            <div
              key={m.tool.id}
              className={cn(
                "relative flex gap-3 overflow-hidden rounded-xl border bg-card p-4",
                isTop ? cn(a.border, a.shadow) : "border-border"
              )}
            >
              {/* rank ribbon */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg border font-display text-sm font-bold",
                    isTop
                      ? cn(a.border, a.bgSoft, a.text)
                      : "border-border bg-ink/40 text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                {isTop && (
                  <span className="text-[9px] font-bold uppercase tracking-wide text-star">
                    Best
                  </span>
                )}
              </div>

              {/* logo + name */}
              <button
                onClick={() => openDetail(m.tool.id)}
                className="flex min-w-0 flex-1 items-start gap-3 text-left"
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-lg border font-display text-lg font-bold",
                    a.bgSoft,
                    a.border,
                    a.text
                  )}
                >
                  {m.tool.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-display text-base font-bold tracking-tight">
                      {m.tool.name}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-star text-star" />
                      {m.tool.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {m.tool.tagline}
                  </p>
                  {/* match score bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full border border-border bg-ink/60">
                      <div
                        className={cn("h-full rounded-full", a.bg)}
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                    <span className={cn("text-xs font-bold", a.text)}>{m.score}%</span>
                  </div>
                  {/* reasons */}
                  {m.reasons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.reasons.map((r) => (
                        <span
                          key={r}
                          className={cn(
                            "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                            a.bgSoft,
                            a.border,
                            a.text
                          )}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>

              {/* actions */}
              <div className="flex shrink-0 flex-col items-center gap-1.5">
                <button
                  onClick={() => toggleCompare(m.tool.id)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                    selected
                      ? "border-aurora/60 bg-aurora/15 text-aurora"
                      : "border-border bg-ink/40 text-muted-foreground hover:border-aurora/40 hover:text-foreground"
                  )}
                  aria-label="Add to compare"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <FavoriteButton toolId={m.tool.id} accent={m.tool.accent} size="sm" />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Scores are 0–100, weighted by task match, budget fit, your priority, and
        team size. Tap any tool to see full details.
      </p>
    </div>
  );
}
