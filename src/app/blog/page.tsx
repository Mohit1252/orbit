import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/lib/blog-data";
import { ArrowRight } from "lucide-react";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { BlogList } from "./blog-list";

export const metadata: Metadata = {
  title: "AI Tool Blog — Comparisons, Reviews & Guides (2026)",
  description:
    "In-depth AI tool comparisons, reviews, and guides backed by real benchmarks and pricing data. ChatGPT vs Claude, Midjourney vs DALL·E, Cursor vs Copilot, and more — find the right AI for writing, coding, images, video, voice, and music.",
  keywords: [
    "AI tool blog",
    "AI comparisons",
    "ChatGPT vs Claude",
    "Midjourney vs DALL·E",
    "Cursor vs Copilot",
    "best AI tools 2026",
    "AI tool reviews",
    "AI guides",
    "Suno vs Udio",
    "ElevenLabs vs Murf",
    "Gemini vs ChatGPT",
    "Perplexity vs ChatGPT",
    "AI tool comparison blog",
  ],
  alternates: { canonical: "https://myaipicker.com/blog" },
  openGraph: {
    title: "AI Tool Blog — Comparisons, Reviews & Guides (2026)",
    description:
      "In-depth AI tool comparisons backed by real benchmarks. ChatGPT vs Claude, Midjourney vs DALL·E, and more.",
    url: "https://myaipicker.com/blog",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function BlogPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-ink/30">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Blog</span>
            </nav>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              AI Tool Guides & Comparisons
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              In-depth articles comparing AI tools by real benchmarks, pricing,
              and use cases. New comparisons added every week — find the right
              AI for any task.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
                {blogArticles.length} articles
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-star" />
                Updated weekly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-nebula" />
                Real benchmark data
              </span>
            </div>
          </div>
        </section>

        {/* Article list with filters */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <BlogList articles={blogArticles} />

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6 text-center">
            <h3 className="font-display text-lg font-bold">
              Compare AI tools yourself
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Don&apos;t just read — try our interactive comparison deck with
              real benchmark scores.
            </p>
            <Link
              href="/#compare"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
            >
              Compare AI Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
