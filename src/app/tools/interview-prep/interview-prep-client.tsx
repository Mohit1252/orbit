"use client";

import { useState } from "react";
import { SpaceBackground } from "@/components/site/space-background";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreHydration } from "@/components/site/store-hydration";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSchema } from "@/components/seo/faq-schema";
import {
  Mic, Loader2, AlertCircle, Check, X, Star, ArrowRight, FileText, Mail,
  ChevronRight, RotateCcw, Award, TrendingUp,
} from "lucide-react";

interface Question {
  id: number;
  type: string;
  question: string;
}

interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  starCheck: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
}

const faqs = [
  {
    question: "Is the AI interview prep free?",
    answer: "Yes — completely free. You can practice unlimited mock interviews without paying or signing up. Pro features (voice interview, session history) are coming in Phase 2.",
  },
  {
    question: "How does AI interview prep work?",
    answer: "Select your role, experience level, and interview type. AI generates 8 role-specific questions. Type your answer, and AI evaluates it with a score (0-100), strengths, improvements, and a suggested better answer.",
  },
  {
    question: "What types of interviews can I practice?",
    answer: "We support 4 interview types: HR (general), Technical (role-specific coding/system design), Behavioral (STAR format), and Case study (situational). Choose the type that matches your upcoming interview.",
  },
  {
    question: "How is my answer scored?",
    answer: "AI evaluates your answer on 5 criteria: STAR structure (for behavioral), clarity, relevance, impact (metrics), and length. You get a score (0-100), strengths, improvements, and a suggested better answer.",
  },
  {
    question: "Which AI powers the interview prep?",
    answer: "Our interview prep uses GPT-5 (by OpenAI) for question generation and feedback. GPT-5 excels at reasoning and evaluation, making it ideal for interview coaching.",
  },
];

