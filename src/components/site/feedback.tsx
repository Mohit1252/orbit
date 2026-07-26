"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Check, Mail } from "lucide-react";

export function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<"missing_tool" | "bug" | "suggestion">("suggestion");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would POST to an API route or Formspree/Typeform.
    // For now, we just simulate success and could open a mailto link.
    setSubmitted(true);
  };

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur block-shadow-neutral p-8 sm:p-12"
      >
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-aurora/10 blur-[80px]" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
            Help us improve
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            What should we add next?
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground text-balance">
            Found a bug? Know an AI tool we&apos;re missing? Have an idea to make
            the comparison better? Let us know.
          </p>

          {submitted ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-8 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-aurora/40 bg-aurora/10 text-aurora">
                <Check className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold">Thank you!</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us build a better tool for everyone.
              </p>
              <a
                href="mailto:support@myaipicker.com"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-aurora hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@myaipicker.com
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Feedback type selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "suggestion", label: "💡 Suggestion" },
                  { id: "missing_tool", label: "🛠️ Missing AI Tool" },
                  { id: "bug", label: "🐛 Bug Report" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setType(opt.id as typeof type)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                      type === opt.id
                        ? "border-aurora/60 bg-aurora/15 text-aurora"
                        : "border-border bg-ink/40 text-muted-foreground hover:text-foreground"
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
                rows={4}
                placeholder={
                  type === "missing_tool"
                    ? "Which AI tool should we add? (Name + URL)"
                    : type === "bug"
                      ? "What went wrong? (Steps to reproduce)"
                      : "How can we improve the site?"
                }
                className="w-full rounded-xl border border-border bg-ink/50 p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
              />

              {/* Submit */}
              <button
                type="submit"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-aurora/50 bg-aurora px-6 font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-aurora-soft"
              >
                <MessageSquarePlus className="h-4.5 w-4.5" />
                Send Feedback
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}

// Simple cn helper to avoid importing if not needed elsewhere
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
