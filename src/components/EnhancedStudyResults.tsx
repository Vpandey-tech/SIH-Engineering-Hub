import React, { useState, useEffect } from "react";
import { Sparkles, Youtube, FileText, Search, Lightbulb } from "lucide-react";
import StudyResourceSection from "@/components/StudyResourceSection";
import { getResourcesForSubject, generateStudyAdvice, youtubeResources } from "@/utils/studyResources";

interface EnhancedStudyResultsProps {
  subject: string;
  goal: string;
  year?: string;
  semester?: string;
  branch?: string;
}

const EnhancedStudyResults: React.FC<EnhancedStudyResultsProps> = ({ subject, goal, year, semester, branch }) => {
  const normalizedSubject = subject.toLowerCase().trim();
  const resourceData = getResourcesForSubject(normalizedSubject);
  const studyAdvice = generateStudyAdvice(subject, goal);
  const fallbackVideos = Object.values(youtubeResources)
    .flat()
    .filter(video => video.url && video.url.toLowerCase().includes(normalizedSubject)) || [];

  const videoResources = resourceData.videos.length > 0
    ? resourceData.videos
    : fallbackVideos.length > 0
    ? fallbackVideos
    : [{ title: "Explore on YouTube", url: "https://youtube.com" }];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Search className="w-6 h-6 text-purple-600 animate-pulse" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Focused Study Plan for {subject}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>
            <strong>Goal:</strong> {goal}
          </span>
          {branch && <span><strong>Branch:</strong> {branch}</span>}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">
            Smart Study Strategy
          </h3>
        </div>
        <ul className="space-y-2">
          {studyAdvice.map((advice, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-purple-900 dark:text-purple-100">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <span>{advice}</span>
            </li>
          ))}
        </ul>
      </div>

      <StudyResourceSection
        icon={<Youtube className="w-5 h-5 text-red-600" />}
        title="Video Tutorials"
        resources={videoResources}
        guidance={resourceData.guidance}
        color="red"
      />

      <StudyResourceSection
        icon={<FileText className="w-5 h-5 text-green-600" />}
        title="Practice & References"
        resources={resourceData.articles}
        color="green"
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Pro Tip:</strong> Start with video tutorials for concept clarity, then practice with coding platforms.
          Use spaced repetition and solve previous year questions for better retention.
        </p>
      </div>
    </div>
  );
};

export default EnhancedStudyResults;