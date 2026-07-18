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
    count: 84,
    blurb: "Drafts, copy & long-form",
  },
  {
    id: "coding",
    label: "Coding",
    icon: Code2,
    accent: "teal",
    count: 67,
    blurb: "Copilots & dev agents",
  },
  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
    accent: "nebula",
    count: 102,
    blurb: "Art, design & photo",
  },
  {
    id: "video",
    label: "Video",
    icon: Clapperboard,
    accent: "coral",
    count: 48,
    blurb: "Generation & editing",
  },
  {
    id: "voice",
    label: "Voice",
    icon: AudioLines,
    accent: "star",
    count: 39,
    blurb: "TTS, music & cloning",
  },
  {
    id: "data",
    label: "Data",
    icon: Database,
    accent: "aurora",
    count: 31,
    blurb: "Analysis & research",
  },
  {
    id: "agents",
    label: "Agents",
    icon: Bot,
    accent: "nebula",
    count: 27,
    blurb: "Autonomous workflows",
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
    accent: "teal",
    count: 22,
    blurb: "Answer engines",
  },
];

export type BudgetTier = "Free" | "Freemium" | "$" | "$$" | "$$$";

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
  tags: string[];
  featured?: boolean;
  badge?: string;
}

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
    tags: ["GPT-4o", "Voice", "Vision", "Code interpreter"],
    featured: true,
    badge: "Most popular",
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
    tags: ["200K context", "Artifacts", "Projects"],
    featured: true,
    badge: "Best for long docs",
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
    tags: ["v6", "Style refs", "Pan & zoom"],
    featured: true,
    badge: "Top rated art",
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
    tags: ["Repo context", "Tab autocomplete", "Agent mode"],
    featured: true,
    badge: "Devs' choice",
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
    tags: ["32 langs", "Voice clone", "Realtime"],
    featured: true,
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
    tags: ["Gen-3", "Image-to-video", "Motion brush"],
    featured: true,
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
    tags: ["1M context", "Multimodal", "Workspace"],
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
    tags: ["Live web", "Citations", "Pro search"],
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
