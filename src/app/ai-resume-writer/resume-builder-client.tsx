"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Wrench,
  Sparkles, Download, Copy, Check, Loader2, FileText, Palette,
  Wand2, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Template designs — each has a full visual style
const templates = [
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Sleek dark theme with accent",
    headerBg: "bg-ink",
    headerText: "text-white",
    accentColor: "text-aurora",
    accentBar: "bg-aurora",
    bodyBg: "bg-card",
    bodyText: "text-foreground",
    sectionTitle: "text-aurora",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean white with blue accent",
    headerBg: "bg-white",
    headerText: "text-gray-900",
    accentColor: "text-blue-600",
    accentBar: "bg-blue-600",
    bodyBg: "bg-white",
    bodyText: "text-gray-800",
    sectionTitle: "text-blue-600",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold sidebar with color blocks",
    headerBg: "bg-gradient-to-r from-purple-900 to-pink-800",
    headerText: "text-white",
    accentColor: "text-pink-400",
    accentBar: "bg-pink-500",
    bodyBg: "bg-gray-50",
    bodyText: "text-gray-800",
    sectionTitle: "text-purple-700",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra clean, lots of whitespace",
    headerBg: "bg-white",
    headerText: "text-gray-900",
    accentColor: "text-gray-700",
    accentBar: "bg-gray-800",
    bodyBg: "bg-white",
    bodyText: "text-gray-700",
    sectionTitle: "text-gray-900",
  },
];

type GeneratedData = {
  resume: {
    summary: string;
    experience: Array<{ role: string; company: string; duration: string; bullets: string[] }>;
    education: string;
    skills: string[];
  };
  coverLetter: string;
  suggestedSkills: string[];
  atsScore: number;
  atsTips: string[];
};

