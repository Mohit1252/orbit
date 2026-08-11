import type { Metadata } from "next";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "Compare AI Tools Side-by-Side — Benchmarks & Pricing | My AI Picker",
  description:
    "Compare up to 3 AI tools side-by-side by benchmarks (MMLU, SWE-bench, LMArena ELO), pricing, context window, and real capabilities. Search and select any model to compare instantly — ChatGPT vs Claude, Midjourney vs DALL·E, Cursor vs Copilot, and more.",
  keywords: [
    "compare AI tools",
    "AI comparison",
    "ChatGPT vs Claude",
    "Midjourney vs DALL·E",
    "Cursor vs Copilot",
    "AI tool comparison",
    "compare LLMs",
    "AI model comparison",
    "AI benchmark comparison",
    "AI pricing comparison",
    "side by side AI comparison",
  ],
  alternates: { canonical: "https://myaipicker.com/compare" },
  openGraph: {
    title: "Compare AI Tools Side-by-Side — Benchmarks & Pricing",
    description:
      "Compare up to 3 AI tools side-by-side by benchmarks, pricing, and real capabilities. ChatGPT vs Claude, Midjourney vs DALL·E, and more.",
    url: "https://myaipicker.com/compare",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function ComparePage() {
  return <CompareClient />;
}
