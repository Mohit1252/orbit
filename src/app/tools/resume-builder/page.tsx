import type { Metadata } from "next";
import { ResumeBuilderClient } from "./resume-builder-client";

export const metadata: Metadata = {
  title: "AI Resume Builder — Free ATS Resume Maker with AI Tailoring (2026)",
  description:
    "Free AI resume builder — upload your resume or start fresh, paste a job description, and AI tailors it with ATS keywords, STAR bullets, and quantified achievements. Download as PDF. No signup required.",
  keywords: [
    "ai resume builder",
    "free ai resume builder",
    "ai resume maker",
    "ats resume builder free",
    "ai resume builder for freshers",
    "resume builder india free",
    "ai resume tailoring",
    "ats resume maker",
    "free resume builder no signup",
    "best ai for resume 2026",
  ],
  alternates: { canonical: "https://myaipicker.com/tools/resume-builder" },
  openGraph: {
    title: "AI Resume Builder — Free ATS Resume Maker with AI Tailoring",
    description:
      "Build ATS-ready resumes with AI. Upload, paste JD, and get tailored resumes. Free, no signup.",
    url: "https://myaipicker.com/tools/resume-builder",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
