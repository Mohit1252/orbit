import type { Metadata } from "next";
import { LeaderboardContent } from "./leaderboard-content";

export const metadata: Metadata = {
  title: "AI Model Leaderboard 2026 — Ranked by Benchmarks & Price | My AI Picker",
  description:
    "Live leaderboard of top AI models ranked by MMLU, SWE-bench, HumanEval, and LMArena ELO scores. Compare reasoning, coding, and price per million tokens.",
  keywords: [
    "AI leaderboard",
    "LLM benchmark ranking",
    "AI model comparison",
    "MMLU leaderboard",
    "SWE-bench ranking",
    "LMArena ELO",
  ],
  alternates: { canonical: "https://myaipicker.com/leaderboard" },
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
