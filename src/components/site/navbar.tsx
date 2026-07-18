"use client";

import { useState } from "react";
import { Menu, X, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Explore", href: "#explore" },
  { label: "Categories", href: "#categories" },
  { label: "Compare", href: "#compare" },
  { label: "How it works", href: "#how" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-aurora/40 bg-aurora/10 block-shadow-aurora">
            <Rocket className="h-4.5 w-4.5 text-aurora" strokeWidth={2.4} />
            <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-aurora/20" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            ORBIT
            <span className="ml-1 align-super text-[10px] font-semibold text-aurora">
              ◦
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5 border border-aurora/40 bg-aurora text-primary-foreground hover:bg-aurora-soft block-shadow-aurora"
          >
            <Sparkles className="h-4 w-4" />
            Submit a tool
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-ink/95 backdrop-blur-xl transition-[max-height] duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
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
            className="mt-2 gap-1.5 border border-aurora/40 bg-aurora text-primary-foreground hover:bg-aurora-soft"
          >
            <Sparkles className="h-4 w-4" />
            Submit a tool
          </Button>
        </nav>
      </div>
    </header>
  );
}
