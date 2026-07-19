import {
  PenLine,
  Code2,
  Image as ImageIcon,
  Clapperboard,
  AudioLines,
  Database,
  Bot,
  Search,
  type LucideIcon,
} from "lucide-react";

export type AccentColor =
  | "aurora"
  | "star"
  | "nebula"
  | "coral"
  | "teal"
  | "neutral";

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: AccentColor;
  count: number;
  blurb: string;
}

export const categories: Category[] = [
  {
    id: "writing",
    label: "Writing",
    icon: PenLine,
    accent: "aurora",
    count: 0, // computed in getCategoryCounts()
    blurb: "Drafts, copy & long-form",
  },
  {
    id: "coding",
    label: "Coding",
    icon: Code2,
    accent: "teal",
    count: 0,
    blurb: "Copilots & dev agents",
  },
  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
    accent: "nebula",
    count: 0,
    blurb: "Art, design & photo",
  },
  {
    id: "video",
    label: "Video",
    icon: Clapperboard,
    accent: "coral",
    count: 0,
    blurb: "Generation & editing",
  },
  {
    id: "voice",
    label: "Voice",
    icon: AudioLines,
    accent: "star",
    count: 0,
    blurb: "TTS, music & cloning",
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    accent: "aurora",
    count: 0,
    blurb: "Analysis & research",
  },
  {
    id: "agents",
    label: "Agents",
    icon: Bot,
    accent: "nebula",
    count: 0,
    blurb: "Autonomous workflows",
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    accent: "teal",
    count: 0,
    blurb: "Answer engines",
  },
];

/**
 * Returns a map of categoryId -> actual number of tools in that category,
 * computed from the real `tools` array. Use this instead of the hardcoded
 * `count` field so the UI always reflects reality.
 */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of categories) counts[c.id] = 0;
  for (const t of tools) {
    if (counts[t.category] !== undefined) counts[t.category]++;
  }
  return counts;
}

export type BudgetTier = "Free" | "Freemium" | "$" | "$$" | "$$$";

/** Numeric weight used for "at or below budget" filtering. */
export const budgetRank: Record<BudgetTier, number> = {
  Free: 0,
  Freemium: 1,
  $: 2,
  $$: 3,
  $$$: 4,
};

export interface PricingTier {
  name: string;
  price: string;
  note: string;
}

export interface ToolSpec {
  /** capability label -> boolean or string value */
  [key: string]: string | boolean;
}

export interface AiTool {
  id: string;
  name: string;
  vendor: string;
  logo: string; // single emoji / glyph used inside the 3D logo block
  accent: AccentColor;
  category: string;
  tasks: string[];
  budget: BudgetTier;
  priceNote: string;
  rating: number; // 0 - 5
  reviews: number;
  tagline: string;
  description: string;
  tags: string[];
  featured?: boolean;
  badge?: string;
  launched: string; // year
  pricing: PricingTier[];
  pros: string[];
  cons: string[];
  /** canonical spec keys used in the compare table */
  spec: ToolSpec;
  website: string;
}

/** Canonical capability/spec keys rendered in the compare + detail views. */
export const specKeys: {
  key: string;
  label: string;
  highlight?: boolean;
}[] = [
  { key: "bestFor", label: "Best for" },
  { key: "context", label: "Context window", highlight: true },
  { key: "imageGen", label: "Image generation" },
  { key: "voice", label: "Voice mode" },
  { key: "codeExec", label: "Code execution" },
  { key: "web", label: "Web browsing" },
  { key: "offline", label: "Offline / open weights" },
  { key: "api", label: "Public API" },
  { key: "price", label: "Starting price", highlight: true },
];

