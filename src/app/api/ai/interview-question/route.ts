import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/ai/interview-question
 * Body: { role, level, type, jobDescription? }
 * Returns: { questions: [{id, type, question}] }
 */
export async function POST(request: NextRequest) {
  try {
    const { role, level, type, jobDescription } = await request.json();

    if (!role || !level || !type) {
      return NextResponse.json(
        { error: "role, level, and type are required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const prompt = `You are a senior interviewer at a top tech company with 15+ years of hiring experience.

Task: Generate 8 interview questions for a ${role} at ${level} level.

Interview type: ${type} (HR/technical/behavioral/case)
${jobDescription ? `Job description:\n${jobDescription}` : ""}

Guidelines:
1. Start with 2 behavioral questions ("Tell me about a time...")
2. Then 3 role-specific questions (progressive difficulty)
3. Then 2 situational/case questions
4. End with 1 curveball question
5. Make questions realistic and specific to ${role}
6. If JD provided, tailor questions to requirements

Output ONLY valid JSON (no markdown, no code fences):
{
  "questions": [
    {"id": 1, "type": "behavioral", "question": "..."},
    {"id": 2, "type": "behavioral", "question": "..."},
    {"id": 3, "type": "technical", "question": "..."},
    {"id": 4, "type": "technical", "question": "..."},
    {"id": 5, "type": "technical", "question": "..."},
    {"id": 6, "type": "case", "question": "..."},
    {"id": 7, "type": "case", "question": "..."},
    {"id": 8, "type": "curveball", "question": "..."}
  ]
}`;

    const response = await zai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      thinking: { type: "disabled" },
    });

    const content = response.choices[0]?.message?.content || "";
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
    console.error("Interview question error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}
