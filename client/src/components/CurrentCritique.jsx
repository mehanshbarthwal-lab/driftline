import React, { useState } from "react";
import { CheckCircle2, Copy, ArrowRight, Check, Zap, Eye, Compass, ArrowUpRight } from "lucide-react";
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
      <div className="bezel-shell">
        <div className="bezel-core p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px]">
          <div className="w-14 h-14 rounded-full bg-[#11141d] border border-white/10 flex items-center justify-center text-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Compass className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Awaiting Visual Diagnosis
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Supply an image and generation prompt in the attempt console. Driftline will isolate visual defects, calibrate impact, and structure targeted prompt refinements.
            </p>
          </div>
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
        classes: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
      };
    }
    if (l === "low") {
      return {
        label: "MINOR POLISH",
        subtext: "Subtle nuance adjustments with minimal structural variance",
        classes: "text-gray-300 border-white/10 bg-white/5"
      };
    }
    return {
      label: "BALANCED REFINEMENT",
      subtext: "Calibrated adjustment preserving core subject geometry",
      classes: "text-amber-400 border-amber-500/40 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
    };
  };

  const impactInfo = getImpactBadge(currentAttempt.impact_estimate);

  return (
    <div className="bezel-shell">
      <div className="bezel-core p-5 sm:p-6 flex flex-col gap-5">
        
        {/* Step 1: Top Status Bar & Confidence Pill */}
        <div className="reveal-step-1 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-measurement font-semibold text-gray-200">
              ATTEMPT #{attemptIndex || currentAttempt.order_index || 1}
            </span>
            {isAnchor && (
              <span className="text-[10px] font-measurement px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                <Compass className="w-3 h-3 text-amber-400" />
                ANCHOR
              </span>
            )}
          </div>

          {/* Restrained Glass Confidence Pill (Monospace Measurement) */}
          <div className={`px-3 py-1 rounded-full border text-[11px] font-measurement font-medium flex items-center gap-1.5 ${impactInfo.classes}`}>
            <Zap className="w-3 h-3" />
            <span>{impactInfo.label}</span>
          </div>
        </div>

        {/* Step 2: Focal Bottleneck Readout */}
        {currentAttempt.primary_weakness && (
          <div className="reveal-step-2 bg-[#07080c] border border-white/10 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400 font-medium">Primary Bottleneck:</span>
            <span className="text-xs font-semibold text-white">
              {currentAttempt.primary_weakness}
            </span>
          </div>
        )}

        {/* Step 2: Concrete Diagnosis Text */}
        <div className="reveal-step-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-200 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-amber-400/90" />
              <span>Visual Diagnosis</span>
            </label>
            <span className="text-[10px] font-measurement text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              CALIBRATED
            </span>
          </div>
          <div className="bg-[#07080c] border border-white/10 p-4 rounded-xl text-xs text-gray-200 leading-relaxed font-sans shadow-inner">
            {currentAttempt.critique_text}
          </div>
          <p className="text-[10px] text-gray-400">
            {impactInfo.subtext}
          </p>
        </div>

        {/* Step 3: Suggested Prompt Rewrite */}
        <div className="reveal-step-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-gray-200">
              Structured Rewrite
            </label>
            <button
              onClick={handleCopy}
              className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 transition-colors cursor-pointer"
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
          
          <div className="bg-[#07080c] border border-white/10 rounded-xl p-4 text-xs text-gray-200 leading-relaxed font-measurement selection:bg-amber-500/30">
            {currentAttempt.suggested_prompt}
          </div>

          {/* Transfer to Console Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => onUsePrompt(currentAttempt.suggested_prompt)}
              className="group px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-gray-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Transfer to Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
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

        {/* Step 5: Commit Next Attempt with Button in Button Architecture */}
        <div className="reveal-step-4 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400">
            Advance iteration cycle to measure drift
          </div>
          
          <button
            onClick={onCommitNextAttempt}
            className="group btn-pill-primary w-full sm:w-auto text-xs bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.06)]"
            title="Commit this attempt and prepare console for next cycle"
          >
            <span className="font-semibold tracking-wide">Commit to Trajectory</span>
            <div className="btn-icon-wrapper">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
