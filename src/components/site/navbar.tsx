"use client";

import { useState } from "react";
import { Menu, X, Sparkles, Heart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useOrbitStore } from "@/lib/orbit-store";

// Regular nav links (no dropdown)
const navLinks = [
  { label: "Categories", href: "#categories" },
  { label: "Compare", href: "/compare" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Blog", href: "/blog" },
  { label: "Job Suite", href: "/tools/job-application-suite" },
  { label: "How it works", href: "#how" },
];

// AI Tools dropdown sub-headings (keywords bhai dega, yahan add hote rahenge)
const aiToolsDropdown = [
  { label: "AI Job Application Suite", href: "/tools/job-application-suite", description: "Resume + Cover Letter + Interview Prep — Free", emoji: "💼" },
  { label: "AI Resume Builder", href: "/tools/resume-builder", description: "Free ATS resume maker with AI tailoring", emoji: "📄" },
  { label: "AI Cover Letter", href: "/tools/cover-letter-generator", description: "Free personalized cover letter generator", emoji: "✉️" },
  { label: "AI Interview Prep", href: "/tools/interview-prep", description: "Free mock interview with AI feedback", emoji: "🎤" },
  { label: "AI Coding Tools", href: "/best/coding", description: "Cursor, Copilot, Claude Code & more", emoji: "⌨️" },
  { label: "AI Image Generators", href: "/best/images", description: "Midjourney, DALL·E, FLUX & more", emoji: "🎨" },
  { label: "AI Writing Tools", href: "/best/writing", description: "ChatGPT, Claude, Jasper & more", emoji: "✍️" },
  { label: "Free AI Tools", href: "/best/free-ai-tools", description: "No cost, no signup required", emoji: "🆓" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const favoriteCount = useOrbitStore((s) => s.favoriteIds.length);
  const toggleFavoritesOnly = useOrbitStore((s) => s.toggleFavoritesOnly);
  const favoritesOnly = useOrbitStore((s) => s.favoritesOnly);
  const openQuiz = useOrbitStore((s) => s.openQuiz);

  const onFavClick = () => {
    toggleFavoritesOnly();
    if (!favoritesOnly) {
      setTimeout(() => {
        document.querySelector("#tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo — My AI Picker */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-aurora/40 bg-aurora/10 block-shadow-aurora">
            <img
              src="/logo-myaipicker.png"
              alt="My AI Picker logo"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-aurora/20" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            My AI Picker
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* AI Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              AI Tools
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", dropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full w-80 pt-1">
                <div className="overflow-hidden rounded-xl border border-border bg-card/95 backdrop-blur-xl block-shadow-neutral">
                  <div className="p-2">
                    {aiToolsDropdown.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-ink/40"
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-foreground group-hover:text-aurora">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-border bg-ink/40 p-2">
                    <a
                      href="/best-ai-tools-2026"
                      className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-star hover:bg-star/10"
                    >
                      🏆 Best AI Tools 2026 — See Winners
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Regular nav links */}
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Favorites */}
          <button
            onClick={onFavClick}
            aria-pressed={favoritesOnly}
            aria-label={`Favorites (${favoriteCount})`}
            className={cn(
              "relative inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium transition-all",
              favoritesOnly
                ? "border-nebula/60 bg-nebula/15 text-nebula"
                : "border-border bg-card text-muted-foreground hover:border-nebula/40 hover:text-nebula"
            )}
          >
            <Heart
              className={cn("h-4 w-4", (favoritesOnly || favoriteCount > 0) && "fill-nebula")}
            />
            {favoriteCount > 0 && (
              <span className="min-w-5 rounded-md border border-nebula/40 bg-nebula/15 px-1 text-center text-[11px] font-bold text-nebula">
                {favoriteCount}
              </span>
            )}
          </button>
          <Button
            size="sm"
            onClick={() => openQuiz()}
            className="h-9 gap-1.5 border border-aurora/40 bg-aurora text-primary-foreground hover:bg-aurora-soft block-shadow-aurora"
          >
            <Sparkles className="h-4 w-4" />
            Find my AI tool
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onFavClick}
            aria-pressed={favoritesOnly}
            aria-label={`Favorites (${favoriteCount})`}
            className={cn(
              "relative grid h-10 w-10 place-items-center rounded-md border transition-colors",
              favoritesOnly
                ? "border-nebula/60 bg-nebula/15 text-nebula"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            <Heart className={cn("h-4.5 w-4.5", (favoritesOnly || favoriteCount > 0) && "fill-nebula")} />
            {favoriteCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full border border-nebula/50 bg-nebula px-1 text-[9px] font-bold text-ink">
                {favoriteCount}
              </span>
            )}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-ink/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[600px]" : "max-h-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {/* AI Tools section in mobile */}
          <div className="mb-2">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              AI Tools
            </span>
            {aiToolsDropdown.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </a>
            ))}
          </div>

          <div className="my-1 border-t border-border/60" />

          {/* Regular links */}
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Button
            size="sm"
            onClick={() => {
              openQuiz();
              setOpen(false);
            }}
            className="mt-2 gap-1.5 border border-aurora/40 bg-aurora text-primary-foreground hover:bg-aurora-soft"
          >
            <Sparkles className="h-4 w-4" />
            Find my AI tool
          </Button>
        </nav>
      </div>
    </header>
  );
}
