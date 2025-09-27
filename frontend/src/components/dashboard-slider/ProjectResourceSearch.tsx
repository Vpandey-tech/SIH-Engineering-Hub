
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Search } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  description?: string;
  type: "github" | "youtube" | "docs";
}

// Helper functions to construct links (public search since no API keys)
const buildGitHubSearchURL = (topic: string, year: string) =>
  `https://github.com/search?q=${encodeURIComponent(topic + " " + year + " project")}&type=repositories`;

const buildYouTubeSearchURL = (topic: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " project tutorial")}`;

const buildDocsSearchURL = (topic: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(topic + " project documentation tutorial")}`;

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

const ProjectResourceSearch: React.FC = () => {
  const [year, setYear] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!topic || !year) return;
    setSearching(true);
    // Simulate fetch delay
    setTimeout(() => {
      setResources([
        {
          title: "GitHub Projects",
          url: buildGitHubSearchURL(topic, year),
          description: "Explore open-source repositories related to your project topic and year.",
          type: "github",
        },
        {
          title: "YouTube Tutorials",
          url: buildYouTubeSearchURL(topic),
          description: "Watch tutorials on similar projects and learn step by step.",
          type: "youtube",
        },
        {
          title: "Documentation & Articles",
          url: buildDocsSearchURL(topic),
          description: "Find online guides, articles, and documentation on building this project.",
          type: "docs",
        },
      ]);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form 
        onSubmit={handleSearch}
        className="space-y-5 mb-8 bg-slate-50/60 dark:bg-slate-800/40 p-6 rounded-lg shadow"
      >
        <div>
          <label className="block mb-1 font-medium text-slate-700 dark:text-slate-200">
            Select Academic Year
          </label>
          <select
            className="w-full rounded border bg-white dark:bg-slate-900 px-3 py-2 text-base dark:text-slate-100"
            value={year}
            onChange={e => setYear(e.target.value)}
            required
          >
            <option value="">-- Select Year --</option>
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-slate-700 dark:text-slate-200">
            Enter Project Topic / Technology
          </label>
          <Input
            placeholder="e.g. Weather App, Blockchain, Face Recognition"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            maxLength={48}
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full mt-2 flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Search Resources
        </Button>
      </form>
      {searching && (
        <div className="flex items-center gap-2 justify-center text-blue-700">
          <Loader className="animate-spin w-5 h-5" />
          Searching resources...
        </div>
      )}
      {touched && !searching && resources && (
        <div className="mt-6 space-y-6">
          {resources.map(res => (
            <Card key={res.type} className="border-2">
              <CardContent className="py-5">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg text-blue-700 hover:underline"
                >
                  {res.title}
                </a>
                <div className="text-sm text-slate-700 mt-1">{res.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectResourceSearch;
