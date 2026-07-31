import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { Trophy, ArrowRight, Star, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Best AI Tools 2026 — Ranked & Awarded | My AI Picker",
  description:
    "The definitive guide to the best AI tools of 2026. Ranked by real benchmarks (MMLU, SWE-bench, LMArena ELO) and pricing. Find the best AI for coding, writing, images, video, and more.",
  keywords: [
    "best AI tools 2026",
    "best AI for coding",
    "best AI for writing",
    "best AI image generator",
    "best free AI tools",
    "top AI models 2026",
    "AI tool awards",
  ],
  alternates: { canonical: "https://myaipicker.com/best-ai-tools-2026" },
  openGraph: {
    title: "Best AI Tools 2026 — Ranked & Awarded | My AI Picker",
    description:
      "The definitive guide to the best AI tools of 2026. Ranked by real benchmarks and pricing.",
    url: "https://myaipicker.com/best-ai-tools-2026",
    type: "article",
  },
};

// Award categories
const awards = [
  {
    id: "coding",
    title: "Best AI for Coding",
    emoji: "⌨️",
    description: "For developers who want AI to write, debug, and ship code faster.",
    winner: "claude",
    runnersUp: ["cursor", "github-copilot"],
    reason: "Claude leads SWE-bench (49.0%) — the gold standard for software engineering benchmarks. Its terminal-native Claude Code agent can plan, execute, and deploy multi-file changes autonomously.",
  },
  {
    id: "writing",
    title: "Best AI for Writing",
    emoji: "✍️",
    description: "For bloggers, marketers, and authors who need high-quality content.",
    winner: "claude",
    runnersUp: ["chatgpt", "notion-ai"],
    reason: "Claude's nuanced, natural writing style outperforms ChatGPT on readability and creative tasks. Its 200K context handles long-form content without losing track.",
  },
  {
    id: "images",
    title: "Best AI for Image Generation",
    emoji: "🎨",
    description: "For designers, artists, and creators who need stunning visuals.",
    winner: "midjourney",
    runnersUp: ["flux", "dalle3"],
    reason: "Midjourney V6 ranks #1 on aesthetic ELO leaderboards. Its signature painterly style and style references make it the artist's choice.",
  },
  {
    id: "video",
    title: "Best AI for Video Generation",
    emoji: "🎬",
    description: "For filmmakers and content creators producing AI video.",
    winner: "veo",
    runnersUp: ["runway", "kling"],
    reason: "Veo 3.1 generates HD video with synchronized audio and dialogue — a first for AI video. Its physics simulation is the most realistic available.",
  },
  {
    id: "voice",
    title: "Best AI for Voice & TTS",
    emoji: "🔊",
    description: "For podcasters, educators, and developers needing natural speech.",
    winner: "elevenlabs",
    runnersUp: ["murf", "play-ht"],
    reason: "ElevenLabs sets the industry standard for natural text-to-speech. Its instant voice cloning and 32-language support make it unbeatable for voiceover production.",
  },
  {
    id: "value",
    title: "Best Value AI (Free or Cheap)",
    emoji: "💰",
    description: "For budget-conscious users who want maximum capability per dollar.",
    winner: "deepseek",
    runnersUp: ["llama", "gemini"],
    reason: "DeepSeek R1 offers frontier-class reasoning at near-zero cost. Open weights mean you can self-host for free. Its SWE-bench score (38.8%) rivals models 10x its price.",
  },
  {
    id: "research",
    title: "Best AI for Research",
    emoji: "🔍",
    description: "For students, academics, and analysts who need cited answers.",
    winner: "perplexity",
    runnersUp: ["google-ai-mode", "you-com"],
    reason: "Perplexity's Pro Search breaks complex questions into multi-step research with live web citations. It's the most reliable answer engine for academic and market research.",
  },
  {
    id: "build",
    title: "Best AI for Building Apps",
    emoji: "🏗️",
    description: "For founders and makers who want to ship apps without code.",
    winner: "v0",
    runnersUp: ["lovable", "bolt"],
    reason: "v0 by Vercel generates production-ready React + Tailwind UI from natural language. One-click deploy to Vercel makes it the fastest path from idea to live website.",
  },
  {
    id: "longcontext",
    title: "Best AI for Long Documents",
    emoji: "📄",
    description: "For users who need to analyze books, codebases, or legal documents.",
    winner: "gemini",
    runnersUp: ["claude", "kimi"],
    reason: "Gemini 2.5 Pro's 1M-token context window is the largest among frontier models. Combined with Google Search grounding, it's unmatched for analyzing massive documents.",
  },
  {
    id: "opensource",
    title: "Best Open-Source AI",
    emoji: "🔓",
    description: "For developers who want to self-host, fine-tune, and own their AI.",
    winner: "llama",
    runnersUp: ["deepseek", "flux"],
    reason: "Meta's Llama 4 family (Scout, Maverick, Behemoth) offers the best open-weights models available. Scout runs on consumer GPUs, Maverick balances quality, and the community is massive.",
  },
];

