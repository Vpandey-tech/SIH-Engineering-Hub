
import React from "react";
import { GraduationCap } from "lucide-react";
import ProjectResourceSearch from "./ProjectResourceSearch";

const ProjectSuggestionsCard: React.FC = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <GraduationCap className="w-6 h-6 text-indigo-600" />
      <h3 className="text-lg font-bold text-indigo-800">Project Suggestions</h3>
    </div>
    <ProjectResourceSearch />
  </div>
);

export default ProjectSuggestionsCard;
