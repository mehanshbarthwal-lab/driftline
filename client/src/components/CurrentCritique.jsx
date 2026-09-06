import React, { useState } from "react";
import { CheckCircle2, Copy, ArrowRight, AlertTriangle, Sparkles, Check, Zap, Eye, Compass, ShieldAlert } from "lucide-react";
import CouncilReview from "./CouncilReview.jsx";
import ChainDetector from "./ChainDetector.jsx";

export default function CurrentCritique({
  currentAttempt,
  onUsePrompt,
  onCommitNextAttempt,
  isAnchor,
  attemptIndex
}) {
  const [copied, setCopied] = useState(false);

  if (!currentAttempt) {
    return (
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[420px] shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-[#171a21] border border-[#262c37] flex items-center justify-center text-cyan-400">
          <Compass className="w-7 h-7 stroke-[1.5]" />
        </div>
        <div className="max-w-md">
          <h3 className="text-base font-semibold text-white tracking-wide">
            Awaiting Visual Diagnosis
          </h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Upload an image and specify your prompt on the left, then click Run Visual Diagnosis.
            Driftline will pinpoint concrete flaws, calibrate impact, and generate targeted prompt rewrites.
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    if (currentAttempt.suggested_prompt) {
      navigator.clipboard.writeText(currentAttempt.suggested_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Confidence calibrated impact styling (Phase 4 requirement)
  const getImpactBadge = (level) => {
    const l = (level || "medium").toLowerCase();
    if (l === "high") {
      return {
        label: "High Impact Rewrite",
        subtext: "Regenerating will substantially transform visual structure",
        classes: "bg-emerald-950/70 text-emerald-300 border-emerald-700/50 shadow-emerald-950/40"
      };
    }
    if (l === "low") {
      return {
        label: "Minor Polish",
        subtext: "Subtle nuance adjustments with minimal structural variance",
        classes: "bg-gray-800/80 text-gray-300 border-gray-600/50 shadow-none"
      };
    }
    return {
      label: "Balanced Refinement",
      subtext: "Targets specific attributes while preserving overall framing",
      classes: "bg-cyan-950/70 text-cyan-300 border-cyan-700/50 shadow-cyan-950/40"
    };
  };

  const impactInfo = getImpactBadge(currentAttempt.impact_estimate);

  return (
    <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 shadow-lg flex flex-col gap-4">
      
      {/* Top Banner Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#21262f] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-mono font-semibold uppercase text-gray-300">
            Attempt {attemptIndex || currentAttempt.order_index || 1}
          </span>
          {isAnchor && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              Pinned Anchor
            </span>
          )}
        </div>

        {/* Impact Calibration Pill */}
        <div className={`px-2.5 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${impactInfo.classes}`}>
          <Zap className="w-3 h-3" />
          <span>{impactInfo.label}</span>
        </div>
      </div>

      {/* Primary Weakness Category */}
      {currentAttempt.primary_weakness && (
        <div className="bg-[#161a22] border border-[#272e3a] px-3.5 py-2 rounded-lg flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-gray-400">Focal Bottleneck :</span>
          <span className="text-xs font-medium text-amber-300">
            {currentAttempt.primary_weakness}
          </span>
        </div>
      )}

      {/* Concrete Diagnosis Text */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          Concrete Visual Diagnosis
        </label>
        <div className="bg-[#161920] border border-[#272d38] p-3.5 rounded-lg text-xs text-gray-200 leading-relaxed font-sans">
          {currentAttempt.critique_text}
        </div>
        <p className="text-[10px] text-gray-400 italic">
          {impactInfo.subtext}
        </p>
      </div>

      {/* Suggested Rewritten Prompt */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-gray-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Suggested Prompt Rewrite
          </label>
          <button
            onClick={handleCopy}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-[#161920] border border-amber-500/20 rounded-lg p-3 text-xs text-amber-100/90 leading-relaxed font-mono">
          {currentAttempt.suggested_prompt}
        </div>

        {/* Use This Prompt Action */}
        <div className="flex items-center justify-end mt-1">
          <button
            onClick={() => onUsePrompt(currentAttempt.suggested_prompt)}
            className="px-3 py-1.5 rounded-md bg-[#1d222b] hover:bg-[#262c37] border border-[#343b48] text-xs font-medium text-cyan-300 flex items-center gap-1.5 transition-all"
          >
            <span>Use Prompt in Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Council Review Breakdown (Phase 3) */}
      {currentAttempt.council_breakdown && currentAttempt.council_breakdown.length > 0 && (
        <CouncilReview
          advisors={currentAttempt.council_breakdown}
          consensus={currentAttempt.consensus}
        />
      )}

      {/* Chain Detector Warning (Phase 4) */}
      {currentAttempt.chain_analysis && (
        <ChainDetector analysis={currentAttempt.chain_analysis} />
      )}

      {/* Next Attempt Regenerate Affordance */}
      <div className="border-t border-[#21262f] pt-4 mt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-400">
          Ready to generate on your creative platform?
        </div>
        <button
          onClick={onCommitNextAttempt}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          title="Save this attempt and prepare the editor for the next generation"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Commit Attempt to Lineage</span>
        </button>
      </div>

    </div>
  );
}
