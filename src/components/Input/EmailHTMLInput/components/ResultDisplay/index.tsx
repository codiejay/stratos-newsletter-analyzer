import React from "react";
import { AnalysisResponse } from "@/app/api/analyze/route";
import TagsSection from "./TagsSection";
import SummarySection from "./SummarySection";
import MetadataSection from "./MetadataSection";
import RawTextSection from "./RawTextSection";

interface ResultDisplayProps {
  result: AnalysisResponse;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6 text-white/90">
      <TagsSection tags={result.tags} />
      <SummarySection synopsis={result.synopsis} />
      <MetadataSection metadata={result.metadata} />
      <RawTextSection rawText={result.raw_text} />
    </div>
  );
};

export default ResultDisplay;
