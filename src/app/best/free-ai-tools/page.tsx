import type { Metadata } from "next";
import Link from "next/link";
import { tools, getToolById } from "@/lib/ai-data";
import { accentClasses } from "@/components/site/block";
import { cn } from "@/lib/utils";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import { Trophy, ArrowRight, Star, Sparkles, Check, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Free AI Tools 2026 — 25+ Tools You Can Use Without Paying",
  description:
    "Best free AI tools in 2026 — 25+ AI tools you can use without paying. Compare ChatGPT free, Claude free, Gemini free, DeepSeek, Llama, Perplexity free & more by features, limits, and use case. No credit card required.",
  keywords: [
    "best free ai tools",
    "best free ai tools 2026",
    "free ai tools no credit card",
    "free ai tools for students",
    "free ai image generator",
    "free ai video generator",
    "free ai writing tool",
    "free ai coding assistant",
    "free ai chatbot",
    "free ai api",
    "chatgpt free tier",
    "claude free tier",
    "gemini free tier",
    "deepseek free",
    "llama free open source",
    "completely free ai tools",
    "free ai tools list 2026",
  ],
  alternates: { canonical: "https://myaipicker.com/best/free-ai-tools" },
  openGraph: {
    title: "Best Free AI Tools 2026 — 25+ Tools Without Paying",
    description:
      "25+ free AI tools you can use without paying. ChatGPT, Claude, Gemini, DeepSeek, Llama & more — compare free tiers, limits, and use cases.",
    url: "https://myaipicker.com/best/free-ai-tools",
    type: "article",
    siteName: "My AI Picker",
  },
};

const faqs = [
  {
    question: "What are the best free AI tools in 2026?",
    answer: "The best free AI tools in 2026 are: ChatGPT (GPT-4o mini, limited free), Claude (Sonnet, daily limits), Gemini (Flash, free with basic app), DeepSeek (free, open-source), Llama (free open weights), Perplexity (5 Pro searches per 4 hours), and Stable Diffusion (free, runs locally). Stack 2-3 free tiers to cover all your needs.",
  },
  {
    question: "Is ChatGPT free to use?",
    answer: "Yes — ChatGPT has a free tier with GPT-4o mini, limited messages per day, web + mobile app access, and standard response speed. For GPT-5, higher limits, image generation, and code interpreter, you need ChatGPT Plus ($20/month).",
  },
  {
    question: "Is Claude free to use?",
    answer: "Yes — Claude has a free tier with Claude Sonnet access, daily message limits, web app access, and Artifacts preview. For Claude Opus 4.6, 5x more usage, Projects, and computer use, you need Claude Pro ($20/month).",
  },
  {
    question: "What is the best free AI for coding?",
    answer: "The best free AI for coding is DeepSeek V4 (free, open-source, SWE-bench 42.0%, self-hostable). For free hosted options: GitHub Copilot Free (2,000 completions/month), Cursor Free (2,000 completions/month), and Windsurf Free (12 credits/month). For local, private coding, use Llama 4 (free open weights).",
  },
  {
    question: "What is the best free AI image generator?",
    answer: "The best free AI image generator is Stable Diffusion (free, open-source, runs locally on your GPU). For free hosted options: DALL·E 3 (2 images/day free in ChatGPT), Craiyon (free, unlimited), and Canva AI (free tier). For artistic quality, Midjourney has no free tier — use Stable Diffusion with community models.",
  },
  {
    question: "Are there any AI tools that are completely free with no limits?",
    answer: "Yes — DeepSeek (free API with rate limits), Llama (free open weights, self-hostable, no limits), Stable Diffusion (free, runs locally, no limits), and Gemini Flash (free with basic app, soft limits). For truly unlimited free AI, self-host Llama or Stable Diffusion on your own hardware.",
  },
  {
    question: "Can I use AI tools for free without a credit card?",
    answer: "Yes — most free AI tiers don't require a credit card: ChatGPT free, Claude free, Gemini free, Perplexity free, DeepSeek free API, and Llama (self-hosted). Some tools (like Runway, Pika) require a credit card for free trials — avoid these if you want truly free.",
  },
  {
    question: "What is the cheapest way to get premium AI?",
    answer: "The cheapest way to get premium AI is to subscribe to one $20/month plan. Best value: ChatGPT Plus (GPT-5 + DALL·E 3 + voice + code interpreter) or Claude Pro (Opus 4.6 + Artifacts + Projects). For cheaper options: GitHub Copilot ($10/mo), Windsurf ($15/mo), or Perplexity Pro ($20/mo with 50% student discount).",
  },
];