export function ResumeBuilder() {
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [templateId, setTemplateId] = useState("modern-dark");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover">("resume");
  const printRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: "", jobTitle: "", email: "", phone: "", location: "",
    summary: "", experience: "", education: "", skills: "", targetRole: "",
  });

  const tpl = templates.find((t) => t.id === templateId)!;

  const handleGenerate = async () => {
    setStep("generating");
    try {
      const res = await fetch("/api/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tone, template: templateId }),
      });
      const data = await res.json();
      if (data.success) { setResult(data.data); setStep("result"); }
      else { alert(data.error); setStep("form"); }
    } catch { alert("Network error"); setStep("form"); }
  };

  const handlePrint = () => window.print();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-16">
      <section className="border-b border-border bg-ink/40">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-md border border-aurora/40 bg-aurora/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <Sparkles className="h-3.5 w-3.5" /> Free AI Tool
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">AI Powered Resume Builder</h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Create a professional, ATS-optimized resume and cover letter in seconds. Choose your design, fill in your details, and let AI do the rest. No signup required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>✅ 100% Free</span><span>✅ No Signup</span><span>✅ ATS-Optimized</span>
            <span>✅ 4 Professional Templates</span><span>✅ PDF Export</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* === FORM === */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Template Selector */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Palette className="h-5 w-5 text-aurora" /> Choose Your Resume Design</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => setTemplateId(t.id)}
                      className={cn("rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5",
                        templateId === t.id ? "border-aurora/60 bg-aurora/10 ring-2 ring-aurora/30" : "border-border bg-card")}>
                      {/* Mini preview */}
                      <div className={cn("mb-3 overflow-hidden rounded-lg", t.headerBg)}>
                        <div className="p-2">
                          <div className={cn("h-2 w-3/4 rounded-full bg-current opacity-60", t.headerText)} />
                          <div className="mt-1 h-1 w-1/2 rounded-full bg-current opacity-30" />
                        </div>
                        <div className={cn("flex gap-1 p-2", t.bodyBg)}>
                          <div className="flex-1 space-y-1">
                            <div className={cn("h-1.5 w-full rounded bg-current opacity-15", t.bodyText)} />
                            <div className={cn("h-1.5 w-5/6 rounded bg-current opacity-15", t.bodyText)} />
                          </div>
                          <div className={cn("w-1/3 space-y-1")}>
                            <div className={cn("h-1.5 w-full rounded", t.accentBar, "opacity-40")} />
                            <div className={cn("h-1.5 w-full rounded bg-current opacity-15", t.bodyText)} />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold"><FileText className="h-5 w-5 text-star" /> Writing Tone</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["professional", "confident", "friendly", "concise"].map((t) => (
                    <button key={t} onClick={() => setTone(t)}
                      className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                        tone === t ? "border-star/60 bg-star/10 text-star" : "border-border bg-card text-muted-foreground hover:text-foreground")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="rounded-xl border border-border bg-card/70 p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold"><User className="h-5 w-5 text-aurora" /> Your Information</h2>
                <p className="mt-1 text-xs text-muted-foreground">Fill in what you have. AI will enhance and fill gaps.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field icon={User} label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={(v) => setFormData({ ...formData, fullName: v })} />
                  <Field icon={Briefcase} label="Job Title" placeholder="Software Engineer" value={formData.jobTitle} onChange={(v) => setFormData({ ...formData, jobTitle: v })} />
                  <Field icon={Mail} label="Email" placeholder="john@example.com" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                  <Field icon={Phone} label="Phone" placeholder="+1 234 567 890" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
                  <Field icon={MapPin} label="Location" placeholder="San Francisco, CA" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
                  <Field icon={Briefcase} label="Target Role" placeholder="Senior Engineer at Google" value={formData.targetRole} onChange={(v) => setFormData({ ...formData, targetRole: v })} />
                </div>
                <div className="mt-4 space-y-4">
                  <Area icon={FileText} label="Summary (optional)" placeholder="5 years experience in..." value={formData.summary} onChange={(v) => setFormData({ ...formData, summary: v })} rows={2} />
                  <Area icon={Briefcase} label="Work Experience" placeholder={"Software Engineer at Tech Corp (2022-Present)\n- Built React dashboard\n- Led migration to Next.js"} value={formData.experience} onChange={(v) => setFormData({ ...formData, experience: v })} rows={6} />
                  <Area icon={GraduationCap} label="Education" placeholder="B.Tech CS, IIT Delhi (2016-2020)" value={formData.education} onChange={(v) => setFormData({ ...formData, education: v })} rows={2} />
                  <Area icon={Wrench} label="Skills (comma separated)" placeholder="React, Node.js, Python, AWS" value={formData.skills} onChange={(v) => setFormData({ ...formData, skills: v })} rows={2} />
                </div>
              </div>

              <button onClick={handleGenerate} disabled={!formData.fullName && !formData.jobTitle}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-aurora/50 bg-aurora px-6 font-semibold text-primary-foreground block-shadow-aurora transition-all hover:-translate-y-0.5 hover:bg-aurora-soft disabled:opacity-40">
                <Wand2 className="h-5 w-5" /> Generate My Resume + Cover Letter <Sparkles className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* === GENERATING === */}
          {step === "generating" && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border border-aurora/40 bg-aurora/10">
                <Loader2 className="h-10 w-10 animate-spin text-aurora" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">Building your resume...</h3>
              <p className="mt-2 text-sm text-muted-foreground">AI is writing your summary, enhancing bullets, and crafting a cover letter.</p>
            </motion.div>
          )}

          {/* === RESULT === */}
          {step === "result" && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Action bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("grid h-12 w-12 place-items-center rounded-lg", tpl.accentBar, "opacity-80")}>
                    <span className="text-xl font-bold text-white">{result.atsScore}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-muted-foreground">ATS Score</div>
                    <div className="text-sm font-semibold">{result.atsScore >= 80 ? "Excellent — ATS ready!" : result.atsScore >= 60 ? "Good — minor improvements needed" : "Needs work"}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(activeTab === "resume" ? result.resume.summary : result.coverLetter)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:text-foreground">
                    {copied ? <Check className="h-3.5 w-3.5 text-aurora" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={handlePrint} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-aurora/50 bg-aurora px-3 text-xs font-semibold text-primary-foreground hover:bg-aurora-soft">
                    <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                  </button>
                  <button onClick={() => { setStep("form"); setResult(null); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:text-foreground">
                    <Wand2 className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>

              {/* ATS Tips */}
              {result.atsTips?.length > 0 && (
                <div className="rounded-lg border border-aurora/30 bg-aurora/[0.04] p-3">
                  <span className="text-[10px] font-bold uppercase text-aurora">💡 ATS Tips</span>
                  <ul className="mt-1 space-y-0.5">{result.atsTips.slice(0, 3).map((t, i) => <li key={i} className="text-xs text-muted-foreground">• {t}</li>)}</ul>
                </div>
              )}

              {/* Tab switcher */}
              <div className="inline-flex gap-1 rounded-lg border border-border bg-card/60 p-1">
                <button onClick={() => setActiveTab("resume")} className={cn("inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold", activeTab === "resume" ? "bg-aurora/15 text-aurora" : "text-muted-foreground")}>
                  <FileText className="h-4 w-4" /> Resume
                </button>
                <button onClick={() => setActiveTab("cover")} className={cn("inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold", activeTab === "cover" ? "bg-star/15 text-star" : "text-muted-foreground")}>
                  <Mail className="h-4 w-4" /> Cover Letter
                </button>
              </div>

              {/* === RESUME PREVIEW (Professional Design) === */}
              {activeTab === "resume" && (
                <div ref={printRef} className="overflow-hidden rounded-xl border border-border shadow-2xl print:border-0 print:shadow-none">
                  {/* Header */}
                  <div className={cn("p-6", tpl.headerBg)}>
                    <h2 className={cn("font-display text-3xl font-bold", tpl.headerText)}>{formData.fullName || "Your Name"}</h2>
                    <p className={cn("mt-1 text-lg", tpl.accentColor)}>{formData.jobTitle || "Professional"}</p>
                    <div className={cn("mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs", tpl.headerText, "opacity-80")}>
                      {formData.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {formData.email}</span>}
                      {formData.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {formData.phone}</span>}
                      {formData.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {formData.location}</span>}
                    </div>
                  </div>

                  {/* Body */}
                  <div className={cn("p-6", tpl.bodyBg)}>
                    {/* Summary */}
                    {result.resume.summary && (
                      <Section title="SUMMARY" tpl={tpl}>
                        <p className="text-sm leading-relaxed">{result.resume.summary}</p>
                      </Section>
                    )}

                    {/* Experience */}
                    {result.resume.experience?.length > 0 && (
                      <Section title="EXPERIENCE" tpl={tpl}>
                        <div className="space-y-4">
                          {result.resume.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex items-baseline justify-between">
                                <span className="text-sm font-bold">{exp.role}</span>
                                <span className="text-xs text-muted-foreground">{exp.duration}</span>
                              </div>
                              <span className={cn("text-xs font-semibold", tpl.accentColor)}>{exp.company}</span>
                              <ul className="mt-1 space-y-1">
                                {exp.bullets?.map((b, j) => (
                                  <li key={j} className="flex gap-2 text-xs leading-relaxed">
                                    <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", tpl.accentBar)} />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Education */}
                    {result.resume.education && (
                      <Section title="EDUCATION" tpl={tpl}>
                        <p className="text-sm">{result.resume.education}</p>
                      </Section>
                    )}

                    {/* Skills */}
                    {result.resume.skills?.length > 0 && (
                      <Section title="SKILLS" tpl={tpl}>
                        <div className="flex flex-wrap gap-1.5">
                          {result.resume.skills.map((s, i) => (
                            <span key={i} className={cn("rounded-md border px-2 py-0.5 text-xs", tpl.accentBar ? cn("border-current opacity-70", tpl.bodyText) : "border-border")}>{s}</span>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Suggested Skills */}
                    {result.suggestedSkills?.length > 0 && (
                      <div className={cn("mt-4 rounded-lg border p-3", tpl.bodyBg === "bg-white" ? "border-amber-200 bg-amber-50" : "border-star/30 bg-star/[0.04]")}>
                        <h4 className="text-[10px] font-bold uppercase opacity-60">💡 Suggested Skills to Add</h4>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {result.suggestedSkills.map((s, i) => <span key={i} className="rounded-md border border-star/30 bg-star/10 px-2 py-0.5 text-xs text-star">+ {s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* === COVER LETTER PREVIEW === */}
              {activeTab === "cover" && (
                <div className="overflow-hidden rounded-xl border border-border shadow-2xl print:border-0 print:shadow-none">
                  <div className={cn("p-6", tpl.headerBg)}>
                    <h3 className={cn("font-display text-xl font-bold", tpl.headerText)}>Cover Letter</h3>
                  </div>
                  <div className={cn("p-6", tpl.bodyBg)}>
                    <div className={cn("whitespace-pre-wrap text-sm leading-relaxed", tpl.bodyText)}>
                      {result.coverLetter || "No cover letter generated."}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
                <h3 className="font-display text-lg font-bold">Compare premium resume tools</h3>
                <p className="mt-1 text-sm text-muted-foreground">See the best AI resume builders with more templates and features.</p>
                <a href="/best-ai-tools-2026" className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-5 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft">
                  <Sparkles className="h-4 w-4" /> Best AI Resume Tools 2026
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────
function Section({ title, tpl, children }: { title: string; tpl: typeof templates[0]; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className={cn("h-3 w-1 rounded-full", tpl.accentBar)} />
        <h3 className={cn("text-xs font-bold uppercase tracking-wider", tpl.sectionTitle)}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Input Fields ────────────────────────────────────────────
function Field({ icon: Icon, label, placeholder, value, onChange }: any) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-border bg-ink/50 pl-9 pr-3 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25" />
      </div>
    </div>
  );
}

function Area({ icon: Icon, label, placeholder, value, onChange, rows = 3 }: any) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          className="w-full rounded-lg border border-border bg-ink/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-aurora/60 focus:ring-2 focus:ring-aurora/25" />
      </div>
    </div>
  );
}
