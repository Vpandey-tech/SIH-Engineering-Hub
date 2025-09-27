import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    api
      .get("/lms/courses")
      .then((r) => setCourses(r.data || []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const videoId = extractYouTubeId(form.youtubeUrl);
      if (!videoId) throw new Error("Invalid YouTube URL");

      await api.post("/lectures", {
        title: form.title,
        description: form.description,
        youtubeId: videoId,
        courseId: form.courseId || null,
      });

      alert("Lecture created!");
      setForm({ title: "", description: "", youtubeUrl: "", courseId: "" });
    } catch (err) {
      console.error("Failed to create lecture:", err);
      alert("Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Lecture</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Lecture Title"
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows={4}
        className="w-full p-2 border rounded"
      />
      <input
        name="youtubeUrl"
        value={form.youtubeUrl}
        onChange={handleChange}
        placeholder="YouTube Video URL"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="courseId"
        value={form.courseId}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">(Optional) assign to course</option>
        {courses.map((c) => (
          <option key={c._id || c.id} value={c._id || c.id}>
            {c.title}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating…" : "Create Lecture"}
      </button>
    </form>
  );
};

export default AdminCreateLecture;
