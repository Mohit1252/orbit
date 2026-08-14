"use client";

import { useState } from "react";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import {
  Sparkles, Upload, FileText, Wand2, Download, Loader2, Check, X,
  Briefcase, Target, AlertCircle, ArrowRight, Copy, Mail, Mic,
} from "lucide-react";

interface AISuggestions {
  summary: string;
  experience: Array<{ company: string; role: string; bullets: string[] }>;
  skills: string[];
  atsKeywordsAdded: string[];
  suggestions: string[];
}

const faqs = [
  {
    question: "Is the AI resume builder free?",
    answer: "Yes — completely free. No credit card, no signup required. You can build, tailor, and copy your resume without paying. PDF download is also free.",
  },
  {
    question: "How does AI tailoring work?",
    answer: "Paste your resume text and the job description. Our AI (powered by Claude) analyzes the JD, extracts keywords, rewrites your experience bullets in STAR format, and adds ATS-friendly keywords to help you pass screening bots.",
  },
  {
    question: "Do I need to sign up?",
    answer: "No — you can use the resume builder in guest mode. Sign up only if you want to save multiple resume versions and access them across devices.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer: "Yes — you can copy the AI-improved resume text and paste it into any resume template (Canva, Google Docs, Word). A built-in PDF download feature is coming soon.",
  },
  {
    question: "Which AI powers the resume builder?",
    answer: "Our resume builder uses Claude (by Anthropic) — the best AI for writing quality. Claude leads on SWE-bench and produces the most natural, professional resume content.",
  },
];

export function ResumeBuilderClient() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter your target role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/improve-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole,
          jobDescription: jobDescription || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to improve resume");
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!suggestions) return;
    const text = `
PROFESSIONAL SUMMARY
${suggestions.summary}

WORK EXPERIENCE
${suggestions.experience.map(exp =>
  `${exp.role} at ${exp.company}\n${exp.bullets.map(b => `• ${b}`).join("\n")}`
).join("\n\n")}

SKILLS
${suggestions.skills.join(", ")}
`.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Tools", href: "/#tools" }, { label: "Resume Builder" }]} />

          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-aurora/40 bg-aurora/10 text-aurora">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                AI Resume Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Free ATS resume maker with AI tailoring — no signup required
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Input Panel */}
            <div className="space-y-4">
              {/* Resume Text */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Upload className="h-4 w-4 text-aurora" />
                  Your Resume
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste your current resume text (or LinkedIn profile text)
                </p>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here...&#10;&#10;Example:&#10;John Doe&#10;Software Developer&#10;email@example.com&#10;&#10;Experience:&#10;TechCorp - Developer (2022-present)&#10;Built React dashboards..."
                  className="mt-3 h-48 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
                />
              </div>

              {/* Target Role */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Target className="h-4 w-4 text-aurora" />
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Software Developer, UX Designer, Data Analyst"
                  className="mt-3 h-10 w-full rounded-lg border border-border bg-ink/40 px-3 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
                />
              </div>

              {/* Job Description */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-aurora" />
                  Job Description <span className="text-muted-foreground font-normal">(optional but recommended)</span>
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste the JD to tailor your resume with ATS keywords
                </p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here...&#10;&#10;AI will extract keywords and tailor your resume to match."
                  className="mt-3 h-32 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-coral">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                onClick={handleImprove}
                disabled={loading}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-4 text-sm font-semibold text-primary-foreground block-shadow-aurora transition-all hover:bg-aurora-soft disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI improving resume...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Improve with AI
                  </>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {suggestions ? (
                <>
                  {/* Summary */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-aurora" />
                      Improved Summary
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{suggestions.summary}</p>
                  </div>

                  {/* Experience */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Briefcase className="h-4 w-4 text-aurora" />
                      Improved Experience
                    </h3>
                    <div className="mt-3 space-y-4">
                      {suggestions.experience.map((exp, i) => (
                        <div key={i}>
                          <p className="text-sm font-bold">{exp.role} at {exp.company}</p>
                          <ul className="mt-1 space-y-1">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="text-xs text-muted-foreground">
                                • {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold">Improved Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {suggestions.skills.map((s, i) => (
                        <span key={i} className="rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 text-xs font-medium text-aurora">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ATS Keywords */}
                  {suggestions.atsKeywordsAdded.length > 0 && (
                    <div className="rounded-xl border border-star/40 bg-star/[0.04] p-5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <Check className="h-4 w-4 text-star" />
                        ATS Keywords Added
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {suggestions.atsKeywordsAdded.map((k, i) => (
                          <span key={i} className="rounded-md border border-star/40 bg-star/10 px-2 py-0.5 text-xs font-medium text-star">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.suggestions.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h3 className="text-sm font-semibold">Tips</h3>
                      <ul className="mt-2 space-y-1">
                        {suggestions.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-aurora/40 bg-aurora/10 px-4 text-sm font-semibold text-aurora hover:bg-aurora/20"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy Resume"}
                    </button>
                    <a
                      href="/tools/cover-letter-generator"
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:border-aurora/40"
                    >
                      <Mail className="h-4 w-4" />
                      Cover Letter
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Paste your resume and click <strong>Improve with AI</strong> to see suggestions here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="/tools/cover-letter-generator"
              className="group flex items-center justify-between rounded-xl border border-star/30 bg-star/[0.04] p-5 transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="font-display text-base font-bold">Next: Cover Letter →</h3>
                <p className="text-xs text-muted-foreground">Generate a tailored cover letter</p>
              </div>
              <ArrowRight className="h-5 w-5 text-star transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/tools/interview-prep"
              className="group flex items-center justify-between rounded-xl border border-teal/30 bg-teal/[0.04] p-5 transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="font-display text-base font-bold">Next: Interview Prep →</h3>
                <p className="text-xs text-muted-foreground">Practice with AI mock interview</p>
              </div>
              <Mic className="h-5 w-5 text-teal" />
            </a>
          </div>

          {/* FAQs */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold">Resume Builder FAQs</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                  <h3 className="font-display text-sm font-bold">{faq.question}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <FAQSchema faqs={faqs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
