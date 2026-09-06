import React from "react";
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";

export default function ChainDetector({ analysis }) {
  if (!analysis) return null;

  if (!analysis.has_conflict) {
    return (
      <div className="bg-[#131d1a] border border-emerald-900/40 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Pipeline nodes exhibit complementary instruction harmony</span>
      </div>
    );
  }

  return (
    <div className="bg-[#241318] border border-rose-900/50 rounded-lg p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center gap-2 text-rose-300 font-medium text-xs">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span>Pipeline Contradiction Detected Across Nodes</span>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        {analysis.conflict_reports?.map((report, idx) => (
          <div key={idx} className="bg-[#1b0d12] border border-rose-950/80 rounded-md p-2.5 text-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-gray-300">
              <span className="text-amber-400">{report.node_a_name}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-rose-400">{report.node_b_name}</span>
            </div>
            
            <p className="text-gray-300 text-[11px] leading-relaxed">
              {report.reason}
            </p>

            {report.remedy && (
              <div className="text-[11px] font-mono text-emerald-300 bg-[#0e1915] border border-emerald-900/40 px-2 py-1 rounded mt-0.5">
                Fix : {report.remedy}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
