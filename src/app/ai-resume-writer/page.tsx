import type { Metadata } from "next";
import { ResumeBuilder } from "./resume-builder-client";

export const metadata: Metadata = {
  title: "AI Resume Writer — Free AI Powered Resume Builder | My AI Picker",
  description:
    "Free AI powered resume builder. Create ATS-optimized resumes and cover letters in seconds. Choose from 4 templates, customize your design, and download. No signup required.",
  keywords: [
    "ai resume writer",
    "ai powered resume builder",
    "free ai resume builder",
    "ai resume maker",
    "ai cover letter generator",
    "ats resume builder",
    "free resume builder no signup",
  ],
  alternates: { canonical: "https://myaipicker.com/ai-resume-writer" },
  openGraph: {
    title: "AI Resume Writer — Free AI Powered Resume Builder",
    description:
      "Create ATS-optimized resumes and cover letters in seconds. Free, no signup. 4 templates available.",
    url: "https://myaipicker.com/ai-resume-writer",
    type: "website",
  },
};

export default function ResumeWriterPage() {
  return <ResumeBuilder />;
}
