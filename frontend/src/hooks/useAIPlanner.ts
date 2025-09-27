
import { useState, useEffect, useCallback } from "react";

export interface PlannerInput {
  year: string;
  semester: string;
  subjects: string;
  focusQuery: string;
}

export const years = [
  "First Year",
  "Second Year",
  "Third Year",
  "Final Year",
];

export const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export const roadmapSteps = [
  "Analyzing your selected year and semester…",
  "Curating optimal study subjects…",
  "Identifying your key goal/focus area…",
  "Designing an AI-optimized timetable…",
  "Bringing success tips for the final roadmap…",
];

// Returns actionable tips adapted to inputs
export function getAIGeneratedTips(inputs: PlannerInput) {
  return [
    "Break down each subject into small, manageable weekly goals.",
    `Prioritize difficult topics in ${inputs.subjects.split(",")[0]?.trim() || "your focus subject"} using spaced repetition.`,
    "Do weekly self-quizzes & review past PYQs for key subjects.",
    "Make summary notes after every study session—consistency wins.",
    `Dedicate extra time on weekends for ${inputs.focusQuery || "your main goal"}.`,
    "Ask doubts early—form a study group or use university forums.",
    "Balance rest and study. Stay positive and track your progress with micro-checklists."
  ];
}

export type PlannerStep = "form" | "animating" | "loading" | "result";

export function useAIPlanner(initialOpen: boolean, onOpenChange: (open: boolean) => void) {
  const [inputs, setInputs] = useState<PlannerInput>({
    year: "",
    semester: "",
    subjects: "",
    focusQuery: "",
  });
  const [step, setStep] = useState<PlannerStep>("form");
  const [roadmapIdx, setRoadmapIdx] = useState(0);

  // Animation sequence for roadmap steps
  useEffect(() => {
    if (step === "animating") {
      setRoadmapIdx(0);
      let idx = 0;
      const interval = setInterval(() => {
        idx += 1;
        if (idx < roadmapSteps.length) {
          setRoadmapIdx(idx);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setStep("loading");
            setTimeout(() => setStep("result"), 1200);
          }, 700);
        }
      }, 650);
      return () => clearInterval(interval);
    }
  }, [step]);

  const startPlanner = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setStep("animating");
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        branch: "Computer Engineering",
        year: inputs.year,
        semester: inputs.semester,
        subjects: inputs.subjects,
        focusSubject: inputs.subjects.split(",")[0],
        studyTime: "4-6",
        description: inputs.focusQuery,
        goals: inputs.focusQuery,
      })
    );
  }, [inputs]);

  const closePlanner = useCallback(() => {
    setStep("form");
    setInputs({
      year: "",
      semester: "",
      subjects: "",
      focusQuery: "",
    });
    setRoadmapIdx(0);
    onOpenChange(false);
  }, [onOpenChange]);

  return {
    inputs,
    setInputs,
    step,
    setStep,
    roadmapIdx,
    setRoadmapIdx,
    startPlanner,
    closePlanner,
  };
}
