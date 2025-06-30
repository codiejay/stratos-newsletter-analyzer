import React from "react";
import { AnalysisResponse } from "@/app/api/analyze/route";

interface MetadataSectionProps {
  metadata: AnalysisResponse["metadata"];
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata }) => {
  return (
    <div className="text-xs text-white/30 space-y-1">
      <p>Topics: {metadata.topics?.join(", ")}</p>
      <p>Word Count: {metadata.word_count}</p>
      <p>Analyzed: {new Date(metadata.analyzed_at).toLocaleString()}</p>
    </div>
  );
};

export default MetadataSection;
