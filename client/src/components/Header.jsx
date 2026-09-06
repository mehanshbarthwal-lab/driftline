import React from "react";
import { Compass, Sparkles, Users, RefreshCw, Layers, ShieldCheck, PlayCircle } from "lucide-react";
import { SAMPLE_SCENARIOS } from "../data/samples.js";

export default function Header({
  sessionId,
  councilMode,
  setCouncilMode,
  onResetSession,
  onLoadSample,
  showChainDrawer,
  setShowChainDrawer,
  attemptCount
}) {
  return (
    <header className="border-b border-[#22272f] bg-[#0e1014]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand and Tagline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-wide text-white text-lg">Driftline</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  Diagnostic Layer
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">
                Visual flaw diagnosis and anchor trajectory tracking
              </p>
            </div>
          </div>

          {/* Session ID Pill (Mobile) */}
          <div className="md:hidden text-[11px] font-mono text-gray-400 bg-[#16191f] px-2.5 py-1 rounded border border-[#262c36]">
            Session : {sessionId?.slice(0, 10)}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Preset Scenario Quick Select */}
          <div className="flex items-center gap-1.5 bg-[#14171d] px-2.5 py-1.5 rounded-lg border border-[#252b35]">
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-gray-300 font-medium mr-1">Sample :</span>
            <select
              onChange={(e) => {
                const sample = SAMPLE_SCENARIOS.find(s => s.id === e.target.value);
                if (sample) onLoadSample(sample);
              }}
              defaultValue=""
              className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#14171d] text-gray-400">Select preset scenario</option>
              {SAMPLE_SCENARIOS.map(s => (
                <option key={s.id} value={s.id} className="bg-[#14171d] text-gray-200">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Single Critic vs 3 Advisor Council Toggle */}
          <div className="flex items-center bg-[#14171d] p-0.5 rounded-lg border border-[#252b35]">
            <button
              onClick={() => setCouncilMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                !councilMode
                  ? "bg-[#252b36] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Fast single model visual diagnosis"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fast Critic</span>
            </button>
            <button
              onClick={() => setCouncilMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                councilMode
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="3 parallel independent advisors synthesized by chairman"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Council Review</span>
            </button>
          </div>

          {/* Node Chain Inspector Toggle (Phase 4) */}
          <button
            onClick={() => setShowChainDrawer(!showChainDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              showChainDrawer
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-[#14171d] text-gray-300 border-[#252b35] hover:border-[#38414f]"
            }`}
            title="Inspect multi node pipeline for contradictory instructions"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Node Chain</span>
          </button>

          {/* New Session Button */}
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#252b35] bg-[#14171d] hover:bg-[#1b2029] text-gray-300 text-xs font-medium transition-all hover:border-[#3b4352]"
            title="Start a fresh iteration trail"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

        </div>

      </div>
    </header>
  );
}
