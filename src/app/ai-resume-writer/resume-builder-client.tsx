"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Wrench,
  Sparkles, Download, Copy, Check, Loader2, FileText, Palette,
  Wand2, Printer, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Template definitions — each has a DIFFERENT LAYOUT (not just colors)
const templates = [
  { id: "classic-word", name: "Classic Word", emoji: "📝", desc: "Traditional single-column" },
  { id: "modern-sidebar", name: "Modern Sidebar", emoji: "📊", desc: "Left sidebar + main content" },
  { id: "executive", name: "Executive", emoji: "👔", desc: "Centered header + clean body" },
  { id: "two-column", name: "Two Column", emoji: "📰", desc: "Split experience & skills" },
  { id: "tech-modern", name: "Tech Modern", emoji: "💻", desc: "Dark header + code-style" },
  { id: "creative-bold", name: "Creative Bold", emoji: "🎨", desc: "Color blocks + bold accents" },
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
  const [templateId, setTemplateId] = useState("classic-word");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState<GeneratedData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "cover">("resume");
  const printRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: "", jobTitle: "", email: "", phone: "", location: "",
    summary: "", experience: "", education: "", skills: "", targetRole: "",
  });

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
            Choose from 6 professional templates (like MS Word), fill in your details, and AI builds a polished, ATS-optimized resume. No signup required.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>✅ 100% Free</span><span>✅ No Signup</span><span>✅ ATS-Optimized</span>
            <span>✅ 6 Professional Templates</span><span>✅ PDF Export</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* === FORM === */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Template Selector — MS Office style grid */}
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold"><Palette className="h-5 w-5 text-aurora" /> Choose a Template</h2>
                <p className="mt-1 text-xs text-muted-foreground">Pick a design — like choosing a Word template. Your data fills in automatically.</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => setTemplateId(t.id)}
                      className={cn("group rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5",
                        templateId === t.id ? "border-aurora/60 bg-aurora/10 ring-2 ring-aurora/30" : "border-border bg-card hover:border-aurora/40")}>
                      {/* Mini layout preview */}
                      <TemplatePreview templateId={t.id} />
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg">{t.emoji}</span>
                        <div>
                          <div className="text-sm font-bold">{t.name}</div>
                          <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                        </div>
                      </div>
                      {templateId === t.id && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-aurora">
                          <Check className="h-3 w-3" /> Selected
                        </div>
                      )}
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
                  <Field icon={User} label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={(v: string) => setFormData({ ...formData, fullName: v })} />
                  <Field icon={Briefcase} label="Job Title" placeholder="Software Engineer" value={formData.jobTitle} onChange={(v: string) => setFormData({ ...formData, jobTitle: v })} />
                  <Field icon={Mail} label="Email" placeholder="john@example.com" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                  <Field icon={Phone} label="Phone" placeholder="+1 234 567 890" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                  <Field icon={MapPin} label="Location" placeholder="San Francisco, CA" value={formData.location} onChange={(v: string) => setFormData({ ...formData, location: v })} />
                  <Field icon={Briefcase} label="Target Role" placeholder="Senior Engineer at Google" value={formData.targetRole} onChange={(v: string) => setFormData({ ...formData, targetRole: v })} />
                </div>
                <div className="mt-4 space-y-4">
                  <Area icon={FileText} label="Summary (optional)" placeholder="5 years experience in..." value={formData.summary} onChange={(v: string) => setFormData({ ...formData, summary: v })} rows={2} />
                  <Area icon={Briefcase} label="Work Experience" placeholder={"Software Engineer at Tech Corp (2022-Present)\n- Built React dashboard\n- Led migration to Next.js"} value={formData.experience} onChange={(v: string) => setFormData({ ...formData, experience: v })} rows={6} />
                  <Area icon={GraduationCap} label="Education" placeholder="B.Tech CS, IIT Delhi (2016-2020)" value={formData.education} onChange={(v: string) => setFormData({ ...formData, education: v })} rows={2} />
                  <Area icon={Wrench} label="Skills (comma separated)" placeholder="React, Node.js, Python, AWS" value={formData.skills} onChange={(v: string) => setFormData({ ...formData, skills: v })} rows={2} />
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
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-aurora text-white">
                    <span className="text-xl font-bold">{result.atsScore}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-muted-foreground">ATS Score</div>
                    <div className="text-sm font-semibold">{result.atsScore >= 80 ? "Excellent — ATS ready!" : result.atsScore >= 60 ? "Good — minor improvements" : "Needs work"}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(activeTab === "resume" ? JSON.stringify(result.resume) : result.coverLetter)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:text-foreground">
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

              {/* === RESUME PREVIEW === */}
              {activeTab === "resume" && (
                <div ref={printRef} className="overflow-hidden rounded-xl border border-border shadow-2xl print:border-0 print:shadow-none print:rounded-none">
                  <ResumeTemplate templateId={templateId} data={result} user={formData} />
                </div>
              )}

              {/* === COVER LETTER === */}
              {activeTab === "cover" && (
                <div className="overflow-hidden rounded-xl border border-border shadow-2xl print:border-0 print:shadow-none">
                  <div className="border-b-2 border-aurora bg-ink p-6">
                    <h3 className="font-display text-xl font-bold text-white">Cover Letter</h3>
                    <p className="text-xs text-muted-foreground">{formData.fullName} — {formData.jobTitle}</p>
                  </div>
                  <div className="bg-white p-6">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                      {result.coverLetter || "No cover letter generated."}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 text-center">
                <h3 className="font-display text-lg font-bold">Compare premium resume tools</h3>
                <p className="mt-1 text-sm text-muted-foreground">See the best AI resume builders with more templates.</p>
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

// ─── Template Preview (mini mockup for selector) ──────────────
function TemplatePreview({ templateId }: { templateId: string }) {
  const base = "h-20 overflow-hidden rounded-md";
  switch (templateId) {
    case "classic-word":
      return (
        <div className={cn(base, "bg-white p-1.5")}>
          <div className="border-b border-gray-300 pb-1">
            <div className="mx-auto h-1.5 w-1/2 rounded bg-gray-800" />
            <div className="mx-auto mt-0.5 h-1 w-1/3 rounded bg-gray-400" />
          </div>
          <div className="mt-1 space-y-0.5">
            <div className="h-0.5 w-full rounded bg-gray-300" />
            <div className="h-0.5 w-5/6 rounded bg-gray-200" />
            <div className="h-0.5 w-full rounded bg-gray-300" />
            <div className="h-0.5 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      );
    case "modern-sidebar":
      return (
        <div className={cn(base, "bg-white flex")}>
          <div className="w-1/3 bg-gray-800 p-1">
            <div className="h-1.5 w-full rounded bg-gray-400" />
            <div className="mt-1 space-y-0.5">
              <div className="h-0.5 w-full rounded bg-gray-500" />
              <div className="h-0.5 w-2/3 rounded bg-gray-500" />
            </div>
          </div>
          <div className="flex-1 p-1 space-y-0.5">
            <div className="h-1 w-3/4 rounded bg-gray-800" />
            <div className="h-0.5 w-full rounded bg-gray-200" />
            <div className="h-0.5 w-5/6 rounded bg-gray-200" />
            <div className="h-0.5 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      );
    case "executive":
      return (
        <div className={cn(base, "bg-white p-1.5 text-center")}>
          <div className="mx-auto h-1.5 w-2/5 rounded bg-gray-900" />
          <div className="mx-auto mt-0.5 h-0.5 w-1/3 rounded bg-gray-400" />
          <div className="mx-auto mt-0.5 h-px w-3/4 bg-gray-300" />
          <div className="mt-1 space-y-0.5 text-left">
            <div className="h-0.5 w-full rounded bg-gray-200" />
            <div className="h-0.5 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      );
    case "two-column":
      return (
        <div className={cn(base, "bg-white p-1.5")}>
          <div className="border-b border-gray-300 pb-0.5">
            <div className="h-1.5 w-1/2 rounded bg-blue-700" />
          </div>
          <div className="mt-1 flex gap-1">
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 w-full rounded bg-gray-300" />
              <div className="h-0.5 w-5/6 rounded bg-gray-200" />
            </div>
            <div className="w-1/3 space-y-0.5">
              <div className="h-0.5 w-full rounded bg-blue-200" />
              <div className="h-0.5 w-2/3 rounded bg-blue-200" />
            </div>
          </div>
        </div>
      );
    case "tech-modern":
      return (
        <div className={cn(base, "bg-gray-900 p-1.5")}>
          <div className="flex items-center gap-1 border-b border-gray-700 pb-1">
            <div className="h-1.5 w-1/3 rounded bg-teal-400" />
            <div className="h-0.5 w-1/4 rounded bg-gray-500" />
          </div>
          <div className="mt-1 space-y-0.5">
            <div className="h-0.5 w-full rounded bg-gray-600" />
            <div className="h-0.5 w-5/6 rounded bg-gray-700" />
            <div className="flex gap-0.5">
              <div className="h-1 w-3 rounded bg-teal-500" />
              <div className="h-1 w-3 rounded bg-teal-500" />
              <div className="h-1 w-3 rounded bg-teal-500" />
            </div>
          </div>
        </div>
      );
    case "creative-bold":
      return (
        <div className={cn(base, "bg-white")}>
          <div className="h-6 bg-gradient-to-r from-purple-600 to-pink-500 p-1">
            <div className="h-1 w-1/2 rounded bg-white" />
          </div>
          <div className="p-1 space-y-0.5">
            <div className="h-0.5 w-full rounded bg-gray-300" />
            <div className="h-0.5 w-3/4 rounded bg-gray-200" />
            <div className="flex gap-0.5">
              <div className="h-1 w-4 rounded bg-purple-200" />
              <div className="h-1 w-4 rounded bg-pink-200" />
            </div>
          </div>
        </div>
      );
    default:
      return <div className={base} />;
  }
}

// ─── Resume Template Renderer ─────────────────────────────────
function ResumeTemplate({ templateId, data, user }: { templateId: string; data: GeneratedData; user: any }) {
  const r = data.resume;
  const contactItems = [user.email, user.phone, user.location].filter(Boolean);

  switch (templateId) {
    // ═════════════════════════════════════════════════════════
    // TEMPLATE 1: CLASSIC WORD (Traditional single-column)
    // ═════════════════════════════════════════════════════════
    case "classic-word":
      return (
        <div className="bg-white p-8 text-gray-900">
          {/* Header — centered, classic */}
          <div className="text-center border-b-2 border-gray-800 pb-3">
            <h1 className="font-serif text-3xl font-bold tracking-wide">{user.fullName || "Your Name"}</h1>
            <p className="mt-1 text-sm text-gray-600">{user.jobTitle}</p>
            <p className="mt-1 text-xs text-gray-500">{contactItems.join(" | ")}</p>
          </div>
          {/* Sections */}
          <div className="mt-4 space-y-4">
            {r.summary && <ClassicSection title="Summary"><p className="text-sm">{r.summary}</p></ClassicSection>}
            {r.experience?.length > 0 && (
              <ClassicSection title="Experience">
                {r.experience.map((e, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between"><span className="font-bold text-sm">{e.role}</span><span className="text-xs text-gray-500">{e.duration}</span></div>
                    <p className="text-xs text-gray-600 italic">{e.company}</p>
                    <ul className="mt-0.5 list-disc pl-4">{e.bullets?.map((b, j) => <li key={j} className="text-xs">{b}</li>)}</ul>
                  </div>
                ))}
              </ClassicSection>
            )}
            {r.education && <ClassicSection title="Education"><p className="text-sm">{r.education}</p></ClassicSection>}
            {r.skills?.length > 0 && <ClassicSection title="Skills"><p className="text-sm">{r.skills.join(", ")}</p></ClassicSection>}
          </div>
        </div>
      );

    // ═════════════════════════════════════════════════════════
    // TEMPLATE 2: MODERN SIDEBAR (Left sidebar + main)
    // ═════════════════════════════════════════════════════════
    case "modern-sidebar":
      return (
        <div className="flex bg-white text-gray-900">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-900 p-5 text-white">
            <h1 className="text-xl font-bold">{user.fullName || "Name"}</h1>
            <p className="text-sm text-aurora">{user.jobTitle}</p>
            {/* Contact */}
            <div className="mt-4">
              <h3 className="border-b border-gray-700 pb-1 text-[10px] font-bold uppercase text-gray-400">Contact</h3>
              <div className="mt-1 space-y-1 text-xs text-gray-300">
                {user.email && <p>✉ {user.email}</p>}
                {user.phone && <p>☎ {user.phone}</p>}
                {user.location && <p>📍 {user.location}</p>}
              </div>
            </div>
            {/* Skills in sidebar */}
            {r.skills?.length > 0 && (
              <div className="mt-4">
                <h3 className="border-b border-gray-700 pb-1 text-[10px] font-bold uppercase text-gray-400">Skills</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {r.skills.map((s, i) => <span key={i} className="rounded border border-gray-600 px-1.5 py-0.5 text-[10px]">{s}</span>)}
                </div>
              </div>
            )}
            {/* Education in sidebar */}
            {r.education && (
              <div className="mt-4">
                <h3 className="border-b border-gray-700 pb-1 text-[10px] font-bold uppercase text-gray-400">Education</h3>
                <p className="mt-1 text-xs text-gray-300">{r.education}</p>
              </div>
            )}
          </div>
          {/* Main content */}
          <div className="flex-1 p-5">
            {r.summary && (
              <div className="mb-4">
                <h3 className="mb-1 text-xs font-bold uppercase text-gray-400">Summary</h3>
                <p className="text-sm">{r.summary}</p>
              </div>
            )}
            {r.experience?.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Experience</h3>
                {r.experience.map((e, i) => (
                  <div key={i} className="mb-3 border-l-2 border-aurora pl-3">
                    <div className="flex justify-between"><span className="font-bold text-sm">{e.role}</span><span className="text-xs text-gray-400">{e.duration}</span></div>
                    <p className="text-xs text-aurora">{e.company}</p>
                    <ul className="mt-0.5 list-disc pl-4">{e.bullets?.map((b, j) => <li key={j} className="text-xs">{b}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    // ═════════════════════════════════════════════════════════
    // TEMPLATE 3: EXECUTIVE (Centered header + clean)
    // ═════════════════════════════════════════════════════════
    case "executive":
      return (
        <div className="bg-white p-8 text-gray-900">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-wider">{user.fullName || "Name"}</h1>
            <div className="mx-auto mt-1 h-px w-32 bg-gray-800" />
            <p className="mt-1 text-sm tracking-wide text-gray-600 uppercase">{user.jobTitle}</p>
            <p className="mt-1 text-xs text-gray-500">{contactItems.join("  •  ")}</p>
          </div>
          <div className="mt-6 space-y-4">
            {r.summary && <ExecSection title="Summary"><p className="text-sm">{r.summary}</p></ExecSection>}
            {r.experience?.length > 0 && (
              <ExecSection title="Experience">
                {r.experience.map((e, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between"><span className="font-bold text-sm">{e.role}, {e.company}</span><span className="text-xs text-gray-400">{e.duration}</span></div>
                    <ul className="mt-0.5 list-disc pl-4">{e.bullets?.map((b, j) => <li key={j} className="text-xs">{b}</li>)}</ul>
                  </div>
                ))}
              </ExecSection>
            )}
            {r.education && <ExecSection title="Education"><p className="text-sm">{r.education}</p></ExecSection>}
            {r.skills?.length > 0 && <ExecSection title="Skills"><p className="text-sm">{r.skills.join("  •  ")}</p></ExecSection>}
          </div>
        </div>
      );

    // ═════════════════════════════════════════════════════════
    // TEMPLATE 4: TWO COLUMN (Split experience & skills)
    // ═════════════════════════════════════════════════════════
    case "two-column":
      return (
        <div className="bg-white p-8 text-gray-900">
          <div className="border-b-2 border-blue-700 pb-2">
            <h1 className="text-2xl font-bold text-blue-900">{user.fullName || "Name"}</h1>
            <p className="text-sm text-blue-700">{user.jobTitle}</p>
            <p className="mt-0.5 text-xs text-gray-500">{contactItems.join(" | ")}</p>
          </div>
          {r.summary && <div className="mt-3"><p className="text-sm italic text-gray-600">{r.summary}</p></div>}
          <div className="mt-3 flex gap-5">
            {/* Left: Experience */}
            <div className="flex-1">
              <h3 className="border-b border-blue-200 pb-0.5 text-xs font-bold uppercase text-blue-800">Experience</h3>
              {r.experience?.map((e, i) => (
                <div key={i} className="mt-2">
                  <div className="font-bold text-sm">{e.role}</div>
                  <p className="text-xs text-blue-700">{e.company} | {e.duration}</p>
                  <ul className="mt-0.5 list-disc pl-4">{e.bullets?.map((b, j) => <li key={j} className="text-xs">{b}</li>)}</ul>
                </div>
              ))}
            </div>
            {/* Right: Skills + Education */}
            <div className="w-1/3">
              <h3 className="border-b border-blue-200 pb-0.5 text-xs font-bold uppercase text-blue-800">Skills</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {r.skills?.map((s, i) => <span key={i} className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-800">{s}</span>)}
              </div>
              {r.education && (
                <>
                  <h3 className="mt-3 border-b border-blue-200 pb-0.5 text-xs font-bold uppercase text-blue-800">Education</h3>
                  <p className="mt-1 text-xs">{r.education}</p>
                </>
              )}
            </div>
          </div>
        </div>
      );

    // ═════════════════════════════════════════════════════════
    // TEMPLATE 5: TECH MODERN (Dark header + code-style)
    // ═════════════════════════════════════════════════════════
    case "tech-modern":
      return (
        <div className="bg-gray-900 text-gray-100">
          <div className="border-b border-teal-500 p-5">
            <h1 className="font-mono text-2xl font-bold text-teal-400">$ {user.fullName || "name"}</h1>
            <p className="font-mono text-sm text-gray-400">{"// "}{user.jobTitle}</p>
            <p className="mt-1 font-mono text-xs text-gray-500">{contactItems.join("  ")}</p>
          </div>
          <div className="p-5">
            {r.summary && (
              <div className="mb-4">
                <h3 className="font-mono text-xs font-bold text-teal-400">{"// SUMMARY"}</h3>
                <p className="mt-1 text-sm text-gray-300">{r.summary}</p>
              </div>
            )}
            {r.experience?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-mono text-xs font-bold text-teal-400">{"// EXPERIENCE"}</h3>
                {r.experience.map((e, i) => (
                  <div key={i} className="mt-2 border-l border-teal-800 pl-3">
                    <div className="font-mono text-sm font-bold">{e.role}</div>
                    <p className="font-mono text-xs text-teal-500">{e.company} — {e.duration}</p>
                    <ul className="mt-0.5 font-mono text-xs text-gray-400">{e.bullets?.map((b, j) => <li key={j}>→ {b}</li>)}</ul>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-6">
              {r.skills?.length > 0 && (
                <div>
                  <h3 className="font-mono text-xs font-bold text-teal-400">{"// SKILLS"}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {r.skills.map((s, i) => <span key={i} className="font-mono rounded border border-teal-800 px-1.5 py-0.5 text-[10px] text-teal-300">{s}</span>)}
                  </div>
                </div>
              )}
              {r.education && (
                <div>
                  <h3 className="font-mono text-xs font-bold text-teal-400">{"// EDUCATION"}</h3>
                  <p className="mt-1 font-mono text-xs text-gray-400">{r.education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

    // ═════════════════════════════════════════════════════════
    // TEMPLATE 6: CREATIVE BOLD (Color blocks + bold)
    // ═════════════════════════════════════════════════════════
    case "creative-bold":
      return (
        <div className="bg-white text-gray-900">
          {/* Gradient header */}
          <div className="bg-gradient-to-r from-purple-700 to-pink-600 p-6 text-white">
            <h1 className="font-display text-3xl font-bold">{user.fullName || "Name"}</h1>
            <p className="text-lg text-pink-200">{user.jobTitle}</p>
            <p className="mt-1 text-xs text-purple-200">{contactItems.join("  •  ")}</p>
          </div>
          <div className="p-6">
            {r.summary && (
              <div className="mb-4 rounded-lg bg-purple-50 p-3">
                <h3 className="text-xs font-bold uppercase text-purple-700">Summary</h3>
                <p className="mt-1 text-sm">{r.summary}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Experience takes 2 cols */}
              <div className="sm:col-span-2">
                <h3 className="border-b-2 border-pink-500 pb-1 text-xs font-bold uppercase text-pink-600">Experience</h3>
                {r.experience?.map((e, i) => (
                  <div key={i} className="mt-2">
                    <div className="flex justify-between"><span className="font-bold text-sm">{e.role}</span><span className="text-xs text-gray-400">{e.duration}</span></div>
                    <p className="text-xs text-purple-600">{e.company}</p>
                    <ul className="mt-0.5 list-disc pl-4">{e.bullets?.map((b, j) => <li key={j} className="text-xs">{b}</li>)}</ul>
                  </div>
                ))}
              </div>
              {/* Skills + Education in 1 col */}
              <div>
                <h3 className="border-b-2 border-purple-500 pb-1 text-xs font-bold uppercase text-purple-600">Skills</h3>
                <div className="mt-1 space-y-1">
                  {r.skills?.map((s, i) => <div key={i} className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-800">{s}</div>)}
                </div>
                {r.education && (
                  <>
                    <h3 className="mt-3 border-b-2 border-pink-500 pb-1 text-xs font-bold uppercase text-pink-600">Education</h3>
                    <p className="mt-1 text-xs">{r.education}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div className="bg-white p-8">Template not found</div>;
  }
}

// ─── Section helpers ──────────────────────────────────────────
function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="border-b border-gray-300 pb-0.5 font-serif text-sm font-bold uppercase tracking-wide text-gray-800">{title}</h3>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{title}</h3>
      <div className="mx-auto mt-1 h-px w-8 bg-gray-300" />
      <div className="mt-2">{children}</div>
    </div>
  );
}

// ─── Input Fields ─────────────────────────────────────────────
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
