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

---
Task ID: 2
Agent: webDevReview (scheduled cron)
Task: QA the Phase 1 homepage, then advance with high-impact features: wire filters to the tool grid, add a tool detail modal, make the comparison deck dynamic, expand data, and polish styling.

Work Log:
- Read worklog.md to understand Phase 1 status (homepage visual pass complete & verified).
- QA pass via agent-browser: opened page, snapshot (437 nodes), screenshotted all 6 sections (hero/categories/tools/compare/how/footer). Confirmed no runtime errors, lint clean, all sections render.
- VLM visual QA: confirmed hero/categories/tools render cleanly; the only flagged "1 Issue" badge is the Next.js dev overlay (cross-origin warning), not a UI bug.
- Planned Phase 2 scope: global state store → expanded data → wire filters → detail modal → dynamic compare → styling polish.
- Created `src/lib/orbit-store.ts`: zustand store with searchQuery, activeTasks, budget, sort, compareIds, detailToolId + actions. Exported pure `filterAndSortTools()` for derived data (avoids the zustand v5 selector infinite-loop gotcha).
- Expanded `src/lib/ai-data.ts`: doubled dataset to 16 tools (added DALL·E 3, Suno, GitHub Copilot, Stable Diffusion, Synthesia, DeepSeek, Notion AI, Sora). Added detailed fields: `description`, `launched`, `pricing` tiers, `pros`, `cons`, canonical `spec` object, `website`. Added `specKeys` array + `budgetRank` map + `getToolById` helper.
- Rewired `filter-panel.tsx` to the store: live match count, clearable search input (X button), task clear-with-count, budget "any budget" reset, functional Reset + Launch buttons (scrolls to tools). Match count updates live.
- Rewired `featured-tools.tsx`: reads filter primitives from store, computes filtered+sorted list via useMemo. Added sort tabs (Featured/Most popular/Top rated/All tools). Added empty state with reset CTA. Added compare tray with removable tool chips + clear-all. AnimatePresence layout animations on grid.
- Rewired `tool-card.tsx`: card body is now a button that opens the detail modal via store. Compare button separate in footer. Line-clamped tagline, "Details" affordance.
- Built `tool-detail-dialog.tsx`: full modal using shadcn Dialog. Header banner (logo, badge, rating, reviews, launch year, description, tags). Pricing tiers grid (3 cols, first marked "Best value"). Capabilities grid (all specKeys, boolean → check/X, highlighted rows). Pros (aurora) / Cons (coral) two-column. Task chips. Sticky footer with Add-to-compare + Visit-site (external link).
- Rewrote `comparison.tsx`: fully dynamic deck driven by compareIds from store. Dynamic grid columns (1 label + N tool cols). Per-tool remove button. Crown on highest-rated "winner". Winner banner when 2+ tools. Empty state with "Browse tools" CTA. "Add another tool" link back to directory.
- Styling polish: bolder 3D block shadows (6px → 7px offset) + inset top-left white highlight on every accent shadow for a stronger extruded-block feel. hover-lift increased to -3px.
- Built `count-up.tsx`: animated number counter (easeOutCubic, inView-triggered) with decimal support. Applied to `stats.tsx` (500+, 120K, 60K, 4.8 all count up on scroll). Added per-stat hover accent bar.
- Fixed a critical runtime bug: `useOrbitStore(selectFilteredTools)` caused an infinite re-render loop ("Maximum update depth exceeded" → client-side exception) because zustand v5 uses `Object.is` equality and the selector returned a new array each call. Refactored to select primitives + `useMemo(filterAndSortTools(...))`.
- Fixed task-filter semantics: AND (tool must cover ALL selected tasks) was too restrictive — with default ["Writing","Images"] no tool matched (0 results). Switched to OR (tool covers ANY selected task) for intuitive browse behavior.
- Wired `ToolDetailDialog` into `page.tsx`.

