import React, { useState, useEffect } from "react";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { BookOpen, Stars } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { branches, semesters } from "@/data/resources";
import ResourceList from "./resource-tabs/ResourceList";
import DriveEmbed from "./DriveEmbed"; // component to embed PDF

interface Resource {
  name: string;
  url: string;
  description: string;
  branch: string;
  semester: string;
  isMostImportant?: boolean;
}

export default function ResourcesTabs() {
  const [showMOSOnly, setShowMOSOnly] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedSemester, setSelectedSemester] = useState("All");
  const [syllabusResources, setSyllabusResources] = useState<Resource[]>([]);
  const [pyqResources, setPyqResources] = useState<Resource[]>([]);
  const [mostImportantResources, setMostImportantResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState("syllabus");
  const [error, setError] = useState<string | null>(null);

  // URL for currently open resource
  const [currentResourceUrl, setCurrentResourceUrl] = useState<string | null>(null);

  const semesterMap: Record<string, string> = {
    "Semester 1": "Sem1", "Semester 2": "Sem2", "Semester 3": "Sem3",
    "Semester 4": "Sem4", "Semester 5": "Sem5", "Semester 6": "Sem6",
    "Semester 7": "Sem7", "Semester 8": "Sem8",
  };

  const branchMap: Record<string, string> = {
    "Computer Engineering": "Computer Engineering",
    IT: "IT",
    Mechanical: "Mechanical",
    EXTC: "EXTC",
    "CSE (AI&ML&DS)": "CSE",
    All: "All",
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setError(null);
        const mappedBranch = branchMap[selectedBranch] || selectedBranch;
        const year =
          ["Semester 1", "Semester 2"].includes(selectedSemester)
            ? "First Year"
            : mappedBranch === "All"
            ? "First Year"
            : mappedBranch;
        const semester =
          semesterMap[selectedSemester] ||
          (selectedSemester === "All" ? "" : "Sem1");

        // ----- Syllabus -----
        if (activeTab === "syllabus" && selectedSemester !== "All") {
          const res = await fetch(
            `http://localhost:5000/api/folders?year=${year}&category=Syllabus&semester=${semester}`
          );
          if (!res.ok) throw new Error("Failed to fetch syllabus");
          const data = await res.json();
          setSyllabusResources(
            (data.pdfs || []).map((pdf: { name: string; url: string }) => ({
              name: pdf.name,
              url: pdf.url,
              description: `Syllabus PDF for ${selectedBranch}, ${selectedSemester}`,
              branch: selectedBranch,
              semester: selectedSemester,
            }))
          );
        } else if (activeTab === "syllabus") setSyllabusResources([]);

        // ----- PYQ -----
        if (activeTab === "pyq" && selectedSemester !== "All") {
          const res = await fetch(
            `http://localhost:5000/api/folders?year=${year}&category=Pyq&semester=${semester}`
          );
          if (!res.ok) throw new Error("Failed to fetch PYQ");
          const data = await res.json();
          setPyqResources(
            data.url
              ? [
                  {
                    name: `${semester} PYQ Folder`,
                    url: data.url,
                    description: `PYQ for ${selectedBranch}, ${selectedSemester}`,
                    branch: selectedBranch,
                    semester: selectedSemester,
                  },
                ]
              : []
          );
        } else if (activeTab === "pyq") setPyqResources([]);

        // ----- Most Important -----
        if (
          showMOSOnly &&
          activeTab === "pyq" &&
          ["Sem1", "Sem2"].includes(semester) &&
          selectedSemester !== "All"
        ) {
          const res = await fetch(
            `http://localhost:5000/api/folders?year=${year}&category=MostImportant&semester=${semester}`
          );
          if (!res.ok) throw new Error("Failed to fetch Most Important");
          const data = await res.json();
          setMostImportantResources(
            data.url
              ? [
                  {
                    name: `${semester} Most Important Questions`,
                    url: data.url,
                    description: `Most Important Questions for ${selectedBranch}, ${selectedSemester}`,
                    branch: selectedBranch,
                    semester: selectedSemester,
                    isMostImportant: true,
                  },
                ]
              : []
          );
        } else setMostImportantResources([]);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load resources. Please try again.");
        setSyllabusResources([]);
        setPyqResources([]);
        setMostImportantResources([]);
      }
    };

    fetchResources();
  }, [selectedBranch, selectedSemester, activeTab, showMOSOnly]);

  const displayedResources = showMOSOnly ? mostImportantResources : pyqResources;

  return (
    <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Resources
        </CardTitle>
        <CardDescription>
          Syllabus and PYQ Questions to help you pass exams.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* -------- Filters -------- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Branch</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Semester</label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="syllabus" onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
            <TabsTrigger value="pyq">PYQ Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="syllabus">
            <ResourceList
              resources={syllabusResources}
              emptyText="No syllabus PDFs available."
              type="syllabus"
              onSelectResource={r => setCurrentResourceUrl(r.url)}
            />
          </TabsContent>

          <TabsContent value="pyq">
            <div className="flex items-center gap-2 mb-3">
              <Switch
                id="mos-switch"
                checked={showMOSOnly}
                onCheckedChange={() => setShowMOSOnly(v => !v)}
              />
              <label htmlFor="mos-switch" className="text-sm flex items-center gap-1 font-medium">
                <Stars className="w-4 h-4 text-amber-500" />
                Show only MOS/IMP
              </label>
            </div>
            <ResourceList
              resources={displayedResources}
              emptyText="No PYQs available for this selection."
              type="pyq"
              onSelectResource={r => setCurrentResourceUrl(r.url)}
            />
          </TabsContent>
        </Tabs>

        {/* ---------- Embedded Viewer ---------- */}
        {currentResourceUrl && (
          <DriveEmbed url={currentResourceUrl} onClose={() => setCurrentResourceUrl(null)} />
        )}
      </CardContent>
    </Card>
  );
}
