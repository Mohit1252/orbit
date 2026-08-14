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
import { Trophy, ArrowRight, Star, Sparkles, Check, GraduationCap, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Best AI for Students 2026 — 12 Tools Compared by Price, Free Tier & Use Case",
  description:
    "Best AI tools for students in 2026 — compare ChatGPT, Claude, Gemini, Perplexity, Notion AI, DeepSeek & more by price, free tier, and use case. Find your perfect study AI for essays, research, math, and coding homework.",
  keywords: [
    "best ai for students",
    "best ai for students 2026",
    "best free ai tools for college students",
    "best ai for studying and notes",
    "best ai for research papers",
    "best ai for math homework",
    "best ai for essay writing",
    "cheapest ai for students",
    "ai tools for students under 10",
    "best ai for indian students",
    "chatgpt vs claude for students",
    "notion ai vs chatgpt for students",
    "perplexity for students",
    "deepseek free for students",
    "student discount ai tools",
  ],
  alternates: { canonical: "https://myaipicker.com/best/for-students" },
  openGraph: {
    title: "Best AI for Students 2026 — 12 Tools Compared",
    description:
      "Compare the best AI tools for students by price, free tier, and use case. ChatGPT, Claude, Gemini, Perplexity, Notion AI & more.",
    url: "https://myaipicker.com/best/for-students",
    type: "article",
    siteName: "My AI Picker",
  },
};

// Curated student tools (ID list)
const STUDENT_TOOLS = [
  "chatgpt", "claude", "gemini", "perplexity", "notion-ai", "deepseek",
  "quillbot", "grammarly", "llama", "ms-copilot", "poe", "mistral",
];

const faqs = [
  {
    question: "What is the best AI for students in 2026?",
    answer: "The best AI for students in 2026 is Claude (best writing quality, $20/mo with daily free limits), followed by ChatGPT (best all-rounder, $20/mo) and Gemini (best for research, free Flash tier). For budget students, DeepSeek is free and open-source.",
  },
  {
    question: "Which AI is free for students?",
    answer: "Several AI tools offer free tiers for students: Gemini Flash (free), DeepSeek (free and open-source), ChatGPT (GPT-4o mini, limited), Claude (Sonnet, daily limits), Perplexity (5 Pro searches per 4 hours), and Llama (free open weights). Notion AI is free for students with a valid .edu email.",
  },
  {
    question: "Is ChatGPT or Claude better for students?",
    answer: "For most students, ChatGPT is better — it's more versatile, has image generation, voice mode, and a code interpreter. Claude is better if you need high-quality writing (essays, research papers) or coding help. Both cost $20/month for the paid tier.",
  },
  {
    question: "What is the cheapest AI tool for students?",
    answer: "The cheapest AI tools for students are: DeepSeek (free, open-source), Gemini Flash (free), Llama (free, self-hostable), and QuillBot ($9.95/mo with 50% student discount). For $10/month or less, Notion AI (free for students) and Perplexity (50% student discount) are great options.",
  },
  {
    question: "Does ChatGPT offer a student discount?",
    answer: "No — ChatGPT does not currently offer a student discount. However, the free tier (GPT-4o mini) is sufficient for casual use. Perplexity offers 50% off for students, and Notion AI is free for students with a .edu email.",
  },
  {
    question: "Which AI is best for writing essays?",
    answer: "Claude is the best AI for writing essays — it produces the most natural, nuanced prose. ChatGPT is a close second, better for structured content. QuillBot is best for paraphrasing and avoiding plagiarism detection. For research-backed essays, use Perplexity for cited sources.",
  },
  {
    question: "Which AI is best for math and coding homework?",
    answer: "Claude is the best AI for coding homework (leads SWE-bench at 80.8%). For math, both Claude and ChatGPT (GPT-5) score above 96% on GSM8K. DeepSeek is a free alternative with strong math (97.3% GSM8K) and coding (38.8% SWE-bench) capabilities.",
  },
  {
    question: "Can I use AI tools for free as a student?",
    answer: "Yes — many AI tools offer free tiers. Gemini Flash is free with basic app access. DeepSeek is free and open-source (self-hostable). ChatGPT offers GPT-4o mini free. Claude offers Sonnet with daily limits. Perplexity gives 5 Pro searches per 4 hours. Llama is free open-weights. Stack 2-3 free tiers to cover all your needs.",
  },
];

