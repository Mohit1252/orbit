"use client";

import { useMemo } from "react";

/**
 * SpaceBackground — fixed full-viewport layered backdrop:
 *  - deep space gradient
 *  - subtle grid
 *  - twinkling stars (generated once)
 *  - drifting aurora/nebula orbs
 *  - a faint orbit ring
 */
export function SpaceBackground() {
  const stars = useMemo(() => {
    const arr: {
      top: string;
      left: string;
      size: number;
      delay: string;
      dur: string;
      opacity: number;
    }[] = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.8 ? 1 : 2,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
        dur: `${(2.5 + Math.random() * 4).toFixed(2)}s`,
        opacity: 0.3 + Math.random() * 0.6,
      });
    }
    return arr;
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink"
    >
      {/* base vertical gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#12121d_0%,#0a0a12_45%,#07070b_100%)]" />

      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_85%)]" />

      {/* drifting aurora orb */}
      <div className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-aurora/10 blur-[120px] animate-drift" />
      {/* nebula orb */}
      <div className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-nebula/10 blur-[120px] animate-float-mid" />
      {/* star orb */}
      <div className="absolute bottom-0 -left-40 h-[30rem] w-[30rem] rounded-full bg-star/8 blur-[120px] animate-float-slow" />

      {/* faint orbit ring near top */}
      <div className="absolute left-1/2 top-[-18rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border border-white/5 animate-spin-slow">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-aurora shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]" />
      </div>
      <div className="absolute left-1/2 top-[-22rem] h-[52rem] w-[52rem] -translate-x-1/2 rounded-full border border-white/[0.03] animate-spin-reverse-slow">
        <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-nebula shadow-[0_0_12px_2px_rgba(244,114,182,0.6)]" />
      </div>

      {/* stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}

      {/* bottom vignette to settle content */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
