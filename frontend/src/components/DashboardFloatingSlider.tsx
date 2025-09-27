
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import ProjectSuggestionsCard from "./dashboard-slider/ProjectSuggestionsCard";
import InternshipNotificationsCard from "./dashboard-slider/InternshipNotificationsCard";
import ExamPreparationCard from "./dashboard-slider/ExamPreparationCard";
import ResumeTutorialCard from "./dashboard-slider/ResumeTutorialCard";
import LinkedInGuideCard from "./dashboard-slider/LinkedInGuideCard";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sliderCards = [
  { key: "project", component: <ProjectSuggestionsCard /> },
  { key: "internship", component: <InternshipNotificationsCard /> },
  { key: "exam", component: <ExamPreparationCard /> },
  { key: "resume", component: <ResumeTutorialCard /> },
  { key: "linkedin", component: <LinkedInGuideCard /> },
];

const DashboardFloatingSlider: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState([0]);

  if (!open) return null;

  return (
    <div className="fixed top-6 right-10 z-50">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-6 px-6 w-[390px] max-w-[98vw] min-h-[375px] animate-fade-in">
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition"
          onClick={() => setOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <Slider
          min={0}
          max={sliderCards.length - 1}
          step={1}
          value={value}
          onValueChange={v => setValue(v)}
          className="mt-3 mb-6"
        />

        {sliderCards[value[0]].component}

        <div className="flex justify-center gap-2 mt-6">
          {sliderCards.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-3 h-3 rounded-full",
                value[0] === idx ? "bg-primary" : "bg-muted hover:bg-primary/50",
                "transition-colors"
              )}
              aria-label={`Go to card ${idx + 1}`}
              onClick={() => setValue([idx])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardFloatingSlider;
