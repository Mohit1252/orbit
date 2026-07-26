"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  CalendarDays,
  ArrowRight,
  GitCompareArrows,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AiTool, AiModel } from "@/lib/ai-data";
import { accentClasses, AccentChip } from "@/components/site/block";
import { RatingBar } from "@/components/site/rating-bar";
import { FavoriteButton } from "@/components/site/favorite-button";
import { useOrbitStore } from "@/lib/orbit-store";

export function ToolDetailContent({
  tool,
  similar,
  specKeys,
}: {
  tool: AiTool;
  similar: AiTool[];
  specKeys: { key: string; label: string; highlight?: boolean }[];
}) {
  const a = accentClasses[tool.accent];
  const openDetail = useOrbitStore((s) => s.openDetail);
  const toggleCompare = useOrbitStore((s) => s.toggleCompare);
  const compareIds = useOrbitStore((s) => s.compareIds);
  const selected = compareIds.includes(tool.id);
  const [selectedTier, setSelectedTier] = useState(0);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero / Header */}
      <section className={cn("relative overflow-hidden border-b border-border", a.bgSoft)}>
        <div className={cn("absolute inset-x-0 top-0 h-1", a.bg)} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/5 animate-spin-slow">
          <span className={cn("absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full", a.bg)} />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/#tools" className="hover:text-foreground">AI Tools</Link>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Logo */}
            <span className={cn("grid h-20 w-20 shrink-0 place-items-center rounded-2xl border font-display text-4xl font-bold", a.bgSoft, a.border, a.text)}>
              {tool.logo}
            </span>

            {/* Title + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className={cn("rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide", a.bgSoft, a.border, a.text)}>
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                by {tool.vendor}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-star text-star" />
                  <span className="font-bold text-foreground">{tool.rating.toFixed(1)}</span>
                  <RatingBar rating={tool.rating} accent={tool.accent} />
                  <span className="text-xs">({(tool.reviews / 1000).toFixed(1)}k reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Launched {tool.launched}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{tool.priceNote}</span>
                </span>
              </div>

              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                {tool.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {tool.tags.map((t) => (
                  <span key={t} className="rounded-md border border-border bg-ink/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col gap-2">
              <FavoriteButton toolId={tool.id} accent={tool.accent} />
              <a
                href={`https://${tool.website}`}
                target="_blank"
                rel="noreferrer"
                className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5", a.border, a.bg, a.shadow)}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Site
              </a>
              <button
                onClick={() => toggleCompare(tool.id)}
                className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all", selected ? "border-aurora/60 bg-aurora/15 text-aurora" : "border-border bg-card text-muted-foreground hover:text-foreground")}
              >
                <GitCompareArrows className="h-4 w-4" />
                {selected ? "In Compare" : "Add to Compare"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Pricing + Specs */}
          <div className="space-y-8 lg:col-span-2">
            {/* Pricing */}
            <section>
              <h2 className="font-display text-xl font-bold tracking-tight">Pricing Tiers</h2>
              <p className="mt-1 text-xs text-muted-foreground">Click a tier to see full details</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {tool.pricing.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedTier(i)}
                    className={cn(
                      "rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5",
                      selectedTier === i ? cn(a.border, a.shadow, "ring-2 ring-aurora/30") : "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{p.name}</span>
                      {i === 0 && <span className={cn("text-[10px] font-bold uppercase", a.text)}>Best Value</span>}
                      {selectedTier === i && (
                        <span className={cn("inline-flex h-5 w-5 items-center justify-center rounded-full border", a.border, a.bgSoft, a.text)}>
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold">{p.price}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                  </button>
                ))}
              </div>

              {/* Selected tier detail */}
              <div className={cn("mt-4 rounded-xl border p-5", a.border, a.bgSoft)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">
                    {tool.pricing[selectedTier].name} — {tool.pricing[selectedTier].price}
                  </h3>
                  <a
                    href={`https://${tool.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold text-primary-foreground transition-all hover:-translate-y-0.5", a.border, a.bg)}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Subscribe
                  </a>
                </div>
                <p className="mt-2 text-sm text-foreground/90">{tool.pricing[selectedTier].note}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md border border-border bg-ink/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                    Plan: {tool.pricing[selectedTier].name}
                  </span>
                  <span className="rounded-md border border-border bg-ink/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                    Price: {tool.pricing[selectedTier].price}
                  </span>
                  <span className="rounded-md border border-border bg-ink/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                    Tool: {tool.name}
                  </span>
                </div>
              </div>
            </section>

            {/* Capabilities */}
            <section>
              <h2 className="font-display text-xl font-bold tracking-tight">Capabilities & Specs</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specKeys.map((sk) => {
                  const v = tool.spec[sk.key];
                  const isBool = typeof v === "boolean";
                  return (
                    <div key={sk.key} className={cn("rounded-lg border p-3", sk.highlight ? "border-aurora/30 bg-aurora/[0.04]" : "border-border bg-card")}>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {sk.label}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {isBool ? (
                          v ? (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-aurora/40 bg-aurora/10 text-aurora">
                              <Check className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-border bg-ink/50 text-muted-foreground">
                              <X className="h-3 w-3" />
                            </span>
                          )
                        ) : (
                          <span className="text-sm font-semibold">{v}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Pros & Cons */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-aurora/20 bg-aurora/[0.04] p-5">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-aurora">
                  <ThumbsUp className="h-4 w-4" /> Pros
                </h3>
                <ul className="mt-3 space-y-2">
                  {tool.pros.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-coral/20 bg-coral/[0.04] p-5">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-coral">
                  <ThumbsDown className="h-4 w-4" /> Cons
                </h3>
                <ul className="mt-3 space-y-2">
                  {tool.cons.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-foreground/90">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Model variants */}
            {tool.models && tool.models.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold tracking-tight">Available Models</h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-ink/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Model</th>
                        <th className="px-4 py-2 text-left">Context</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tool.models.map((m: AiModel, i) => (
                        <tr key={m.name} className={cn(i % 2 === 1 && "bg-ink/20")}>
                          <td className="px-4 py-2 font-semibold">{m.name}</td>
                          <td className="px-4 py-2 text-muted-foreground">{m.context}</td>
                          <td className="px-4 py-2 text-muted-foreground">{m.price}</td>
                          <td className="px-4 py-2 text-muted-foreground">{m.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Right: Sidebar (Similar tools + Compare CTA) */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-bold">Similar Tools</h3>
              <div className="mt-3 space-y-2">
                {similar.map((s) => {
                  const sa = accentClasses[s.accent];
                  return (
                    <Link
                      key={s.id}
                      href={`/tools/${s.id}`}
                      className="group flex items-center gap-3 rounded-lg border border-border bg-ink/30 p-2.5 transition-all hover:-translate-y-0.5 hover:border-foreground/30"
                    >
                      <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md border font-display text-sm font-bold", sa.bgSoft, sa.border, sa.text)}>
                        {s.logo}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">{s.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {s.rating.toFixed(1)} · {s.priceNote.split("·")[0]}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
              <GitCompareArrows className="mx-auto h-8 w-8 text-aurora" />
              <h3 className="mt-2 font-display text-base font-bold">Compare {tool.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Stack {tool.name} against rivals and see who wins on real benchmarks.
              </p>
              <Link
                href="/#compare"
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-aurora/50 bg-aurora px-4 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
              >
                Go to Compare Deck
              </Link>
            </div>
          </aside>
        </div>

        {/* Tasks */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold tracking-tight">Tasks {tool.name} Covers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {tool.tasks.map((t) => (
              <AccentChip key={t} accent={tool.accent}>
                {t}
              </AccentChip>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
