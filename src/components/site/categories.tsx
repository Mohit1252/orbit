"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/ai-data";
import { accentClasses, Block3D } from "./block";

export function Categories() {
  return (
    <section id="categories" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Browse by task"
        title="Pick your orbit"
        description="Every tool is tagged by the job it does best. Start from a category and drill into capabilities, pricing and ratings."
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const a = accentClasses[c.accent];
          const Icon = c.icon;
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
                hover
                className="group h-full overflow-hidden p-5"
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
                      "rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                      a.bgSoft,
                      a.border,
                      a.text
                    )}
                  >
                    {c.count}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                  {c.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  Explore tools
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* bottom accent bar */}
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                    a.bg
                  )}
                />
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
