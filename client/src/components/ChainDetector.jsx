import React from "react";
import { CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";

export default function ChainDetector({ analysis }) {
  if (!analysis) return null;

  if (!analysis.has_conflict) {
    return (
      <div className="bg-[#06140e] border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.1)]">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Pipeline nodes exhibit complementary instruction harmony</span>
      </div>
    );
  }

  return (
    <div className="bg-[#19090e] border border-rose-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
      <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span>Pipeline Contradiction Detected Across Nodes</span>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        {analysis.conflict_reports?.map((report, idx) => (
          <div key={idx} className="bg-[#100609] border border-rose-900/60 rounded-xl p-3 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 font-measurement text-[11px] text-gray-300">
              <span className="text-amber-400 font-semibold">{report.node_a_name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-rose-400 font-semibold">{report.node_b_name}</span>
            </div>
            
            <p className="text-gray-300 text-[11px] leading-relaxed">
              {report.reason}
            </p>

            {report.remedy && (
              <div className="text-[11px] font-measurement text-emerald-300 bg-[#060e0a] border border-emerald-900/50 px-3 py-1.5 rounded-lg mt-0.5">
                REMEDY: {report.remedy}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
