import {
  type AiTool,
  type AiModel,
  type ToolSpec,
  budgetRank,
  type BudgetTier,
} from "@/lib/ai-data";

/** Use-cases a user can pick before scoring. */
export type UseCase =
  | "general"
  | "coding"
  | "images"
  | "video"
  | "voice"
  | "research";

export const useCases: {
  id: UseCase;
  label: string;
  icon: string; // emoji glyph
  hint: string;
}[] = [
  { id: "general", label: "General chat", icon: "💬", hint: "Everyday Q&A + writing" },
  { id: "coding", label: "Coding", icon: "⌨️", hint: "Code generation + agents" },
  { id: "images", label: "Image gen", icon: "🎨", hint: "Art, photos & design" },
  { id: "video", label: "Video gen", icon: "🎬", hint: "Text/image to video" },
  { id: "voice", label: "Voice / TTS", icon: "🔊", hint: "Speech synthesis + clone" },
  { id: "research", label: "Research", icon: "🔍", hint: "Web search + citations" },
];

/**
 * Which spec keys are RELEVANT to each use-case.
 * Any spec key NOT in this list is treated as N/A (not penalized) for that
 * use-case. This is the core of the "N/A vs Fail" fix.
 */
export const useCaseRelevantSpecs: Record<UseCase, string[]> = {
  general: [
    "context",
    "voice",
    "codeExec",
    "web",
    "imageGen",
    "api",
    "price",
  ],
  coding: ["context", "codeExec", "web", "api", "offline", "price"],
  images: ["imageGen", "api", "price"],
  video: ["voice", "api", "price"],
  voice: ["voice", "api", "price"],
  research: ["web", "context", "api", "price"],
};

/** Which spec keys are "capabilities" (booleans) vs descriptive (strings). */
const BOOLEAN_CAPS = new Set([
  "imageGen",
  "voice",
  "codeExec",
  "web",
  "offline",
  "api",
]);

/** Returns true if a spec key is a boolean capability. */
export function isBooleanCap(key: string): boolean {
  return BOOLEAN_CAPS.has(key);
}

/**
 * Decide whether a capability is "applicable" to a tool at all.
 * E.g. an image-only tool (Midjourney) does NOT have code execution as a
 * relevant capability — it's N/A, not a fail.
 *
 * Heuristic: a capability is applicable to a tool if EITHER:
 *  - the tool's category matches the capability's domain, OR
 *  - the tool actually has that capability (true), OR
 *  - the capability is universally relevant (context, price, api).
 */
export function isSpecApplicable(
  tool: AiTool,
  specKey: string,
  mergedSpec: ToolSpec
): boolean {
  // Universally relevant specs
  const universal = new Set(["context", "price", "api", "bestFor"]);
  if (universal.has(specKey)) return true;

  // If the tool actually HAS the capability, it's applicable (true = yes)
  const v = mergedSpec[specKey];
  if (v === true) return true;

  // Category-based applicability
  const cat = tool.category;
  const capabilityDomain: Record<string, string[]> = {
    imageGen: ["images", "build"],
    voice: ["voice", "video"],
    codeExec: ["coding", "writing", "agents", "data", "build"],
    web: ["search", "writing", "agents", "data"],
    offline: ["coding", "writing", "agents", "images", "video"],
  };
  const domains = capabilityDomain[specKey];
  if (domains && domains.includes(cat)) return true;

  // Otherwise: not applicable (N/A). E.g. codeExec for Midjourney (images-only).
  return false;
}

export interface ScoreBreakdown {
  capability: number; // 0-100
  rating: number; // 0-100
  price: number; // 0-100
  breadth: number; // 0-100
  total: number; // weighted 0-100
  reasons: string[]; // human-readable why-this-won bullets
}

export interface ScoredTool {
  tool: AiTool;
  model?: AiModel;
  modelIndex: number;
  mergedSpec: ToolSpec;
  breakdown: ScoreBreakdown;
}

/**
 * Score a single tool for a given use-case.
 * Formula: total = cap×0.4 + rating×0.3 + price×0.2 + breadth×0.1
 * N/A capabilities are EXCLUDED from the capability average (not counted as 0).
 */
