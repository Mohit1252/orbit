"use client";

import { useState } from "react";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import {
  Mail, Wand2, Loader2, Copy, Check, Download, Briefcase, Building2,
  User, AlertCircle, ArrowRight, FileText, Mic,
} from "lucide-react";

const faqs = [
  {
    question: "Is the AI cover letter generator free?",
    answer: "Yes — completely free. No credit card, no signup required. You can generate, edit, and copy cover letters without paying.",
  },
  {
    question: "How does AI generate cover letters?",
    answer: "Paste your resume summary and the job description. Our AI (powered by Claude) analyzes both, identifies key requirements, and writes a personalized cover letter that connects your experience to the role. It includes company-specific details and a strong call to action.",
  },
  {
    question: "Can I choose the tone of my cover letter?",
    answer: "Yes — you can choose from 4 tones: Formal (corporate), Friendly (casual), Startup (modern), and Creative (designer). Pick the tone that matches the company culture.",
  },
  {
    question: "How long should a cover letter be?",
    answer: "We recommend 300 words (Medium) — about 3-4 paragraphs on one page. You can choose Short (200 words) for quick applications or Long (400 words) for detailed roles.",
  },
  {
    question: "Can I edit the generated cover letter?",
    answer: "Yes — the generated letter is fully editable. You can modify any part, change the tone, regenerate with different settings, or copy it to your preferred editor.",
  },
];

export function CoverLetterClient() {
  const [resumeSummary, setResumeSummary] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState(300);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resumeSummary.trim() || !jobDescription.trim() || !companyName.trim()) {
      setError("Please fill in resume summary, job description, and company name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeSummary,
          jobDescription,
          companyName,
          hiringManager: hiringManager || undefined,
          role: role || undefined,
          tone,
          length,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate cover letter");

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
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
          <Breadcrumbs items={[{ label: "Tools", href: "/#tools" }, { label: "Cover Letter Generator" }]} />

          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-star/40 bg-star/10 text-star">
              <Mail className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                AI Cover Letter Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Free personalized cover letters — no signup required
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Input Panel */}
            <div className="space-y-4">
              {/* Resume Summary */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-star" />
                  Your Resume Summary
                </label>
                <textarea
                  value={resumeSummary}
                  onChange={(e) => setResumeSummary(e.target.value)}
                  placeholder="Paste your resume summary or key experience here...&#10;&#10;Example: Software Developer with 3+ years building React/Node.js apps. Built dashboard serving 10K+ users. AWS certified."
                  className="mt-3 h-32 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                />
              </div>

              {/* Job Description */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-star" />
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="mt-3 h-32 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                />
              </div>

              {/* Company + Role */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4 text-star" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, TechCorp"
                    className="mt-3 h-10 w-full rounded-lg border border-border bg-ink/40 px-3 text-sm outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                  />
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-star" />
                    Hiring Manager <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                    placeholder="e.g., Sarah Johnson"
                    className="mt-3 h-10 w-full rounded-lg border border-border bg-ink/40 px-3 text-sm outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="text-sm font-semibold">Role / Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Software Developer"
                  className="mt-3 h-10 w-full rounded-lg border border-border bg-ink/40 px-3 text-sm outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                />
              </div>

              {/* Tone + Length */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="text-sm font-semibold">Tone</label>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["formal", "friendly", "startup", "creative"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`h-9 rounded-md border text-xs font-semibold capitalize transition-all ${
                          tone === t
                            ? "border-star/50 bg-star/15 text-star"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="text-sm font-semibold">Length: {length} words</label>
                  <input
                    type="range"
                    min="200"
                    max="400"
                    step="50"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="mt-4 w-full accent-star"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>Short</span>
                    <span>Medium</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-coral">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-lg border border-star/50 bg-star px-4 text-sm font-semibold text-primary-foreground block-shadow-star transition-all hover:bg-star/80 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating cover letter...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              {coverLetter ? (
                <>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <Check className="h-4 w-4 text-star" />
                        Your Cover Letter
                      </h3>
                      <button
                        onClick={handleCopy}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-star/40 bg-star/10 px-3 text-xs font-semibold text-star hover:bg-star/20"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="mt-3 h-[500px] w-full resize-none rounded-lg border border-border bg-ink/40 p-4 text-sm leading-relaxed outline-none focus:border-star/60 focus:ring-2 focus:ring-star/25"
                    />
                  </div>

                  <div className="flex gap-2">
                    <a
                      href="/tools/interview-prep"
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-teal/40 bg-teal/10 px-4 text-sm font-semibold text-teal hover:bg-teal/20"
                    >
                      <Mic className="h-4 w-4" />
                      Interview Prep
                    </a>
                    <a
                      href="/tools/resume-builder"
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:border-star/40"
                    >
                      <FileText className="h-4 w-4" />
                      Build Resume
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-8 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Fill in the details and click <strong>Generate Cover Letter</strong> to see your personalized letter here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold">Cover Letter Generator FAQs</h2>
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
