import { removeDashes } from "./llm.js";

/**
 * Drift Calculation Engine
 * Quantifies semantic and trajectory deviation from Attempt 1 (Pinned Anchor)
 * Generates periodic Drift Check observations (every 3rd or 4th attempt)
 * Computes deflection offsets for the dynamic SVG Drift Line
 */

export function calculateDrift({ currentPrompt, anchorPrompt, attemptIndex, previousAttempts = [] }) {
  if (attemptIndex <= 1 || !anchorPrompt) {
    return {
      drift_score: 0,
      drift_category: "anchor",
      drift_note: null,
      deflection_px: 0
    };
  }

  // Tokenize and compare word sets
  const anchorTokens = extractSignificantTokens(anchorPrompt);
  const currentTokens = extractSignificantTokens(currentPrompt);

  let commonCount = 0;
  for (const token of currentTokens) {
    if (anchorTokens.has(token)) commonCount++;
  }

  const unionSize = new Set([...anchorTokens, ...currentTokens]).size || 1;
  const jaccardDistance = 1 - (commonCount / unionSize);

  // Measure stylistic modifiers shift
  const anchorStyleDensity = countStyleKeywords(anchorPrompt);
  const currentStyleDensity = countStyleKeywords(currentPrompt);
  const styleShift = Math.abs(currentStyleDensity - anchorStyleDensity) * 12;

  // Raw score bounded 0 to 100
  let rawScore = Math.round((jaccardDistance * 70) + styleShift);
  rawScore = Math.max(5, Math.min(95, rawScore));

  // Determine category
  let category = "aligned";
  if (rawScore > 65) {
    category = "critical_drift";
  } else if (rawScore > 35) {
    category = "moderate_drift";
  } else {
    category = "tightly_aligned";
  }

  // Generate Drift Note every 3rd or 4th attempt or when critical drift occurs
  let driftNote = null;
  const isScheduledCheck = (attemptIndex % 3 === 0) || (attemptIndex % 4 === 0);

  if (isScheduledCheck || category === "critical_drift") {
    driftNote = generateDriftNote({
      attemptIndex,
      category,
      rawScore,
      anchorPrompt,
      currentPrompt
    });
  }

  // Deflection offset in pixels for SVG visualization (bends line left/right)
  // Moderate drift deflects outward, high drift swings wide
  const directionSign = (attemptIndex % 2 === 0) ? 1 : -1;
  const deflectionPx = Math.round((rawScore / 100) * 44 * directionSign);

  return {
    drift_score: rawScore,
    drift_category: category,
    drift_note: driftNote ? removeDashes(driftNote) : null,
    deflection_px: deflectionPx
  };
}

function extractSignificantTokens(text) {
  if (!text) return new Set();
  const stopwords = new Set([
    "the", "and", "with", "for", "from", "into", "that", "this", "image", "photo", "render",
    "very", "more", "shot", "style", "view", "high", "quality"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.has(w));

  return new Set(words);
}

function countStyleKeywords(text) {
  if (!text) return 0;
  const styleKeywords = [
    "cinematic", "lighting", "cyberpunk", "photorealistic", "moody", "neon", "minimalist",
    "macro", "octane", "unreal", "hyperdetailed", "grain", "volumetric", "bokeh", "pastel",
    "monochrome", "portrait", "wide", "close up", "aerial", "vintage"
  ];
  let count = 0;
  const lower = text.toLowerCase();
  for (const kw of styleKeywords) {
    if (lower.includes(kw)) count++;
  }
  return count;
}

function generateDriftNote({ attemptIndex, category, rawScore, anchorPrompt, currentPrompt }) {
  if (category === "critical_drift") {
    return `Drift Warning at Attempt ${attemptIndex} : Your prompt has diverged ${rawScore}% from your pinned anchor. Core motifs from Attempt 1 are being replaced by secondary descriptors. Consider restoring foundational anchor terms before regenerating again.`;
  }

  if (category === "moderate_drift") {
    return `Drift Check at Attempt ${attemptIndex} : Intent variance is at ${rawScore}%. You have introduced fresh stylistic modifiers while maintaining primary anchor elements. Monitor upcoming steps to prevent accidental diversion.`;
  }

  return `Drift Status at Attempt ${attemptIndex} : Strong trajectory alignment (${rawScore}% variance). Your edits are surgically addressing specific feedback while faithfully preserving the original aesthetic of Attempt 1.`;
}
