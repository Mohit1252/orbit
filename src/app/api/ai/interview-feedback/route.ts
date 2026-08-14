import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/ai/interview-feedback
 * Body: { question, answer, role, level, type }
 * Returns: { score, strengths, improvements, suggestedAnswer, starCheck }
 */
export async function POST(request: NextRequest) {
  try {
    const { question, answer, role, level, type } = await request.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "question and answer are required" },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const prompt = `You are an expert interview coach who has evaluated 5000+ interview answers.

Task: Evaluate the candidate's answer to the interview question.

Inputs:
- Question: ${question}
- Candidate answer: ${answer}
- Role: ${role}
- Level: ${level}
- Question type: ${type}

Evaluation criteria:
1. For behavioral: Check STAR structure (Situation, Task, Action, Result)
2. Clarity: Is the answer easy to follow?
3. Relevance: Does it answer the question?
4. Impact: Does it demonstrate value/metrics?
5. Length: Is it too short (<100 words) or too long (>400 words)?

Output ONLY valid JSON (no markdown, no code fences):
{
  "score": 0-100,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "suggestedAnswer": "short improved version of the answer",
  "starCheck": {
    "situation": true/false,
    "task": true/false,
    "action": true/false,
    "result": true/false
  }
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
    console.error("Interview feedback error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback. Please try again." },
      { status: 500 }
    );
  }
}
