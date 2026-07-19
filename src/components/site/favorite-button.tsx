"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrbitStore } from "@/lib/orbit-store";
import type { AccentColor } from "@/lib/ai-data";
import { accentClasses } from "./block";

interface FavoriteButtonProps {
  toolId: string;
  accent: AccentColor;
  size?: "sm" | "md";
  className?: string;
  /** stopPropagation so it doesn't trigger card click */
  stopPropagation?: boolean;
}

export function FavoriteButton({
  toolId,
  accent,
  size = "md",
  className,
  stopPropagation = true,
}: FavoriteButtonProps) {
  const favoriteIds = useOrbitStore((s) => s.favoriteIds);
  const toggleFavorite = useOrbitStore((s) => s.toggleFavorite);
  const isFav = favoriteIds.includes(toolId);
  const a = accentClasses[accent];

  const dim = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        toggleFavorite(toolId);
      }}
      aria-pressed={isFav}
      aria-label={isFav ? `Remove ${toolId} from favorites` : `Save ${toolId} to favorites`}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-lg border transition-all hover:-translate-y-0.5",
        dim,
        isFav
          ? cn("border-nebula/60 bg-nebula/15 text-nebula")
          : cn("border-border bg-ink/40 text-muted-foreground hover:border-nebula/40 hover:text-nebula"),
        className
      )}
    >
      <Heart
        className={cn(icon, isFav && "fill-nebula")}
        strokeWidth={2.2}
      />
    </button>
  );
}
