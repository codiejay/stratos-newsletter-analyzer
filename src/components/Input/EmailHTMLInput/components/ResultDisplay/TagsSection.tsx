import React from "react";
import Tag from "../Tag";
import { AnalysisResponse } from "@/app/api/analyze/route";

interface TagsSectionProps {
  tags: AnalysisResponse["tags"];
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags }) => {
  const renderTags = (
    tagList: string[] | undefined,
    type:
      | "classification"
      | "sentiment"
      | "action"
      | "technical_depth"
      | "credibility"
  ) => {
    if (!Array.isArray(tagList)) return null;
    return tagList.map((tag, i) => <Tag key={i} text={tag} type={type} />);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/50">Tags:</h3>
      <div className="space-y-2">
        <div>{renderTags(tags.classification, "classification")}</div>
        <div>{renderTags(tags.sentiment, "sentiment")}</div>
        <div>{renderTags(tags.action, "action")}</div>
        {tags.technical_depth && (
          <Tag text={tags.technical_depth} type="technical_depth" />
        )}
        <div>{renderTags(tags.credibility, "credibility")}</div>
      </div>
    </div>
  );
};

export default TagsSection;
