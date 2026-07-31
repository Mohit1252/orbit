import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      jobTitle,
      email,
      phone,
      location,
      summary,
      experience,
      education,
      skills,
      targetRole,
      tone,
      template,
    } = body;

    // Build the prompt for the LLM
    const prompt = `You are a professional resume writer. Create a complete, ATS-optimized resume and a cover letter based on the following information. Use a ${tone || "professional"} tone.

PERSONAL INFO:
- Name: ${fullName || "Not provided"}
- Target Role: ${targetRole || jobTitle || "Not specified"}
- Email: ${email || ""}
- Phone: ${phone || ""}
- Location: ${location || ""}

PROFESSIONAL SUMMARY (if provided):
${summary || "Generate a compelling summary based on the experience."}

WORK EXPERIENCE:
${experience || "No experience provided. Generate entry-level appropriate content."}

EDUCATION:
${education || "Not provided"}

SKILLS:
${skills || "Not provided"}

INSTRUCTIONS:
1. Generate a polished professional summary (2-3 sentences) tailored to the target role.
2. Rewrite and enhance the work experience bullets to be achievement-focused with metrics where possible.
3. Generate a customized cover letter for the target role (3-4 paragraphs).
4. Suggest 5 relevant skills to add if missing.
5. Format everything in clean, structured sections.

Return the response as JSON with this exact structure:
{
  "resume": {
    "summary": "...",
    "experience": [{"role": "...", "company": "...", "duration": "...", "bullets": ["...", "..."]}],
    "education": "...",
    "skills": ["...", "..."],
    "certifications": "..."
  },
  "coverLetter": "...",
  "suggestedSkills": ["...", "..."],
  "atsScore": 85,
  "atsTips": ["...", "..."]
}`;

    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume writer with 15 years of experience. You create compelling, keyword-optimized resumes that pass Applicant Tracking Systems. Always return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      thinking: { type: "disabled" },
    });

    const content = response.choices[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Extract JSON from response (in case there's markdown around it)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      // If parsing fails, return raw content
      parsed = {
        resume: {
          summary: content.slice(0, 500),
          experience: [],
          education: "",
          skills: [],
          certifications: "",
        },
        coverLetter: "",
        suggestedSkills: [],
        atsScore: 0,
        atsTips: [],
        raw: content,
      };
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Resume builder error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate resume. Please try again." },
      { status: 500 }
    );
  }
}