export function scoreTool(
  tool: AiTool,
  modelIndex: number,
  useCase: UseCase
): ScoredTool {
  // Import getMergedSpec lazily to avoid circular deps at module load.
  // We re-implement the small merge inline.
  const model = tool.models?.[modelIndex];
  const mergedSpec: ToolSpec = model
    ? {
        ...tool.spec,
        ...(model.spec || {}),
        context: model.context,
        price: model.price,
      }
    : tool.spec;

  const relevant = useCaseRelevantSpecs[useCase];
  const reasons: string[] = [];

  // --- Capability score (0-100) ---
  // For each RELEVANT spec key that is applicable to this tool, award points.
  let capSum = 0;
  let capCount = 0;
  for (const key of relevant) {
    if (!isSpecApplicable(tool, key, mergedSpec)) continue;
    capCount++;
    const v = mergedSpec[key];
    if (typeof v === "boolean") {
      if (v === true) capSum += 100;
      else capSum += 30; // false but applicable = partial credit (has gap)
    } else if (key === "context") {
      // context: parse "128K" / "1M" / "2M" / "—"
      const ctx = parseContext(v as string);
      if (ctx <= 0) capSum += 20;
      else if (ctx >= 1_000_000) capSum += 100;
      else if (ctx >= 200_000) capSum += 85;
      else if (ctx >= 128_000) capSum += 70;
      else capSum += 50;
    } else if (key === "price") {
      // price handled in price score; skip here to avoid double-count
      capSum += 70;
    }
  }
  const capability = capCount > 0 ? capSum / capCount : 50;

  // --- Quality rating (0-100) ---
  // rating is 0-5; map to 0-100 (5.0 → 100, 4.0 → 80, etc.)
  const rating = Math.round((tool.rating / 5) * 100);
  if (tool.rating >= 4.7) reasons.push(`Top-rated (${tool.rating.toFixed(1)}★)`);
  else if (tool.rating >= 4.4) reasons.push(`Strong rating (${tool.rating.toFixed(1)}★)`);

  // --- Price value (0-100) ---
  // Cheaper = higher score, but Free/Freemium cap at 100, $$ caps lower.
  const tier = tool.budget;
  const priceMap: Record<BudgetTier, number> = {
    Free: 100,
    Freemium: 85,
    $: 70,
    $$: 55,
    $$$: 40,
  };
  const price = priceMap[tier] ?? 60;
  if (tier === "Free") reasons.push("Completely free");
  else if (tier === "Freemium") reasons.push("Has a free tier");

  // --- Breadth (0-100) ---
  // Count how many BOOLEAN capabilities are true (extra features beyond the
  // core use-case). This is a small bonus, not decisive.
  const allCaps = ["imageGen", "voice", "codeExec", "web", "offline", "api"];
  let trueCount = 0;
  for (const c of allCaps) {
    if (mergedSpec[c] === true) trueCount++;
  }
  const breadth = Math.round((trueCount / allCaps.length) * 100);
  if (trueCount >= 4) reasons.push("Broad multi-capability");

  // use-case specific reason
  if (useCase === "coding" && tool.category === "coding")
    reasons.push("Built for coding");
  if (useCase === "images" && tool.category === "images")
    reasons.push("Dedicated image tool");
  if (useCase === "voice" && tool.category === "voice")
    reasons.push("Dedicated voice tool");
  if (useCase === "video" && tool.category === "video")
    reasons.push("Dedicated video tool");
  if (useCase === "research" && tool.category === "search")
    reasons.push("Built for search/research");

  const total = Math.round(
    capability * 0.4 + rating * 0.3 + price * 0.2 + breadth * 0.1
  );

  return {
    tool,
    model,
    modelIndex,
    mergedSpec,
    breakdown: { capability, rating, price, breadth, total, reasons },
  };
}

/** Parse a context string like "128K", "1M", "2M", "200K", "—" into a number. */
function parseContext(s: string): number {
  if (!s || s === "—" || s === "-" || s === "") return 0;
  const m = s.toUpperCase().match(/([\d.]+)\s*([KM]?)/);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const unit = m[2];
  if (unit === "M") return num * 1_000_000;
  if (unit === "K") return num * 1_000;
  return num;
}

/**
 * Score all tools and return sorted (highest total first).
 */
export function scoreAll(
  tools: AiTool[],
  modelSelections: Record<string, number>,
  useCase: UseCase
): ScoredTool[] {
  return tools
    .map((t) => scoreTool(t, modelSelections[t.id] ?? 0, useCase))
    .sort((a, b) => b.breakdown.total - a.breakdown.total);
}

/**
 * Returns the per-category winner among a set of scored tools.
 * A tool can win multiple categories.
 */
export interface CategoryWinner {
  category: string;
  label: string;
  winnerId: string;
  score: number;
}

export function computeCategoryWinners(
  scored: ScoredTool[]
): CategoryWinner[] {
  if (scored.length === 0) return [];
  const cats: { key: string; label: string; pick: (s: ScoredTool) => number }[] =
    [
      { key: "general", label: "Best for General Chat", pick: (s) => s.breakdown.total },
      { key: "coding", label: "Best for Coding", pick: (s) => s.breakdown.capability },
      { key: "value", label: "Best for Value / Price", pick: (s) => s.breakdown.price },
      { key: "quality", label: "Best for Quality", pick: (s) => s.breakdown.rating },
      { key: "breadth", label: "Most Versatile", pick: (s) => s.breakdown.breadth },
    ];

  const winners: CategoryWinner[] = [];
  for (const c of cats) {
    let best = scored[0];
    for (const s of scored) {
      if (c.pick(s) > c.pick(best)) best = s;
    }
    winners.push({
      category: c.key,
      label: c.label,
      winnerId: best.tool.id,
      score: Math.round(c.pick(best)),
    });
  }
  return winners;
}
