import React, { useState } from "react";
import { Compass, Sparkles, Users, RefreshCw, Layers, PlayCircle, Menu, X, ChevronRight } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 px-4 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="island-glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Readout with Luminous Compass Mark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/5 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.25)]">
            <Compass className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white text-sm sm:text-base">Driftline</span>
            <span className="text-[10px] font-measurement uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
              v2.4
            </span>
          </div>
        </div>

        {/* Center: Segmented Engine Switcher */}
        <div className="hidden lg:flex items-center bg-[#07090e] p-1 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => setCouncilMode(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              !councilMode
                ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20"
                : "text-gray-400 hover:text-gray-200"
            }`}
            title="Fast single model visual diagnosis"
          >
            <Sparkles className="w-3.5 h-3.5 text-gray-300" />
            <span>Fast Critic</span>
          </button>
          
          <button
            onClick={() => setCouncilMode(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
              councilMode
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "text-gray-400 hover:text-gray-200"
            }`}
            title="Three parallel independent advisors synthesized by chairman"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Council Review</span>
          </button>
        </div>

        {/* Right: Controls Deck */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* Preset Scenario Select */}
          <div className="flex items-center gap-2 bg-[#080a0f] px-3 py-1.5 rounded-full border border-white/10 text-xs">
            <PlayCircle className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="text-gray-400 font-normal text-[11px]">Preset:</span>
            <select
              onChange={(e) => {
                const sample = SAMPLE_SCENARIOS.find(s => s.id === e.target.value);
                if (sample) onLoadSample(sample);
              }}
              defaultValue=""
              className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled className="bg-[#080a0f] text-gray-400">Select scenario</option>
              {SAMPLE_SCENARIOS.map(s => (
                <option key={s.id} value={s.id} className="bg-[#080a0f] text-gray-200">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Node Chain Inspector Toggle */}
          <button
            onClick={() => setShowChainDrawer(!showChainDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              showChainDrawer
                ? "bg-white/15 text-white border-white/30"
                : "bg-[#080a0f] text-gray-300 border-white/10 hover:border-white/20"
            }`}
            title="Inspect multi node pipeline for contradictory instructions"
          >
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span>Nodes</span>
          </button>

          {/* Lineage Counter Badge */}
          <div className="text-[11px] font-measurement text-gray-400 bg-[#080a0f] px-3 py-1.5 rounded-full border border-white/10">
            Att: <span className="text-amber-400 font-semibold">{attemptCount}</span>
          </div>

          {/* Reset Action */}
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#080a0f] hover:bg-white/10 text-gray-300 text-xs font-medium transition-all cursor-pointer"
            title="Start a fresh iteration trail"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset</span>
          </button>

        </div>

        {/* Mobile Action Controls with Smooth Morph Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className="text-[11px] font-measurement text-gray-400 bg-[#080a0f] px-2.5 py-1 rounded-full border border-white/10">
            Att: <span className="text-amber-400 font-semibold">{attemptCount}</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Controls"
            className="relative w-8 h-8 rounded-full bg-[#080a0f] border border-white/10 flex items-center justify-center text-gray-300 active:scale-95 transition-transform cursor-pointer"
          >
            <Menu
              className={`w-4 h-4 absolute transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? "rotate-90 scale-75 opacity-0 pointer-events-none"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`w-4 h-4 absolute transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0 pointer-events-none"
              }`}
            />
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 island-glass rounded-2xl p-4 flex flex-col gap-3 animate-in fade-in duration-200">
          
          {/* Preset Scenario Select */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-gray-400 font-medium">Test Scenario</label>
            <select
              onChange={(e) => {
                const sample = SAMPLE_SCENARIOS.find(s => s.id === e.target.value);
                if (sample) {
                  onLoadSample(sample);
                  setMobileMenuOpen(false);
                }
              }}
              defaultValue=""
              className="bg-[#080a0f] text-xs text-gray-200 border border-white/10 rounded-xl px-3 py-2"
            >
              <option value="" disabled>Choose a creative scenario</option>
              {SAMPLE_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setCouncilMode(false);
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                !councilMode
                  ? "bg-white/15 text-white border-white/30"
                  : "bg-[#080a0f] text-gray-400 border-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gray-300" />
              <span>Fast Critic</span>
            </button>
            <button
              onClick={() => {
                setCouncilMode(true);
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                councilMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-[#080a0f] text-gray-400 border-white/10"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Council Review</span>
            </button>
          </div>

          {/* Drawer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setShowChainDrawer(!showChainDrawer);
                setMobileMenuOpen(false);
              }}
              className="text-xs text-gray-300 flex items-center gap-1.5 py-1"
            >
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>{showChainDrawer ? "Close Chain Inspector" : "Open Chain Inspector"}</span>
            </button>
            <button
              onClick={() => {
                onResetSession();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-300/90 flex items-center gap-1.5 py-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
