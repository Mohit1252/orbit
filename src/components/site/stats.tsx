"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Star, Zap } from "lucide-react";

const stats = [
  { icon: Zap, value: "500+", label: "AI tools indexed", accent: "text-aurora" },
  { icon: TrendingUp, value: "120K", label: "comparisons / month", accent: "text-star" },
  { icon: Users, value: "60K", label: "people guided", accent: "text-nebula" },
  { icon: Star, value: "4.8", label: "avg tool rating", accent: "text-teal" },
];

export function Stats() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur block-shadow-neutral sm:p-6 lg:grid-cols-4"
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-ink/30 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-card">
                <Icon className={`h-5 w-5 ${s.accent}`} />
              </span>
              <div>
                <div className="font-display text-2xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
