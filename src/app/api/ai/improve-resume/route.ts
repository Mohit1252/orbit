import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/ai/improve-resume
 * Body: { resumeText, targetRole, jobDescription? }
 * Returns: { summary, experience, skills, atsKeywordsAdded, suggestions }
 */
export async function POST(request: NextRequest) {
  try {
    const { resumeText, targetRole, jobDescription } = await request.json();

    if (!resumeText || !targetRole) {
      return NextResponse.json(
        { error: "resumeText and targetRole are required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const prompt = `You are an expert resume writer and ATS specialist with 10+ years of experience helping candidates land jobs at top tech companies.

Task: Improve the following resume for the role of ${targetRole}.

Guidelines:
1. Use STAR format for experience bullets (Situation, Task, Action, Result)
2. Add quantifiable metrics (numbers, percentages, time saved)
3. Use strong action verbs (Built, Led, Optimized, Launched)
4. Keep bullets to 1-2 lines each
5. Include ATS keywords from the job description if provided
6. Remove fluff and generic statements

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : ""}

Output ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "summary": "improved 2-3 line summary",
  "experience": [{"company": "name", "role": "title", "bullets": ["bullet1", "bullet2"]}],
  "skills": ["skill1", "skill2"],
  "atsKeywordsAdded": ["keyword1", "keyword2"],
  "suggestions": ["tip1", "tip2", "tip3"]
}`;

    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    const content = response.choices[0]?.message?.content || "";

    // Extract JSON from response (handle if wrapped in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Improve resume error:", error);
    return NextResponse.json(
      { error: "Failed to improve resume. Please try again." },
      { status: 500 }
    );
  }
}
