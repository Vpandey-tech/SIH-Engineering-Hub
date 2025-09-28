import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "sonner";

const AdminLectureForm: React.FC = () => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [loading, setLoading] = useState(false);
  

  // Fetch lecture if editing
  useEffect(() => {
    if (!lectureId) return;
    API.get(`/lectures/${lectureId}`).then((res) => {
      const l = res.data;
      setTitle(l.title);
      setDescription(l.description || "");
      setYoutubeId(l.youtubeId || "");
    });
  }, [lectureId]);

  const extractYouTubeId = (urlOrId: string) => {
    try {
      if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
      const url = new URL(urlOrId);
      if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
      if (url.searchParams.has("v")) return url.searchParams.get("v")!;
    } catch {}
    return urlOrId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanId = extractYouTubeId(youtubeId);
    try {
      if (lectureId) {
        await API.put(`/lectures/${lectureId}`, { title, description, youtubeId: cleanId });
        toast.success("Lecture updated");
      } else {
        await API.post(`/lectures`, { title, description, youtubeId: cleanId, courseId });
        toast.success("Lecture created");
      }
      navigate(`/lms/courses`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transition-colors">
        <h1 className="text-2xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          {lectureId ? "Edit Lecture" : "Create Lecture"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Lecture Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition"
          />

          <input
            type="text"
            placeholder="YouTube Video URL or ID"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition"
          />

          {youtubeId && (
            <img
              src={`https://img.youtube.com/vi/${extractYouTubeId(youtubeId)}/maxresdefault.jpg`}
              alt="Thumbnail"
              className="w-full h-48 object-cover rounded-lg shadow-lg"
            />
          )}

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition resize-none h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Saving…" : "Save Lecture"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLectureForm;
