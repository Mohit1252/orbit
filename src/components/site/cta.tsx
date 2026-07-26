"use client";

import { motion } from "framer-motion";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-aurora/30 bg-gradient-to-br from-aurora/12 via-card to-card p-8 block-shadow-aurora sm:p-12"
      >
        {/* decorative My AI Picker */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-aurora/20 animate-spin-slow">
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-aurora shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]" />
        </div>
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-nebula/10 blur-[80px]" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-md border border-aurora/40 bg-aurora/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <Sparkles className="h-3.5 w-3.5" />
            Ready when you are
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Stop guessing. Start with the right AI.
          </h2>
          <p className="mt-3 text-muted-foreground text-balance">
            Join 60,000+ builders, writers and founders who skip the research
            rabbit hole and ship faster with My AI Picker.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-aurora/50 bg-aurora px-6 font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-aurora-soft">
              <Rocket className="h-4.5 w-4.5" />
              Find my AI tool
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Free forever for individuals · No credit card required
          </p>
        </div>
      </motion.div>
    </section>
  );
}
