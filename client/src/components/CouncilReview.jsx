import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp, Compass, Palette, Sliders } from "lucide-react";

export default function CouncilReview({ advisors = [], consensus }) {
  const [expanded, setExpanded] = useState(true);

  if (!advisors || advisors.length === 0) return null;

  const getAdvisorIcon = (role) => {
    const r = (role || "").toLowerCase();
    if (r.includes("spatial") || r.includes("composition")) {
      return <Compass className="w-3.5 h-3.5 text-amber-400" />;
    }
    if (r.includes("style") || r.includes("intent")) {
      return <Palette className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Sliders className="w-3.5 h-3.5 text-amber-400" />;
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || "moderate").toLowerCase();
    if (s === "critical") {
      return "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.15)]";
    }
    if (s === "minor") {
      return "bg-white/5 text-gray-300 border-white/10";
    }
    return "bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.15)]";
  };

  return (
    <div className="bg-[#06070c] border border-white/10 rounded-2xl p-4 flex flex-col gap-3.5 shadow-inner">
      
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-400/20 to-transparent border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora text-xs font-bold text-white tracking-tight">
                Review Council Deliberation
              </span>
              <span className="text-[10px] uppercase font-measurement px-2.5 py-0.5 rounded-full glow-pill-amber font-semibold">
                3 ADVISORS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 font-light">
              {consensus || "Independent domain advisors cross checked generation"}
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white text-xs cursor-pointer p-1.5 rounded-full hover:bg-white/10 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 3 Advisor Cards */}
      {expanded && (
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {advisors.map((adv) => (
            <div
              key={adv.advisor_id}
              className="bg-[#090b10] border border-white/10 hover:border-amber-400/40 rounded-xl p-3.5 flex flex-col gap-2 transition-all hover:shadow-[0_0_16px_rgba(245,158,11,0.08)] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-400/30 transition-colors">
                    {getAdvisorIcon(adv.role)}
                  </div>
                  <span className="font-sora text-xs font-semibold text-gray-200">
                    {adv.advisor_name}
                  </span>
                </div>
                <span className={`text-[10px] font-measurement uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge(adv.severity)} font-medium`}>
                  {adv.severity} PRIORITY
                </span>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed pl-8 font-light">
                {adv.focal_diagnosis}
              </p>

              {adv.recommended_fix && (
                <div className="text-[11px] font-measurement text-emerald-300 bg-[#050608] border border-emerald-500/30 px-3.5 py-2 rounded-lg ml-8 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                  <span className="text-emerald-400 font-semibold mr-1.5">REMEDY:</span>
                  <span>{adv.recommended_fix}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
