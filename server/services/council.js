import dotenv from "dotenv";
import { removeDashes, ACTIVE_VISION_MODELS } from "./llm.js";
dotenv.config();

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const SYNTHESIZER_MODELS = [
  "dots-studio/dots-3-note-preview:free",
  "google/gemma-4-31b-it:free",
  "inclusionai/ling-3.0-flash-fin:free"
];

const ADVISORS = [
  {
    id: "spatial",
    name: "Composition and Anatomy Specialist",
    role: "Spatial Structure",
    lens: "Evaluates geometric balance, focal depth, subject proportions, and structural posture."
  },
  {
    id: "style",
    name: "Style and Intent Fidelity Critic",
    role: "Prompt Adherence",
    lens: "Checks faithfulness to the prompt instructions, color palette, lighting scheme, and artistic medium."
  },
  {
    id: "artifacts",
    name: "Perceptual Realism and Artifact Auditor",
    role: "Technical Quality",
    lens: "Scrutinizes AI generation tells, surface smoothing, unnatural specular glares, and texture anomalies."
  }
];

/**
 * Run the Karpathy style multi advisor council pipeline
 * 3 parallel advisor calls followed by 1 synthesis chairman call
 */
export async function runCouncilPipeline({ prompt, imageBase64, previousAttempts = [], anchorAttempt = null }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("[Driftline Council] No OPENROUTER_API_KEY found. Using heuristic council simulation.");
    return runHeuristicCouncil({ prompt, previousAttempts, anchorAttempt });
  }

  let imageUrlPayload = imageBase64;
  if (!imageBase64.startsWith("data:") && !imageBase64.startsWith("http")) {
    imageUrlPayload = `data:image/jpeg;base64,${imageBase64}`;
  }

  let historyText = "";
  if (previousAttempts?.length > 0) {
    historyText = `Iteration history:\n` + previousAttempts.slice(-3).map(a => `Attempt ${a.order_index}: "${a.prompt_text}"`).join("\n");
  }

  // Step 1: Run 3 parallel advisor critiques
  try {
    console.log("[Driftline Council] Launching 3 parallel advisor vision critiques...");
    const advisorPromises = ADVISORS.map(async (advisor, idx) => {
      const promptInstruction = `You are the ${advisor.name} in the Driftline Review Council.
Your specific analytical lens: ${advisor.lens}

Original generation prompt: "${prompt}"
${historyText}

Inspect the image output strictly through your lens.
Produce a concise, specific diagnostic report in valid JSON:
{
  "advisor_id": "${advisor.id}",
  "advisor_name": "${advisor.name}",
  "focal_diagnosis": "2 to 3 sentences detailing the primary flaw through your lens, avoiding dashes",
  "recommended_fix": "one concrete suggestion to resolve this specific flaw, avoiding dashes",
  "severity": "critical or moderate or minor"
}
Strictly avoid all dashes, hyphens, en dashes, and em dashes.`;

      // Select model for each advisor
      const modelToUse = ACTIVE_VISION_MODELS[idx % ACTIVE_VISION_MODELS.length];

      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://driftline.onrender.com",
          "X-Title": `Driftline Advisor ${advisor.id}`
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: promptInstruction },
                { type: "image_url", image_url: { url: imageUrlPayload } }
              ]
            }
          ],
          temperature: 0.35,
          max_tokens: 500
        })
      });

      if (!res.ok) {
        throw new Error(`Advisor ${advisor.id} failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      return parseAdvisorJson(content, advisor);
    });

    const advisorResults = await Promise.all(advisorPromises);
    console.log("[Driftline Council] All 3 advisors reported successfully!");

    // Step 2: Run Chairman Synthesizer call
    const synthesis = await runChairmanSynthesis({
      prompt,
      advisorResults,
      apiKey,
      previousAttempts,
      anchorAttempt
    });

    return {
      critique_text: synthesis.critique_text,
      suggested_prompt: synthesis.suggested_prompt,
      impact_estimate: synthesis.impact_estimate,
      primary_weakness: synthesis.primary_weakness,
      council_breakdown: advisorResults,
      consensus: synthesis.consensus,
      source: "openrouter_council_live"
    };

  } catch (error) {
    console.warn("[Driftline Council] Live council error, falling back:", error.message);
    return runHeuristicCouncil({ prompt, previousAttempts, anchorAttempt });
  }
}

/**
 * Chairman call synthesizes 3 advisor evaluations into one unified critique
 */
async function runChairmanSynthesis({ prompt, advisorResults, apiKey, previousAttempts, anchorAttempt }) {
  const advisorSummary = advisorResults.map(a => {
    return `${a.advisor_name} (${a.severity} severity): ${a.focal_diagnosis} Recommendation: ${a.recommended_fix}`;
  }).join("\n\n");

  const chairmanPrompt = `You are the Council Chairman of Driftline.
Three independent domain advisors evaluated an AI generated image based on the prompt: "${prompt}".

Advisor Evaluations:
${advisorSummary}

Synthesize these perspectives:
1. Reconcile the 3 advisor findings into a unified, actionable diagnosis (2 to 3 sentences).
2. Write one unified prompt rewrite that addresses the highest leverage issue.
3. Determine consensus level: "High Consensus" if advisors identified the same core flaw, "Moderate Consensus" if partially overlapping, or "Divergent Perspectives" if they flagged completely separate concerns.
4. Set impact estimate: "high", "medium", or "low".
5. Strictly avoid all dashes, hyphens, and em dashes.

Respond in JSON format:
{
  "critique_text": "synthesized unified diagnosis without dashes",
  "suggested_prompt": "rewritten prompt targeting the root issue without dashes",
  "impact_estimate": "high or medium or low",
  "primary_weakness": "primary unified flaw category",
  "consensus": "High Consensus or Moderate Consensus or Divergent Perspectives"
}`;

  for (const synthModel of SYNTHESIZER_MODELS) {
    try {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://driftline.onrender.com",
          "X-Title": "Driftline Chairman"
        },
        body: JSON.stringify({
          model: synthModel,
          messages: [{ role: "user", content: chairmanPrompt }],
          temperature: 0.2,
          max_tokens: 600
        })
      });

      if (!res.ok) continue;

      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || "";
      const parsed = extractJson(raw);

      return {
        critique_text: removeDashes(parsed.critique_text || `Advisors highlight ${advisorResults[0]?.focal_diagnosis}`),
        suggested_prompt: removeDashes(parsed.suggested_prompt || `${prompt}, ${advisorResults[0]?.recommended_fix}`),
        impact_estimate: parsed.impact_estimate?.toLowerCase() || "high",
        primary_weakness: removeDashes(parsed.primary_weakness || "Synthesized Multi Advisor Diagnosis"),
        consensus: removeDashes(parsed.consensus || "High Consensus")
      };
    } catch (_) {}
  }

  // Graceful programmatic synthesis if LLM calls hiccup
  return {
    critique_text: removeDashes(`Council review indicates priority focus on ${advisorResults[0]?.focal_diagnosis || "spatial composition and lighting coherence."}`),
    suggested_prompt: removeDashes(`${prompt}, ${advisorResults[0]?.recommended_fix || "refined tonal balance"}`),
    impact_estimate: "high",
    primary_weakness: removeDashes(advisorResults[0]?.advisor_name || "Council Priority"),
    consensus: "Moderate Consensus"
  };
}

function extractJson(str) {
  try {
    let clean = str.trim();
    if (clean.startsWith("```")) {
      clean = clean.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    return JSON.parse(clean);
  } catch (_) {
    const match = str.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (__) {}
    }
    return {};
  }
}

