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
    <div className="bg-[#07080c] border border-white/10 rounded-2xl p-4 flex flex-col gap-3.5 shadow-inner">
      
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Review Council Deliberation
              </span>
              <span className="text-[10px] uppercase font-measurement px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/10">
                3 ADVISORS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {consensus || "Independent domain advisors cross checked generation"}
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white text-xs cursor-pointer p-1 rounded-full hover:bg-white/5 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 3 Advisor Cards */}
      {expanded && (
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {advisors.map((adv) => (
            <div
              key={adv.advisor_id}
              className="bg-[#090b10] border border-white/10 rounded-xl p-3.5 flex flex-col gap-2 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAdvisorIcon(adv.role)}
                  <span className="text-xs font-semibold text-gray-200">
                    {adv.advisor_name}
                  </span>
                </div>
                <span className={`text-[10px] font-measurement uppercase px-2 py-0.5 rounded-full border ${getSeverityBadge(adv.severity)}`}>
                  {adv.severity} PRIORITY
                </span>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed pl-5">
                {adv.focal_diagnosis}
              </p>

              {adv.recommended_fix && (
                <div className="text-[11px] font-measurement text-emerald-300 bg-[#050608] border border-emerald-500/20 px-3 py-1.5 rounded-lg ml-5">
                  REMEDY: {adv.recommended_fix}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
