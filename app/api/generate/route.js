export const runtime = "edge";
export const maxDuration = 90;

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS = {
  child: `You are a licensed child therapist and clinical consultant specializing in evidence-based interventions for children ages 6–11. You create practical, age-appropriate therapeutic materials that are engaging, trauma-informed, and clinically sound. Your materials draw from CBT, DBT for children, play therapy, somatic approaches, and attachment theory as appropriate. Always write in child-friendly language for materials directed at kids. Be warm, concrete, and creative. Return ONLY valid JSON — no markdown, no preamble, no explanation.`,

  teen: `You are a licensed therapist specializing in adolescent mental health for ages 12–17. You create evidence-based therapeutic materials that are engaging, non-condescending, and clinically sound. Your materials draw from DBT, ACT, CBT, motivational interviewing, and narrative therapy. Write in a collaborative, respectful tone that treats teens as capable — avoid childish language but keep it accessible. Return ONLY valid JSON — no markdown, no preamble, no explanation.`,

  adult: `You are a licensed clinical therapist specializing in adult mental health. You create sophisticated, evidence-based therapeutic materials that are warm, practical, and clinically grounded. Your materials draw from ACT, CBT, EFT, somatic approaches, psychodynamic concepts, and DBT as appropriate. Write at a peer level — professional but human, never condescending. Return ONLY valid JSON — no markdown, no preamble, no explanation.`,
};

const AGE_LABELS = {
  child: "children ages 6–11",
  teen: "teenagers ages 12–17",
  adult: "adults",
};

function buildPrompt(categoryLabel, materialType, ageGroup) {
  const ageLabel = AGE_LABELS[ageGroup] || "clients";

  const typeInstructions = {
    worksheet: `Create a single printable worksheet/activity for ${ageLabel} presenting with ${categoryLabel}. Include: a clear title, brief therapist instructions (2-3 sentences), the worksheet content with sections the client can fill in, and a closing reflection question. Make it appropriately engaging for the age group.`,

    coping: `Create a coping strategies list for ${ageLabel} presenting with ${categoryLabel}. Include: 8-10 concrete, specific coping strategies organized into 2-3 categories (e.g., In My Body, In My Mind, With Support). Each strategy should be 1-2 sentences, action-oriented, and realistic for the age group.`,

    game: `Create a therapeutic game or structured intervention for ${ageLabel} presenting with ${categoryLabel}. Include: activity name, goal/therapeutic purpose, materials needed, step-by-step instructions (5-7 steps), and a debrief question for the therapist to ask afterward. Make it age-appropriate and clinically grounded.`,
  };

  return `${typeInstructions[materialType]}

Respond with ONLY a JSON object in this exact format:
{
  "title": "string",
  "therapistNote": "string (1-2 sentence clinical framing for the therapist)",
  "sections": [
    { "heading": "string", "content": "string or array of strings" }
  ],
  "printFooter": "string (a brief encouraging closing phrase appropriate for the age group)"
}`;
}

export async function POST(request) {
  try {
    const { categoryLabel, materialType, ageGroup } = await request.json();
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPTS[ageGroup] || SYSTEM_PROMPTS.adult,
      messages: [{ role: "user", content: buildPrompt(categoryLabel, materialType, ageGroup) }],
    });
    const text = response.content.find((b) => b.type === "text")?.text || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
