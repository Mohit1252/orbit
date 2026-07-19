"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Star, Zap } from "lucide-react";
import { CountUp } from "./count-up";

const stats = [
  { icon: Zap, to: 40, suffix: "+", decimals: 0, label: "AI tools indexed", accent: "text-aurora" },
  { icon: TrendingUp, to: 120, suffix: "K", decimals: 0, label: "comparisons / month", accent: "text-star" },
  { icon: Users, to: 60, suffix: "K", decimals: 0, label: "people guided", accent: "text-nebula" },
  { icon: Star, to: 4.8, suffix: "", decimals: 1, label: "avg tool rating", accent: "text-teal" },
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
        {stats.map((s, i) => {
          const Icon = s.icon;
          const barColor = s.accent.replace("text-", "bg-");
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-border/60 bg-ink/30 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-card transition-transform group-hover:-translate-y-0.5">
                <Icon className={`h-5 w-5 ${s.accent}`} />
              </span>
              <div className="min-w-0">
                <div className="font-display text-2xl font-bold tracking-tight">
                  <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="truncate text-xs text-muted-foreground">{s.label}</div>
              </div>
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${barColor}`}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
