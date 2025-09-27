
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Sparkles, Loader2, X, Brain } from "lucide-react";
import Guide from "@/components/Guide"; // The AI roadmap planner

export interface PlannerInput {
  year: string;
  semester: string;
  subjects: string;
  focusQuery: string;
}

interface AIPlannerLauncherProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const years = [
  "First Year",
  "Second Year",
  "Third Year",
  "Final Year"
];

const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8"
];

const AIPlannerLauncher: React.FC<AIPlannerLauncherProps> = ({ open, onOpenChange }) => {
  const [inputs, setInputs] = useState<PlannerInput>({
    year: "",
    semester: "",
    subjects: "",
    focusQuery: "",
  });
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  // Set localStorage profile on submit and trigger Guide rendering
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        branch: "Computer Engineering", // Hardcoded for now (can add selector later)
        year: inputs.year,
        semester: inputs.semester,
        subjects: inputs.subjects,
        focusSubject: inputs.subjects.split(",")[0],
        studyTime: "4-6", // Default for now
        description: inputs.focusQuery,
        goals: inputs.focusQuery,
      })
    );
    setTimeout(() => {
      setLoading(false);
      setStarted(true);
    }, 1800); // Simulate roadmap animation/AI processing
  };

  const handleField = (field: keyof PlannerInput, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrawerClose = () => {
    // Reset on close
    setInputs({
      year: "",
      semester: "",
      subjects: "",
      focusQuery: "",
    });
    setStarted(false);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={handleDrawerClose}>
      <DrawerContent className="max-w-full w-full sm:w-[440px] left-0 fixed animate-slide-in-right rounded-none sm:rounded-tl-2xl border-l-0 border-t sm:border-l z-50">
        <DrawerHeader className="flex flex-row gap-2 items-center justify-between pr-4 border-b">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <DrawerTitle className="text-lg font-bold text-slate-800">
              AI Study Planner
            </DrawerTitle>
          </span>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <X className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-6">
          {!started && (
            <form onSubmit={handleStart} className="space-y-5">
              <DrawerDescription className="mb-3">
                Get a customized study roadmap and tips to pass your semester exams! Enter your details below:
              </DrawerDescription>
              <div>
                <label className="block font-medium mb-1">Year</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white dark:bg-slate-800"
                  value={inputs.year}
                  required
                  onChange={e => handleField("year", e.target.value)}
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Semester</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white dark:bg-slate-800"
                  value={inputs.semester}
                  required
                  onChange={e => handleField("semester", e.target.value)}
                >
                  <option value="">Select semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Subjects <span className="text-xs text-slate-500">(comma separated)</span></label>
                <Input
                  required
                  placeholder="Eg: Data Structures, Algorithms"
                  value={inputs.subjects}
                  onChange={e => handleField("subjects", e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">What's your main goal or doubt?</label>
                <Input
                  required
                  placeholder="Eg: Pass with good marks, focus on key topics, etc."
                  value={inputs.focusQuery}
                  onChange={e => handleField("focusQuery", e.target.value)}
                />
              </div>
              <div>
                <Button
                  className="w-full mt-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                  type="submit"
                  disabled={loading}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Create Roadmap
                </Button>
              </div>
            </form>
          )}

          {loading && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <div className="mb-2 text-lg font-semibold text-slate-800">Generating your AI roadmap...</div>
              <div className="text-slate-500 text-center flex flex-col gap-1">
                <span>Analyzing subjects, year, and focus area</span>
                <span>Aligning resources for your semester</span>
                <span className="text-blue-600 font-medium animate-pulse">Almost ready!</span>
              </div>
            </div>
          )}

          {started && !loading && (
            <div className="mt-4">
              <Guide />
            </div>
          )}

        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AIPlannerLauncher;
