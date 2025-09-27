
import React from "react";
import { ArrowRight, Route } from "lucide-react";
import { roadmapSteps } from "@/hooks/useAIPlanner";

interface AIPlannerStepsProps {
  roadmapIdx: number;
}

const AIPlannerSteps: React.FC<AIPlannerStepsProps> = ({ roadmapIdx }) => (
  <div className="flex flex-col items-center gap-4 py-8 animate-fade-in min-h-[300px]">
    <Route className="w-14 h-14 text-blue-600 animate-bounce-slow mb-2 drop-shadow" />
    <div className="font-bold text-lg mb-1 text-slate-900 dark:text-white text-center">
      Your AI-guided study journey is being created...
    </div>
    <div className="w-full flex flex-col items-start space-y-2 text-base font-medium max-w-sm mx-auto">
      {roadmapSteps.map((stepText, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-3 pl-1 transition-opacity duration-300 ${roadmapIdx >= idx ? "opacity-100" : "opacity-30"}`}>
          <ArrowRight className={`w-5 h-5 ${roadmapIdx === idx ? "animate-bounce-slow text-blue-500" : "text-blue-400"}`} />
          <span className={`${roadmapIdx === idx ? "font-semibold text-blue-900 dark:text-blue-200" : "text-slate-500"}`}>
            {stepText}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AIPlannerSteps;
