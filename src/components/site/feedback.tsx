"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<"missing_tool" | "bug" | "suggestion">("suggestion");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* === BLACK HOLE CONTAINER === */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-ink/80"
      >
        {/* === BLACK HOLE VISUAL === */}
        {/* Outer accretion disk — rotates clockwise */}
        <div
          className="blackhole-disk blackhole-disk-gradient pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-60 blur-[2px]"
          style={{ maskImage: "radial-gradient(circle, transparent 25%, black 30%, black 48%, transparent 52%)",
                   WebkitMaskImage: "radial-gradient(circle, transparent 25%, black 30%, black 48%, transparent 52%)" }}
        />

        {/* Inner accretion disk — rotates counter-clockwise, hotter/brighter */}
        <div
          className="blackhole-disk-reverse blackhole-disk-inner pointer-events-none absolute h-[400px] w-[400px] rounded-full opacity-70 blur-[1px]"
          style={{ maskImage: "radial-gradient(circle, transparent 28%, black 32%, black 45%, transparent 50%)",
                   WebkitMaskImage: "radial-gradient(circle, transparent 28%, black 32%, black 45%, transparent 50%)" }}
        />

        {/* Gravitational lensing ring — the bright photon sphere */}
        <div
          className="blackhole-lensing pointer-events-none absolute h-[200px] w-[200px] rounded-full"
        />

        {/* Event horizon — the dark center (pure black circle) */}
        <div className="blackhole-core-pulse pointer-events-none absolute h-[140px] w-[140px] rounded-full bg-black shadow-[0_0_60px_20px_rgba(252,211,77,0.3),0_0_100px_40px_rgba(251,146,60,0.15)]" />

        {/* Outer glow — subtle amber haze */}
        <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[60px]" />

        {/* === FEEDBACK FORM (centered on black hole) === */}
        <div className="relative z-10 w-full max-w-md px-6">
          {/* Heading */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-md border border-star/40 bg-ink/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-star backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-star" />
              Help us improve
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl">
              Send a signal into the void
            </h2>
            <p className="mt-2 text-sm text-white/60 text-balance">
              Found a bug? Know a tool we&apos;re missing? Drop your feedback into the black hole.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-aurora/30 bg-ink/90 p-6 text-center backdrop-blur-xl"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-aurora/40 bg-aurora/10 text-aurora">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold text-white">Signal received!</h3>
              <p className="text-sm text-white/60">
                Your feedback has crossed the event horizon. We&apos;ll process it on the other side.
              </p>
              <a
                href="mailto:support@myaipicker.com"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-aurora hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@myaipicker.com
              </a>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-3 rounded-xl border border-border/60 bg-ink/90 p-5 backdrop-blur-xl"
            >
              {/* Feedback type selector */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "suggestion", label: "💡 Suggestion" },
                  { id: "missing_tool", label: "🛠️ Missing Tool" },
                  { id: "bug", label: "🐛 Bug" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setType(opt.id as typeof type)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-all",
                      type === opt.id
                        ? "border-star/60 bg-star/15 text-star"
                        : "border-border bg-ink/60 text-white/50 hover:text-white"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Message input */}
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={
                  type === "missing_tool"
                    ? "Which AI tool should we add? (Name + URL)"
                    : type === "bug"
                      ? "What went wrong? (Steps to reproduce)"
                      : "How can we improve the site?"
                }
                className="w-full rounded-lg border border-border bg-ink/70 p-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-star/60 focus:ring-2 focus:ring-star/20"
              />

              {/* Submit */}
              <button
                type="submit"
                className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-star/50 bg-gradient-to-r from-amber-600 to-orange-600 px-4 font-semibold text-white shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)] transition-all hover:shadow-[0_0_30px_0px_rgba(251,191,36,0.6)] hover:brightness-110"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Send into the void
              </button>
            </form>
          )}
        </div>

        {/* === STARS around black hole === */}
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() < 0.7 ? 1 : 2,
              height: Math.random() < 0.7 ? 1 : 2,
              opacity: 0.3 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}
