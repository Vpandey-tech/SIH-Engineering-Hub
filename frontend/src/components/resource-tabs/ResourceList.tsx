import React from "react";
import { FolderOpen } from "lucide-react"; // Folder icon

interface Resource {
  name: string;
  url: string;
  description: string;
  branch: string;
  semester: string;
  isMostImportant?: boolean;
}

interface ResourceListProps {
  resources: Resource[];
  emptyText: string;
  type: "syllabus" | "pyq" | "mostImportant";
  containerClassName?: string;
  onSelectResource?: (resource: Resource) => void; // callback to open inside site
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  emptyText,
  type,
  containerClassName,
  onSelectResource,
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${containerClassName || ""}`}>
      {resources.length === 0 ? (
        <p className="col-span-full text-center text-gray-600 dark:text-gray-400 text-base font-medium">
          {emptyText}
        </p>
      ) : (
        resources.map((resource, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br from-teal-50/80 to-purple-50/80 dark:from-gray-900/80 dark:to-gray-800/80 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-teal-200/50 dark:border-purple-800/50 backdrop-blur-md cursor-pointer transform hover:scale-105 ${
              type === "mostImportant"
                ? "bg-gradient-to-br from-amber-50/90 to-red-50/90 dark:from-amber-900/80 dark:to-red-900/80 border-2 border-amber-300/70 dark:border-red-700/70 shadow-amber-300/50 dark:shadow-red-700/50"
                : ""
            }`}
            onClick={() => onSelectResource?.(resource)} // open inside site
          >
            {/* Folder Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 rounded-xl shadow-inner">
                <FolderOpen className="w-7 h-7 text-blue-600 dark:text-indigo-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {resource.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {resource.description}
            </p>

            {/* Button UI (kept EXACT same) */}
            <div
              className={`inline-flex items-center px-6 py-2 text-white rounded-full hover:focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 transition-all duration-300 ${
                type === "syllabus"
                  ? "bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 focus:ring-teal-400"
                  : type === "pyq"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-400"
                  : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-400"
              }`}
            >
              {type === "syllabus"
                ? "Syllabus Access"
                : type === "pyq"
                ? "PYQ Access"
                : "Most Important Access"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResourceList;