Stage Summary:
- **Phase 2 complete & verified.** The homepage is now a functional, interactive AI tool discovery experience — not just a visual mockup.
- New files: `src/lib/orbit-store.ts`, `src/components/site/tool-detail-dialog.tsx`, `src/components/site/count-up.tsx`.
- Key features delivered this round:
  1. **Global zustand store** unifying filter/search/compare/detail state across all sections.
  2. **Real filtering** — task (OR) + budget (at-or-below tier) + full-text search across name/vendor/tagline/tags/tasks, with live match count and 4 sort modes.
  3. **Tool detail modal** — rich per-tool view with pricing tiers, capability grid, pros/cons, launch year, external link.
  4. **Dynamic comparison deck** — populated from the user's compare selection (up to 3), with auto-computed winner + crown, per-tool removal, and an empty state.
  5. **Expanded dataset** — 16 real AI tools with full specs, across all 8 categories.
  6. **Animated stat counters** + bolder neobrutalist 3D shadows with inset highlights.
- Verification (agent-browser + VLM):
  - Clean browser session: page loads, `hasError:false`, 5 tools render with default filters.
  - Toggled "Coding" task → match count went 5 → 7 (live update). ✅
  - Typed "voice" in search → 7 → 1 result (ChatGPT). ✅
  - Opened ChatGPT detail modal → 4 sections, pricing tiers, pros/cons, buttons all present. ✅
  - Added Claude to compare → tray "3/3", deck shows ChatGPT/Midjourney/Claude with winner banner. ✅
  - VLM confirmed hero, modal, and 3-way compare deck render with no visual problems.
  - ESLint clean.
- Remaining for future rounds: light/dark theme toggle, real backend (Prisma + search API), tool "alternatives" in modal, save/favorite tools, persistent compare via URL params.


---
Task ID: 3
Agent: webDevReview (scheduled cron)
Task: QA the Phase 2 site, then advance with high-impact features: favorites system, similar tools in modal, trending launches carousel, back-to-top + keyboard shortcuts, and styling polish.

Work Log:
- Read worklog.md to understand Phase 2 status (filtering, detail modal, dynamic compare all complete & verified).
- QA pass via agent-browser: clean session, confirmed no runtime errors, lint clean, all Phase 2 features intact (match count, compare tray, sort tabs, modal, dynamic compare deck).
- Planned Phase 3 scope: favorites system → similar tools → trending carousel → floating controls + keyboard shortcuts → styling polish.
- Extended `src/lib/orbit-store.ts`: added `favoriteIds: string[]`, `favoritesOnly: boolean`, `toggleFavorite`, `clearFavorites`, `toggleFavoritesOnly` actions. Added localStorage persistence (`orbit:favorites` key) with SSR-safe `loadFavorites`/`persistFavorites` helpers + `hydrateFavorites()` function. Updated `filterAndSortTools` to accept `favoritesOnly` + `favoriteIds` params. Updated `resetFilters` to also clear `favoritesOnly`.
- Extended `src/lib/ai-data.ts`: added `getSimilarTools(tool, n)` — ranks tools by shared category (weight 3) + shared tasks (weight 1 each), ties broken by rating. Added `getTrendingLaunches(limit)` — sorts by launch year desc then rating.
- Created `src/components/site/favorite-button.tsx`: reusable heart button with accent-colored active state (nebula pink), `stopPropagation` option so it doesn't trigger card click, sm/md sizes.
- Created `src/components/site/rating-bar.tsx`: 5-segment blocky rating bar — each segment fills proportionally to represent 0.2 increments of a 0–5 rating. Matches neobrutalist aesthetic.
- Updated `src/components/site/tool-card.tsx`: added FavoriteButton in footer next to Compare button. Added RatingBar in the meta row (visual rating alongside the numeric rating). Moved badge to hidden on small screens (`hidden sm:inline-block`) to prevent overflow.
- Updated `src/components/site/filter-panel.tsx`: added "Show my favorites (N)" toggle button (nebula accent) that appears when favorites exist. Updated filter count to include favoritesOnly. Updated `filterAndSortTools` call with new params.
- Updated `src/components/site/featured-tools.tsx`: reads `favoritesOnly` + `favoriteIds` from store, passes to `filterAndSortTools`.
- Updated `src/components/site/navbar.tsx`: added favorites button with count badge (heart icon + count pill). Clicking toggles favoritesOnly and scrolls to tools. Responsive: badge moves to corner on mobile. Uses nebula accent for favorites.
- Created `src/components/site/trending-launches.tsx`: horizontal scroll carousel of newest tools (sorted by launch year). Snap-x scrolling with left/right arrow buttons. Compact card variant with launch-year ribbon, logo, name, tagline, rating, price, and favorite button.
- Updated `src/components/site/tool-detail-dialog.tsx`: added FavoriteButton in header (next to close). Added RatingBar in the rating display. Added "Similar tools" section with 3 related tools (clickable → opens that tool's detail). Fixed semantic structure: `DialogTitle`/`DialogDescription` now properly scoped to sr-only elements (was incorrectly wrapping the entire body via `asChild`).
- Created `src/components/site/floating-controls.tsx`: back-to-top floating button (appears after 600px scroll, aurora accent). Keyboard shortcuts: "/" focuses mission-control search input, "Esc" closes detail modal. Uses `useOrbitStore.getState()` to read modal state synchronously.
- Created `src/components/site/store-hydration.tsx`: client-side effect that calls `hydrateFavorites()` on mount to load persisted favorites from localStorage.
- Updated `src/app/page.tsx`: added TrendingLaunches (between Categories and FeaturedTools), FloatingControls, and StoreHydration.
- Fixed a bug: keyboard shortcut "/" used `input[type="text"]` selector which didn't match because React doesn't set the `type` attribute in the DOM for default-type inputs. Changed to `section#explore input`.
- Styling polish: rating bars on tool cards + modal, launch-year ribbons on trending cards, hover accent lines, heart fill states, consistent nebula accent for favorites throughout.

Stage Summary:
- **Phase 3 complete & verified.** The homepage is now a richer, more interactive discovery experience with persistent user preferences.
- New files: `favorite-button.tsx`, `rating-bar.tsx`, `trending-launches.tsx`, `floating-controls.tsx`, `store-hydration.tsx`.
- Key features delivered this round:
  1. **Favorites system** — heart buttons on every tool card + trending card + detail modal. Persisted to localStorage across sessions. Navbar shows live count badge + toggles a "favorites only" filter. Filter panel shows "Show my favorites (N)" toggle when favorites exist.
  2. **Similar tools** in the detail modal — 3 algorithmically-ranked alternatives (shared category + tasks) that navigate between tools without closing the modal.
  3. **Trending launches carousel** — horizontal snap-scroll of newest tools with arrow controls and compact cards.
  4. **Back-to-top button** — floating aurora button that appears after scrolling 600px.
  5. **Keyboard shortcuts** — "/" focuses search, "Esc" closes modal.
  6. **Rating bars** — 5-segment blocky visual rating on cards + modal.
  7. **Semantic accessibility fix** — DialogTitle/DialogDescription properly scoped (was wrapping entire modal body).
- Verification (agent-browser + VLM):
  - Clean session: no errors, 5 tools render, 15 favorite buttons, trending carousel + back-to-top present.
  - Favorited ChatGPT via card heart → navbar badge appeared, filter panel showed "Show my favorites (1)". ✅
  - Toggled favorites-only → "Matching 1 tool" (only ChatGPT). ✅
  - Opened ChatGPT modal → Similar tools section showed Claude, Notion AI, Gemini (3 tools). ✅
  - Clicked Claude in similar tools → modal switched to Claude detail. ✅
  - Scrolled → back-to-top button became visible. ✅
  - Closed modal, pressed "/" → search input focused. ✅
  - VLM confirmed all 5 views (hero, categories, trending, tools, modal) render with no visual problems.
  - ESLint clean.
- Remaining for future rounds: light/dark theme toggle, real backend (Prisma + search API), persistent compare via URL params, tool screenshots in modal, user accounts/auth.

---
Task ID: 4
Agent: direct (user request)
Task: Expand the AI tool dataset using the user-provided "100 AI Models.pdf" list — add the major missing models so the site covers a meaningful slice of the real AI landscape.

Work Log:
- Read /home/z/my-project/upload/100_AI_Models.pdf — extracted the full 100-model list (GPT variants, Claude variants, Gemini, Grok, Llama, Mistral, image models, video models, voice models, coding tools, search engines, embedding models, regional LLMs).
- Mapped the PDF list against the existing 16 tools. Identified ~24 high-impact missing models to add across all 8 categories.
- Added 24 new tools to src/lib/ai-data.ts with full data (description, pricing tiers, pros/cons, spec, website, accent, tags):
  - Writing/LLM: Grok, Microsoft Copilot, Llama 4, Mistral Large
  - Data/Agents: Command R+ (Cohere)
  - Images: Adobe Firefly, Ideogram, Leonardo AI, Imagen 4, FLUX.1
  - Video: Veo 3.1, Kling 3.0, Pika 2.0, Luma Ray3
  - Voice: Murf AI, Play.ht, Speechify, Udio
  - Coding: Windsurf, Claude Code, Amazon Q Developer, Replit AI
  - Search: You.com
  - Agents: Character.AI
- Updated hero stats ("500+" → "40+") and Stats section counter (500 → 40) to reflect the real tool count.
- Category counts auto-update via getCategoryCounts() (already wired in Phase 4 fix).

Stage Summary:
- Dataset expanded from 16 → 40 AI tools (2.5x), now covering the major models from the user's 100-model PDF.
- New category distribution (real, dynamic): Writing 7, Coding 7, Images 8, Video 7, Voice 6, Data 1, Agents 2, Search 2 = 40 total.
- All new tools have complete data: description, 2-3 pricing tiers, pros/cons, 9-field spec object, tags, launch year, website — so they work fully in the detail modal, comparison deck, quiz, and filtering.
- Verification: clean session, no runtime errors, lint clean, 40 tools render when filters cleared, category counts show real numbers, hero + stats show "40+".
- ESLint clean.

---
Task ID: 5
Agent: direct (user request)
Task: Add website/app builder AI tools (no-code & agentic builders) that were missing — including Emergent, v0, Bolt, Lovable, etc.

Work Log:
- User pointed out the site had no "build a website/app" AI tools (like Emergent). Created a new "Build" category for these.
- Added `Blocks` icon import from lucide-react.
- Added new category `build` ("Build", Blocks icon, aurora accent, "App & website builders") to the categories array in ai-data.ts.
- Added "Build" to taskOptions array (now 9 task types).
- Added 10 website/app builder AI tools with full data:
  - v0 (Vercel) — React+Tailwind UI generation
  - Bolt.new (StackBlitz) — in-browser full-stack apps
  - Lovable — full-stack MVPs with Supabase
  - Emergent — agentic builder that plans & ships software
  - Replit Agent — prompt-to-deployed app
  - WebSim — free instant interactive apps
  - Framer AI — no-code marketing sites
  - Durable — 30-sec business websites
  - Solo — free solopreneur websites
  - Bubble — powerful no-code SaaS builder
- Updated taskIcons map in filter-panel.tsx and quiz-dialog.tsx to include Build → Blocks.
- Added Build orbit block to hero.tsx (now 7 floating blocks).
- Added "Build an app" use-case scenario chip to recommend.ts.
- Updated taskRelated() in recommend.ts to group Build with Coding+Agents (adjacent credit).
- Updated hero stats ("40+" → "50+", "8" → "9 categories") and Stats counter (40 → 50).

Stage Summary:
- New "Build" category added with 10 app/website builder AI tools — dataset now 50 tools total across 9 categories.
- Build tools work everywhere: category grid, filter panel (Build chip + icon), quiz (Build task option), hero use-case chip ("Build an app"), search, detail modal, comparison, favorites.
- Verification: clean session, no runtime errors, lint clean. Build category shows "10 tools", filtering by Build shows all 10 tools (v0, Bolt.new, Lovable, Emergent, Replit Agent, WebSim, Framer AI, Durable, Solo, Bubble).
- ESLint clean.

---
Task ID: 6
Agent: direct (user request)
Task: Add ALL remaining missing AI tools from the 100-models PDF in one batch — regional LLMs, open models, and remaining image/video/voice/coding/search tools.

Work Log:
- User feedback: don't make them ask repeatedly — add all remaining tools at once.
- Mapped full PDF list (100 models) against current 50 tools. Identified 30 more notable models to add.
- Added 30 new tools to src/lib/ai-data.ts in a single batch:
  - Writing/LLM (regional + open): Inflection Pi, Gemma 2, Phi-4, Falcon 2, BLOOM, Yi-Large, Aya, Jamba, Ernie 4.0 (Baidu), Doubao (ByteDance), Hunyuan (Tencent), SenseChat (SenseTime), MiniMax abab, GLM-5 (Zhipu), Tongyi Qianwen (Alibaba), ChatGLM, Sarvam AI (India), Krutrim (India), BharatGPT (India)
  - Images: GPT Image 2, Recraft V3, Playground v3
  - Video: Seedance 2.0, MiniMax Hailuo, Hunyuan Video (open)
  - Voice: Tortoise TTS (open), Fish Audio (open)
  - Coding: Codex (OpenAI agent), Tabnine (on-prem)
  - Search: Google AI Mode
- Each tool has full data: description, pricing tiers, pros/cons, 9-field spec, tags, launch year, website — works in detail modal, comparison, quiz, and filtering.
- Updated hero stats (50+ → 80+) and Stats counter (50 → 80).

Stage Summary:
- Dataset expanded from 50 → 80 AI tools (1.6x) in a single batch — now covers virtually the entire user-provided PDF list.
- New category distribution (real, dynamic): Writing 26, Coding 9, Images 11, Video 10, Voice 8, Data 1, Agents 2, Search 3, Build 10 = 80 total.
- Covers: all major Western LLMs, all Chinese LLMs (Ernie, Doubao, Hunyuan, SenseChat, MiniMax, GLM, Qwen, ChatGLM), all Indian LLMs (Sarvam, Krutrim, BharatGPT), all major open-weights models (Llama, Gemma, Phi, Falcon, BLOOM, Yi, Aya, Jamba), all image/video/voice/coding tools, and a dedicated Build category for app builders.
- Verification: clean session, no runtime errors, lint clean, 80 tools render when filters cleared, category counts show real numbers, hero + stats show "80+".
- ESLint clean.
- Only intentionally excluded: pure embedding models (text-embedding-3, Cohere Embed, Gemini Embedding, BGE) which are infrastructure-level, not comparison UI tools; and HappyHorse-1.0 which is too niche.

---
Task ID: 7
Agent: direct (user session — multi-fix + strategy)
Task: Multiple user-requested fixes + monetization/SEO strategy discussion.

Work Log:
- Added 80 AI tools total (expanded from 50): regional LLMs (Ernie, Doubao, Hunyuan, GLM, Qwen, ChatGLM, Sarvam, Krutrim, BharatGPT), open models (Gemma, Phi-4, Falcon, BLOOM, Yi, Aya, Jamba), missing image/video/voice/coding tools.
- Fixed ratings to real benchmarks: Claude 4.8 (SWE-bench #1), Gemini 4.7 (longest context), ChatGPT 4.6 (most popular), Midjourney 4.8 (aesthetic ELO #1), FLUX 4.8 (technical ELO #1), DALL-E 3 4.5 (text accuracy #1).
- Restored Claude Fable 5 (public) + Mythos 5 (limited access) with proper `access` field in AiModel interface.
- Built weighted scoring system (src/lib/scoring.ts): formula = capability×0.4 + rating×0.3 + price×0.2 + breadth×0.1. N/A vs Fail distinction (grey dash for non-applicable, red X for missing). Category-wise winners (5 categories). Expandable "Why this won?" score breakdown per tool.
- Added use-case selector in compare deck (6 options: general/coding/images/video/voice/research) — scores re-weight live.
- Added `compareUseCase` + `setCompareUseCase` to orbit-store.
- Fixed category cards: now clickable, set filter + scroll to tools. Empty categories show "No tools yet".
- Fixed detail modal: heart + close buttons had z-index issue (sticky footer covered them). Added z-20/z-30 to header.
- Simplified footer: removed placeholder links (Blog/Guides/API/About/Contact/Privacy/Terms), kept only functional (Explore sections, Compare by task, About).
- Removed "Sign in" button from navbar.
- Removed "500+" text everywhere (hero badge + browse button). Now shows real counts.
- Limited featured tools to 9 on homepage (perf) + "Browse all N tools +M more" expand button.
- Removed "Submit your tool" button from CTA section — only "Find my AI tool" remains.
- Strategy discussion: monetization (affiliate primary, AdSense secondary), single vs multi-page SEO, deploy process (Vercel).

Stage Summary:
- Site is feature-complete for homepage. 80 tools, real benchmarks, model-level comparison, weighted scoring, full interactivity.
- Pending for tomorrow: .gitignore + sitemap.ts + robots.txt (deploy prep), affiliate links implementation, production build test.
- ESLint clean throughout. No runtime errors.
