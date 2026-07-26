"use client";

import { useMemo } from "react";

interface Star {
  top: string;
  left: string;
  size: number;
  delay: string;
  dur: string;
  opacity: number;
}

/**
 * Mulberry32 — a tiny deterministic PRNG.
 * Given the same seed, it always produces the same sequence of numbers.
 * This lets us generate identical stars on the server and the client,
 * avoiding React hydration mismatches (unlike Math.random()).
 */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * SpaceBackground — fixed full-viewport layered backdrop:
 *  - deep space gradient
 *  - subtle grid
 *  - twinkling stars (deterministic — same on server & client)
 *  - drifting aurora/nebula/star orbs
 *  - a faint My AI Picker ring
 *
 * Uses a seeded PRNG (mulberry32) instead of Math.random() so that
 * the star field is identical on the server and the client, preventing
 * React hydration mismatches.
 */
export function SpaceBackground() {
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(20260719); // fixed seed → deterministic
    const arr: Star[] = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        top: `${rand() * 100}%`,
        left: `${rand() * 100}%`,
        size: rand() < 0.8 ? 1 : 2,
        delay: `${(rand() * 4).toFixed(2)}s`,
        dur: `${(2.5 + rand() * 4).toFixed(2)}s`,
        opacity: 0.3 + rand() * 0.6,
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

      {/* faint My AI Picker ring near top */}
      <div className="absolute left-1/2 top-[-18rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border border-white/5 animate-spin-slow">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-aurora shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]" />
      </div>
      <div className="absolute left-1/2 top-[-22rem] h-[52rem] w-[52rem] -translate-x-1/2 rounded-full border border-white/[0.03] animate-spin-reverse-slow">
        <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-nebula shadow-[0_0_12px_2px_rgba(244,114,182,0.6)]" />
      </div>

      {/* stars — deterministic, safe for SSR */}
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
