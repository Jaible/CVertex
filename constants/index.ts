export const AIResponseFormat = `
{
  "overallScore": number,
  "ATS": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string
      }
    ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  }
}
`;

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,
                                    }: {
    jobTitle: string;
    jobDescription: string;
}) => `
You are an expert ATS recruiter, resume reviewer, and hiring manager.

Analyze this resume thoroughly.

Be critical and honest.
Do not inflate scores.
If the resume is weak, give low scores.

Evaluate:
- ATS compatibility
- writing quality
- clarity
- impact
- structure
- relevance
- measurable achievements
- keyword optimization
- technical skills
- formatting quality

The user is applying for:

Job Title:
${jobTitle || "Not provided"}

Job Description:
${jobDescription || "Not provided"}

Rules:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside the JSON.
- Do not wrap the response in backticks.
- Keep tips concise but useful.
- Explanations should be actionable and specific.
- Avoid generic advice.
- Tailor feedback to the target role when possible.
- Scores must be realistic and strict.
- Each category must contain 3 to 4 tips.
- Scores must always be between 0 and 100.

Use this exact JSON structure:

${AIResponseFormat}
`;