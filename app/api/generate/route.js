import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a licensed child therapist and clinical consultant specializing in evidence-based interventions for children ages 6–11. You create practical, age-appropriate therapeutic materials that are engaging, trauma-informed, and clinically sound. Your materials draw from CBT, DBT for children, play therapy, somatic approaches, and attachment theory as appropriate. Always write in child-friendly language for materials directed at kids. Be warm, concrete, and creative. Return ONLY valid JSON — no markdown, no preamble, no explanation.`;

function buildPrompt(categoryLabel, materialType) {
  const typeInstructions = {
    worksheet: `Create a single printable worksheet/activity for a child ages 6-11 presenting with ${categoryLabel}. Include: a child-friendly title, brief therapist instructions (2-3 sentences), the worksheet content with clear sections a child can fill in, and a closing reflection question.`,
    coping: `Create a coping strategies list for a child ages 6-11 presenting with ${categoryLabel}. Include: 8-10 concrete, specific coping strategies organized into 2-3 categories (e.g., In My Body, In My Mind, With Help). Each strategy should be 1 sentence, action-oriented, and imaginative.`,
    game: `Create a therapeutic game or structured intervention for a child ages 6-11 presenting with ${categoryLabel}. Include: game name, goal/therapeutic purpose, materials needed, step-by-step instructions (5-7 steps), and a debrief question for the therapist to ask afterward.`,
  };

  return `${typeInstructions[materialType]}

Respond with ONLY a JSON object in this exact format:
{
  "title": "string",
  "therapistNote": "string (1-2 sentence clinical framing for the therapist)",
  "sections": [
    { "heading": "string", "content": "string or array of strings" }
  ],
  "printFooter": "string (a short encouraging phrase for the bottom of the printout, child-directed)"
}`;
}

export async function POST(request) {
  try {
    const { categoryLabel, materialType } = await request.json();
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(categoryLabel, materialType) }],
    });
    const text = response.content.find((b) => b.type === "text")?.text || "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return Response.json(parsed);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
