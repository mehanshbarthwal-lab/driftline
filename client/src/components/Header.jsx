import React, { useState } from "react";
import { Compass, Sparkles, Users, RefreshCw, Layers, PlayCircle, Menu, X } from "lucide-react";
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
    <header className="instrument-glass sticky top-0 z-40 px-4 lg:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Readout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141820] border border-white/10 flex items-center justify-center text-amber-400 shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">Driftline</span>
              <span className="text-[10px] font-measurement uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block leading-none mt-0.5">
              Visual flaw diagnosis and anchor drift measurement
            </p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Preset Scenario Select */}
          <div className="flex items-center gap-1.5 bg-[#0e1117] px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
            <PlayCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 font-normal">Scenario:</span>
            <select
              onChange={(e) => {
                const sample = SAMPLE_SCENARIOS.find(s => s.id === e.target.value);
                if (sample) onLoadSample(sample);
              }}
              defaultValue=""
              className="bg-transparent text-xs text-gray-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="" disabled className="bg-[#0e1117] text-gray-400">Select preset scenario</option>
              {SAMPLE_SCENARIOS.map(s => (
                <option key={s.id} value={s.id} className="bg-[#0e1117] text-gray-200">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Single Critic vs Council Review Segmented Pill */}
          <div className="flex items-center bg-[#0e1117] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setCouncilMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all cursor-pointer ${
                !councilMode
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Fast single model visual diagnosis"
            >
              <Sparkles className="w-3.5 h-3.5 text-gray-300" />
              <span>Fast Critic</span>
            </button>
            <button
              onClick={() => setCouncilMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-all cursor-pointer ${
                councilMode
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Three parallel independent advisors synthesized by chairman"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Council Review</span>
            </button>
          </div>

          {/* Node Chain Inspector Toggle */}
          <button
            onClick={() => setShowChainDrawer(!showChainDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              showChainDrawer
                ? "bg-white/10 text-white border-white/20"
                : "bg-[#0e1117] text-gray-300 border-white/10 hover:border-white/20"
            }`}
            title="Inspect multi node pipeline for contradictory instructions"
          >
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span>Node Chain</span>
          </button>

          {/* Session Telemetry Pill */}
          <div className="text-[11px] font-measurement text-gray-400 bg-[#0e1117] px-2.5 py-1.5 rounded-lg border border-white/10">
            Att: <span className="text-gray-200 font-semibold">{attemptCount}</span>
          </div>

          {/* Reset Action */}
          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0e1117] hover:bg-white/5 text-gray-300 text-xs font-medium transition-all cursor-pointer"
            title="Start a fresh iteration trail"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset</span>
          </button>

        </div>

        {/* Mobile Action Pill & Morphing Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <div className="text-[11px] font-measurement text-gray-400 bg-[#0e1117] px-2 py-1 rounded border border-white/10">
            Att: <span className="text-gray-200">{attemptCount}</span>
          </div>

          {/* Rotate Scale Fade Icon Morph Toggle (300ms) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Controls"
            className="relative w-9 h-9 rounded-lg bg-[#0e1117] border border-white/10 flex items-center justify-center text-gray-300 active:scale-95 transition-transform cursor-pointer"
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
        <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 flex flex-col gap-3 animate-in fade-in duration-200">
          
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
              className="bg-[#0e1117] text-xs text-gray-200 border border-white/10 rounded-lg px-2.5 py-2"
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
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 ${
                !councilMode
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-[#0e1117] text-gray-400 border-white/10"
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
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 ${
                councilMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-[#0e1117] text-gray-400 border-white/10"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Council Review</span>
            </button>
          </div>

          {/* Drawer Actions */}
          <div className="flex items-center justify-between pt-1">
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
