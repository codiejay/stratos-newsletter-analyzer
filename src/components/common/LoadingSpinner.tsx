import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "w-5 h-5",
}) => (
  <div
    className={`border-2 border-white/30 border-t-white/90 rounded-full animate-spin ${className}`}
  />
);

export default LoadingSpinner;
