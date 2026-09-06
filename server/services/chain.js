import { removeDashes } from "./llm.js";

/**
 * Phase 4 Node Chain Disagreement Detector
 * Analyzes multi node generative pipelines (e.g. Base Generation -> Upscale -> Style Transfer)
 * Flags contradictory instructions between connected nodes before spending compute credits
 */

const CONFLICT_PAIRS = [
  {
    tagA: "soft_painterly",
    keywordsA: ["soft", "painterly", "oil painting", "watercolor", "diffuse", "impressionist", "blurred", "dreamy"],
    tagB: "sharp_crisp",
    keywordsB: ["crisp", "sharp", "hyperdetailed", "8k", "razor", "needle sharp", "ultra crisp", "micro detail"],
    reason: "Soft painterly aesthetics clash with aggressive edge sharpening, which destroys organic brushstroke textures.",
    remedy: "Use a structure preserving upscale model with low denoising strength instead of edge sharpening."
  },
  {
    tagA: "monochrome_muted",
    keywordsA: ["monochrome", "black and white", "sepia", "desaturated", "muted tones", "grayscale", "subdued palette"],
    tagB: "vivid_neon",
    keywordsB: ["vivid", "neon", "saturated", "technicolor", "hyper saturated", "rainbow", "cyberpunk colors"],
    reason: "Muted desaturated color grading directly contradicts vivid high saturation prompts in the pipeline.",
    remedy: "Align color grading nodes by choosing either monochrome tonal control or vivid chromatic richness."
  },
  {
    tagA: "minimalist_empty",
    keywordsA: ["minimalist", "clean empty", "sparse", "negative space", "isolated subject", "zen", "simple backdrop"],
    tagB: "complex_cluttered",
    keywordsB: ["intricate detail", "cluttered", "crowded", "dense patterns", "packed elements", "maximalist", "ornate"],
    reason: "Minimalist framing is compromised by downstream detail injection nodes that fill negative space with clutter.",
    remedy: "Constrain downstream denoise levels to protect minimalist compositional breathing room."
  },
  {
    tagA: "vintage_grain",
    keywordsA: ["vintage film", "grain", "noise", "analog texture", "kodak", "35mm grain", "dust and scratches"],
    tagB: "smooth_clean",
    keywordsB: ["smooth clean", "denoise", "crystal clear", "flawless skin", "noise reduction", "clean digital"],
    reason: "Film grain simulation is cancelled out by downstream denoising and smoothing algorithms.",
    remedy: "Apply film grain as the final terminal node in your chain rather than preceding a denoiser."
  }
];

export function detectChainConflicts(nodes = []) {
  if (!nodes || nodes.length < 2) {
    return {
      has_conflict: false,
      status: "compatible",
      message: "Single node or empty pipeline. No cross node conflicts detected.",
      conflict_reports: []
    };
  }

  const reports = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const nodeA = nodes[i];
    const nodeB = nodes[i + 1];

    const textA = (nodeA.prompt || nodeA.instruction || "").toLowerCase();
    const textB = (nodeB.prompt || nodeB.instruction || "").toLowerCase();

    for (const pair of CONFLICT_PAIRS) {
      const matchA = pair.keywordsA.some(kw => textA.includes(kw));
      const matchB = pair.keywordsB.some(kw => textB.includes(kw));

      const reverseMatchA = pair.keywordsB.some(kw => textA.includes(kw));
      const reverseMatchB = pair.keywordsA.some(kw => textB.includes(kw));

      if ((matchA && matchB) || (reverseMatchA && reverseMatchB)) {
        reports.push({
          node_a_name: nodeA.name || `Node ${i + 1}`,
          node_b_name: nodeB.name || `Node ${i + 2}`,
          node_a_type: nodeA.type || "generation",
          node_b_type: nodeB.type || "enhancement",
          reason: removeDashes(pair.reason),
          remedy: removeDashes(pair.remedy),
          severity: "high"
        });
      }
    }
  }

  const hasConflict = reports.length > 0;

  return {
    has_conflict: hasConflict,
    status: hasConflict ? "conflict_detected" : "pipeline_harmonious",
    message: hasConflict 
      ? `Detected ${reports.length} pipeline contradiction between sequential nodes.` 
      : "All pipeline nodes exhibit complementary parameter harmony.",
    conflict_reports: reports
  };
}