export default function BestAITools2026() {
  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-ink/40">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-star/10 blur-[80px]" />
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">Best AI Tools 2026</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-md border border-star/40 bg-star/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-star">
            <Trophy className="h-3.5 w-3.5" />
            AI Tool Awards 2026
          </span>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Best AI Tools of 2026
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground text-balance">
            Ranked by real benchmarks — not paid placements. We evaluated {tools.length}+ AI tools
            across {awards.length} categories using SWE-bench, MMLU, LMArena ELO, and live API pricing.
          </p>

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold text-foreground">{tools.length}+</span>
              <span className="text-muted-foreground">tools evaluated</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold text-foreground">{awards.length}</span>
              <span className="text-muted-foreground">award categories</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="font-display text-2xl font-bold text-foreground">7</span>
              <span className="text-muted-foreground">benchmark sources</span>
            </span>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {awards.map((award, idx) => {
            const winner = tools.find((t) => t.id === award.winner);
            if (!winner) return null;
            const wa = accentClasses[winner.accent];
            const runners = award.runnersUp.map((id) => tools.find((t) => t.id === id)).filter(Boolean);

            return (
              <div key={award.id} className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral">
                {/* Award header */}
                <div className={cn("flex items-center gap-3 border-b border-border p-5", wa.bgSoft)}>
                  <span className="text-3xl">{award.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-bold tracking-tight">
                      {award.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">{award.description}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase", wa.border, wa.bgSoft, wa.text)}>
                    <Trophy className="h-3 w-3" />
                    Winner
                  </span>
                </div>

                {/* Winner card */}
                <div className="p-5">
                  <Link
                    href={`/tools/${winner.id}`}
                    className={cn("group flex items-center gap-4 rounded-xl border p-4 transition-all hover:-translate-y-0.5", wa.border, wa.shadow)}
                  >
                    <span className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-xl border font-display text-2xl font-bold", wa.bgSoft, wa.border, wa.text)}>
                      {winner.logo}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold">{winner.name}</h3>
                        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {winner.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{winner.vendor} · {winner.priceNote}</p>
                      <p className="mt-2 text-sm text-foreground/90">{award.reason}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>

                  {/* Runners up */}
                  {runners.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Runners Up
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {runners.map((r) => {
                          if (!r) return null;
                          const ra = accentClasses[r.accent];
                          return (
                            <Link
                              key={r.id}
                              href={`/tools/${r.id}`}
                              className="group flex items-center gap-3 rounded-lg border border-border bg-ink/30 p-3 transition-all hover:-translate-y-0.5 hover:border-foreground/30"
                            >
                              <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", ra.bgSoft, ra.border, ra.text)}>
                                {r.logo}
                              </span>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-bold">{r.name}</div>
                                <div className="truncate text-[10px] text-muted-foreground">{r.priceNote.split("·")[0]}</div>
                              </div>
                              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Methodology CTA */}
        <div className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-aurora" />
          <h3 className="mt-2 font-display text-lg font-bold">How did we choose?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Our scoring formula: Capability×0.4 + Quality×0.3 + Price×0.2 + Breadth×0.1.
            No paid placements. No bias. Just real benchmarks.
          </p>
          <Link
            href="/how-we-score"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
          >
            Read our methodology <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Compare CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/compare"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-aurora/40"
          >
            <Trophy className="h-4 w-4 text-star" />
            Compare all tools yourself
          </Link>
        </div>
      </section>
    </div>
  );
}
