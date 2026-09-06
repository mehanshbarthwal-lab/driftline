import { Router } from "express";
import { getSession, createSession, addAttempt } from "../services/storage.js";
import { runVisionCritique } from "../services/llm.js";
import { runCouncilPipeline } from "../services/council.js";
import { calculateDrift } from "../services/drift.js";
import { detectChainConflicts } from "../services/chain.js";

const router = Router();

router.post("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { prompt, image, mode = "single", chain_nodes = [] } = req.body || {};

  if (!prompt || !image) {
    return res.status(400).json({
      error: "Both prompt text and image payload are required for diagnosis."
    });
  }

  let session = getSession(sessionId);
  if (!session) {
    session = createSession(sessionId);
  }

  const attemptIndex = session.attempts.length + 1;
  const anchorAttempt = session.attempts[0] || null;
  const anchorPrompt = anchorAttempt ? anchorAttempt.prompt_text : prompt;

  try {
    let critiqueResult;

    if (mode === "council") {
      critiqueResult = await runCouncilPipeline({
        prompt,
        imageBase64: image,
        previousAttempts: session.attempts,
        anchorAttempt
      });
    } else {
      critiqueResult = await runVisionCritique({
        prompt,
        imageBase64: image,
        previousAttempts: session.attempts,
        anchorAttempt
      });
    }

    // Measure drift relative to Attempt 1
    const driftData = calculateDrift({
      currentPrompt: prompt,
      anchorPrompt,
      attemptIndex,
      previousAttempts: session.attempts
    });

    // Check optional chain nodes
    let chainAnalysis = null;
    if (chain_nodes && chain_nodes.length >= 2) {
      chainAnalysis = detectChainConflicts(chain_nodes);
    }

    // Assemble and store Attempt object
    const attemptPayload = {
      prompt_text: prompt,
      image_url_or_blob: image,
      critique_text: critiqueResult.critique_text,
      suggested_prompt: critiqueResult.suggested_prompt,
      impact_estimate: critiqueResult.impact_estimate,
      drift_score: driftData.drift_score,
      drift_note: driftData.drift_note || critiqueResult.drift_observation || null,
      council_breakdown: critiqueResult.council_breakdown || null,
      consensus: critiqueResult.consensus || null,
      chain_analysis: chainAnalysis,
      source: critiqueResult.source,
      primary_weakness: critiqueResult.primary_weakness,
      deflection_px: driftData.deflection_px
    };

    const { session: updatedSession, attempt: newAttempt } = addAttempt(sessionId, attemptPayload);

    return res.json({
      success: true,
      attempt: newAttempt,
      session: updatedSession,
      meta: {
        attempt_index: attemptIndex,
        is_anchor: attemptIndex === 1,
        mode,
        source: critiqueResult.source
      }
    });

  } catch (error) {
    console.error("[Critique Route Error]:", error);
    return res.status(500).json({
      error: "Diagnosis execution encountered an unexpected issue.",
      details: error.message
    });
  }
});

export default router;
