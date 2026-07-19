"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrbitStore } from "@/lib/orbit-store";

/**
 * Floating "back to top" button that appears after scrolling.
 * Also wires two keyboard shortcuts:
 *   - "/" focuses the mission-control search input
 *   - "Esc" closes the detail modal (Radix Dialog already handles this, but
 *     we also blur active elements to be safe)
 */
export function FloatingControls() {
  const [visible, setVisible] = useState(false);
  const closeDetail = useOrbitStore((s) => s.closeDetail);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;

      // "/" focuses search (unless already typing)
      if (e.key === "/" && !typing) {
        e.preventDefault();
        const input = document.querySelector(
          "section#explore input"
        ) as HTMLInputElement | null;
        input?.focus();
        input?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Esc closes modal if open
      if (e.key === "Escape") {
        const { detailToolId } = useOrbitStore.getState();
        if (detailToolId) closeDetail();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDetail]);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-xl border border-aurora/40 bg-aurora/15 text-aurora backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-aurora/25 block-shadow-aurora",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
      <span className="sr-only">Back to top</span>
    </button>
  );
}
