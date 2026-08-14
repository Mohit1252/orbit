import type { Metadata } from "next";
import { InterviewPrepClient } from "./interview-prep-client";

export const metadata: Metadata = {
  title: "AI Interview Prep — Free Mock Interview with AI Feedback (2026)",
  description:
    "Free AI interview prep — practice with AI-generated questions tailored to your role. Get instant feedback with scores, strengths, and improvement tips. No signup required. Text-based mock interview.",
  keywords: [
    "ai interview prep",
    "ai mock interview",
    "free ai interview prep",
    "ai mock interview free",
    "ai interview practice",
    "ai interview questions",
    "interview prep ai",
    "mock interview online free",
    "ai interview prep for developers",
    "ai interview prep for freshers",
    "best ai interview prep 2026",
    "behavioral interview practice ai",
  ],
  alternates: { canonical: "https://myaipicker.com/tools/interview-prep" },
  openGraph: {
    title: "AI Interview Prep — Free Mock Interview with AI Feedback",
    description:
      "Practice with AI-generated interview questions and get instant feedback. Free, no signup.",
    url: "https://myaipicker.com/tools/interview-prep",
    type: "website",
    siteName: "My AI Picker",
  },
};

export default function InterviewPrepPage() {
  return <InterviewPrepClient />;
}