export default function BestFreeAIToolsPage() {
  // Get all tools with free tiers
  const freeTools = tools
    .filter(t => t.priceNote.toLowerCase().includes("free") || t.priceNote.toLowerCase().includes("$0"))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 25);

  // Group by category
  const byCategory = freeTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof freeTools>);

  const categoryLabels: Record<string, string> = {
    writing: "Writing & Chat AI (Free)",
    coding: "Coding AI (Free)",
    images: "Image Generators (Free)",
    video: "Video Generators (Free)",
    voice: "Voice & TTS (Free)",
    agents: "AI Agents (Free)",
    search: "Search & Research (Free)",
    build: "App Builders (Free)",
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Best", href: "/best-ai-tools-2026" }, { label: "Free AI Tools" }]} />

          <span className="inline-flex items-center gap-2 rounded-md border border-star/40 bg-star/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-star">
            <Gift className="h-3.5 w-3.5" />
            Free Tools Guide 2026
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Best Free AI Tools in 2026: 25+ Tools You Can Use Without Paying
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            You don't need to pay for AI. We found 25+ AI tools with genuine free tiers — no credit
            card, no hidden trials. Compare them by category, features, and limits to build your
            free AI stack.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-aurora/40 bg-aurora/10 text-aurora font-bold text-[10px]">MP</span>
              <span className="font-semibold text-foreground">My AI Picker Editorial Team</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Updated August 2026
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-aurora/30 bg-aurora/[0.04] px-2 py-0.5 font-medium text-aurora">
              Expert reviewed
            </span>
          </div>

          {/* Quick comparison */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Top 10 Free AI Tools (Quick Picks)</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="border border-border p-2.5 text-left font-bold">Tool</th>
                    <th className="border border-border p-2.5 text-left font-bold">Category</th>
                    <th className="border border-border p-2.5 text-left font-bold">Free Tier</th>
                    <th className="border border-border p-2.5 text-left font-bold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {freeTools.slice(0, 10).map(tool => (
                    <tr key={tool.id} className="hover:bg-card/50">
                      <td className="border border-border p-2.5">
                        <Link href={`/tools/${tool.id}`} className="font-semibold text-aurora hover:underline">
                          {tool.name}
                        </Link>
                      </td>
                      <td className="border border-border p-2.5 text-muted-foreground capitalize">{tool.category}</td>
                      <td className="border border-border p-2.5 text-muted-foreground">{tool.priceNote}</td>
                      <td className="border border-border p-2.5">
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {tool.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* By category */}
          {Object.entries(byCategory).map(([cat, catTools]) => (
            <section key={cat} className="mt-10">
              <h2 className="font-display text-2xl font-bold">
                {categoryLabels[cat] || `${cat.charAt(0).toUpperCase() + cat.slice(1)} (Free)`}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {catTools.map(tool => {
                  const a = accentClasses[tool.accent];
                  return (
                    <div key={tool.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold">
                          <Link href={`/tools/${tool.id}`} className="hover:text-aurora">{tool.name}</Link>
                        </h3>
                        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-star text-star" />
                          {tool.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
                      <p className="mt-2 text-xs">
                        <strong className="text-aurora">Free tier:</strong> {tool.priceNote}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <strong>Best for:</strong> {tool.spec.bestFor}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Free stack recommendations */}
          <section className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6">
            <h2 className="font-display text-2xl font-bold">Recommended Free AI Stacks</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Stack these free tools to cover all your needs without paying:
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold text-aurora">📦 The Student Stack ($0/month)</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>ChatGPT Free</strong> — general chat, image gen (limited)</li>
                  <li>• <strong>Gemini Free</strong> — long PDFs, research (2M context)</li>
                  <li>• <strong>Perplexity Free</strong> — cited research (5 Pro/4h)</li>
                  <li>• <strong>DeepSeek Free</strong> — coding & math (open source)</li>
                  <li>• <strong>Notion AI Free</strong> — notes (free for students)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold text-aurora">👨‍💻 The Developer Stack ($0/month)</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Cursor Free</strong> — IDE autocomplete (2K/mo)</li>
                  <li>• <strong>GitHub Copilot Free</strong> — IDE pair programming (2K/mo)</li>
                  <li>• <strong>DeepSeek Free</strong> — complex coding (open source)</li>
                  <li>• <strong>Llama 4 Free</strong> — self-hosted, private coding</li>
                  <li>• <strong>Claude Free</strong> — debugging help (daily limits)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold text-aurora">🎨 The Creator Stack ($0/month)</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>ChatGPT Free</strong> — writing, brainstorming</li>
                  <li>• <strong>Stable Diffusion</strong> — image generation (local, free)</li>
                  <li>• <strong>Craiyon</strong> — image generation (free, unlimited)</li>
                  <li>• <strong>Suno Free</strong> — music generation (10 songs/day)</li>
                  <li>• <strong>Canva AI Free</strong> — design & graphics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-display text-base font-bold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <FAQSchema faqs={faqs} />
          </section>

          {/* CTA */}
          <section className="mt-12 rounded-xl border border-aurora/30 bg-gradient-to-br from-aurora/[0.06] to-card p-6 text-center">
            <h3 className="font-display text-lg font-bold">Find Your Perfect Free AI</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Take our 60-second quiz to get a personalized free AI recommendation.
            </p>
            <Link
              href="/#top"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
            >
              Find My AI Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
