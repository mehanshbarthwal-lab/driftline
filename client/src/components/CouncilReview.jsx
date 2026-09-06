import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp, Compass, Palette, Sliders } from "lucide-react";

export default function CouncilReview({ advisors = [], consensus }) {
  const [expanded, setExpanded] = useState(true);

  if (!advisors || advisors.length === 0) return null;

  const getAdvisorIcon = (role) => {
    const r = (role || "").toLowerCase();
    if (r.includes("spatial") || r.includes("composition")) {
      return <Compass className="w-3.5 h-3.5 text-gray-400" />;
    }
    if (r.includes("style") || r.includes("intent")) {
      return <Palette className="w-3.5 h-3.5 text-gray-400" />;
    }
    return <Sliders className="w-3.5 h-3.5 text-gray-400" />;
  };

  const getSeverityBadge = (severity) => {
    const s = (severity || "moderate").toLowerCase();
    if (s === "critical") {
      return "bg-rose-950/60 text-rose-300 border-rose-500/40";
    }
    if (s === "minor") {
      return "bg-white/5 text-gray-400 border-white/10";
    }
    return "bg-amber-950/60 text-amber-300 border-amber-500/40";
  };

  return (
    <div className="bg-[#0a0c10] border border-white/10 rounded-lg p-3.5 flex flex-col gap-3">
      
      {/* Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">
                Review Council Deliberation
              </span>
              <span className="text-[10px] uppercase font-measurement px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                3 ADVISORS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {consensus || "Independent domain advisors cross checked generation"}
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-200 text-xs cursor-pointer">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 3 Advisor Cards */}
      {expanded && (
        <div className="grid grid-cols-1 gap-2 pt-1">
          {advisors.map((adv) => (
            <div
              key={adv.advisor_id}
              className="bg-[#0e1117] border border-white/10 rounded-lg p-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {getAdvisorIcon(adv.role)}
                  <span className="text-xs font-medium text-gray-200">
                    {adv.advisor_name}
                  </span>
                </div>
                <span className={`text-[10px] font-measurement uppercase px-2 py-0.5 rounded border ${getSeverityBadge(adv.severity)}`}>
                  {adv.severity} PRIORITY
                </span>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed pl-5">
                {adv.focal_diagnosis}
              </p>

              {adv.recommended_fix && (
                <div className="text-[11px] font-measurement text-gray-200 bg-[#060709] border border-white/10 px-2.5 py-1 rounded ml-5">
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
