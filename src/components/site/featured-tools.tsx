"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { tools } from "@/lib/ai-data";
import { ToolCard } from "./tool-card";
import { SectionHeading } from "./categories";

const sortTabs = [
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "popular", label: "Most popular", icon: Flame },
  { id: "all", label: "All tools", icon: LayoutGrid },
] as const;

type SortId = (typeof sortTabs)[number]["id"];

export function FeaturedTools() {
  const [sort, setSort] = useState<SortId>("featured");
  const [compare, setCompare] = useState<string[]>(["chatgpt", "midjourney"]);

  const list = tools.filter((t) =>
    sort === "featured" ? t.featured : true
  );

  const toggle = (id: string) =>
    setCompare((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );

  return (
    <section id="tools" className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="The directory"
          title="Featured AI tools"
          description="Hand-picked models worth your attention. Add up to three to compare them side-by-side below."
        />

        {/* sort tabs */}
        <div className="inline-flex w-full gap-1 rounded-lg border border-border bg-card/60 p-1 lg:w-auto">
          {sortTabs.map((t) => {
            const Icon = t.icon;
            const active = sort === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSort(t.id)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all lg:flex-none",
                  active
                    ? "bg-aurora/15 text-aurora"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* compare tray */}
      <CompareTray count={compare.length} />

      {/* grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
          >
            <ToolCard
              tool={tool}
              selected={compare.includes(tool.id)}
              onToggle={toggle}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-aurora/40 block-shadow-sm">
          Browse all 500+ tools
        </button>
      </div>
    </section>
  );
}

function CompareTray({ count }: { count: number }) {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-ink/40 px-4 py-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <LayoutGrid className="h-4 w-4" />
      </span>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{count}/3</span> tools
        queued for comparison — head to the{" "}
        <a href="#compare" className="text-aurora hover:underline">
          compare deck
        </a>
        .
      </p>
    </div>
  );
}
