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
      <div className="glow-card-wrapper group/trail-empty">
        <div className="glow-card-underlay glow-card-underlay-emerald" />
        <div className="glow-border-card p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-emerald-400/20 to-transparent border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.25)] group-hover/trail-empty:scale-105 transition-transform">
            <History className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="max-w-xs">
            <h3 className="font-sora text-base font-semibold text-white tracking-tight">
              Lineage Trail Inactive
            </h3>
            <p className="text-xs text-gray-400 mt-2.5 leading-relaxed font-light">
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
    <div className="glow-card-wrapper group/trail is-active">
      <div className="glow-card-underlay glow-card-underlay-emerald" />
      <div className="glow-border-card p-5 sm:p-6 flex flex-col gap-5">
        
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-emerald-400/20 to-transparent border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sora text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <span>Lineage Trail</span>
                <span className="text-[11px] font-measurement font-normal text-gray-400">
                  [<CountUpNumber value={attempts.length} /> ATTEMPTS]
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 font-light">
                Continuous trajectory relative to Attempt 1
              </p>
            </div>
          </div>

          {nonAnchorAttempts.length > 0 && (
            <div className="text-[10px] font-measurement px-3 py-1 rounded-full glow-pill-amber font-semibold">
              AVG DRIFT: <span><CountUpNumber value={avgDrift} />%</span>
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
                <filter id="splineGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Datum Reference Centerline */}
              <line
                x1={centerX}
                y1="20"
                x2={centerX}
                y2={totalHeight}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Animated Consequential Drift Spline with Glow */}
              <path
                d={pathString}
                stroke="url(#driftGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#splineGlow)"
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
                  
                  {/* Attempt Card with Cyber Glow */}
                  <div
                    onClick={() => onSelectAttempt(att)}
                    className={`rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col gap-3 ${
                      isSelected
                        ? "border border-amber-400/60 bg-gradient-to-r from-amber-500/15 via-[#0c0f18] to-[#0c0f18] shadow-[0_4px_24px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/30"
                        : isFirst
                        ? "border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-[#090b12] to-[#090b12] hover:border-amber-400/50"
                        : "border border-white/10 bg-[#07080c] hover:border-white/20 hover:bg-[#090b12] shadow-sm"
                    }`}
                  >
                    
                    {/* Top Bar with Monospace Measurements */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-measurement text-xs font-semibold text-gray-200">
                          #{att.order_index}
                        </span>
                        {isFirst ? (
                          <span className="text-[10px] font-measurement px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                            <Compass className="w-3 h-3 text-amber-400" />
                            ANCHOR BASELINE
                          </span>
                        ) : (
                          <span className={`text-[10px] font-measurement px-2.5 py-0.5 rounded-full border ${
                            (att.drift_score || 0) > 55
                              ? "bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                              : (att.drift_score || 0) > 25
                              ? "bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                              : "bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]"
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
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/12 bg-black shrink-0 shadow-inner">
                          <img
                            src={att.image_url_or_blob}
                            alt={`Attempt ${att.order_index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <p className="text-xs text-gray-300 leading-snug line-clamp-2 font-light">
                          {att.prompt_text}
                        </p>
                        {att.prompt_text?.length > 70 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePrompt(att.id);
                            }}
                            className="text-[10px] text-gray-400 hover:text-amber-300 flex items-center gap-0.5 mt-1 cursor-pointer transition-colors"
                          >
                            {isPromptExpanded ? "Collapse" : "Full prompt"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Diagnosis Note */}
                    <div className="bg-[#050608] border border-white/8 rounded-lg px-3 py-2 text-[11px] text-gray-300 leading-tight">
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

                  {/* Periodic Drift Assessment Banner with Amber Glow */}
                  {att.drift_note && (
                    <div className="bg-gradient-to-r from-amber-500/10 via-[#150d11] to-[#150d11] border border-amber-500/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs shadow-[0_0_18px_rgba(245,158,11,0.15)]">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="font-sora font-semibold text-amber-300 text-[11px] tracking-wide">
                          Anchor Drift Assessment
                        </span>
                        <p className="text-gray-300 text-[11px] leading-relaxed font-light">
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
