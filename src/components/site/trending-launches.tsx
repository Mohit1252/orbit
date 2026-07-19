"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTrendingLaunches } from "@/lib/ai-data";
import { useOrbitStore } from "@/lib/orbit-store";
import { accentClasses } from "./block";
import { FavoriteButton } from "./favorite-button";
import { SectionHeading } from "./categories";

const launches = getTrendingLaunches(8);

export function TrendingLaunches() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const openDetail = useOrbitStore((s) => s.openDetail);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 260; // approx card + gap
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Fresh launches"
          title="Trending in the universe"
          description="The newest AI tools to land on ORBIT, sorted by launch date. Swipe through to catch up."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-aurora/40 hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-aurora/40 hover:text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]"
      >
        {launches.map((tool, i) => {
          const a = accentClasses[tool.accent];
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              className="group relative w-[240px] shrink-0 snap-start"
            >
              <div
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-x-0.5 hover:-translate-y-0.5",
                  a.border,
                  a.shadow
                )}
              >
                {/* launch year ribbon */}
                <div className="absolute right-0 top-0 z-10 flex items-center gap-1 rounded-bl-lg border border-t-0 border-r-0 border-border bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                  <Flame className={cn("h-3 w-3", a.text)} />
                  <span className={a.text}>{tool.launched}</span>
                </div>

                {/* clickable body */}
                <button
                  onClick={() => openDetail(tool.id)}
                  className="flex flex-1 flex-col p-4 text-left"
                  aria-label={`View ${tool.name} details`}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-lg border font-display text-lg font-bold",
                      a.bgSoft,
                      a.border,
                      a.text
                    )}
                  >
                    {tool.logo}
                  </span>
                  <h3 className="mt-3 truncate font-display text-base font-bold tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">{tool.vendor}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.tagline}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-star text-star" />
                      <span className="text-xs font-semibold">{tool.rating.toFixed(1)}</span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-6 items-center gap-0.5 rounded-md border px-1.5 text-[10px] font-semibold",
                        a.bgSoft,
                        a.border,
                        a.text
                      )}
                    >
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </button>

                {/* favorite footer */}
                <div className="flex items-center justify-between border-t border-border/60 bg-ink/30 px-3 py-2">
                  <span className="truncate text-[11px] font-semibold text-foreground">
                    {tool.priceNote.split("·")[0].trim()}
                  </span>
                  <FavoriteButton toolId={tool.id} accent={tool.accent} size="sm" />
                </div>

                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    a.bg
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