export function InterviewPrepClient() {
  const [phase, setPhase] = useState<"setup" | "session" | "feedback">("setup");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("fresher");
  const [type, setType] = useState("behavioral");
  const [jobDescription, setJobDescription] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [scores, setScores] = useState<number[]>([]);

  const handleStart = async () => {
    if (!role.trim()) {
      setError("Please enter your target role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/interview-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          type,
          jobDescription: jobDescription || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate questions");

      const data = await res.json();
      setQuestions(data.questions);
      setPhase("session");
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write your answer first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQ].question,
          answer,
          role,
          level,
          type: questions[currentQ].type,
        }),
      });

      if (!res.ok) throw new Error("Failed to get feedback");

      const data = await res.json();
      setFeedback(data);
      setScores([...scores, data.score]);
      setPhase("feedback");
    } catch (err) {
      setError("Failed to get feedback. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setFeedback(null);
      setPhase("session");
    } else {
      // Session complete
      setPhase("setup");
      setCurrentQ(0);
      setAnswer("");
      setFeedback(null);
      setQuestions([]);
      setScores([]);
    }
  };

  const handleRestart = () => {
    setPhase("setup");
    setCurrentQ(0);
    setAnswer("");
    setFeedback(null);
    setQuestions([]);
    setScores([]);
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="relative flex min-h-screen flex-col">
      <SpaceBackground />
      <StoreHydration />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Tools", href: "/#tools" }, { label: "Interview Prep" }]} />

          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal/40 bg-teal/10 text-teal">
              <Mic className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                AI Interview Prep
              </h1>
              <p className="text-sm text-muted-foreground">
                Free mock interview with AI feedback — no signup required
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {phase !== "setup" && questions.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>Avg Score: {avgScore}/100</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-teal transition-all"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Setup Phase */}
          {phase === "setup" && (
            <div className="mt-6 max-w-2xl space-y-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="text-sm font-semibold">Target Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Developer, UX Designer, Product Manager"
                  className="mt-3 h-10 w-full rounded-lg border border-border bg-ink/40 px-3 text-sm outline-none focus:border-teal/60 focus:ring-2 focus:ring-teal/25"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="text-sm font-semibold">Experience Level</label>
                  <div className="mt-3 space-y-2">
                    {["fresher", "mid", "senior"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs font-semibold capitalize transition-all ${
                          level === l
                            ? "border-teal/50 bg-teal/15 text-teal"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {l === "fresher" ? "Fresher (0-2 yrs)" : l === "mid" ? "Mid (3-7 yrs)" : "Senior (7+ yrs)"}
                        {level === l && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="text-sm font-semibold">Interview Type</label>
                  <div className="mt-3 space-y-2">
                    {[
                      { v: "hr", label: "HR Round" },
                      { v: "technical", label: "Technical" },
                      { v: "behavioral", label: "Behavioral" },
                      { v: "case", label: "Case Study" },
                    ].map((t) => (
                      <button
                        key={t.v}
                        onClick={() => setType(t.v)}
                        className={`flex h-9 w-full items-center justify-between rounded-md border px-3 text-xs font-semibold transition-all ${
                          type === t.v
                            ? "border-teal/50 bg-teal/15 text-teal"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {t.label}
                        {type === t.v && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <label className="text-sm font-semibold">Job Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                <p className="mt-1 text-xs text-muted-foreground">Paste JD for tailored questions</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description for role-specific questions..."
                  className="mt-3 h-24 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-teal/60 focus:ring-2 focus:ring-teal/25"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-coral">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className="flex w-full h-12 items-center justify-center gap-2 rounded-lg border border-teal/50 bg-teal px-4 text-sm font-semibold text-primary-foreground block-shadow-teal transition-all hover:bg-teal/80 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating questions...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Mock Interview
                  </>
                )}
              </button>
            </div>
          )}

          {/* Session Phase */}
          {phase === "session" && questions.length > 0 && (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl border border-teal/40 bg-teal/[0.04] p-5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-teal/40 bg-teal/10 px-2 py-0.5 text-[10px] font-bold uppercase text-teal">
                    {questions[currentQ].type}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold">
                    {questions[currentQ].question}
                  </h3>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <label className="text-sm font-semibold">Your Answer</label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here...&#10;&#10;Tip: Use STAR format for behavioral questions&#10;- Situation: Set the context&#10;- Task: What you needed to do&#10;- Action: What you did&#10;- Result: What happened (with metrics)"
                    className="mt-3 h-64 w-full resize-none rounded-lg border border-border bg-ink/40 p-3 text-sm outline-none focus:border-teal/60 focus:ring-2 focus:ring-teal/25"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {answer.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-coral">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading || !answer.trim()}
                  className="flex w-full h-12 items-center justify-center gap-2 rounded-lg border border-teal/50 bg-teal px-4 text-sm font-semibold text-primary-foreground block-shadow-teal transition-all hover:bg-teal/80 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI evaluating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card/40 p-5">
                <h3 className="text-sm font-semibold">Tips for a Good Answer</h3>
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 text-teal" /> Use STAR format (Situation, Task, Action, Result)</li>
                  <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 text-teal" /> Add quantifiable metrics (numbers, %)</li>
                  <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 text-teal" /> Keep it 100-300 words</li>
                  <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 text-teal" /> Be specific — avoid generic answers</li>
                  <li className="flex items-start gap-2"><Check className="mt-0.5 h-3 w-3 text-teal" /> Focus on YOUR contribution, not the team</li>
                </ul>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === "feedback" && feedback && (
            <div className="mt-6 space-y-4">
              {/* Score */}
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Score</p>
                <p className={`mt-2 font-display text-5xl font-bold ${
                  feedback.score >= 80 ? "text-aurora" : feedback.score >= 60 ? "text-star" : "text-coral"
                }`}>
                  {feedback.score}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feedback.score >= 80 ? "Excellent! 🎉" : feedback.score >= 60 ? "Good, room for improvement 👍" : "Needs work — see tips below 💪"}
                </p>
              </div>

              {/* STAR Check */}
              {questions[currentQ].type === "behavioral" && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold">STAR Structure Check</h3>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      { k: "situation", l: "Situation" },
                      { k: "task", l: "Task" },
                      { k: "action", l: "Action" },
                      { k: "result", l: "Result" },
                    ].map((s) => (
                      <div key={s.k} className={`flex flex-col items-center rounded-lg border p-3 ${
                        feedback.starCheck[s.k as keyof typeof feedback.starCheck]
                          ? "border-aurora/40 bg-aurora/10 text-aurora"
                          : "border-coral/40 bg-coral/10 text-coral"
                      }`}>
                        {feedback.starCheck[s.k as keyof typeof feedback.starCheck] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="mt-1 text-[10px] font-bold">{s.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              <div className="rounded-xl border border-aurora/40 bg-aurora/[0.04] p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Award className="h-4 w-4 text-aurora" />
                  Strengths
                </h3>
                <ul className="mt-3 space-y-2">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-aurora" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="rounded-xl border border-star/40 bg-star/[0.04] p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-star" />
                  Improvements
                </h3>
                <ul className="mt-3 space-y-2">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-star" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Answer */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">Suggested Better Answer</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feedback.suggestedAnswer}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-teal/50 bg-teal px-4 text-sm font-semibold text-primary-foreground hover:bg-teal/80"
                >
                  {currentQ < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Start New Session
                    </>
                  )}
                </button>
                <button
                  onClick={handleRestart}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:border-teal/40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </button>
              </div>
            </div>
          )}

          {/* Next steps */}
          {phase === "setup" && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <a
                href="/tools/resume-builder"
                className="group flex items-center justify-between rounded-xl border border-aurora/30 bg-aurora/[0.04] p-5 transition-all hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="font-display text-base font-bold">← Build Resume</h3>
                  <p className="text-xs text-muted-foreground">Create ATS-optimized resume</p>
                </div>
                <FileText className="h-5 w-5 text-aurora" />
              </a>
              <a
                href="/tools/cover-letter-generator"
                className="group flex items-center justify-between rounded-xl border border-star/30 bg-star/[0.04] p-5 transition-all hover:-translate-y-0.5"
              >
                <div>
                  <h3 className="font-display text-base font-bold">← Cover Letter</h3>
                  <p className="text-xs text-muted-foreground">Generate personalized letter</p>
                </div>
                <Mail className="h-5 w-5 text-star" />
              </a>
            </div>
          )}

          {/* FAQs */}
          {phase === "setup" && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold">Interview Prep FAQs</h2>
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
