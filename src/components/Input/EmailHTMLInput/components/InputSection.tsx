import React from "react";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface InputSectionProps {
  html: string;
  loading: boolean;
  onHtmlChange: (html: string) => void;
  onSubmit: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  html,
  loading,
  onHtmlChange,
  onSubmit,
}) => {
  return (
    <div className="p-4 border-t border-white/10">
      <div className="relative flex items-center gap-2">
        <textarea
          value={html}
          onChange={(e) => onHtmlChange(e.target.value)}
          placeholder="Paste Newsletter HTML here"
          className="w-full min-h-[88px] px-4 py-2.5 bg-white/5 rounded-lg resize-y outline-none border border-white/10 text-white/90 placeholder-white/50 focus:border-white/20 transition-colors"
          style={{ scrollbarWidth: "none", maxHeight: "300px" }}
        />
        <button
          onClick={onSubmit}
          disabled={loading || !html.trim()}
          className="flex items-center justify-center h-[44px] w-[44px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner /> : <ArrowIcon className="text-white" />}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
