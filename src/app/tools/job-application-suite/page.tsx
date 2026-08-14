import type { Metadata } from "next";
import Link from "next/link";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import { ArrowRight, FileText, Mail, Mic, Check, Sparkles, Star, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Job Application Suite — Resume Builder, Cover Letter & Interview Prep (Free 2026)",
  description:
    "Free AI job application suite — build ATS-ready resumes, write tailored cover letters, and practice interviews. No signup required. Powered by Claude & GPT-5. Land your dream job faster.",
  keywords: [
    "ai resume builder",
    "ai cover letter generator",
    "ai interview prep",
    "free ai resume builder",
    "ai job application suite",
    "ats resume builder free",
    "ai resume maker",
    "ai mock interview",
    "best ai for resume 2026",
    "ai resume builder for freshers",
    "free ai cover letter",
    "ai interview prep for developers",
    "resume builder india free",
    "ai job search tools",
  ],
  alternates: { canonical: "https://myaipicker.com/tools/job-application-suite" },
  openGraph: {
    title: "AI Job Application Suite — Resume, Cover Letter & Interview Prep Free",
    description:
      "Build ATS-ready resumes, write tailored cover letters, and practice interviews — all in one free AI suite. No signup required.",
    url: "https://myaipicker.com/tools/job-application-suite",
    type: "website",
    siteName: "My AI Picker",
  },
};

const faqs = [
  {
    question: "Is the AI resume builder really free?",
    answer: "Yes, the core resume builder is completely free — no credit card, no signup required. You can build, tailor, and download your resume as PDF without paying. Pro features (unlimited versions, DOCX export, advanced ATS scoring) start at ₹499/month.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you can use the resume builder, cover letter generator, and interview prep in guest mode without signing up. Create a free account only if you want to save your work and access it later across devices.",
  },
  {
    question: "Which AI model powers the suite?",
    answer: "Our suite uses multiple AI models: Claude (by Anthropic) for resume writing and cover letters (best writing quality), and GPT-5 (by OpenAI) for interview question generation and feedback. These are the same models you can compare on My AI Picker.",
  },
  {
    question: "Can I download my resume as PDF?",
    answer: "Yes — all resumes can be downloaded as PDF for free. DOCX format is available on the Pro plan. The PDFs are ATS-friendly and properly formatted for job applications.",
  },
  {
    question: "Is my data safe?",
    answer: "Yes. Your resume data is encrypted in transit (HTTPS) and at rest. We never share your personal data with third parties. You can delete your account and all associated data anytime from the dashboard.",
  },
  {
    question: "Does it work for the Indian job market?",
    answer: "Yes — our suite is designed for the Indian job market with support for Indian companies, roles, and formats. Phase 2 will include Hindi language support for resume building and interview prep.",
  },
  {
    question: "Can I tailor my resume for specific jobs?",
    answer: "Yes — paste the job description and our AI will tailor your resume by adding ATS keywords, reordering skills, and rewriting experience bullets to match the role. This significantly improves your chances of passing ATS screening.",
  },
];

