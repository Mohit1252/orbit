"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getCategoryCounts } from "@/lib/ai-data";
import { useOrbitStore } from "@/lib/orbit-store";
import { accentClasses, Block3D } from "./block";

export function Categories() {
  // Compute real tool counts per category from the actual tools array.
  const counts = getCategoryCounts();
  const setTasks = useOrbitStore((s) => s.setSearch);
  const setBudget = useOrbitStore((s) => s.setBudget);

  // Click a category → set it as the only active task filter and scroll to tools.
  const selectCategory = (taskLabel: string) => {
    // Replace active tasks with just this one category's task.
    useOrbitStore.setState({ activeTasks: [taskLabel] });
    // Clear budget so all matching tools show (don't over-filter).
    setBudget(null);
    // Smoothly scroll to the tools grid.
    setTimeout(() => {
      document
        .querySelector("#tools")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <section id="categories" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Browse by task"
        title="Pick your orbit"
        description="Every tool is tagged by the job it does best. Tap a category to see only those tools."
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const a = accentClasses[c.accent];
          const Icon = c.icon;
          const toolCount = counts[c.id] ?? 0;
          const disabled = toolCount === 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
            >
              <Block3D
                accent={c.accent}
                hover={!disabled}
                className="group h-full overflow-hidden p-5"
                as="button"
                onClick={() => !disabled && selectCategory(c.label)}
                aria-label={`Show ${c.label} tools`}
                disabled={disabled}
              >
                {/* corner count */}
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-lg border",
                      a.bgSoft,
                      a.border
                    )}
                  >
                    <Icon className={cn("h-6 w-6", a.text)} strokeWidth={2.2} />
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                      a.bgSoft,
                      a.border,
                      a.text
                    )}
                  >
                    {toolCount}
                    <span className="opacity-70">
                      {toolCount === 1 ? "tool" : "tools"}
                    </span>
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                  {c.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>

                <div
                  className={cn(
                    "mt-4 flex items-center gap-1 text-xs font-medium transition-colors",
                    disabled
                      ? "text-muted-foreground/50"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {disabled ? "No tools yet" : "Explore tools"}
                  {!disabled && (
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>

                {/* bottom accent bar */}
                {!disabled && (
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                      a.bg
                    )}
                  />
                )}
              </Block3D>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
        <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-muted-foreground text-balance">{description}</p>
      )}
    </div>
  );
}
