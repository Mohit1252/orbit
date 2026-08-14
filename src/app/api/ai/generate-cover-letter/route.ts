import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/ai/generate-cover-letter
 * Body: { resumeSummary, jobDescription, companyName, hiringManager?, role, tone, length }
 * Returns: { coverLetter }
 */
export async function POST(request: NextRequest) {
  try {
    const {
      resumeSummary,
      jobDescription,
      companyName,
      hiringManager,
      role,
      tone = "formal",
      length = 300,
    } = await request.json();

    if (!resumeSummary || !jobDescription || !companyName) {
      return NextResponse.json(
        { error: "resumeSummary, jobDescription, and companyName are required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const prompt = `You are an expert cover letter writer who has helped 1000+ candidates land jobs at top companies.

Task: Write a personalized cover letter for ${role || "the role"} at ${companyName}.

Inputs:
- Resume summary: ${resumeSummary}
- Job description: ${jobDescription}
- Company: ${companyName}
- Hiring manager: ${hiringManager || "Hiring Manager"}
- Tone: ${tone}
- Target length: ${length} words

Guidelines:
1. Open with a strong hook (NOT "I am writing to apply...")
2. Connect resume experience to specific JD requirements
3. Show company research (mention company's product/mission)
4. Use ${tone} tone throughout
5. Include a call to action in closing
6. No generic fluff ("I am a hardworking team player")
7. Keep to ~${length} words, 3-4 paragraphs
8. Address it to ${hiringManager || "Hiring Manager"}

Output: ONLY the cover letter text (no JSON, no markdown, no explanation). Start with "Dear ${hiringManager || "Hiring Manager"}," and end with "Best regards, [Your Name]".`;

    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    const coverLetter = response.choices[0]?.message?.content?.trim() || "";

    if (!coverLetter) {
      return NextResponse.json(
        { error: "Failed to generate cover letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
