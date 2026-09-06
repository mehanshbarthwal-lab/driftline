import React, { useState, useEffect } from "react";
import { Compass, AlertTriangle, History } from "lucide-react";

// Numeric count-up helper for animated measurement telemetry
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
      <div className="instrument-card rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[400px]">
        <div className="w-12 h-12 rounded-xl bg-[#11141c] border border-white/10 flex items-center justify-center text-gray-400">
          <History className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Memory Trail Inactive
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Your iteration history and dynamic drift spline will plot here as attempts commit. Attempt 1 locks as the immutable anchor.
          </p>
        </div>
      </div>
    );
  }

  const togglePrompt = (id) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate SVG path for the dynamic bending Drift Line
  const itemHeight = 150;
  const totalHeight = Math.max(200, attempts.length * itemHeight);
  const centerX = 32;

  const points = attempts.map((att, idx) => {
    const y = idx * itemHeight + 50;
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
    <div className="instrument-card rounded-xl p-5 flex flex-col gap-4">
      
      {/* Header Telemetry */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#141820] border border-white/10 flex items-center justify-center text-amber-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <span>Trajectory Trail</span>
              <span className="text-[11px] font-measurement font-normal text-gray-400">
                [<CountUpNumber value={attempts.length} /> ATTEMPTS]
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Continuous lineage tracked relative to Attempt 1
            </p>
          </div>
        </div>

        {nonAnchorAttempts.length > 0 && (
          <div className="text-[10px] font-measurement px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
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
              strokeWidth="2.2"
              strokeLinecap="round"
              className="drift-spline"
            />

            {/* Attempt Measurement Points */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
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
                  stroke="#060709"
                  strokeWidth="2"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="1.5"
                  className="drift-node"
                  fill="#ffffff"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Right Cards Column */}
        <div className="flex-1 flex flex-col gap-3 pb-2">
          {attempts.map((att, idx) => {
            const isFirst = idx === 0;
            const isSelected = activeAttemptId === att.id;
            const isPromptExpanded = Boolean(expandedPrompts[att.id]);

            return (
              <div key={att.id} className="flex flex-col gap-2">
                
                {/* Attempt Card */}
                <div
                  onClick={() => onSelectAttempt(att)}
                  className={`instrument-card rounded-lg p-3.5 transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? "border-white/30 bg-[#12151e] shadow-md"
                      : isFirst
                      ? "border-amber-500/30 bg-[#101217]"
                      : "hover:border-white/20"
                  }`}
                >
                  
                  {/* Top Bar with Monospace Measurements */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-measurement text-xs font-semibold text-gray-200">
                        #{att.order_index}
                      </span>
                      {isFirst ? (
                        <span className="text-[10px] font-measurement px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-amber-400" />
                          ANCHOR BASELINE
                        </span>
                      ) : (
                        <span className={`text-[10px] font-measurement px-2 py-0.5 rounded border ${
                          (att.drift_score || 0) > 55
                            ? "bg-rose-950/60 text-rose-300 border-rose-500/40"
                            : (att.drift_score || 0) > 25
                            ? "bg-amber-950/60 text-amber-300 border-amber-500/40"
                            : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
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
                      <div className="w-14 h-14 rounded-md overflow-hidden border border-white/10 bg-black shrink-0">
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
                  <div className="bg-[#08090d] border border-white/10 rounded px-2.5 py-1.5 text-[11px] text-gray-300 leading-tight">
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
                  <div className="bg-[#140e11] border border-amber-500/30 rounded-lg p-3 flex items-start gap-2 text-xs shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
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
  );
}
