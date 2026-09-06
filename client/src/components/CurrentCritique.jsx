import React, { useState } from "react";
import { CheckCircle2, Copy, ArrowRight, Check, Zap, Eye, Compass } from "lucide-react";
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
      <div className="instrument-card rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[440px]">
        <div className="w-12 h-12 rounded-xl bg-[#11141c] border border-white/10 flex items-center justify-center text-gray-400">
          <Compass className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="max-w-md">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Awaiting Visual Diagnosis
          </h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Supply an image and generation prompt in the input console. Driftline will isolate visual defects, calibrate impact, and structure targeted prompt refinements.
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

  // Saturated color reserved strictly for state: Impact calibration
  const getImpactBadge = (level) => {
    const l = (level || "medium").toLowerCase();
    if (l === "high") {
      return {
        label: "HIGH IMPACT",
        subtext: "Substantial structural and compositional delta",
        classes: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40"
      };
    }
    if (l === "low") {
      return {
        label: "MINOR POLISH",
        subtext: "Subtle nuance adjustments with minimal structural variance",
        classes: "text-gray-400 border-white/10 bg-white/5"
      };
    }
    return {
      label: "BALANCED REFINEMENT",
      subtext: "Calibrated adjustment preserving core subject geometry",
      classes: "text-amber-400 border-amber-500/40 bg-amber-950/40"
    };
  };

  const impactInfo = getImpactBadge(currentAttempt.impact_estimate);

  return (
    <div className="instrument-card rounded-xl p-5 flex flex-col gap-4">
      
      {/* Step 1: Top Status Bar & Confidence Pill */}
      <div className="reveal-step-1 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-measurement font-semibold text-gray-300">
            ATTEMPT #{attemptIndex || currentAttempt.order_index || 1}
          </span>
          {isAnchor && (
            <span className="text-[10px] font-measurement px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              ANCHOR
            </span>
          )}
        </div>

        {/* Restrained Glass Confidence Pill (Monospace Measurement) */}
        <div className={`instrument-glass px-2.5 py-1 rounded-full border text-[11px] font-measurement font-medium flex items-center gap-1.5 ${impactInfo.classes}`}>
          <Zap className="w-3 h-3" />
          <span>{impactInfo.label}</span>
        </div>
      </div>

      {/* Step 2: Focal Bottleneck Readout */}
      {currentAttempt.primary_weakness && (
        <div className="reveal-step-2 bg-[#0a0c10] border border-white/10 px-3 py-2 rounded-lg flex items-center justify-between">
          <span className="text-[11px] text-gray-400 font-medium">Primary Bottleneck:</span>
          <span className="text-xs font-semibold text-gray-200">
            {currentAttempt.primary_weakness}
          </span>
        </div>
      )}

      {/* Step 2: Concrete Diagnosis Text */}
      <div className="reveal-step-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>Visual Diagnosis</span>
          </label>
          <span className="text-[10px] font-measurement text-gray-400">
            CONFIDENCE CALIBRATED
          </span>
        </div>
        <div className="bg-[#0a0c10] border border-white/10 p-3.5 rounded-lg text-xs text-gray-200 leading-relaxed font-sans">
          {currentAttempt.critique_text}
        </div>
        <p className="text-[10px] text-gray-400">
          {impactInfo.subtext}
        </p>
      </div>

      {/* Step 3: Suggested Prompt Rewrite */}
      <div className="reveal-step-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-gray-300">
            Structured Rewrite
          </label>
          <button
            onClick={handleCopy}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-measurement">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="font-measurement">COPY</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-[#0a0c10] border border-white/10 rounded-lg p-3 text-xs text-gray-200 leading-relaxed font-measurement selection:bg-amber-500/30">
          {currentAttempt.suggested_prompt}
        </div>

        {/* Use Prompt Action */}
        <div className="flex items-center justify-end mt-1">
          <button
            onClick={() => onUsePrompt(currentAttempt.suggested_prompt)}
            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-gray-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Transfer to Console</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Step 4: Multi Advisor Council Review */}
      {currentAttempt.council_breakdown && currentAttempt.council_breakdown.length > 0 && (
        <div className="reveal-step-4">
          <CouncilReview
            advisors={currentAttempt.council_breakdown}
            consensus={currentAttempt.consensus}
          />
        </div>
      )}

      {/* Step 4: Chain Detector Contradiction Notice */}
      {currentAttempt.chain_analysis && (
        <div className="reveal-step-4">
          <ChainDetector analysis={currentAttempt.chain_analysis} />
        </div>
      )}

      {/* Step 4: Commit Next Attempt */}
      <div className="reveal-step-4 border-t border-white/10 pt-3.5 mt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-gray-400">
          Advance iteration cycle to measure drift
        </div>
        <button
          onClick={onCommitNextAttempt}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="Commit this attempt and prepare console for next cycle"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Commit to Trajectory</span>
        </button>
      </div>

    </div>
  );
}