export const tools: AiTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    logo: "✦",
    accent: "aurora",
    category: "writing",
    tasks: ["Writing", "Agents", "Coding"],
    budget: "Freemium",
    priceNote: "Free · $20/mo Plus",
    rating: 4.8,
    reviews: 18420,
    tagline: "The general-purpose conversational AI for almost any task.",
    description:
      "ChatGPT is the most widely used AI assistant, handling writing, coding, analysis and image generation through a single chat interface. GPT-4o brings realtime voice, vision and a built-in code interpreter to every conversation.",
    tags: ["GPT-4o", "Voice", "Vision", "Code interpreter"],
    featured: true,
    badge: "Most popular",
    launched: "2022",
    pricing: [
      { name: "Free", price: "$0", note: "GPT-4o mini, limited messages" },
      { name: "Plus", price: "$20/mo", note: "GPT-4o, higher limits" },
      { name: "Team", price: "$25/mo", note: "Shared workspace" },
    ],
    pros: [
      "Excellent all-rounder across tasks",
      "Realtime voice & vision",
      "Massive plugin + GPT ecosystem",
    ],
    cons: ["Context caps on free tier", "Usage limits on Plus"],
    spec: {
      bestFor: "General chat & tasks",
      context: "128K",
      imageGen: true,
      voice: true,
      codeExec: true,
      web: true,
      offline: false,
      api: true,
      price: "Free · $20/mo",
    },
    website: "chat.openai.com",
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    logo: "✸",
    accent: "star",
    category: "writing",
    tasks: ["Writing", "Coding", "Agents"],
    budget: "Freemium",
    priceNote: "Free · $20/mo Pro",
    rating: 4.8,
    reviews: 9650,
    tagline: "Thoughtful, long-context assistant tuned for nuance and safety.",
    description:
      "Claude is known for its measured, high-quality writing and an industry-leading 200K context window. Artifacts, Projects and computer use make it a favourite for long documents, codebases and careful reasoning.",
    tags: ["200K context", "Artifacts", "Projects"],
    featured: true,
    badge: "Best for long docs",
    launched: "2023",
    pricing: [
      { name: "Free", price: "$0", note: "Sonnet, daily limits" },
      { name: "Pro", price: "$20/mo", note: "Opus access, 5x usage" },
      { name: "Team", price: "$30/mo", note: "Shared projects" },
    ],
    pros: [
      "Best-in-class long-context handling",
      "Superior writing quality",
      "Artifacts for live previews",
    ],
    cons: ["No native image generation", "Tighter content guardrails"],
    spec: {
      bestFor: "Long documents & nuance",
      context: "200K",
      imageGen: false,
      voice: true,
      codeExec: true,
      web: true,
      offline: false,
      api: true,
      price: "Free · $20/mo",
    },
    website: "claude.ai",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    vendor: "Midjourney",
    logo: "◐",
    accent: "nebula",
    category: "images",
    tasks: ["Images"],
    budget: "$",
    priceNote: "From $10/mo",
    rating: 4.7,
    reviews: 7320,
    tagline: "Cinematic, painterly image generation with a signature style.",
    description:
      "Midjourney produces some of the most aesthetically refined AI imagery available. Version 6 adds style references, character consistency and precise pan/zoom controls — all driven from a Discord or web prompt.",
    tags: ["v6", "Style refs", "Pan & zoom"],
    featured: true,
    badge: "Top rated art",
    launched: "2022",
    pricing: [
      { name: "Basic", price: "$10/mo", note: "~200 images" },
      { name: "Standard", price: "$30/mo", note: "15h fast + unlimited relax" },
      { name: "Pro", price: "$60/mo", note: "Stealth + 12h fast" },
    ],
    pros: [
      "Unmatched aesthetic quality",
      "Style & character references",
      "Active community & gallery",
    ],
    cons: ["No free tier", "Discord-first workflow"],
    spec: {
      bestFor: "Artistic image generation",
      context: "—",
      imageGen: true,
      voice: false,
      codeExec: false,
      web: false,
      offline: false,
      api: false,
      price: "From $10/mo",
    },
    website: "midjourney.com",
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    logo: "⌘",
    accent: "teal",
    category: "coding",
    tasks: ["Coding"],
    budget: "Freemium",
    priceNote: "Free · $20/mo Pro",
    rating: 4.7,
    reviews: 5110,
    tagline: "The AI code editor that understands your whole repository.",
    description:
      "Cursor is a VS Code fork built around AI. It indexes your entire repo for context-aware tab autocomplete, multi-file edits and an agent mode that can plan and execute changes across the codebase.",
    tags: ["Repo context", "Tab autocomplete", "Agent mode"],
    featured: true,
    badge: "Devs' choice",
    launched: "2023",
    pricing: [
      { name: "Hobby", price: "$0", note: "2K completions / mo" },
      { name: "Pro", price: "$20/mo", note: "Unlimited completions" },
      { name: "Business", price: "$40/mo", note: "Admin + privacy mode" },
    ],
    pros: [
      "Deep whole-repo context",
      "Best-in-class autocomplete",
      "Familiar VS Code UX",
    ],
    cons: ["Heavier on resources", "Premium model usage capped"],
    spec: {
      bestFor: "In-editor coding",
      context: "Repo-wide",
      imageGen: false,
      voice: false,
      codeExec: true,
      web: false,
      offline: false,
      api: false,
      price: "Free · $20/mo",
    },
    website: "cursor.sh",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    logo: "ღ",
    accent: "star",
    category: "voice",
    tasks: ["Voice"],
    budget: "Freemium",
    priceNote: "Free · from $5/mo",
    rating: 4.6,
    reviews: 4280,
    tagline: "Hyper-realistic text-to-speech, voice cloning & dubbing.",
    description:
      "ElevenLabs sets the bar for natural synthetic speech. Generate voices in 32 languages, clone a voice from a short sample, and dub full videos with lip-synced translation in minutes.",
    tags: ["32 langs", "Voice clone", "Realtime"],
    featured: true,
    launched: "2022",
    pricing: [
      { name: "Free", price: "$0", note: "10K chars / mo" },
      { name: "Starter", price: "$5/mo", note: "30K chars + voice clone" },
      { name: "Creator", price: "$22/mo", note: "100K chars, commercial" },
    ],
    pros: [
      "Most realistic TTS available",
      "Instant voice cloning",
      "Multilingual dubbing",
    ],
    cons: ["Char-based pricing adds up", "Clone quality varies by sample"],
    spec: {
      bestFor: "Voice & dubbing",
      context: "—",
      imageGen: false,
      voice: true,
      codeExec: false,
      web: false,
      offline: false,
      api: true,
      price: "Free · from $5/mo",
    },
    website: "elevenlabs.io",
  },
  {
    id: "runway",
    name: "Runway",
    vendor: "Runway",
    logo: "▷",
    accent: "coral",
    category: "video",
    tasks: ["Video"],
    budget: "$",
    priceNote: "From $15/mo",
    rating: 4.5,
    reviews: 3990,
    tagline: "Generate and direct video from a single text prompt.",
    description:
      "Runway's Gen-3 Alpha turns text and images into high-fidelity video. Motion brush, camera controls and image-to-video give directors fine-grained control over every shot.",
    tags: ["Gen-3", "Image-to-video", "Motion brush"],
    featured: true,
    launched: "2020",
    pricing: [
      { name: "Standard", price: "$15/mo", note: "625 credits" },
      { name: "Pro", price: "$35/mo", note: "2250 credits" },
      { name: "Unlimited", price: "$95/mo", note: "Unlimited Gen-3" },
    ],
    pros: [
      "Leading text-to-video quality",
      "Precise camera & motion control",
      "Strong image-to-video",
    ],
    cons: ["Credits burn fast", "Steep learning curve"],
    spec: {
      bestFor: "Text-to-video",
      context: "—",
      imageGen: false,
      voice: false,
      codeExec: false,
      web: false,
      offline: false,
      api: true,
      price: "From $15/mo",
    },
    website: "runwayml.com",
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    logo: "✧",
    accent: "aurora",
    category: "agents",
    tasks: ["Writing", "Data", "Agents"],
    budget: "Freemium",
    priceNote: "Free · $20/mo Advanced",
    rating: 4.6,
    reviews: 12100,
    tagline: "Multimodal model with deep Google Workspace integration.",
    description:
      "Gemini is Google's flagship multimodal model with a 1M-token context window. It powers AI features across Docs, Gmail, Sheets and Android, and integrates directly with Search for grounded answers.",
    tags: ["1M context", "Multimodal", "Workspace"],
    launched: "2023",
    pricing: [
      { name: "Free", price: "$0", note: "Flash model" },
      { name: "Advanced", price: "$20/mo", note: "Pro + 2TB storage" },
      { name: "AI Pro", price: "$200/mo", note: "Highest limits" },
    ],
    pros: [
      "Massive 1M context",
      "Native Google Workspace tie-in",
      "Strong multimodal grounding",
    ],
    cons: ["Less consistent tone", "Region-restricted features"],
    spec: {
      bestFor: "Google ecosystem",
      context: "1M",
      imageGen: true,
      voice: true,
      codeExec: true,
      web: true,
      offline: false,
      api: true,
      price: "Free · $20/mo",
    },
    website: "gemini.google.com",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity",
    logo: "◉",
    accent: "teal",
    category: "search",
    tasks: ["Search", "Data"],
    budget: "Freemium",
    priceNote: "Free · $20/mo Pro",
    rating: 4.6,
    reviews: 6740,
    tagline: "Answer engine that cites live sources for every response.",
    description:
      "Perplexity is an answer engine that searches the live web and writes cited responses. Pro search breaks complex questions into steps, and the Pro tier unlocks frontier models like GPT-4o and Claude.",
    tags: ["Live web", "Citations", "Pro search"],
    launched: "2022",
    pricing: [
      { name: "Free", price: "$0", note: "5 Pro searches / 4h" },
      { name: "Pro", price: "$20/mo", note: "Unlimited + model choice" },
      { name: "Enterprise", price: "$40/mo", note: "SSO + data privacy" },
    ],
    pros: [
      "Always-cited, current answers",
      "Multi-step Pro search",
      "Pick the underlying model",
    ],
    cons: ["Less creative for long-form", "Free tier is rate-limited"],
    spec: {
      bestFor: "Answer engine",
      context: "—",
      imageGen: false,
      voice: true,
      codeExec: false,
      web: true,
      offline: false,
      api: true,
      price: "Free · $20/mo",
    },
    website: "perplexity.ai",
  },
  {
    id: "dalle3",
    name: "DALL·E 3",
    vendor: "OpenAI",
    logo: "◆",
    accent: "nebula",
    category: "images",
    tasks: ["Images"],
    budget: "Freemium",
    priceNote: "Free in ChatGPT · $20/mo",
    rating: 4.4,
    reviews: 5810,
    tagline: "Prompt-faithful image generation built into ChatGPT.",
    description:
      "DALL·E 3 excels at following complex prompts and rendering legible text inside images. Available free inside ChatGPT, it makes image generation a natural part of any conversation.",
    tags: ["Prompt fidelity", "Text in images", "ChatGPT native"],
    launched: "2023",
    pricing: [
      { name: "Free", price: "$0", note: "2/day in ChatGPT" },
      { name: "Plus", price: "$20/mo", note: "Higher limits + editing" },
    ],
    pros: [
      "Excellent prompt adherence",
      "Reads text in images reliably",
      "No separate subscription",
    ],
    cons: ["Less artistic than Midjourney", "Locked to OpenAI ecosystem"],
    spec: {
      bestFor: "Prompt-faithful images",
      context: "—",
      imageGen: true,
      voice: false,
      codeExec: false,
      web: false,
      offline: false,
      api: true,
      price: "Free · $20/mo",
    },
    website: "openai.com/dall-e-3",
  },
  {
    id: "suno",
    name: "Suno",
    vendor: "Suno",
    logo: "♪",
    accent: "star",
    category: "voice",
    tasks: ["Voice"],
    budget: "Freemium",
    priceNote: "Free · $10/mo Pro",
    rating: 4.5,
    reviews: 3120,
    tagline: "Generate full songs with vocals from a single line of text.",
    description:
      "Suno turns a prompt into a complete song — lyrics, vocals, instruments and all. The Pro and Premier tiers unlock commercial rights and higher daily generation limits.",
    tags: ["Full songs", "Vocals", "Commercial use"],
    launched: "2023",
    pricing: [
      { name: "Free", price: "$0", note: "10 songs / day" },
      { name: "Pro", price: "$10/mo", note: "2500 credits + comm. rights" },
      { name: "Premier", price: "$30/mo", note: "10000 credits" },
    ],
    pros: [
      "Complete songs with vocals",
      "Surprisingly natural production",
      "Generous free tier",
    ],
    cons: ["Vocal clarity can vary", "Genre coverage still growing"],
    spec: {
      bestFor: "Music generation",
      context: "—",
      imageGen: false,
      voice: true,
      codeExec: false,
      web: false,
      offline: false,
      api: false,
      price: "Free · $10/mo",
    },
    website: "suno.com",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    logo: "⌥",
    accent: "teal",
    category: "coding",
    tasks: ["Coding"],
    budget: "$",
    priceNote: "From $10/mo",
    rating: 4.5,
    reviews: 8890,
    tagline: "The OG AI pair programmer, deeply integrated into your IDE.",
    description:
      "GitHub Copilot suggests whole lines and functions inside VS Code, JetBrains and Neovim. Copilot Chat and the new agent mode bring repo-aware refactoring and autonomous task execution.",
    tags: ["IDE native", "Copilot Chat", "Agent mode"],
    launched: "2021",
    pricing: [
      { name: "Free", price: "$0", note: "2000 completions / mo" },
      { name: "Pro", price: "$10/mo", note: "Unlimited + chat" },
      { name: "Business", price: "$19/mo", note: "Org policy + privacy" },
    ],
    pros: [
      "Broadest IDE support",
      "Free tier available",
      "Backed by GitHub's code corpus",
    ],
    cons: ["Less repo context than Cursor", "Agent mode is newer"],
    spec: {
      bestFor: "IDE pair programming",
      context: "File + chat",
      imageGen: false,
      voice: false,
      codeExec: true,
      web: false,
      offline: false,
      api: true,
      price: "Free · $10/mo",
    },
    website: "github.com/features/copilot",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    vendor: "Stability AI",
    logo: "▰",
    accent: "coral",
    category: "images",
    tasks: ["Images"],
    budget: "Free",
    priceNote: "Free / open weights",
    rating: 4.3,
    reviews: 6240,
    tagline: "Open-weights image model you can run locally and fine-tune.",
    description:
      "Stable Diffusion is the open-source backbone of the AI image world. Run it locally with ComfyUI or Automatic1111, fine-tune custom checkpoints, and own your pipeline end to end.",
    tags: ["Open weights", "Local run", "Fine-tunable"],
    launched: "2022",
    pricing: [
      { name: "Community", price: "$0", note: "Run locally, free" },
      { name: "Creator", price: "$9/mo", note: "Stability API credits" },
      { name: "Pro", price: "$49/mo", note: "Higher throughput" },
    ],
    pros: [
      "Fully open weights",
      "Runs offline on your GPU",
      "Endless community models",
    ],
    cons: ["Requires GPU + setup", "Quality behind Midjourney v6"],
    spec: {
      bestFor: "Open & local image gen",
      context: "—",
      imageGen: true,
      voice: false,
      codeExec: false,
      web: false,
      offline: true,
      api: true,
      price: "Free / open",
    },
    website: "stability.ai",
  },
  {
    id: "synthesia",
    name: "Synthesia",
    vendor: "Synthesia",
    logo: "▣",
    accent: "coral",
    category: "video",
    tasks: ["Video"],
    budget: "$$",
    priceNote: "From $22/mo",
    rating: 4.4,
    reviews: 2180,
    tagline: "Studio-quality talking-head videos from a script, no camera.",
    description:
      "Synthesia turns a written script into a polished video presented by a lifelike AI avatar. Ideal for training, onboarding and explainer content across 140+ languages.",
    tags: ["AI avatars", "140+ langs", "Corporate video"],
    launched: "2017",
    pricing: [
      { name: "Starter", price: "$22/mo", note: "120 min / year" },
      { name: "Creator", price: "$67/mo", note: "360 min + avatar clone" },
      { name: "Enterprise", price: "Custom", note: "SSO + custom avatars" },
    ],
    pros: [
      "Best-in-class AI avatars",
      "Massive language coverage",
      "No filming required",
    ],
    cons: ["Pricier than generative video", "Less creative freedom"],
    spec: {
      bestFor: "Avatar & training video",
      context: "—",
      imageGen: false,
      voice: true,
      codeExec: false,
      web: false,
      offline: false,
      api: true,
      price: "From $22/mo",
    },
    website: "synthesia.io",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    logo: "◈",
    accent: "aurora",
    category: "coding",
    tasks: ["Coding", "Data"],
    budget: "Free",
    priceNote: "Free / open weights",
    rating: 4.4,
    reviews: 4520,
    tagline: "Frontier-class reasoning model with open weights, near-free API.",
    description:
      "DeepSeek's R1 reasoning model rivals frontier labs on math and code at a fraction of the cost — and the weights are open. A top pick for builders who want capability without vendor lock-in.",
    tags: ["Open weights", "Reasoning", "Low-cost API"],
    launched: "2023",
    pricing: [
      { name: "Free", price: "$0", note: "Open weights, self-host" },
      { name: "API", price: "$0.27/M", note: "Input token pricing" },
    ],
    pros: [
      "Open weights, self-hostable",
      "Extremely cheap API",
      "Strong math & code reasoning",
    ],
    cons: ["No first-party app/UX", "Smaller tool ecosystem"],
    spec: {
      bestFor: "Open reasoning & code",
      context: "128K",
      imageGen: false,
      voice: false,
      codeExec: true,
      web: false,
      offline: true,
      api: true,
      price: "Free / open",
    },
    website: "deepseek.com",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    vendor: "Notion",
    logo: "❏",
    accent: "star",
    category: "writing",
    tasks: ["Writing", "Data"],
    budget: "$",
    priceNote: "From $10/mo",
    rating: 4.3,
    reviews: 3640,
    tagline: "AI built into the workspace where your notes already live.",
    description:
      "Notion AI writes, summarises and transforms content inside your existing docs and databases. Ask questions across your workspace, auto-fill database properties, and draft without leaving context.",
    tags: ["Workspace AI", "Q&A", "Auto-fill"],
    launched: "2023",
    pricing: [
      { name: "Add-on", price: "$10/mo", note: "Per member, on any plan" },
      { name: "Business", price: "$20/mo", note: "Includes AI + admin" },
    ],
    pros: [
      "Lives where your knowledge already is",
      "Cross-workspace Q&A",
      "Database auto-fill",
    ],
    cons: ["Per-seat pricing", "Weakest on pure chat"],
    spec: {
      bestFor: "Workspace writing",
      context: "Workspace-wide",
      imageGen: false,
      voice: false,
      codeExec: false,
      web: true,
      offline: false,
      api: false,
      price: "From $10/mo",
    },
    website: "notion.so/product/ai",
  },
  {
    id: "sora",
    name: "Sora",
    vendor: "OpenAI",
    logo: "⏵",
    accent: "nebula",
    category: "video",
    tasks: ["Video"],
    budget: "$$",
    priceNote: "Included in $20/mo Plus",
    rating: 4.2,
    reviews: 1980,
    tagline: "Long-form, physics-aware video generation from OpenAI.",
    description:
      "Sora generates up to 20-second HD video clips with consistent characters and surprising physical plausibility. Storyboard tools let you stitch clips into structured sequences.",
    tags: ["Long clips", "Storyboard", "HD output"],
    launched: "2024",
    pricing: [
      { name: "Plus", price: "$20/mo", note: "50 prioritized 5s clips" },
      { name: "Pro", price: "$200/mo", note: "Unlimited + 20s 1080p" },
    ],
    pros: [
      "Longer, more coherent clips",
      "Storyboard stitching",
      "Strong physical plausibility",
    ],
    cons: ["Limited availability", "Credit limits on Plus"],
    spec: {
      bestFor: "Long-form AI video",
      context: "—",
      imageGen: false,
      voice: false,
      codeExec: false,
      web: false,
      offline: false,
      api: false,
      price: "$20/mo Plus",
    },
    website: "openai.com/sora",
  },
];