export default function JobApplicationSuitePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Tools", href: "/#tools" }, { label: "Job Application Suite" }]} />

          {/* Hero */}
          <section className="text-center">
            <span className="inline-flex items-center gap-2 rounded-md border border-aurora/40 bg-aurora/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
              <Sparkles className="h-3.5 w-3.5" />
              Free AI Job Suite 2026
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              AI Job Application Suite
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Resume Builder, Cover Letter Generator & Interview Prep — all in one free AI suite.
              Build ATS-ready resumes, write tailored cover letters, and practice interviews.
              No signup required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/tools/resume-builder"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-aurora/50 bg-aurora px-6 text-sm font-semibold text-primary-foreground block-shadow-aurora hover:bg-aurora-soft"
              >
                Start Free — No Signup
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-semibold hover:border-aurora/40"
              >
                See How It Works
              </Link>
            </div>
          </section>

          {/* Value Props */}
          <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "All-in-One Flow", desc: "Resume → Cover Letter → Interview in one suite" },
              { icon: Shield, title: "ATS-Optimized", desc: "Pass resume screening bots with AI-tailored keywords" },
              { icon: Sparkles, title: "AI-Powered", desc: "Claude & GPT-5 under the hood — best-in-class" },
              { icon: Check, title: "Free Forever", desc: "No credit card, no signup for core features" },
            ].map((v, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <v.icon className="h-6 w-6 text-aurora" />
                <h3 className="mt-3 font-display text-base font-bold">{v.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </section>

          {/* 3 Modules */}
          <section id="how-it-works" className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">
              Three Tools, One Goal — Land Your Dream Job
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Resume Builder */}
              <div className="rounded-2xl border border-aurora/30 bg-gradient-to-br from-aurora/[0.06] to-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-aurora/40 bg-aurora/10 text-aurora">
                    <FileText className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">AI Resume Builder</h3>
                    <p className="text-xs text-muted-foreground">ATS-optimized resumes</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Upload your old resume or start fresh. AI tailors it to any job description
                  with ATS keywords, STAR-format bullets, and quantified achievements.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-aurora" /> PDF download free</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-aurora" /> JD tailoring</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-aurora" /> 6+ templates</li>
                </ul>
                <Link
                  href="/tools/resume-builder"
                  className="mt-5 inline-flex h-9 items-center gap-1 text-sm font-semibold text-aurora hover:underline"
                >
                  Build Resume <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Cover Letter */}
              <div className="rounded-2xl border border-star/30 bg-gradient-to-br from-star/[0.06] to-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-star/40 bg-star/10 text-star">
                    <Mail className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">AI Cover Letter</h3>
                    <p className="text-xs text-muted-foreground">Personalized letters</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Generate company-specific cover letters tailored to your resume and the job
                  description. Choose tone (formal, friendly, startup) and length.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-star" /> Company-specific</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-star" /> Tone control</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-star" /> Copy / PDF / DOCX</li>
                </ul>
                <Link
                  href="/tools/cover-letter-generator"
                  className="mt-5 inline-flex h-9 items-center gap-1 text-sm font-semibold text-star hover:underline"
                >
                  Write Cover Letter <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Interview Prep */}
              <div className="rounded-2xl border border-teal/30 bg-gradient-to-br from-teal/[0.06] to-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal/40 bg-teal/10 text-teal">
                    <Mic className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">AI Interview Prep</h3>
                    <p className="text-xs text-muted-foreground">Mock + instant feedback</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Practice with AI-generated interview questions tailored to your role.
                  Get instant feedback with scores, strengths, and improvement tips.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-teal" /> Role-specific questions</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-teal" /> STAR structure check</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3 w-3 text-teal" /> Score + feedback</li>
                </ul>
                <Link
                  href="/tools/interview-prep"
                  className="mt-5 inline-flex h-9 items-center gap-1 text-sm font-semibold text-teal hover:underline"
                >
                  Practice Interview <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">How It Works</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { step: "1", title: "Build Resume", desc: "Upload old resume or start fresh. AI tailors to any job with ATS keywords." },
                { step: "2", title: "Write Cover Letter", desc: "AI generates a personalized cover letter based on your resume and the JD." },
                { step: "3", title: "Practice Interview", desc: "Mock interview with AI questions + instant feedback on your answers." },
              ].map((s, i) => (
                <div key={i} className="relative rounded-xl border border-border bg-card p-6 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-aurora/40 bg-aurora/10 font-display text-lg font-bold text-aurora">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold">{s.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing teaser */}
          <section className="mt-16 rounded-2xl border border-aurora/30 bg-gradient-to-br from-aurora/[0.06] to-card p-8 text-center">
            <h2 className="font-display text-2xl font-bold">Free Forever. Pro from ₹499/month</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Core features are free — no credit card, no signup. Upgrade to Pro for unlimited
              resumes, DOCX export, advanced ATS scoring, and voice interview prep.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-xl border border-border bg-card p-5 text-left">
                <h3 className="font-display text-lg font-bold">Free</h3>
                <p className="text-xs text-muted-foreground">₹0 forever</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>✅ 1 resume, 3 templates</li>
                  <li>✅ 3 cover letters/month</li>
                  <li>✅ 5 interview sessions/month</li>
                  <li>✅ PDF download</li>
                </ul>
              </div>
              <div className="rounded-xl border border-aurora/40 bg-aurora/[0.04] p-5 text-left">
                <span className="inline-flex items-center gap-1 rounded-md border border-aurora/40 bg-aurora/10 px-2 py-0.5 text-[10px] font-bold text-aurora">
                  <Star className="h-3 w-3" /> PRO
                </span>
                <h3 className="mt-2 font-display text-lg font-bold">Pro — ₹499/mo</h3>
                <p className="text-xs text-muted-foreground">or ₹3999/year (save 33%)</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <li>✅ Unlimited everything</li>
                  <li>✅ All templates + DOCX</li>
                  <li>✅ Advanced ATS scoring</li>
                  <li>✅ Voice interview (Phase 2)</li>
                  <li>✅ Hindi support (Phase 2)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-display text-base font-bold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <FAQSchema faqs={faqs} />
          </section>

          {/* Final CTA */}
          <section className="mt-12 rounded-2xl border border-aurora/50 bg-aurora p-8 text-center text-primary-foreground">
            <h2 className="font-display text-2xl font-bold">Ready to Land Your Dream Job?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/90">
              Start with our free AI resume builder — no signup, no credit card.
            </p>
            <Link
              href="/tools/resume-builder"
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 text-sm font-bold text-aurora hover:bg-primary-foreground/90"
            >
              Start Free Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
