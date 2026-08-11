import type { Metadata } from "next";
import { LeaderboardContent } from "./leaderboard-content";

export const metadata: Metadata = {
  title: "AI Model Leaderboard 2026 — Ranked by Benchmarks & Price",
  description:
    "Live leaderboard of top AI models ranked by MMLU, SWE-bench, HumanEval, GSM8K, and LMArena ELO scores. Compare reasoning, coding, math, and price per million tokens. See which AI model is #1 in 2026.",
  keywords: [
    "AI leaderboard",
    "LLM benchmark ranking",
    "AI model comparison",
    "MMLU leaderboard",
    "SWE-bench ranking",
    "LMArena ELO",
    "HumanEval leaderboard",
    "GSM8K leaderboard",
    "best AI model 2026",
    "AI model ranking",
    "cheapest AI API",
    "AI value score",
  ],
  alternates: { canonical: "https://myaipicker.com/leaderboard" },
  openGraph: {
    title: "AI Model Leaderboard 2026 — Ranked by Benchmarks & Price",
    description:
      "Live leaderboard of top AI models ranked by MMLU, SWE-bench, HumanEval, and LMArena ELO scores.",
    url: "https://myaipicker.com/leaderboard",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
