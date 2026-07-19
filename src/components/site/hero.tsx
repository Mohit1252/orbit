"use client";

import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  PenLine,
  Code2,
  Image as ImageIcon,
  Clapperboard,
  AudioLines,
  Bot,
  Blocks,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrbitStore } from "@/lib/orbit-store";
import { useCaseScenarios } from "@/lib/recommend";

const orbitBlocks = [
  { icon: PenLine, accent: "aurora", label: "Writing", x: "-58%", y: "-10%", delay: 0 },
  { icon: Code2, accent: "teal", label: "Coding", x: "55%", y: "-22%", delay: 0.4 },
  { icon: ImageIcon, accent: "nebula", label: "Images", x: "62%", y: "30%", delay: 0.8 },
  { icon: Clapperboard, accent: "coral", label: "Video", x: "-5%", y: "62%", delay: 1.2 },
  { icon: AudioLines, accent: "star", label: "Voice", x: "-66%", y: "40%", delay: 0.6 },
  { icon: Bot, accent: "nebula", label: "Agents", x: "40%", y: "-58%", delay: 1.0 },
  { icon: Blocks, accent: "aurora", label: "Build", x: "-78%", y: "-30%", delay: 1.4 },
];

const accentStyle: Record<string, { bg: string; border: string; text: string; shadow: string; glow: string }> = {
  aurora: { bg: "bg-aurora/15", border: "border-aurora/45", text: "text-aurora", shadow: "block-shadow-aurora", glow: "glow-aurora" },
  teal: { bg: "bg-teal/15", border: "border-teal/45", text: "text-teal", shadow: "block-shadow-teal", glow: "" },
  nebula: { bg: "bg-nebula/15", border: "border-nebula/45", text: "text-nebula", shadow: "block-shadow-nebula", glow: "glow-nebula" },
  coral: { bg: "bg-coral/15", border: "border-coral/45", text: "text-coral", shadow: "block-shadow-coral", glow: "" },
  star: { bg: "bg-star/15", border: "border-star/45", text: "text-star", shadow: "block-shadow-star", glow: "glow-star" },
};

const stats = [
  { value: "80+", label: "AI tools tracked" },
  { value: "9", label: "task categories" },
  { value: "120K", label: "monthly comparisons" },
];

export function Hero() {
  const openQuiz = useOrbitStore((s) => s.openQuiz);
  const setSearch = useOrbitStore((s) => s.setSearch);

  const startScenario = (taskId: string, budget: Parameters<typeof openQuiz>[0] extends infer P ? P extends { budget?: infer B } ? B : never : never) => {
    openQuiz({ task: taskId, budget });
  };

  const scrollToExplore = () => {
    document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-10 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-8 lg:pb-20 lg:pt-20">
        {/* LEFT — copy + search */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-aurora" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aurora" />
            </span>
            Now tracking 500+ models · updated daily
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Find the right{" "}
            <span className="relative inline-block">
              <span className="text-aurora text-glow-aurora">AI tool</span>
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-aurora/50"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C40 3 160 3 198 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            for any mission.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-base text-muted-foreground text-balance sm:text-lg"
          >
            The AI universe is crowded. ORBIT compares every model by what it can
            actually do, your budget and your task — so you land on the perfect
            tool in seconds, not hours.
          </motion.p>

          {/* Search + quiz CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group relative flex flex-1 items-center">
                <Search className="pointer-events-none absolute left-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                <input
                  type="text"
                  placeholder="Try “write blog posts” or “generate video”…"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") scrollToExplore();
                  }}
                  className="h-13 w-full rounded-xl border border-border bg-card/80 py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
                />
              </div>
              <button
                onClick={() => openQuiz()}
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-aurora/50 bg-aurora px-5 font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-aurora-soft"
              >
                <Sparkles className="h-4.5 w-4.5" />
                Find my tool
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* use-case scenario chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">I want to:</span>
              {useCaseScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startScenario(s.task, s.budget)}
                  className="rounded-md border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-aurora/40 hover:text-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* stats */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 grid max-w-md grid-cols-3 gap-3"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-card/50 px-3 py-3 text-center"
              >
                <dt className="font-display text-2xl font-bold text-foreground">
                  {s.value}
                </dt>
                <dd className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* RIGHT — orbit visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-[30rem]"
        >
          <OrbitVisual onLaunch={() => openQuiz()} />
        </motion.div>
      </div>
    </section>
  );
}

function OrbitVisual({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="relative h-full w-full">
      {/* orbit rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/[0.06] animate-spin-slow" />
      <div className="absolute inset-[2%] rounded-full border border-white/[0.04]" />
      <div className="absolute inset-[20%] rounded-full border border-dashed border-white/[0.05] animate-spin-reverse-slow" />

      {/* center core — clickable, launches quiz */}
      <button
        onClick={onLaunch}
        aria-label="Launch the find-my-tool quiz"
        className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative grid h-28 w-28 place-items-center rounded-2xl border border-aurora/50 bg-gradient-to-br from-aurora/25 to-aurora/5 block-shadow-aurora glow-aurora transition-transform group-hover:scale-105 sm:h-32 sm:w-32">
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-aurora/30" />
          <div className="grid h-16 w-16 place-items-center rounded-xl border border-aurora/40 bg-ink/70 sm:h-20 sm:w-20">
            <Sparkles className="h-7 w-7 text-aurora text-glow-aurora sm:h-8 sm:w-8" />
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-aurora">
            AI Core
          </span>
        </div>
      </button>

      {/* floating category blocks */}
      {orbitBlocks.map((b, i) => {
        const s = accentStyle[b.accent];
        const Icon = b.icon;
        return (
          <div
            key={b.label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(${b.x}, ${b.y})` }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: b.delay }}
              className={cn(
                "grid h-16 w-16 place-items-center rounded-xl border bg-card/90 backdrop-blur animate-float-slow sm:h-18 sm:w-18",
                s.border,
                s.shadow,
                s.glow
              )}
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <Icon className={cn("h-6 w-6", s.text)} strokeWidth={2.2} />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
                {b.label}
              </span>
            </motion.div>
          </div>
        );
      })}

      {/* tiny rating badge */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 backdrop-blur block-shadow-sm">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5 fill-star text-star"
            />
          ))}
        </div>
        <div className="text-[11px] leading-tight">
          <div className="font-semibold text-foreground">4.8 avg</div>
          <div className="text-muted-foreground">across 60K reviews</div>
        </div>
      </div>
    </div>
  );
}
