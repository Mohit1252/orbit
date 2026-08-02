"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogArticle } from "@/lib/blog-data";
import { CalendarDays, Clock, ArrowRight, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogListProps {
  articles: BlogArticle[];
}

const accentMap: Record<string, string> = {
  Coding: "aurora",
  Writing: "nebula",
  Images: "star",
  Video: "coral",
  Voice: "teal",
  Build: "aurora",
  Data: "teal",
  Agents: "nebula",
  Search: "star",
  Comparisons: "coral",
  Guides: "aurora",
  News: "star",
};

export function BlogList({ articles }: BlogListProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Sort by date desc (newest first)
  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [articles]
  );

  // Build category list from articles
  const categories = useMemo(() => {
    const set = new Set<string>();
    sorted.forEach((a) => set.add(a.category));
    return ["All", ...Array.from(set)];
  }, [sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((a) => {
      const matchesCategory =
        activeCategory === "All" || a.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [sorted, query, activeCategory]);

  const featured = sorted[0];
  const rest = filtered.filter((a) => a.slug !== featured?.slug);
  const showFeatured = featured && activeCategory === "All" && !query;

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-0 z-20 -mx-4 mb-8 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, tools, comparisons..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
            />
          </div>
          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              const accent = accentMap[cat] || "aurora";
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-md border px-3 text-xs font-semibold transition-all",
                    active
                      ? accent === "aurora"
                        ? "border-aurora/50 bg-aurora/15 text-aurora"
                        : accent === "nebula"
                        ? "border-nebula/50 bg-nebula/15 text-nebula"
                        : accent === "star"
                        ? "border-star/50 bg-star/15 text-star"
                        : accent === "coral"
                        ? "border-coral/50 bg-coral/15 text-coral"
                        : "border-teal/50 bg-teal/15 text-teal"
                      : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-aurora" />
        <span>
          Showing <strong className="text-foreground">{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "article" : "articles"}
          {activeCategory !== "All" && (
            <>
              {" "}
              in <strong className="text-foreground">{activeCategory}</strong>
            </>
          )}
        </span>
      </div>

      {/* Featured article (only when no filter/search) */}
      {showFeatured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-8 grid overflow-hidden rounded-2xl border border-aurora/30 bg-gradient-to-br from-aurora/[0.06] via-card to-card transition-all hover:-translate-y-0.5 hover:border-aurora/50 sm:grid-cols-5"
        >
          {featured.image && (
            <div className="relative aspect-[1344/768] w-full overflow-hidden bg-ink/40 sm:col-span-2 sm:aspect-auto">
              <img
                src={featured.image}
                alt={`${featured.title} — visual comparison`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            </div>
          )}
          <div className={cn("p-6 sm:p-8", featured.image ? "sm:col-span-3" : "")}>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md border border-aurora/50 bg-aurora/15 px-2 py-0.5 font-bold text-aurora">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
            <span className="rounded-md border border-border bg-card px-2 py-0.5 font-semibold text-muted-foreground">
              {featured.category}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {featured.date}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {featured.readTime}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight group-hover:text-aurora sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {featured.description}
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-aurora">
            Read article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/40 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No articles found. Try a different search or category.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
            }}
            className="mt-3 inline-flex h-9 items-center rounded-lg border border-aurora/40 bg-aurora/10 px-4 text-sm font-semibold text-aurora hover:bg-aurora/20"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(showFeatured ? rest : filtered).map((article) => {
            const accent = accentMap[article.category] || "aurora";
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-aurora/40"
              >
                {article.image && (
                  <div className="relative aspect-[1344/768] w-full overflow-hidden border-b border-border bg-ink/40">
                    <img
                      src={article.image}
                      alt={`${article.title} — visual comparison`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "rounded-md border px-2 py-0.5 font-semibold",
                      accent === "aurora" && "border-aurora/40 bg-aurora/10 text-aurora",
                      accent === "nebula" && "border-nebula/40 bg-nebula/10 text-nebula",
                      accent === "star" && "border-star/40 bg-star/10 text-star",
                      accent === "coral" && "border-coral/40 bg-coral/10 text-coral",
                      accent === "teal" && "border-teal/40 bg-teal/10 text-teal"
                    )}
                  >
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug tracking-tight group-hover:text-aurora">
                  {article.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {article.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-aurora">
                    Read
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
