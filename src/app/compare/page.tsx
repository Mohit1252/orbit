import type { Metadata } from "next";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "Compare AI Tools Side-by-Side | My AI Picker",
  description:
    "Compare up to 3 AI tools side-by-side by benchmarks, pricing, context window, and real capabilities. Search and select any model to compare instantly.",
  keywords: [
    "compare AI tools",
    "AI comparison",
    "ChatGPT vs Claude",
    "AI tool comparison",
    "compare LLMs",
    "AI model comparison",
  ],
  alternates: { canonical: "https://myaipicker.com/compare" },
};

export default function ComparePage() {
  return <CompareClient />;
}
