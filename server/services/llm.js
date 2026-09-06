import dotenv from "dotenv";
dotenv.config();

/**
 * Driftline Multimodal LLM Service
 * Primary engine: OpenRouter Vision API with verified multimodal models
 * Strictly loads credentials from process.env.OPENROUTER_API_KEY
 * Includes resilient heuristic fallback only for upstream network outages or quota exhaustion
 */

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
// Models supporting image input on OpenRouter without credit depletion
export const ACTIVE_VISION_MODELS = [
  "dots-studio/dots-3-note-preview:free",
  "google/gemma-4-31b-it:free",
  "google/gemini-2.5-flash",
  "google/gemini-2.0-flash-001"
];

/**
 * Clean copy helper enforcing the strict No Dashes Rule across all AI outputs
 */
export function removeDashes(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/[—–]/g, " : ")
    .replace(/\s+-\s+/g, " : ")
    .replace(/(\w)-(\w)/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Execute a single vision critique using OpenRouter
 */
export async function runVisionCritique({ prompt, imageBase64, previousAttempts = [], anchorAttempt = null }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("[Driftline LLM] No OPENROUTER_API_KEY detected in process.env. Engaging emergency heuristic fallback.");
    return generateHeuristicCritique({ prompt, previousAttempts, anchorAttempt, isFallback: true, reason: "No API key configured" });
  }

  // Format context history for Phase 2 trajectory awareness
  let historyContext = "";
  if (previousAttempts && previousAttempts.length > 0) {
    historyContext = `\nIteration history context:\n` + previousAttempts.slice(-3).map((att) => {
      return `Attempt ${att.order_index}: Prompt="${att.prompt_text}", Prior Diagnosis="${att.critique_text}"`;
    }).join("\n");
  }

  let anchorContext = "";
  if (anchorAttempt && anchorAttempt.prompt_text) {
    anchorContext = `\nAnchor Intent (Attempt 1): "${anchorAttempt.prompt_text}". Note if this iteration preserves or drifts from this original intent.`;
  }

  const systemInstructions = `You are Driftline, an elite visual diagnosis system for node based AI image workflows.
Your mission: diagnose what is actually weak in the generated image relative to the user prompt so they do not regenerate blind.

Rules:
1. Diagnosis must be 2 to 4 sentences in plain, direct language.
2. Be specific: name visible elements like lighting angles, depth of field, anatomy, color harmony, artifacting, or prompt adherence.
3. No generic filler like "it looks good" or "lighting could be better".
4. Provide one rewritten prompt that targets the single most impactful weakness.
5. Estimate impact: "high" if the prompt rewrite will transform the output, "medium" for balanced tuning, "low" for subtle polish.
6. Strictly avoid dashes, hyphens, en dashes, and em dashes in all output text. Use colons or direct sentences instead.
7. Return valid JSON only with keys: critique_text, suggested_prompt, impact_estimate, primary_weakness, drift_observation.`;

  const userPromptText = `Prompt used for generation: "${prompt}"${historyContext}${anchorContext}

Examine this image output closely and provide your diagnosis in JSON format:
{
  "critique_text": "2 to 4 sentences concrete diagnosis without dashes",
  "suggested_prompt": "rewritten prompt targeting the main flaw without dashes",
  "impact_estimate": "high or medium or low",
  "primary_weakness": "one concise category name e.g. Flat directional lighting",
  "drift_observation": "one sentence noting if intent drifted from anchor or null"
}`;

  // Build payload with base64 image or URL
  let imageUrlPayload = imageBase64;
  if (!imageBase64.startsWith("data:") && !imageBase64.startsWith("http")) {
    imageUrlPayload = `data:image/jpeg;base64,${imageBase64}`;
  }

  // Iterate through active vision models
  for (const modelName of ACTIVE_VISION_MODELS) {
    try {
      console.log(`[Driftline LLM] Attempting live vision call with model: ${modelName}`);
      const payload = {
        model: modelName,
        messages: [
          { role: "system", content: systemInstructions },
          {
            role: "user",
            content: [
              { type: "text", text: userPromptText },
              { type: "image_url", image_url: { url: imageUrlPayload } }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      };

      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://driftline.onrender.com",
          "X-Title": "Driftline Studio"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[Driftline LLM] Model ${modelName} returned HTTP ${response.status}: ${errorBody.slice(0, 150)}`);
        continue; // Try next active model
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.warn(`[Driftline LLM] Model ${modelName} returned empty content choice.`);
        continue;
      }

      const parsed = parseJsonResponse(content, prompt);
      console.log(`[Driftline LLM] Live vision critique succeeded via ${modelName}!`);
      return {
        critique_text: removeDashes(parsed.critique_text),
        suggested_prompt: removeDashes(parsed.suggested_prompt),
        impact_estimate: parsed.impact_estimate?.toLowerCase() || "high",
        primary_weakness: removeDashes(parsed.primary_weakness || "Visual composition"),
        drift_observation: parsed.drift_observation ? removeDashes(parsed.drift_observation) : null,
        source: "openrouter_live",
        model: modelName
      };

    } catch (err) {
      console.warn(`[Driftline LLM] Error calling ${modelName}:`, err.message);
    }
  }

  // Only if all live vision calls failed (e.g. offline or provider network failure)
  console.warn("[Driftline LLM] All live vision endpoints failed. Using resilient fallback.");
  return generateHeuristicCritique({ prompt, previousAttempts, anchorAttempt, isFallback: true, reason: "Live vision endpoints unavailable" });
}

/**
 * Safely parse structured JSON response from vision models
 */
function parseJsonResponse(rawText, originalPrompt) {
  try {
    let clean = rawText.trim();
    if (clean.startsWith("```")) {
      clean = clean.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (err) {
    // If model answered in plain text rather than JSON
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {}
    }

    // Wrap plain text output safely
    const cleanProse = removeDashes(rawText.replace(/[*#]/g, "").trim());
    return {
      critique_text: cleanProse.slice(0, 320) || "The generated output exhibits subtle compositional variance relative to the requested prompt.",
      suggested_prompt: `${originalPrompt}, refined focal lighting, high tonal clarity, balanced composition`,
      impact_estimate: "high",
      primary_weakness: "Visual fidelity and lighting balance",
      drift_observation: null
    };
  }
}

/**
 * Heuristic Fallback
 * Strictly reserved as a safety net if external API rate limits or network issues strike
 */
export function generateHeuristicCritique({ prompt, previousAttempts = [], anchorAttempt = null, isFallback = false, reason = "" }) {
  const p = (prompt || "").toLowerCase();

  let weakness = "Lighting separation and background depth";
  let critique = "The subject blends into the background due to uniform ambient lighting across the frame. The focal plane lacks clear separation, causing secondary details to compete with the central subject. Increasing rim lighting and narrowing the aperture depth will resolve this immediately.";
  let rewrite = `${prompt}, dramatic rim lighting, shallow depth of field, 85mm portrait framing, deep tonal separation`;
  let impact = "high";

  if (p.includes("cyberpunk") || p.includes("neon") || p.includes("city")) {
    weakness = "Atmospheric perspective and volumetric fog";
    critique = "The neon highlights appear clipped without realistic volumetric scattering or rain reflection. Mid tones are washed out, flattening the perceived distance between foreground structures and the horizon. Adding localized neon glow and pavement wetness will restore the cinematic mood.";
    rewrite = `${prompt}, volumetric fog, wet asphalt reflections, muted deep cyan shadows, sharp directional neon highlights`;
    impact = "high";
  } else if (p.includes("portrait") || p.includes("person") || p.includes("woman") || p.includes("man")) {
    weakness = "Skin texture fidelity and specular highlights";
    critique = "The facial features exhibit typical over smoothing in the cheeks and jawline, eroding authentic skin pores. The catchlights in the eyes lack directional coherence with the primary key light. Specifying natural skin micropores and subtle directional fill light will correct the artificial finish.";
    rewrite = `${prompt}, natural skin texture, visible pores, soft directional key lighting, distinct circular catchlights, Kodak Portra 400 tone`;
    impact = "high";
  } else if (p.includes("product") || p.includes("bottle") || p.includes("shoe") || p.includes("chair")) {
    weakness = "Material roughness and edge definition";
    critique = "Surface reflectivity appears uniform across both metallic and matte materials, reducing tactile realism. Edge contact shadows on the studio surface are overly diffuse, making the item feel slightly floating. Defining distinct roughness maps and grounding contact shadows fixes the anchor.";
    rewrite = `${prompt}, crisp contact shadows, tactile surface roughness, studio softbox illumination, clean seamless cyclorama backdrop`;
    impact = "medium";
  } else if (previousAttempts && previousAttempts.length > 1) {
    weakness = "Iterative convergence stagnation";
    critique = "Recent iterations show marginal improvement because prompt modifications repeated synonymous style descriptors rather than addressing spatial composition. The subject remains static in the geometric center of the frame. Shifting the camera angle and introducing dynamic diagonal lines will unlock progress.";
    rewrite = `${prompt}, dynamic three quarter Dutch angle, sweeping leading lines, intentional off center golden ratio framing`;
    impact = "high";
  }

  let driftObservation = null;
  if (anchorAttempt && anchorAttempt.prompt_text) {
    const wordOverlap = computeWordOverlap(anchorAttempt.prompt_text, prompt);
    if (wordOverlap < 0.4) {
      driftObservation = "Your prompt has drifted significantly from the original anchor attempt, moving from the initial aesthetic toward an unintended style.";
    } else {
      driftObservation = "Your generation remains aligned with the core intent of the anchor attempt.";
    }
  }

  return {
    critique_text: removeDashes(critique),
    suggested_prompt: removeDashes(rewrite),
    impact_estimate: impact,
    primary_weakness: removeDashes(weakness),
    drift_observation: driftObservation ? removeDashes(driftObservation) : null,
    source: isFallback ? "heuristic_fallback" : "heuristic",
    fallback_reason: reason || null
  };
}

function computeWordOverlap(text1, text2) {
  const set1 = new Set((text1 || "").toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const set2 = new Set((text2 || "").toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  if (set1.size === 0 || set2.size === 0) return 1.0;
  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }
  return intersection / Math.max(set1.size, set2.size);
}
