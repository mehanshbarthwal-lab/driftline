import React, { useState, useEffect } from "react";
import { Compass, AlertTriangle, History } from "lucide-react";

// Numeric count up helper for animated measurement telemetry
function CountUpNumber({ value, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startVal = 0;
    const endVal = Number(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startVal + (endVal - startVal) * eased));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

export default function MemoryTrail({
  attempts = [],
  activeAttemptId,
  onSelectAttempt
}) {
  const [expandedPrompts, setExpandedPrompts] = useState({});

  if (!attempts || attempts.length === 0) {
    return (
      <div className="bezel-shell">
        <div className="bezel-core p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px]">
          <div className="w-14 h-14 rounded-full bg-[#11141d] border border-white/10 flex items-center justify-center text-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <History className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Lineage Trail Inactive
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Your iteration trajectory and dynamic drift spline will plot here as attempts commit. Attempt 1 locks as the immutable anchor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const togglePrompt = (id) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate SVG path for the dynamic bending Drift Line
  const itemHeight = 154;
  const totalHeight = Math.max(220, attempts.length * itemHeight);
  const centerX = 32;

  const points = attempts.map((att, idx) => {
    const y = idx * itemHeight + 52;
    const deflection = att.deflection_px !== undefined 
      ? att.deflection_px 
      : Math.round(((att.drift_score || 0) / 100) * 26 * ((idx % 2 === 0) ? 1 : -1));
    const x = idx === 0 ? centerX : Math.max(10, Math.min(54, centerX + deflection));
    return { x, y, score: att.drift_score || 0 };
  });

  // Construct smooth SVG cubic bezier path
  let pathString = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midY = (p0.y + p1.y) / 2;
    pathString += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  // Calculate average drift for telemetry header
  const nonAnchorAttempts = attempts.slice(1);
  const avgDrift = nonAnchorAttempts.length > 0
    ? Math.round(nonAnchorAttempts.reduce((acc, a) => acc + (a.drift_score || 0), 0) / nonAnchorAttempts.length)
    : 0;

  return (
    <div className="bezel-shell">
      <div className="bezel-core p-5 sm:p-6 flex flex-col gap-5">
        
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/5 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <span>Lineage Trail</span>
                <span className="text-[11px] font-measurement font-normal text-gray-400">
                  [<CountUpNumber value={attempts.length} /> ATTEMPTS]
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Continuous trajectory relative to Attempt 1
              </p>
            </div>
          </div>

          {nonAnchorAttempts.length > 0 && (
            <div className="text-[10px] font-measurement px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              AVG DRIFT: <span className="text-amber-400 font-semibold"><CountUpNumber value={avgDrift} />%</span>
            </div>
          )}
        </div>

        {/* Main Trail Container with Consequential Motion SVG Drift Spline */}
        <div className="relative flex">
          
          {/* Left SVG Drift Spline Column */}
          <div className="relative w-16 shrink-0 hidden sm:block">
            <svg
              className="w-full overflow-visible"
              style={{ height: `${totalHeight}px` }}
              viewBox={`0 0 64 ${totalHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="driftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="30%" stopColor="#10b981" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Datum Reference Centerline */}
              <line
                x1={centerX}
                y1="20"
                x2={centerX}
                y2={totalHeight}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Animated Consequential Drift Spline */}
              <path
                d={pathString}
                stroke="url(#driftGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drift-spline"
              />

              {/* Attempt Measurement Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5.5"
                    className="drift-node"
                    fill={
                      idx === 0
                        ? "#f59e0b"
                        : p.score > 55
                        ? "#f43f5e"
                        : p.score > 25
                        ? "#f59e0b"
                        : "#10b981"
                    }
                    stroke="#050608"
                    strokeWidth="2"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="1.75"
                    className="drift-node"
                    fill="#ffffff"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Right Cards Column */}
          <div className="flex-1 flex flex-col gap-3.5 pb-2">
            {attempts.map((att, idx) => {
              const isFirst = idx === 0;
              const isSelected = activeAttemptId === att.id;
              const isPromptExpanded = Boolean(expandedPrompts[att.id]);

              return (
                <div key={att.id} className="flex flex-col gap-2.5">
                  
                  {/* Attempt Card */}
                  <div
                    onClick={() => onSelectAttempt(att)}
                    className={`rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col gap-3 ${
                      isSelected
                        ? "border border-amber-400/40 bg-[#121622] shadow-[0_4px_24px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/20"
                        : isFirst
                        ? "border border-amber-500/30 bg-[#0f1118]"
                        : "border border-white/10 bg-[#07080c] hover:border-white/20 hover:bg-[#090b10]"
                    }`}
                  >
                    
                    {/* Top Bar with Monospace Measurements */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-measurement text-xs font-semibold text-gray-200">
                          #{att.order_index}
                        </span>
                        {isFirst ? (
                          <span className="text-[10px] font-measurement px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                            <Compass className="w-3 h-3 text-amber-400" />
                            ANCHOR BASELINE
                          </span>
                        ) : (
                          <span className={`text-[10px] font-measurement px-2.5 py-0.5 rounded-full border ${
                            (att.drift_score || 0) > 55
                              ? "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                              : (att.drift_score || 0) > 25
                              ? "bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                              : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          }`}>
                            DRIFT: {att.drift_score || 0}%
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-gray-400 font-measurement">
                        {new Date(att.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Thumbnail and Prompt Preview */}
                    <div className="flex gap-3">
                      {att.image_url_or_blob && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                          <img
                            src={att.image_url_or_blob}
                            alt={`Attempt ${att.order_index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <p className="text-xs text-gray-300 leading-snug line-clamp-2">
                          {att.prompt_text}
                        </p>
                        {att.prompt_text?.length > 70 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePrompt(att.id);
                            }}
                            className="text-[10px] text-gray-400 hover:text-gray-200 flex items-center gap-0.5 mt-1 cursor-pointer"
                          >
                            {isPromptExpanded ? "Collapse" : "Full prompt"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Diagnosis Note */}
                    <div className="bg-[#050608] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-gray-300 leading-tight">
                      {isFirst ? (
                        <span className="text-amber-300/90 font-medium">Anchor baseline prompt committed</span>
                      ) : (
                        <span>
                          <span className="text-gray-400 font-medium">Diagnosis: </span>
                          {att.critique_text?.slice(0, 110)}...
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Periodic Drift Assessment Banner */}
                  {att.drift_note && (
                    <div className="bg-[#170e12] border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs shadow-[0_0_16px_rgba(245,158,11,0.1)]">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-amber-300 text-[11px]">
                          Anchor Drift Assessment
                        </span>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          {att.drift_note}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