function parseAdvisorJson(content, advisor) {
  try {
    let clean = content.trim();
    if (clean.startsWith("```")) {
      clean = clean.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    const parsed = JSON.parse(clean);
    return {
      advisor_id: advisor.id,
      advisor_name: advisor.name,
      role: advisor.role,
      focal_diagnosis: removeDashes(parsed.focal_diagnosis || "Output displays structural variance across key focal regions."),
      recommended_fix: removeDashes(parsed.recommended_fix || "Define explicit depth layering and lighting orientation."),
      severity: parsed.severity || "moderate"
    };
  } catch (e) {
    const plainText = removeDashes(content.replace(/[*#]/g, "").slice(0, 220));
    return {
      advisor_id: advisor.id,
      advisor_name: advisor.name,
      role: advisor.role,
      focal_diagnosis: plainText || `Identified subtle divergence in ${advisor.role.toLowerCase()} relative to prompt intent.`,
      recommended_fix: removeDashes("Adjust focal cues and contrast gradient."),
      severity: "moderate"
    };
  }
}

/**
 * Heuristic fallback for Council mode
 */
export function runHeuristicCouncil({ prompt, previousAttempts, anchorAttempt }) {
  const advisorBreakdown = [
    {
      advisor_id: "spatial",
      advisor_name: "Composition and Anatomy Specialist",
      role: "Spatial Structure",
      focal_diagnosis: removeDashes("The composition suffers from centered weight with insufficient visual breathing room around the primary subject. Edge margins feel cramped, diminishing overall visual authority."),
      recommended_fix: removeDashes("Apply rule of thirds positioning and introduce clean negative space"),
      severity: "moderate"
    },
    {
      advisor_id: "style",
      advisor_name: "Style and Intent Fidelity Critic",
      role: "Prompt Adherence",
      focal_diagnosis: removeDashes("Prompt requested nuanced moody atmosphere but the output presents harsh uniform lighting that flattens color saturation across the mid tones."),
      recommended_fix: removeDashes("Introduce atmospheric haze, volumetric shafts, and deep complementary shadows"),
      severity: "critical"
    },
    {
      advisor_id: "artifacts",
      advisor_name: "Perceptual Realism and Artifact Auditor",
      role: "Technical Quality",
      focal_diagnosis: removeDashes("Minor smearing is apparent in fine texture zones and specular reflections lack directional consistency with the scene illumination."),
      recommended_fix: removeDashes("Specify tactile surface micro texture and physically accurate specular highlights"),
      severity: "minor"
    }
  ];

  return {
    critique_text: removeDashes("Council synthesis identifies atmospheric lighting and cramped composition as the primary bottlenecks. While technical artifacts remain low, the uniform illumination dilutes the emotional tone requested in your prompt."),
    suggested_prompt: removeDashes(`${prompt}, rule of thirds framing, volumetric atmospheric haze, deep shadows, authentic micro surface texture`),
    impact_estimate: "high",
    primary_weakness: "Lighting atmosphere and cramped framing",
    council_breakdown: advisorBreakdown,
    consensus: "High Consensus : Atmospheric Lighting Priority",
    source: "heuristic_council"
  };
}
