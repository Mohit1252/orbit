# ORBIT — AI Tool Comparison Homepage · Worklog

## Project Status (Phase 1 — Homepage visual design pass)

**Status:** ✅ Complete & verified. Homepage renders cleanly, fully interactive, no runtime/console errors, lint passes.

The site is "ORBIT" — a homepage that helps users compare and find the right AI tool by task and budget, in the style of prop-firm comparison sites but for AI tools. Built as a **visual design pass only** (no backend) per the brief.

### Design direction delivered
- **3D block-based UI** — signature neobrutalist hard-offset colored shadows (`6px 6px 0 0 <accent>`) on every card/panel, with hover-lift (`translate(-3px,-3px)`) for tactile depth.
- **AI + space vibe** — deep-space near-black background (`#07070b`), animated twinkling starfield, drifting aurora/nebula/star orbs, rotating orbit rings, isometric floating category blocks orbiting a glowing "AI Core".
- **Simple & clean** — limited accent palette (aurora mint `#34d399`, star amber `#fbbf24`, nebula pink `#f472b6`, coral `#fb7185`, teal `#2dd4bf`), Space Grotesk display font + Geist body, consistent rounded-xl blocky cards, generous spacing.
- **Color rule respected** — no indigo/blue; space vibe achieved via aurora/nebula/stars instead of blue void.

## Architecture / Files

```
src/
├─ app/
│  ├─ layout.tsx          (dark mode default, Space Grotesk font, SEO metadata)
│  ├─ globals.css         (space dark theme tokens, 3D block shadow utilities, keyframe animations, custom scrollbar)
│  └─ page.tsx            (composes all sections, min-h-screen flex col → sticky footer)
├─ lib/
│  └─ ai-data.ts          (mock data: 8 categories, 8 AI tools, budget tiers, task options)
└─ components/site/
   ├─ space-background.tsx (fixed layered backdrop: gradient, grid, 90 stars, 3 orbs, 2 orbit rings)
   ├─ block.tsx            (Block3D + AccentChip + accentClasses lookup)
   ├─ navbar.tsx           (sticky, logo, nav, Sign in / Submit a tool, mobile menu)
   ├─ hero.tsx             (headline, search bar, quick chips, stats, orbit visual with 6 floating blocks)
   ├─ filter-panel.tsx     ("Mission control": search + task multi-select + budget selector + launch)
   ├─ categories.tsx       (8 blocky category cards + reusable SectionHeading)
   ├─ tool-card.tsx        (3D tool card: logo, vendor, tagline, tags, rating, price, budget, compare toggle)
   ├─ featured-tools.tsx   (sort tabs, compare tray, responsive grid of tool cards)
   ├─ comparison.tsx      (side-by-side spec table ChatGPT/Claude/Gemini with check/X, highlighted rows)
   ├─ how-it-works.tsx     (3 numbered step cards with connector line)
   ├─ stats.tsx            (4-stat band)
   ├─ cta.tsx              (gradient CTA panel with decorative orbit)
   └─ footer.tsx           (newsletter, 4 nav columns, socials, sticky via mt-auto)
```

## Verification Results (agent-browser + VLM)

- ✅ Page compiles, GET / 200, no runtime/console errors, no hydration warnings.
- ✅ ESLint clean (`bun run lint` passes).
- ✅ All sections render with correct content (verified via accessibility snapshot).
- ✅ Hero: headline with green "AI tool" accent, search bar, green "Find my tool" CTA, orbit visual with 6 floating category blocks + glowing core, stats (500+/8/120K) — all present.
- ✅ Interactivity verified by driving the DOM:
  - Task filter buttons toggle (aria-pressed) — clicked "Coding", active filters updated.
  - Budget selector toggles.
  - Compare button on tool cards toggles "Compare" ↔ "Added to compare" with a **3-item cap** enforced.
  - Sort tabs (Featured/Most popular/All tools) switch state.
  - Mobile menu toggle, nav anchor links work.
- ✅ 3D block shadows confirmed in computed styles: `box-shadow: rgb(52,211,153) 6px 6px 0 0` (full-mint hard offset) on cards — bold neobrutalist blocky effect is implemented. (Note: the VLM screenshot analyzer under-reports fine 6px shadows, but computed-style inspection + DOM confirm they render.)
- ✅ Footer sticky behavior correct (`min-h-screen flex flex-col` + `flex-1` main + `mt-auto` footer).
- ✅ Responsive: mobile-first; grid collapses 4→3→2→1 cols; mobile hamburger menu.
- Silenced Next.js cross-origin dev warning via `allowedDevOrigins: ["*.space-z.ai"]` in next.config.ts.

## Key Decisions
- Dark-only space theme (no theme toggle) — the aesthetic is inherently dark; keeps hydration robust.
- Mock data in `ai-data.ts` (real AI tools: ChatGPT, Claude, Midjourney, Cursor, ElevenLabs, Runway, Gemini, Perplexity) — visual pass only, no DB.
- Framer Motion for entrance/hover micro-animations; CSS keyframes for ambient space motion (twinkle, float, spin, drift).

## Unresolved / Next-phase Recommendations
1. **Make 3D shadows even more pronounced** — consider 8px offset + inner top-left highlight on cards for stronger extruded feel (current 6px is tasteful but could go bolder).
2. **Wire filters to actually filter the tool grid** — currently the filter panel and tool grid are independent state; connect them so selecting tasks/budget filters the visible tools (would need lifting state or a small zustand store).
3. **Tool detail modal/page** — clicking a tool card's arrow could open a detail sheet with full specs, pricing tiers, screenshots, alternatives.
4. **Compare deck interactivity** — make the comparison table dynamically populated from the "Added to compare" selection instead of hardcoded ChatGPT/Claude/Gemini.
5. **Light theme support** via next-themes if desired.
6. **Real data + search** — backend API + Prisma models for tools, full-text search, real ratings.
