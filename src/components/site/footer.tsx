"use client";

import { Github, Twitter, Linkedin, Send, Sparkles } from "lucide-react";
import { useOrbitStore } from "@/lib/orbit-store";

/** Category-filter links that actually work (set filter + scroll to tools). */
function filterLink(label: string, task: string) {
  return { label, task };
}

const exploreLinks = [
  { label: "All tools", href: "#tools" },
  { label: "Categories", href: "#categories" },
  { label: "Trending", href: "#top" }, // trending section has no id; scroll top then it's right after categories
  { label: "Compare deck", href: "#compare" },
  { label: "How it works", href: "#how" },
];

const compareLinks = [
  filterLink("Writing models", "Writing"),
  filterLink("Image generators", "Images"),
  filterLink("Code copilots", "Coding"),
  filterLink("Voice & TTS", "Voice"),
  filterLink("AI agents", "Agents"),
];

export function Footer() {
  const setBudget = useOrbitStore((s) => s.setBudget);
  const openQuiz = useOrbitStore((s) => s.openQuiz);

  const clickFilter = (task: string) => {
    useOrbitStore.setState({ activeTasks: [task] });
    setBudget(null);
    setTimeout(() => {
      document
        .querySelector("#tools")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

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
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
              if (input?.value) {
                window.location.href = `mailto:support@myaipicker.com?subject=Subscribe to AI Launch Radar&body=Please add ${input.value} to the weekly newsletter.`;
              }
            }}
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

        {/* link columns — only functional links */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-aurora/40 bg-aurora/10">
                <img
                  src="/logo-myaipicker.png"
                  alt="My AI Picker logo"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                My AI Picker
              </span>
            </a>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Compare 80+ AI models by task, budget and real benchmarks — find
              your perfect AI match in seconds.
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

          {/* Explore — page sections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <ul className="mt-3 space-y-2">
              {exploreLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare by task — sets filter + scrolls to tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compare by task
            </h4>
            <ul className="mt-3 space-y-2">
              {compareLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => clickFilter(l.task)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* About — keep only real ones */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              About
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#how" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="/how-we-score" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  How we score
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <button
                  onClick={() => openQuiz()}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="h-3 w-3 text-aurora" />
                  Find my AI tool
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 My AI Picker. Find the right AI, every time.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="hover:text-foreground transition-colors">
              Terms &amp; Conditions
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
