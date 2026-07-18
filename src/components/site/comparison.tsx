"use client";

import { motion } from "framer-motion";
import { Check, X, GitCompareArrows, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./categories";
import { accentClasses } from "./block";

type Row = {
  label: string;
  values: (string | boolean)[];
  highlight?: boolean;
};

const columns = [
  { name: "ChatGPT", vendor: "OpenAI", accent: "aurora" as const, logo: "✦", price: "Freemium" },
  { name: "Claude", vendor: "Anthropic", accent: "star" as const, logo: "✸", price: "Freemium" },
  { name: "Gemini", vendor: "Google", accent: "teal" as const, logo: "✧", price: "Freemium" },
];

const rows: Row[] = [
  { label: "Best for", values: ["General chat & tasks", "Long documents & nuance", "Google ecosystem"] },
  { label: "Context window", values: ["128K", "200K", "1M"], highlight: true },
  { label: "Image generation", values: [true, false, true] },
  { label: "Voice mode", values: [true, true, true] },
  { label: "Code execution", values: [true, true, true] },
  { label: "Web browsing", values: [true, true, true] },
  { label: "Offline / open weights", values: [false, false, false] },
  { label: "Starting price", values: ["Free · $20/mo", "Free · $20/mo", "Free · $20/mo"], highlight: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-aurora/40 bg-aurora/10 text-aurora">
        <Check className="h-3.5 w-3.5" />
      </span>
    ) : (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-ink/40 text-muted-foreground">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export function Comparison() {
  return (
    <section id="compare" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Side by side"
        title="Compare before you commit"
        description="Stack up to three tools against the specs that matter — capability, context, price — and pick a winner with confidence."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mt-10 overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral"
      >
        {/* column headers */}
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-2 border-b border-border bg-ink/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <GitCompareArrows className="h-4 w-4 text-aurora" />
            Spec
          </div>
          {columns.map((c, i) => {
            const a = accentClasses[c.accent];
            return (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-lg border font-display text-sm font-bold",
                    a.bgSoft,
                    a.border,
                    a.text
                  )}
                >
                  {c.logo}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-bold">{c.name}</span>
                    {i === 0 && <Crown className="h-3.5 w-3.5 text-star" />}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {c.vendor}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* rows */}
        <div>
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-2 px-4 py-3",
                idx % 2 === 1 && "bg-ink/20",
                row.highlight && "bg-aurora/[0.04]"
              )}
            >
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide",
                  row.highlight ? "text-aurora" : "text-muted-foreground"
                )}
              >
                {row.label}
              </div>
              {row.values.map((v, i) => (
                <div key={i} className="flex items-center">
                  <Cell value={v} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* footer cta */}
        <div className="flex flex-col gap-3 border-t border-border bg-ink/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Highlighted rows are weighted heaviest in your match score.
          </p>
          <div className="flex gap-2">
            <button className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-ink/40 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground">
              Swap tools
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-aurora/50 bg-aurora px-4 text-xs font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft">
              <Crown className="h-3.5 w-3.5" />
              See full breakdown
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
