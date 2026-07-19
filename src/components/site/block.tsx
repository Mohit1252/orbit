import * as React from "react";
import { cn } from "@/lib/utils";
import type { AccentColor } from "@/lib/ai-data";

export const accentClasses: Record<
  AccentColor,
  {
    text: string;
    bg: string;
    bgSoft: string;
    border: string;
    shadow: string;
    glow: string;
    ring: string;
  }
> = {
  aurora: {
    text: "text-aurora",
    bg: "bg-aurora",
    bgSoft: "bg-aurora/12",
    border: "border-aurora/40",
    shadow: "block-shadow-aurora",
    glow: "glow-aurora",
    ring: "ring-aurora/50",
  },
  star: {
    text: "text-star",
    bg: "bg-star",
    bgSoft: "bg-star/12",
    border: "border-star/40",
    shadow: "block-shadow-star",
    glow: "glow-star",
    ring: "ring-star/50",
  },
  nebula: {
    text: "text-nebula",
    bg: "bg-nebula",
    bgSoft: "bg-nebula/12",
    border: "border-nebula/40",
    shadow: "block-shadow-nebula",
    glow: "glow-nebula",
    ring: "ring-nebula/50",
  },
  coral: {
    text: "text-coral",
    bg: "bg-coral",
    bgSoft: "bg-coral/12",
    border: "border-coral/40",
    shadow: "block-shadow-coral",
    glow: "",
    ring: "ring-coral/50",
  },
  teal: {
    text: "text-teal",
    bg: "bg-teal",
    bgSoft: "bg-teal/12",
    border: "border-teal/40",
    shadow: "block-shadow-teal",
    glow: "",
    ring: "ring-teal/50",
  },
  neutral: {
    text: "text-foreground",
    bg: "bg-muted",
    bgSoft: "bg-muted/60",
    border: "border-border",
    shadow: "block-shadow-neutral",
    glow: "",
    ring: "ring-ring/50",
  },
};

interface Block3DProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: AccentColor;
  hover?: boolean;
  shadow?: boolean;
  as?: "div" | "section" | "article" | "button";
  /** forward button-specific props (onClick already comes from HTMLAttributes) */
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/**
 * Block3D — the signature blocky 3D surface.
 * A solid panel with a hard offset colored shadow that reads as an
 * extruded block edge. Lifts on hover for tactile feedback.
 */
export function Block3D({
  accent = "neutral",
  hover = true,
  shadow = true,
  className,
  children,
  as: Tag = "div",
  ...props
}: Block3DProps) {
  const a = accentClasses[accent];
  return (
    <Tag
      className={cn(
        "relative rounded-xl border bg-card text-card-foreground",
        shadow && a.shadow,
        hover && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** A small solid accent chip / tag */
export function AccentChip({
  accent,
  children,
  className,
}: {
  accent: AccentColor;
  children: React.ReactNode;
  className?: string;
}) {
  const a = accentClasses[accent];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        a.bgSoft,
        a.border,
        a.text,
        className
      )}
    >
      {children}
    </span>
  );
}
