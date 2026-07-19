"use client";

import { Rocket, Github, Twitter, Linkedin, Send } from "lucide-react";

const footerNav = [
  {
    title: "Explore",
    links: ["All tools", "Categories", "New launches", "Top rated", "Free tools"],
  },
  {
    title: "Compare",
    links: ["Writing models", "Image generators", "Code copilots", "Voice & TTS", "AI agents"],
  },
  {
    title: "Resources",
    links: ["Blog", "Guides", "API", "Changelog", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Privacy", "Terms", "Submit a tool"],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-ink/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* newsletter band */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card/60 p-6 backdrop-blur block-shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              Get the weekly AI launch radar
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              New models, price changes and hidden gems — every Friday. No spam,
              ever.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md items-center gap-2"
          >
            <div className="relative flex-1">
              <Send className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@galaxy.com"
                className="h-11 w-full rounded-lg border border-border bg-ink/50 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg border border-aurora/50 bg-aurora px-4 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* link columns */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-aurora/40 bg-aurora/10">
                <Rocket className="h-4.5 w-4.5 text-aurora" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                ORBIT
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The AI tool universe. Compare every model by task, budget and
              capability — find your perfect match in seconds.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-aurora/40 hover:text-aurora"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 ORBIT. Navigating the AI universe.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora" />
              All systems nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
