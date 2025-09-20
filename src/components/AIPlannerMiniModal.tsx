import React from "react";
import { X, Sparkles, Loader2, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Guide from "@/components/Guide";
import EnhancedStudyResults from "@/components/EnhancedStudyResults";
import AIPlannerSteps from "@/components/AIPlannerSteps";
import {
  useAIPlanner,
  years,
  semesters,
} from "@/hooks/useAIPlanner";

interface AIPlannerMiniModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIPlannerMiniModal: React.FC<AIPlannerMiniModalProps> = ({ open, onOpenChange }) => {
  const {
    inputs,
    setInputs,
    step,
    roadmapIdx,
    startPlanner,
    closePlanner,
  } = useAIPlanner(open, onOpenChange);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closePlanner}
        aria-label="Close AI planner overlay"
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white via-blue-50/80 to-blue-100 dark:from-slate-900 dark:via-blue-950/95 dark:to-indigo-900/70 animate-scale-in border border-blue-200/70 dark:border-blue-950/40">
        <div className="flex items-center justify-between p-6 border-b border-blue-100 dark:border-blue-800/40 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Study Planner</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Get your personalized study roadmap</p>
            </div>
          </div>
          <button
            onClick={closePlanner}
            aria-label="Close"
            className="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 p-2 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
          {step === "form" && (
            <form onSubmit={startPlanner} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Year</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                    value={inputs.year}
                    required
                    onChange={e => setInputs(s => ({ ...s, year: e.target.value }))}
                  >
                    <option value="">Select year</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Semester</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                    value={inputs.semester}
                    required
                    onChange={e => setInputs(s => ({ ...s, semester: e.target.value }))}
                  >
                    <option value="">Select semester</option>
                    {semesters.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">
                  Subjects <span className="text-xs text-slate-500 font-normal">(comma separated)</span>
                </label>
                <Input
                  required
                  placeholder="e.g., Data Structures, Algorithms, Database Management"
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400 py-2.5"
                  value={inputs.subjects}
                  onChange={e => setInputs(s => ({ ...s, subjects: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Study Goal</label>
                <Input
                  required
                  placeholder="e.g., Score 80%+, Clear concepts, Prepare for placements"
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400 py-2.5"
                  value={inputs.focusQuery}
                  onChange={e => setInputs(s => ({ ...s, focusQuery: e.target.value }))}
                />
              </div>
              <Button
                className="w-full font-semibold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg py-3 text-base"
                type="submit"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate My Study Roadmap
              </Button>
            </form>
          )}
          {step === "animating" && (
            <div className="py-8">
              <AIPlannerSteps roadmapIdx={roadmapIdx} />
            </div>
          )}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center gap-6 py-12 animate-fade-in">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                  Creating Your Personalized Roadmap
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Analyzing your requirements and curating the best resources...
                </p>
              </div>
            </div>
          )}
          {step === "result" && (
            <div className="animate-fade-in space-y-6">
              <EnhancedStudyResults
                subject={inputs.subjects?.split(",")[0]?.trim() || ""}
                goal={inputs.focusQuery}
              />
              <div className="border-t pt-6">
                <Guide />
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 shadow" 
                  variant="secondary" 
                  onClick={closePlanner}
                >
                  Create New Roadmap
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlannerMiniModal;