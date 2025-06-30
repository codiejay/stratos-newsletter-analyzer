import React from "react";

interface RawTextSectionProps {
  rawText: string;
}

const RawTextSection: React.FC<RawTextSectionProps> = ({ rawText }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/50">Raw Text:</h3>
      <div className="text-sm bg-white/5 p-4 rounded-lg max-h-40 overflow-auto">
        {rawText}
      </div>
    </div>
  );
};

export default RawTextSection;
