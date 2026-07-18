"use client";

import { motion } from "framer-motion";
import { Search, GitCompareArrows, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./categories";

const steps = [
  {
    n: "01",
    icon: Search,
    title: "Describe your mission",
    body: "Pick a task, set your budget, and type what you want to achieve. No jargon required.",
    accent: "aurora" as const,
    cls: "text-aurora border-aurora/40 bg-aurora/10 block-shadow-aurora",
  },
  {
    n: "02",
    icon: GitCompareArrows,
    title: "Compare the matches",
    body: "Shortlisted tools line up side-by-side on capability, context, pricing and real ratings.",
    accent: "star" as const,
    cls: "text-star border-star/40 bg-star/10 block-shadow-star",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Launch with confidence",
    body: "Pick a winner and jump straight to the right plan. We keep track of new launches for you.",
    accent: "nebula" as const,
    cls: "text-nebula border-nebula/40 bg-nebula/10 block-shadow-nebula",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="The flow"
        title="From question to tool in three moves"
        description="No more 20-tab research sessions. ORBIT compresses the discovery loop into a clear, fast path."
        align="center"
      />

      <div className="relative mt-12 grid gap-5 md:grid-cols-3">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative h-full rounded-xl border border-border bg-card p-6 block-shadow-neutral hover-lift">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-lg border",
                      s.cls
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <span className="font-display text-4xl font-bold text-border">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
