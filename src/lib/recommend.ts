import { tools, budgetRank, type AiTool, type BudgetTier } from "@/lib/ai-data";

export interface QuizAnswers {
  task: string | null;
  budget: BudgetTier | null;
  priority: "quality" | "price" | "speed" | "privacy" | null;
  teamSize: "solo" | "small" | "enterprise" | null;
}

export const quizPriorities = [
  {
    id: "quality",
    label: "Output quality",
    hint: "Best results, cost be damned",
    accent: "aurora" as const,
  },
  {
    id: "price",
    label: "Best price",
    hint: "Free or cheap, please",
    accent: "star" as const,
  },
  {
    id: "speed",
    label: "Speed & ease",
    hint: "Fast setup, instant results",
    accent: "teal" as const,
  },
  {
    id: "privacy",
    label: "Privacy / open",
    hint: "Self-host or open weights",
    accent: "nebula" as const,
  },
] as const;

export const quizTeamSizes = [
  { id: "solo", label: "Just me", hint: "Personal use", icon: "👤" },
  { id: "small", label: "Small team", hint: "2–20 people", icon: "👥" },
  { id: "enterprise", label: "Company", hint: "20+ people", icon: "🏢" },
] as const;

export interface ToolMatch {
  tool: AiTool;
  score: number; // 0 - 100
  reasons: string[];
}

/**
 * Compute a 0–100 match score for each tool against the quiz answers.
 * Weights:
 *   - task match (the selected task is in tool.tasks): +35
 *   - budget at-or-below selected tier: +25 (partial for adjacent tiers)
 *   - priority alignment: up to +25
 *   - team size alignment: up to +15
 * Quality of tool (rating) acts as a tiebreaker via a small bonus.
 */
export function computeMatches(answers: QuizAnswers): ToolMatch[] {
  const { task, budget, priority, teamSize } = answers;

  const scored = tools.map((tool) => {
    let score = 0;
    const reasons: string[] = [];

    // --- task (35) ---
    if (task) {
      if (tool.tasks.includes(task)) {
        score += 35;
        reasons.push(`Covers ${task.toLowerCase()}`);
      } else if (tool.tasks.some((t) => taskRelated(t, task))) {
        score += 12;
        reasons.push("Adjacent capability");
      }
    }

    // --- budget (25) ---
    if (budget) {
      const toolRank = budgetRank[tool.budget];
      const wantRank = budgetRank[budget];
      if (toolRank <= wantRank) {
        score += 25;
        if (tool.budget === "Free" || tool.budget === "Freemium") {
          reasons.push(`Fits budget (${tool.budget})`);
        }
      } else if (toolRank === wantRank + 1) {
        score += 8;
      }
    }

    // --- priority (25) ---
    if (priority) {
      switch (priority) {
        case "quality":
          if (tool.rating >= 4.7) {
            score += 22;
            reasons.push(`Top-rated (${tool.rating.toFixed(1)}★)`);
          } else if (tool.rating >= 4.4) {
            score += 12;
          }
          break;
        case "price":
          if (tool.budget === "Free") {
            score += 25;
            reasons.push("Completely free / open");
          } else if (tool.budget === "Freemium") {
            score += 18;
            reasons.push("Has a free tier");
          } else if (tool.budget === "$") {
            score += 10;
          }
          break;
        case "speed":
          // tools with web/chat interfaces and no setup
          if (tool.spec.offline === false && tool.spec.api !== false) {
            score += 18;
            reasons.push("Instant web access");
          }
          if (tool.featured) score += 5;
          break;
        case "privacy":
          if (tool.spec.offline === true) {
            score += 25;
            reasons.push("Runs offline / open weights");
          } else if (tool.spec.api === true) {
            score += 8;
          }
          break;
      }
    }

    // --- team size (15) ---
    if (teamSize) {
      const hasTeamPlan = tool.pricing.some((p) =>
        /team|business|enterprise|pro/i.test(p.name)
      );
      switch (teamSize) {
        case "solo":
          if (tool.budget === "Free" || tool.budget === "Freemium") {
            score += 12;
          } else {
            score += 6;
          }
          break;
        case "small":
          if (hasTeamPlan) {
            score += 13;
            reasons.push("Team plan available");
          } else {
            score += 5;
          }
          break;
        case "enterprise":
          if (hasTeamPlan) {
            score += 13;
            reasons.push("Enterprise-ready");
          }
          if (tool.spec.api === true) score += 2;
          break;
      }
    }

    // --- rating tiebreaker bonus (up to 5) ---
    score += Math.round((tool.rating - 4) * 2.5); // 4.8 -> +2, 5.0 -> +5

    // clamp
    score = Math.max(0, Math.min(100, score));

    return { tool, score, reasons: reasons.slice(0, 3) };
  });

  return scored.sort((a, b) => b.score - a.score);
}

/** Loose relatedness for adjacent task credit (e.g. Writing ~ Data). */
function taskRelated(a: string, b: string): boolean {
  const groups: string[][] = [
    ["Writing", "Data", "Search"],
    ["Coding", "Agents", "Build"],
    ["Images", "Video"],
    ["Voice", "Video"],
  ];
  return groups.some(
    (g) => g.includes(a) && g.includes(b) && a !== b
  );
}

/** Use-case scenarios that pre-fill the quiz (hero chips). */
export const useCaseScenarios = [
  { id: "blog", label: "Write blog posts", task: "Writing", budget: "Freemium" as BudgetTier },
  { id: "logo", label: "Design a logo", task: "Images", budget: "$" as BudgetTier },
  { id: "code", label: "Ship code faster", task: "Coding", budget: "Freemium" as BudgetTier },
  { id: "voice", label: "Clone a voice", task: "Voice", budget: "Freemium" as BudgetTier },
  { id: "video", label: "Make a video", task: "Video", budget: "$" as BudgetTier },
  { id: "research", label: "Research a topic", task: "Search", budget: "Freemium" as BudgetTier },
  { id: "app", label: "Build an app", task: "Build", budget: "Freemium" as BudgetTier },
];
