import React from "react";
import { AnalysisResponse } from "@/app/api/analyze/route";

interface SummarySectionProps {
  synopsis: AnalysisResponse["synopsis"];
}

const SummarySection: React.FC<SummarySectionProps> = ({ synopsis }) => {
  return (
    <div className="space-y-3 bg-white/5 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-white/50">Synopsis:</h3>
      <p className="text-sm">{synopsis.brief}</p>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/30">Key Points:</h4>
        <ul className="list-disc list-inside space-y-1">
          {synopsis.key_points?.map((point, i) => (
            <li key={i} className="text-sm">
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/30">
          Interesting Facts:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          {synopsis.interesting_facts?.map((fact, i) => (
            <li key={i} className="text-sm">
              {fact}
            </li>
          ))}
        </ul>
      </div>
      {synopsis.action_items && synopsis.action_items.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-white/30">Action Items:</h4>
          <ul className="list-disc list-inside space-y-1">
            {synopsis.action_items.map((item, i) => (
              <li key={i} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummarySection;
