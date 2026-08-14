import type { Metadata } from "next";
import { CoverLetterClient } from "./cover-letter-client";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator — Free Personalized Cover Letters (2026)",
  description:
    "Free AI cover letter generator — paste your resume summary and job description, get a personalized cover letter tailored to the company and role. Choose tone, length, and download. No signup required.",
  keywords: [
    "ai cover letter generator",
    "free ai cover letter",
    "ai cover letter maker",
    "cover letter generator free",
    "ai cover letter for software developer",
    "ai cover letter for data analyst",
    "cover letter ai free no signup",
    "best ai cover letter 2026",
    "personalized cover letter ai",
    "ats cover letter generator",
  ],
  alternates: { canonical: "https://myaipicker.com/tools/cover-letter-generator" },
  openGraph: {
    title: "AI Cover Letter Generator — Free Personalized Cover Letters",
    description:
      "Generate company-specific cover letters with AI. Free, no signup. Tailored to your resume and job description.",
    url: "https://myaipicker.com/tools/cover-letter-generator",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function CoverLetterPage() {
  return <CoverLetterClient />;
}
