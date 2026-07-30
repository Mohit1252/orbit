import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/lib/blog-data";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — My AI Picker",
  description: "AI tool comparisons, reviews, and guides. Find the right AI for your task with our in-depth articles.",
  alternates: { canonical: "https://myaipicker.com/blog" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        AI Tool Guides & Comparisons
      </h1>
      <p className="mt-2 text-muted-foreground">
        In-depth articles comparing AI tools by real benchmarks, pricing, and use cases.
      </p>

      <div className="mt-8 space-y-4">
        {blogArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-aurora/40"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 font-semibold text-aurora">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight group-hover:text-aurora">
              {article.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{article.description}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-aurora">
              Read article
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6 text-center">
        <h3 className="font-display text-lg font-bold">Compare AI tools yourself</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Don&apos;t just read — try our interactive comparison deck.
        </p>
        <Link
          href="/#compare"
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
        >
          Compare AI Tools →
        </Link>
      </div>
    </div>
  );
}
