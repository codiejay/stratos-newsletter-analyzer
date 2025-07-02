import React from "react";
import { AnalysisResponse } from "@/app/api/analyze/route";

interface MetadataSectionProps {
  metadata: AnalysisResponse["metadata"];
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ metadata }) => {
  return (
    <div className="text-xs text-white/30 space-y-1">
      <div className="space-y-1">
        <p className="font-medium text-white/50">Companies:</p>
        <p>{metadata.topics?.business_names?.join(", ") || "None mentioned"}</p>
      </div>

      <div className="space-y-1">
        <p className="font-medium text-white/50">Technologies:</p>
        <p>{metadata.topics?.technologies?.join(", ") || "None mentioned"}</p>
      </div>

      <div className="space-y-1">
        <p className="font-medium text-white/50">Legislation:</p>
        <p>{metadata.topics?.legislation?.join(", ") || "None mentioned"}</p>
      </div>

      <div className="space-y-1">
        <p className="font-medium text-white/50">General Topics:</p>
        <p>{metadata.topics?.general?.join(", ") || "None mentioned"}</p>
      </div>

      <p>Word Count: {metadata.word_count}</p>
      <p>Analyzed: {new Date(metadata.analyzed_at).toLocaleString()}</p>
    </div>
  );
};

export default MetadataSection;