export const budgetTiers: { label: BudgetTier; hint: string }[] = [
  { label: "Free", hint: "No cost" },
  { label: "Freemium", hint: "Free + paid tiers" },
  { label: "$", hint: "Under $15/mo" },
  { label: "$$", hint: "$15–$50/mo" },
  { label: "$$$", hint: "$50+/mo" },
];

export const taskOptions: string[] = [
  "Writing",
  "Coding",
  "Images",
  "Video",
  "Voice",
  "Data",
  "Agents",
  "Search",
];

export function getToolById(id: string): AiTool | undefined {
  return tools.find((t) => t.id === id);
}

/**
 * Returns up to `n` tools similar to the given tool, ranked by:
 *   1. shared category (weight 3)
 *   2. shared tasks (weight 1 each)
 * Excludes the tool itself. Ties broken by rating.
 */
export function getSimilarTools(tool: AiTool, n = 3): AiTool[] {
  return tools
    .filter((t) => t.id !== tool.id)
    .map((t) => {
      let score = 0;
      if (t.category === tool.category) score += 3;
      score += t.tasks.filter((task) => tool.tasks.includes(task)).length;
      return { tool: t, score };
    })
    .sort((a, b) => b.score - a.score || b.tool.rating - a.tool.rating)
    .slice(0, n)
    .map((x) => x.tool);
}

/** Tools sorted by launch year descending (newest first). */
export function getTrendingLaunches(limit = 8): AiTool[] {
  return [...tools]
    .sort((a, b) => Number(b.launched) - Number(a.launched) || b.rating - a.rating)
    .slice(0, limit);
}
