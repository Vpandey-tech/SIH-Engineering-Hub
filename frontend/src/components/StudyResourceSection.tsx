import React from "react";
import { ExternalLink, AlertCircle, BookOpen, Info } from "lucide-react";
import { StudyResource } from "@/utils/studyResources";

interface StudyResourceSectionProps {
  icon: React.ReactNode;
  title: string;
  resources: StudyResource[];
  guidance?: string[];
  color?: string;
}

const StudyResourceSection: React.FC<StudyResourceSectionProps> = ({ 
  icon, 
  title, 
  resources, 
  guidance,
  color = "blue" 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      {resources.length > 0 ? (
        <div className="grid gap-3">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 rounded-lg border border-${color}-200 bg-${color}-50/50 hover:bg-${color}-100/70 hover:border-${color}-300 transition-all duration-200 group hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className={`font-medium text-${color}-900 group-hover:text-${color}-700 flex items-center gap-2 mb-1`}>
                    {resource.title}
                    <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    {resource.isWorking && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified</span>
                    )}
                  </h4>
                  {resource.description && (
                    <p className={`text-sm text-${color}-700 opacity-80`}>
                      {resource.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : guidance ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Study Guidance</h4>
          </div>
          <ul className="space-y-2">
            {guidance.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Search for these topics on YouTube (CodeWithHarry, Gate Smashers, Jenny's Lectures) 
              or visit GeeksforGeeks for detailed explanations and code examples.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <AlertCircle className="w-5 h-5 text-gray-500" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">No specific resources found for this topic.</p>
            <p>Try searching for "{title.toLowerCase()}" on YouTube or visit educational websites like GeeksforGeeks, W3Schools, or Tutorialspoint.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyResourceSection;