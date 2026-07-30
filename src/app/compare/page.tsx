import type { Metadata } from "next";
import Link from "next/link";
import { Comparison } from "@/components/site/comparison";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare AI Tools Side-by-Side | My AI Picker",
  description:
    "Compare up to 3 AI tools side-by-side by benchmarks, pricing, context window, and real capabilities. See who wins for your use case with our transparent weighted scoring.",
  keywords: [
    "compare AI tools",
    "AI comparison",
    "ChatGPT vs Claude",
    "AI tool comparison",
    "compare LLMs",
  ],
  alternates: { canonical: "https://myaipicker.com/compare" },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">Compare</span>
          </nav>

          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Compare AI Tools
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add up to 3 tools from the directory and compare them side-by-side by
            benchmarks, pricing, context window, and real capabilities. Our weighted
            scoring shows you exactly who wins — and why.
          </p>

          <Link
            href="/#tools"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools Directory
          </Link>
        </div>
      </section>

      {/* Comparison Deck */}
      <Comparison />
    </div>
  );
}
