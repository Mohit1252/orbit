"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  accent: "aurora" | "star" | "nebula" | "coral" | "teal";
}

const testimonials: Testimonial[] = [
  {
    quote:
      "ORBIT cut my AI research from 3 hours to 5 minutes. Found a voice tool I'd never heard of that was perfect.",
    name: "Maya Chen",
    role: "Podcast producer",
    accent: "aurora",
  },
  {
    quote:
      "The compare deck settled a team argument between Claude and Gemini in one screenshot. Worth it for that alone.",
    name: "Dev Patel",
    role: "Engineering lead",
    accent: "teal",
  },
  {
    quote:
      "Finally a directory that doesn't just list tools — it actually tells me which one fits my budget and task.",
    name: "Sofia Reyes",
    role: "Indie founder",
    accent: "nebula",
  },
  {
    quote:
      "The find-my-tool quiz nailed it. Top match was exactly the image generator I ended up subscribing to.",
    name: "Jonas Weber",
    role: "Marketing designer",
    accent: "star",
  },
  {
    quote:
      "I track AI launches for a living. ORBIT's trending section catches things I miss. It's now my morning check.",
    name: "Aisha Okonkwo",
    role: "AI newsletter writer",
    accent: "coral",
  },
];

const accentText: Record<Testimonial["accent"], string> = {
  aurora: "text-aurora",
  star: "text-star",
  nebula: "text-nebula",
  coral: "text-coral",
  teal: "text-teal",
};

export function Testimonials() {
  // duplicate for seamless marquee loop
  const loop = [...testimonials, ...testimonials];
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="mx-auto mb-8 max-w-2xl px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
          <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
          From the community
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Loved by people navigating the AI universe
        </h2>
      </div>

      {/* marquee */}
      <div className="relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-ink to-transparent" />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {loop.map((t, i) => (
            <figure
              key={i}
              className="w-[320px] shrink-0 rounded-xl border border-border bg-card/70 p-5 backdrop-blur block-shadow-sm"
            >
              <Quote className={cn("h-5 w-5", accentText[t.accent])} />
              <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-md border border-border bg-ink/40 font-display text-xs font-bold",
                    accentText[t.accent]
                  )}
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-xs font-semibold text-foreground">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
