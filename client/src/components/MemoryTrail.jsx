import React, { useState } from "react";
import { Compass, AlertTriangle, ArrowDown, Sparkles, ChevronDown, ChevronUp, History, CheckCircle2 } from "lucide-react";

export default function MemoryTrail({
  attempts = [],
  activeAttemptId,
  onSelectAttempt
}) {
  const [expandedPrompts, setExpandedPrompts] = useState({});

  if (!attempts || attempts.length === 0) {
    return (
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[380px] shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-[#171a22] border border-[#262c37] flex items-center justify-center text-amber-400">
          <History className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Memory Trail Empty
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Your iteration history and the dynamic drift line will trace here as you commit attempts.
            Attempt 1 will pin as your immutable anchor.
          </p>
        </div>
      </div>
    );
  }

  const togglePrompt = (id) => {
    setExpandedPrompts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generate SVG path for the dynamic bending Drift Line
  // Nodes are spaced vertically, with horizontal deflection derived from drift score
  const itemHeight = 160;
  const totalHeight = Math.max(200, attempts.length * itemHeight);
  const centerX = 32;

  const points = attempts.map((att, idx) => {
    const y = idx * itemHeight + 50;
    // Deflect based on drift score, alternating directions for dynamic curve
    const deflection = att.deflection_px !== undefined 
      ? att.deflection_px 
      : Math.round(((att.drift_score || 0) / 100) * 28 * ((idx % 2 === 0) ? 1 : -1));
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

  return (
    <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 shadow-lg flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#21262f] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              Memory Trail
              <span className="text-[11px] font-mono font-normal text-gray-400">
                ({attempts.length} attempts)
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">
              The literal line tracking iteration trajectory from Attempt 1
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181d25] border border-[#29303d] text-gray-400">
          Anchor Pinned
        </div>
      </div>

      {/* Main Trail Container with SVG Drift Line */}
      <div className="relative flex">
        
        {/* Left SVG Drift Line Column */}
        <div className="relative w-16 shrink-0 hidden sm:block">
          <svg
            className="w-full"
            style={{ height: `${totalHeight}px` }}
            viewBox={`0 0 64 ${totalHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="driftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" />
                <stop offset="35%" stop-color="#10b981" />
                <stop offset="70%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#f43f5e" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Faint Center Datum Guideline */}
            <line
              x1={centerX}
              y1="20"
              x2={centerX}
              y2={totalHeight}
              stroke="#242b37"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Dynamic Bending Drift Line */}
            <path
              d={pathString}
              stroke="url(#driftGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Attempt Nodes */}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill={idx === 0 ? "#f59e0b" : p.score > 60 ? "#f43f5e" : "#10b981"}
                  stroke="#0a0b0d"
                  strokeWidth="2"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="2"
                  fill="#ffffff"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Right Cards Column */}
        <div className="flex-1 flex flex-col gap-4 pb-2">
          {attempts.map((att, idx) => {
            const isFirst = idx === 0;
            const isSelected = activeAttemptId === att.id;
            const isPromptExpanded = Boolean(expandedPrompts[att.id]);
            const prevAttempt = idx > 0 ? attempts[idx - 1] : null;

            return (
              <div key={att.id} className="flex flex-col gap-2">
                
                {/* Attempt Card */}
                <div
                  onClick={() => onSelectAttempt(att)}
                  className={`bg-[#161920] border rounded-xl p-4 transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? "border-cyan-500/60 shadow-md shadow-cyan-950/30 bg-[#191d26]"
                      : isFirst
                      ? "border-amber-500/40 bg-[#181a20]"
                      : "border-[#252b36] hover:border-[#38414f]"
                  }`}
                >
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-200">
                        #{att.order_index}
                      </span>
                      {isFirst ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-amber-400" />
                          Pinned Anchor
                        </span>
                      ) : (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          (att.drift_score || 0) > 60
                            ? "bg-rose-950/70 text-rose-300 border-rose-800/40"
                            : (att.drift_score || 0) > 30
                            ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
                            : "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                        }`}>
                          Drift : {att.drift_score || 0}%
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(att.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Thumbnail and Prompt Preview */}
                  <div className="flex gap-3">
                    {att.image_url_or_blob && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#2b3341] bg-black shrink-0">
                        <img
                          src={att.image_url_or_blob}
                          alt={`Attempt ${att.order_index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <p className="text-xs text-gray-300 leading-snug line-clamp-2">
                        {isPromptExpanded ? att.prompt_text : att.prompt_text}
                      </p>
                      {att.prompt_text?.length > 70 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePrompt(att.id);
                          }}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 mt-1"
                        >
                          {isPromptExpanded ? "Collapse" : "Full prompt"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* One Line Change / Diagnosis Note */}
                  <div className="bg-[#121419] border border-[#232934] rounded-md px-2.5 py-1.5 text-[11px] text-gray-300 leading-tight">
                    {isFirst ? (
                      <span className="text-amber-300/90 font-medium">Anchor baseline prompt committed.</span>
                    ) : (
                      <span>
                        <strong className="text-gray-400">Diagnosis : </strong>
                        {att.critique_text?.slice(0, 110)}...
                      </span>
                    )}
                  </div>

                </div>

                {/* Periodic Drift Note Banner (Every 3rd/4th attempt or critical drift) */}
                {att.drift_note && (
                  <div className="bg-[#1a171f] border border-amber-700/40 rounded-lg p-3 flex items-start gap-2 text-xs shadow-sm">
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
