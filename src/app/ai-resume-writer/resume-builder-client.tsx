"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Wrench,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
  FileText,
  Layout,
  Palette,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Template designs
const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, minimal with accent color",
    accent: "aurora",
    preview: "border-l-4 border-aurora",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
    accent: "star",
    preview: "border-l-4 border-star",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold header with color blocks",
    accent: "nebula",
    preview: "border-l-4 border-nebula",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Developer-focused with skills sidebar",
    accent: "teal",
    preview: "border-l-4 border-teal",
  },
];

// Cover letter designs
const coverLetterDesigns = [
  { id: "formal", name: "Formal Letter", emoji: "📋" },
  { id: "modern", name: "Modern Email", emoji: "📧" },
  { id: "creative", name: "Creative Brief", emoji: "✨" },
];

type GeneratedData = {
  resume: {
    summary: string;
    experience: Array<{
      role: string;
      company: string;
      duration: string;
      bullets: string[];
    }>;
    education: string;
    skills: string[];
    certifications: string;
  };
  coverLetter: string;
  suggestedSkills: string[];
  atsScore: number;
  atsTips: string[];
};

export function ResumeBuilder() {
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [template, setTemplate] = useState("modern");
  const [coverDesign, setCoverDesign] = useState("formal");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover">("resume");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    targetRole: "",
  });

  const handleGenerate = async () => {
    setStep("generating");
    try {
      const response = await fetch("/api/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tone,
          template,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        setStep("result");
      } else {
        alert(data.error || "Something went wrong");
        setStep("form");
      }
    } catch {
      alert("Network error. Please try again.");
      setStep("form");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `=== RESUME ===\n\n${formData.fullName}\n${formData.jobTitle}\n${formData.email} | ${formData.phone} | ${formData.location}\n\nSUMMARY\n${result.resume.summary}\n\nEXPERIENCE\n${result.resume.experience
      .map((e) => `${e.role} at ${e.company} (${e.duration})\n${e.bullets.map((b) => `• ${b}`).join("\n")}`)
      .join("\n\n")}\n\nEDUCATION\n${result.resume.education}\n\nSKILLS\n${result.resume.skills.join(", ")}\n\n=== COVER LETTER ===\n\n${result.coverLetter}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.fullName || "resume"}-resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTemplate = templates.find((t) => t.id === template)!;

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-md border border-aurora/40 bg-aurora/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <Sparkles className="h-3.5 w-3.5" />
            Free AI Tool
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            AI Powered Resume Builder
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Create a professional, ATS-optimized resume and cover letter in seconds.
            Choose your design, fill in your details, and let AI do the rest. No signup required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">✅ 100% Free</span>
            <span className="inline-flex items-center gap-1">✅ No Signup</span>
            <span className="inline-flex items-center gap-1">✅ ATS-Optimized</span>
            <span className="inline-flex items-center gap-1">✅ Cover Letter Included</span>
            <span className="inline-flex items-center gap-1">✅ 4 Templates</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* === FORM STEP === */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Template Selector */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <Layout className="h-5 w-5 text-aurora" />
                  Choose Your Resume Design
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5",
                        template === t.id
                          ? "border-aurora/60 bg-aurora/10 ring-2 ring-aurora/30"
                          : "border-border bg-card"
                      )}
                    >
                      <div className={cn("mb-3 h-16 rounded-lg bg-ink/60", t.preview)}>
                        <div className="flex h-full flex-col gap-1 p-2">
                          <div className="h-2 w-3/4 rounded bg-foreground/20" />
                          <div className="h-1.5 w-1/2 rounded bg-foreground/10" />
                          <div className="mt-1 h-1 w-full rounded bg-foreground/10" />
                          <div className="h-1 w-2/3 rounded bg-foreground/10" />
                        </div>
                      </div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover Letter Design */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <FileText className="h-5 w-5 text-star" />
                  Cover Letter Design
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {coverLetterDesigns.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setCoverDesign(d.id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all",
                        coverDesign === d.id
                          ? "border-star/60 bg-star/10 text-star"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-lg">{d.emoji}</span>
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <Palette className="h-5 w-5 text-nebula" />
                  Writing Tone
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["professional", "confident", "friendly", "concise"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                        tone === t
                          ? "border-nebula/60 bg-nebula/10 text-nebula"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="rounded-xl border border-border bg-card/70 p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                  <User className="h-5 w-5 text-aurora" />
                  Your Information
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill in what you have. AI will enhance and fill gaps automatically.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <InputField icon={User} label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={(v) => setFormData({ ...formData, fullName: v })} />
                  <InputField icon={Briefcase} label="Current/Target Job Title" placeholder="Software Engineer" value={formData.jobTitle} onChange={(v) => setFormData({ ...formData, jobTitle: v })} />
                  <InputField icon={Mail} label="Email" placeholder="john@example.com" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                  <InputField icon={Phone} label="Phone" placeholder="+1 234 567 890" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
                  <InputField icon={MapPin} label="Location" placeholder="San Francisco, CA" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
                  <InputField icon={Briefcase} label="Target Role (for cover letter)" placeholder="Senior Software Engineer at Google" value={formData.targetRole} onChange={(v) => setFormData({ ...formData, targetRole: v })} />
                </div>

                {/* Big text fields */}
                <div className="mt-4 space-y-4">
                  <TextAreaField
                    icon={FileText}
                    label="Professional Summary (optional — AI will generate if empty)"
                    placeholder="5 years of experience in full-stack development..."
                    value={formData.summary}
                    onChange={(v) => setFormData({ ...formData, summary: v })}
                    rows={2}
                  />
                  <TextAreaField
                    icon={Briefcase}
                    label="Work Experience (paste your current resume or describe your roles)"
                    placeholder={"Software Engineer at Tech Corp (2022-Present)\n- Built React dashboard serving 10K+ users\n- Led migration to Next.js\n\nJunior Dev at StartupCo (2020-2022)\n- Developed REST APIs in Node.js"}
                    value={formData.experience}
                    onChange={(v) => setFormData({ ...formData, experience: v })}
                    rows={6}
                  />
                  <TextAreaField
                    icon={GraduationCap}
                    label="Education"
                    placeholder="B.Tech in Computer Science, IIT Delhi (2016-2020)"
                    value={formData.education}
                    onChange={(v) => setFormData({ ...formData, education: v })}
                    rows={2}
                  />
                  <TextAreaField
                    icon={Wrench}
                    label="Skills (comma separated)"
                    placeholder="React, Node.js, Python, AWS, Docker, TypeScript"
                    value={formData.skills}
                    onChange={(v) => setFormData({ ...formData, skills: v })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!formData.fullName && !formData.jobTitle}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-aurora/50 bg-aurora px-6 font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-y-0.5 hover:bg-aurora-soft disabled:translate-y-0 disabled:opacity-40"
              >
                <Wand2 className="h-5 w-5" />
                Generate My Resume + Cover Letter
                <Sparkles className="h-4 w-4" />
              </button>
              {(!formData.fullName && !formData.jobTitle) && (
                <p className="text-center text-xs text-muted-foreground">
                  Enter at least your name or job title to continue
                </p>
              )}
            </motion.div>
          )}

          {/* === GENERATING STEP === */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-aurora/40 bg-aurora/10">
                  <Loader2 className="h-10 w-10 animate-spin text-aurora" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-aurora" />
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">Building your resume...</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI is writing your summary, enhancing experience bullets, and crafting a cover letter.
              </p>
              <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
                <span className="animate-pulse">✍️ Writing summary</span>
                <span className="animate-pulse" style={{ animationDelay: "0.5s" }}>📊 Optimizing for ATS</span>
                <span className="animate-pulse" style={{ animationDelay: "1s" }}>💌 Crafting cover letter</span>
              </div>
            </motion.div>
          )}

          {/* === RESULT STEP === */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* ATS Score */}
              <div className={cn("rounded-xl border p-4", selectedTemplate.preview)}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ATS Score</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-display text-3xl font-bold text-aurora">{result.atsScore}</span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(activeTab === "resume" ? JSON.stringify(result.resume, null, 2) : result.coverLetter)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:text-foreground"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-aurora" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-aurora/50 bg-aurora px-3 text-xs font-semibold text-primary-foreground hover:bg-aurora-soft"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                    <button
                      onClick={() => { setStep("form"); setResult(null); }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:text-foreground"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
                {result.atsTips && result.atsTips.length > 0 && (
                  <div className="mt-3 border-t border-border/60 pt-3">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">ATS Tips</span>
                    <ul className="mt-1 space-y-1">
                      {result.atsTips.slice(0, 3).map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tabs: Resume / Cover Letter */}
              <div className="inline-flex gap-1 rounded-lg border border-border bg-card/60 p-1">
                <button
                  onClick={() => setActiveTab("resume")}
                  className={cn("inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all",
                    activeTab === "resume" ? "bg-aurora/15 text-aurora" : "text-muted-foreground")}
                >
                  <FileText className="h-4 w-4" />
                  Resume
                </button>
                <button
                  onClick={() => setActiveTab("cover")}
                  className={cn("inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-all",
                    activeTab === "cover" ? "bg-star/15 text-star" : "text-muted-foreground")}
                >
                  <Mail className="h-4 w-4" />
                  Cover Letter
                </button>
              </div>

              {/* Resume Preview */}
              {activeTab === "resume" && (
                <div className={cn("rounded-xl border bg-card p-6", selectedTemplate.preview)}>
                  {/* Header */}
                  <div className="border-b border-border pb-4">
                    <h2 className="font-display text-2xl font-bold">{formData.fullName || "Your Name"}</h2>
                    <p className="text-sm text-aurora">{formData.jobTitle || result.resume.summary?.slice(0, 40)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[formData.email, formData.phone, formData.location].filter(Boolean).join(" | ")}
                    </p>
                  </div>

                  {/* Summary */}
                  {result.resume.summary && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary</h3>
                      <p className="mt-1 text-sm text-foreground/90">{result.resume.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {result.resume.experience && result.resume.experience.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</h3>
                      <div className="mt-2 space-y-3">
                        {result.resume.experience.map((exp, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">{exp.role}</span>
                              <span className="text-xs text-muted-foreground">{exp.duration}</span>
                            </div>
                            <span className="text-xs text-aurora">{exp.company}</span>
                            <ul className="mt-1 space-y-1">
                              {exp.bullets?.map((b, j) => (
                                <li key={j} className="text-xs text-foreground/90">• {b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {result.resume.education && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education</h3>
                      <p className="mt-1 text-sm text-foreground/90">{result.resume.education}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {result.resume.skills && result.resume.skills.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {result.resume.skills.map((s, i) => (
                          <span key={i} className="rounded-md border border-border bg-ink/40 px-2 py-0.5 text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Skills */}
                  {result.suggestedSkills && result.suggestedSkills.length > 0 && (
                    <div className="mt-4 rounded-lg border border-star/30 bg-star/[0.04] p-3">
                      <h4 className="text-[10px] font-bold uppercase text-star">💡 Suggested Skills to Add</h4>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {result.suggestedSkills.map((s, i) => (
                          <span key={i} className="rounded-md border border-star/30 bg-star/10 px-2 py-0.5 text-xs text-star">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cover Letter Preview */}
              {activeTab === "cover" && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 border-b border-border pb-3">
                    <h3 className="font-display text-lg font-bold">
                      {coverLetterDesigns.find((d) => d.id === coverDesign)?.emoji} {coverLetterDesigns.find((d) => d.id === coverDesign)?.name}
                    </h3>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {result.coverLetter || "No cover letter generated. Please try again."}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
                <h3 className="font-display text-lg font-bold">Want a professional to review it?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compare the best AI resume tools and pick one for premium templates.
                </p>
                <a
                  href="/best-ai-tools-2026"
                  className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
                >
                  <Sparkles className="h-4 w-4" />
                  See Best AI Resume Tools 2026
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

// ─── Input Components ────────────────────────────────────────────

function InputField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-border bg-ink/50 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
        />
      </div>
    </div>
  );
}

function TextAreaField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  icon: any;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-lg border border-border bg-ink/50 pl-9 pr-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25"
        />
      </div>
    </div>
  );
}
