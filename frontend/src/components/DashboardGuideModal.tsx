// ✅ Cleaned & Updated DashboardGuideModal.tsx (Exam Preparation Removed)

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, Briefcase, FileText, Linkedin, X, Menu } from "lucide-react";
import ProjectSuggestionsCard from "./dashboard-slider/ProjectSuggestionsCard";
import InternshipNotificationsCard from "./dashboard-slider/InternshipNotificationsCard";
import ResumeTutorialCard from "./dashboard-slider/ResumeTutorialCard";
import LinkedInGuideCard from "./dashboard-slider/LinkedInGuideCard";

const sections = [
  {
    key: "project",
    label: "Project Suggestions",
    icon: <GraduationCap className="w-5 h-5 mr-2 text-indigo-700" />,
    component: <ProjectSuggestionsCard />,
  },
  {
    key: "internship",
    label: "Internship Notifications",
    icon: <Briefcase className="w-5 h-5 mr-2 text-pink-700" />,
    component: <InternshipNotificationsCard />,
  },
  {
    key: "resume",
    label: "Resume Tutorial",
    icon: <FileText className="w-5 h-5 mr-2 text-purple-700" />,
    component: <ResumeTutorialCard />,
  },
  {
    key: "linkedin",
    label: "LinkedIn Profile Guide",
    icon: <Linkedin className="w-5 h-5 mr-2 text-blue-700" />,
    component: <LinkedInGuideCard />,
  },
];

interface DashboardGuideModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

const DashboardGuideModal: React.FC<DashboardGuideModalProps> = ({ open, onOpenChange }) => {
  const [selected, setSelected] = useState(sections[0].key);

  const handleTabChange = (key: string) => setSelected(key);
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-5xl w-full h-[90vh] flex flex-col bg-white dark:bg-slate-900 p-0 shadow-2xl animate-fade-in">
        <DialogHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white">
            <Menu className="w-6 h-6 text-indigo-600" />
            Student Success Center
          </DialogTitle>
          <button 
            onClick={handleClose} 
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <nav className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Select Category
            </h3>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.key}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selected === section.key
                      ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100 shadow-sm"
                      : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                  onClick={() => handleTabChange(section.key)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-current={selected === section.key}
                >
                  {section.icon}
                  <span className="text-sm">{section.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <div className="animate-fade-in">
                {sections.find(section => section.key === selected)?.component}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardGuideModal;
