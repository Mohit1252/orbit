"use client";

import { cn } from "@/lib/utils";
import type { AccentColor } from "@/lib/ai-data";
import { accentClasses } from "./block";

/**
 * A 5-segment blocky rating bar — each segment lights up to represent
 * 0.2 increments of a 0–5 rating. Matches the neobrutalist aesthetic.
 */
export function RatingBar({
  rating,
  accent,
  className,
  segmentClassName,
}: {
  rating: number;
  accent: AccentColor;
  className?: string;
  segmentClassName?: string;
}) {
  const a = accentClasses[accent];
  // 5 segments, each = 1.0; fill ratio per segment = clamp((rating - i) , 0, 1)
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span
            key={i}
            className={cn(
              "relative h-1.5 w-3 overflow-hidden rounded-sm border border-border bg-ink/60",
              segmentClassName
            )}
          >
            <span
              className={cn("absolute inset-y-0 left-0 block", a.bg)}
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        );
      })}
    </div>
  );
}