export default function BestAIForStudentsPage() {
  const studentTools = STUDENT_TOOLS
    .map(id => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .sort((a, b) => b.rating - a.rating);

  const freeTools = studentTools.filter(t => t.priceNote.toLowerCase().includes("free"));
  const cheapTools = studentTools.filter(t => {
    const match = t.priceNote.match(/\$(\d+)/);
    return match && parseInt(match[1]) <= 10;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Best", href: "/best-ai-tools-2026" }, { label: "For Students" }]} />

          <span className="inline-flex items-center gap-2 rounded-md border border-aurora/40 bg-aurora/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <GraduationCap className="h-3.5 w-3.5" />
            Student Guide 2026
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Best AI for Students in 2026: 12 Tools Compared by Price, Use Case & Free Tier
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            As a student, you need AI tools that fit your budget and your workload — essays,
            research, math, coding, and notes. We compared 12 AI tools by price, free tier, and
            use case to help you pick the right one (or stack of free tiers).
          </p>

          {/* Author + updated */}
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

          {/* Quick comparison table */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">Quick Comparison: 12 Best AI Tools for Students</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="border border-border p-2.5 text-left font-bold">Tool</th>
                    <th className="border border-border p-2.5 text-left font-bold">Best For</th>
                    <th className="border border-border p-2.5 text-left font-bold">Free Tier</th>
                    <th className="border border-border p-2.5 text-left font-bold">Paid Price</th>
                    <th className="border border-border p-2.5 text-left font-bold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {studentTools.map(tool => {
                    const a = accentClasses[tool.accent];
                    return (
                      <tr key={tool.id} className="hover:bg-card/50">
                        <td className="border border-border p-2.5">
                          <Link href={`/tools/${tool.id}`} className="font-semibold text-aurora hover:underline">
                            {tool.name}
                          </Link>
                        </td>
                        <td className="border border-border p-2.5 text-muted-foreground">{tool.spec.bestFor}</td>
                        <td className="border border-border p-2.5 text-muted-foreground">
                          {tool.priceNote.toLowerCase().includes("free") ? "✅ Yes" : "❌ No"}
                        </td>
                        <td className="border border-border p-2.5 text-muted-foreground">{tool.priceNote}</td>
                        <td className="border border-border p-2.5">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-star text-star" />
                            {tool.rating.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Best for writing */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Best AI for Writing Essays & Assignments</h2>
            <p className="mt-2 text-muted-foreground">
              For essays, research papers, and assignments, you need an AI that writes naturally
              and follows academic conventions. Here are the top picks:
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">
                    <Link href="/tools/claude" className="hover:text-aurora">1. Claude — Best Writing Quality</Link>
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-md border border-star/40 bg-star/10 px-2 py-0.5 text-xs font-bold text-star">
                    <Trophy className="h-3 w-3" /> Top Pick
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Claude produces the most natural, nuanced prose of any AI. Its writing feels
                  human — less "AI-sounding" than ChatGPT. The 200K context window handles long
                  research papers without losing track. <strong>Price:</strong> Free (Sonnet, daily
                  limits) · $20/mo (Pro with Opus 4.6).
                </p>
                <p className="mt-2 text-sm">
                  <strong>Best for:</strong> Essays, research papers, creative writing, long-form content.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">
                  <Link href="/tools/chatgpt" className="hover:text-aurora">2. ChatGPT — Best All-Rounder</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ChatGPT is the most versatile AI — writing, coding, image generation, voice, and
                  a code interpreter. For students who want one AI that does everything, ChatGPT is
                  the pick. <strong>Price:</strong> Free (GPT-4o mini) · $20/mo (Plus with GPT-5).
                </p>
                <p className="mt-2 text-sm">
                  <strong>Best for:</strong> Students who want one AI for everything.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">
                  <Link href="/tools/quillbot" className="hover:text-aurora">3. QuillBot — Best Paraphraser</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  QuillBot is the world's most popular paraphrasing tool. It rewrites, summarizes,
                  and enhances text in 10+ modes. Essential for avoiding plagiarism and improving
                  readability. <strong>Price:</strong> Free (120 words/paraphrase) · $9.95/mo
                  (Premium, 50% student discount).
                </p>
                <p className="mt-2 text-sm">
                  <strong>Best for:</strong> Paraphrasing, summarizing, plagiarism avoidance.
                </p>
              </div>
            </div>
          </section>

          {/* Best for research */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Best AI for Research & Citations</h2>
            <p className="mt-2 text-muted-foreground">
              For research papers, you need an AI that finds sources and cites them. These two
              tools are essential for academic work:
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">
                    <Link href="/tools/perplexity" className="hover:text-aurora">Perplexity</Link>
                  </h3>
                  <span className="text-xs font-bold text-aurora">Cited Answers</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perplexity is an answer engine that searches the live web and cites every source.
                  Perfect for research papers — you get cited, verifiable answers.{" "}
                  <strong>Student discount:</strong> 50% off Pro.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">
                    <Link href="/tools/gemini" className="hover:text-aurora">Gemini</Link>
                  </h3>
                  <span className="text-xs font-bold text-aurora">2M Context</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Gemini's 2 million token context means you can upload entire textbooks or 50+
                  research papers. Free Flash tier is generous for students.
                </p>
              </div>
            </div>
          </section>

          {/* Best for math & coding */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Best AI for Math & Coding Homework</h2>
            <p className="mt-2 text-muted-foreground">
              For STEM students, coding ability and math accuracy matter most. Here are the top picks:
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">
                  <Link href="/tools/claude" className="hover:text-aurora">Claude — Coding Leader (SWE-bench 80.8%)</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Claude leads the SWE-bench benchmark at 80.8% — it can solve real GitHub issues
                  end-to-end. For computer science students, Claude is the clear choice for coding
                  assignments and debugging.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">
                  <Link href="/tools/deepseek" className="hover:text-aurora">DeepSeek — Free & Open (SWE-bench 38.8%)</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  DeepSeek offers frontier-class reasoning at near-zero cost — and the weights are
                  open. For budget students, DeepSeek is the best free AI for math (97.3% GSM8K)
                  and coding homework.
                </p>
              </div>
            </div>
          </section>

          {/* Best for notes */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Best AI for Notes & Study Organization</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">
                  <Link href="/tools/notion-ai" className="hover:text-aurora">Notion AI — Free for Students</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Notion AI lives inside your notes. It can summarize lecture notes, auto-fill study
                  databases, and answer questions across your workspace. <strong>Free for students</strong>{" "}
                  with a .edu email.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-bold">ChatGPT Projects</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ChatGPT's Projects feature lets you keep context across conversations — upload
                  your syllabus, and ChatGPT remembers it for future chats.
                </p>
              </div>
            </div>
          </section>

          {/* Best free tools */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-bold">Best Free AI Tools for Students (Budget Picks)</h2>
            <p className="mt-2 text-muted-foreground">
              On a tight budget? Stack these free tiers to cover all your needs:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-card">
                    <th className="border border-border p-2.5 text-left font-bold">Tool</th>
                    <th className="border border-border p-2.5 text-left font-bold">Free Tier</th>
                    <th className="border border-border p-2.5 text-left font-bold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {freeTools.map(tool => (
                    <tr key={tool.id}>
                      <td className="border border-border p-2.5">
                        <Link href={`/tools/${tool.id}`} className="font-semibold text-aurora hover:underline">
                          {tool.name}
                        </Link>
                      </td>
                      <td className="border border-border p-2.5 text-muted-foreground">{tool.priceNote}</td>
                      <td className="border border-border p-2.5 text-muted-foreground">{tool.spec.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to choose */}
          <section className="mt-10 rounded-xl border border-aurora/30 bg-aurora/[0.04] p-6">
            <h2 className="font-display text-2xl font-bold">How to Choose: Decision Guide</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>Writing essays?</strong> → Claude (best quality) or ChatGPT (versatile)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>Research with citations?</strong> → Perplexity (cited) or Gemini (long PDFs)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>Math & coding homework?</strong> → Claude (best) or DeepSeek (free)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>Notes & organization?</strong> → Notion AI (free for students)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>On a $0 budget?</strong> → Stack Gemini (free) + DeepSeek (free) + Perplexity (free tier)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-aurora" />
                <span><strong>Can spend $20/mo?</strong> → ChatGPT Plus or Claude Pro (pick based on use case)</span>
              </li>
            </ul>
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
            <h3 className="font-display text-lg font-bold">Compare These Tools Side-by-Side</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use our interactive comparison deck to see specs, pricing, and benchmarks side-by-side.
            </p>
            <Link
              href="/compare"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
            >
              Compare AI Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
