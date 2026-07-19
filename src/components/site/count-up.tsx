"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** numeric target */
  to: number;
  /** number of decimal places to render */
  decimals?: number;
  /** prefix string (e.g. "$") */
  prefix?: string;
  /** suffix string (e.g. "+", "K", "%") */
  suffix?: string;
  /** duration in ms */
  duration?: number;
  className?: string;
}

/**
 * CountUp — animates from 0 to `to` when scrolled into view.
 * Uses a native IntersectionObserver + requestAnimationFrame.
 * The "started" flag is kept in a ref (not state) to avoid the
 * react-hooks/set-state-in-effect lint rule and unnecessary re-renders.
 */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      // guard against double-start
      if (startedRef.current) return;
      startedRef.current = true;

      let raf = 0;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(eased * to);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // cleanup stored on the element via a data attribute is overkill;
      // the outer effect cleanup handles disconnect.
      (el as HTMLElement & { _raf?: number })._raf = raf;
    };

    // Fallback for environments without IntersectionObserver: start immediately.
    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      const raf = (el as HTMLElement & { _raf?: number })._raf;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  const display = rounded.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
