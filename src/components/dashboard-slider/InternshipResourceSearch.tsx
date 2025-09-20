
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Search } from "lucide-react";

interface InternshipResource {
  title: string;
  url: string;
  description?: string;
  type: "linkedin" | "internshala" | "tcs" | "other";
}

const buildLinkedInURL = (field: string, location?: string) =>
  `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    field + " internship"
  )}${location ? `&location=${encodeURIComponent(location)}` : ""}`;

const buildInternshalaURL = (field: string) =>
  `https://internshala.com/internships/${encodeURIComponent(
    field
  )}-internship`;

const buildOtherURL = (field: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(field + " internship")}`;

const InternshipResourceSearch: React.FC = () => {
  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);
  const [resources, setResources] = useState<InternshipResource[] | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!field) return;
    setSearching(true);

    setTimeout(() => {
      setResources([
        {
          title: "LinkedIn Internships",
          url: buildLinkedInURL(field, location),
          description: "Browse live internship postings on LinkedIn tailored to your field.",
          type: "linkedin",
        },
        {
          title: "Internshala Internships",
          url: buildInternshalaURL(field),
          description: "Browse internships in your domain on Internshala.",
          type: "internshala",
        },
        {
          title: "Google Search",
          url: buildOtherURL(field),
          description: "Explore internship opportunities with a focused Google search.",
          type: "other",
        },
      ]);
      setSearching(false);
    }, 1000); // Simulate online fetch
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="space-y-5 mb-8 bg-slate-50/60 dark:bg-slate-800/40 p-6 rounded-lg shadow"
      >
        <div>
          <label className="block mb-1 font-medium text-slate-700 dark:text-slate-200">
            Enter Your Field of Interest <span className="text-red-600">*</span>
          </label>
          <Input
            placeholder="e.g. Data Science, Mechanical, Web Development"
            value={field}
            onChange={e => setField(e.target.value)}
            maxLength={48}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-slate-700 dark:text-slate-200">
            Location (Optional)
          </label>
          <Input
            placeholder="e.g. Mumbai, Remote"
            value={location}
            onChange={e => setLocation(e.target.value)}
            maxLength={32}
          />
        </div>
        <Button type="submit" size="lg" className="w-full mt-2 flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Search Internships
        </Button>
      </form>
      {searching && (
        <div className="flex items-center gap-2 justify-center text-pink-700">
          <Loader className="animate-spin w-5 h-5" />
          Searching internships...
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

export default InternshipResourceSearch;
