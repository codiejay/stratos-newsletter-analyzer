"use client";

import React, { useState } from "react";
import { AnalysisResponse } from "@/app/api/analyze/route";
import ResultDisplay from "./components/ResultDisplay";
import InputSection from "./components/InputSection";

const EmailHTMLInput: React.FC = () => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!html.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze HTML");
      }

      // Validate the response structure
      if (!data.tags || typeof data.tags !== "object") {
        throw new Error("Invalid response format: missing tags");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[40vw] h-[70vh] rounded-lg overflow-hidden bg-[#0f1012] flex flex-col">
      <div className="flex-1 p-4 overflow-auto">
        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}
        {result && <ResultDisplay result={result} />}
      </div>
      <InputSection
        html={html}
        loading={loading}
        onHtmlChange={setHtml}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EmailHTMLInput;
