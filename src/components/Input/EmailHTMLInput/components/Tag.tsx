import React from "react";

interface TagProps {
  text: string;
  type:
    | "classification"
    | "sentiment"
    | "action"
    | "technical_depth"
    | "credibility";
}

const Tag: React.FC<TagProps> = ({ text, type }) => {
  const getTagStyle = () => {
    switch (type) {
      case "classification":
        return "bg-blue-500/20 text-blue-300";
      case "sentiment":
        return "bg-green-500/20 text-green-300";
      case "action":
        return "bg-yellow-500/20 text-yellow-300";
      case "technical_depth":
        return "bg-purple-500/20 text-purple-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${getTagStyle()}`}
    >
      {text}
    </span>
  );
};

export default Tag;
