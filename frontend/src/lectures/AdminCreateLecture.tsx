// import React, { useEffect, useState } from "react";
// import api from "../services/api";

// function extractYouTubeId(url: string): string | null {
//   if (!url) return null;
//   const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/;
//   const match = url.match(regExp);
//   return match ? match[1] : null;
// }

// const AdminCreateLecture: React.FC = () => {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     youtubeUrl: "",
//     courseId: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [courses, setCourses] = useState<any[]>([]);

//   useEffect(() => {
//     api
//       .get("/lms/courses")
//       .then((r) => setCourses(r.data || []))
//       .catch((err) => console.error("Error fetching courses:", err));
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const videoId = extractYouTubeId(form.youtubeUrl);
//       if (!videoId) throw new Error("Invalid YouTube URL");

//       await api.post("/lectures", {
//         title: form.title,
//         description: form.description,
//         youtubeId: videoId,
//         courseId: form.courseId || null,
//       });

//       alert("Lecture created!");
//       setForm({ title: "", description: "", youtubeUrl: "", courseId: "" });
//     } catch (err) {
//       console.error("Failed to create lecture:", err);
//       alert("Failed to create lecture");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
//       <h2 className="text-2xl font-bold mb-4">Create New Lecture</h2>

//       <input
//         name="title"
//         value={form.title}
//         onChange={handleChange}
//         placeholder="Lecture Title"
//         required
//         className="w-full p-2 border rounded"
//       />
//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Description"
//         rows={4}
//         className="w-full p-2 border rounded"
//       />
//       <input
//         name="youtubeUrl"
//         value={form.youtubeUrl}
//         onChange={handleChange}
//         placeholder="YouTube Video URL"
//         required
//         className="w-full p-2 border rounded"
//       />

//       <select
//         name="courseId"
//         value={form.courseId}
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//       >
//         <option value="">(Optional) assign to course</option>
//         {courses.map((c) => (
//           <option key={c._id || c.id} value={c._id || c.id}>
//             {c.title}
//           </option>
//         ))}
//       </select>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? "Creating…" : "Create Lecture"}
//       </button>
//     </form>
//   );
// };

// export default AdminCreateLecture;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Video, FileText, Link as LinkIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "../services/api";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const AdminCreateLecture: React.FC = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    courseId: "",
  });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    loadCourses();
    // Pre-select course if coming from course page
    if (params.courseId) {
      setForm(prev => ({ ...prev, courseId: params.courseId }));
    }
  }, [params.courseId]);

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await api.get("/lms/courses");
      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }
    
    if (!form.youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const videoId = extractYouTubeId(form.youtubeUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL. Please check the URL and try again.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/lms/lectures", {
        title: form.title,
        description: form.description,
        youtubeId: videoId,
        courseId: form.courseId || null,
      });

      toast.success("Lecture created successfully!", {
        description: form.courseId ? "Lecture added to course" : "Lecture created",
      });
      
      // Navigate back to course or admin courses
      setTimeout(() => {
        if (form.courseId) {
          navigate(`/admin/lms/courses/${form.courseId}`);
        } else {
          navigate("/admin/lms/courses");
        }
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create lecture:", err);
      const errorMsg = err.response?.data?.message || "Failed to create lecture";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-xl px-4 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Main Card */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-purple-200 dark:border-purple-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Video className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold mb-2">Create New Lecture</CardTitle>
                <p className="text-purple-100 text-sm">Add a new video lecture to your course</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {loadingCourses ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-300">Loading courses...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Selection */}
                <div className="space-y-2">
                  <Label htmlFor="courseId" className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Assign to Course (Optional)
                  </Label>
                  <Select
                    value={form.courseId}
                    onValueChange={(value) => setForm({ ...form, courseId: value })}
                  >
                    <SelectTrigger className="w-full bg-purple-50 dark:bg-slate-700 border-purple-200 dark:border-purple-700 rounded-xl py-6 text-slate-700 dark:text-slate-200">
                      <SelectValue placeholder="Select a course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Standalone Lecture)</SelectItem>
                      {courses.map((c) => (
                        <SelectItem key={c.id || c._id} value={c.id || c._id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Leave empty to create a standalone lecture
                  </p>
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Lecture Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to React Hooks"
                    required
                    className="bg-purple-50 dark:bg-slate-700 border-purple-200 dark:border-purple-700 rounded-xl py-6 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of what students will learn..."
                    rows={5}
                    className="bg-purple-50 dark:bg-slate-700 border-purple-200 dark:border-purple-700 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* YouTube URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl" className="text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-purple-500" />
                    YouTube Video URL *
                  </Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={form.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="bg-purple-50 dark:bg-slate-700 border-purple-200 dark:border-purple-700 rounded-xl py-6 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste the full YouTube video URL
                  </p>
                  
                  {/* Preview */}
                  {form.youtubeUrl && extractYouTubeId(form.youtubeUrl) && (
                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-700">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold">
                        Preview
                      </div>
                      <div className="aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(form.youtubeUrl)}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Create Lecture
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-800 dark:to-slate-700 border border-purple-200 dark:border-purple-800 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Tips for Creating Great Lectures
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Use clear and descriptive titles that tell students what they'll learn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Write detailed descriptions to help students understand the lecture content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Make sure your YouTube video is set to "Public" or "Unlisted"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Assign lectures to courses to keep your content organized</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCreateLecture;