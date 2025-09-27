import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "sonner";

const AdminCourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    API.get(`/lms/courses/${id}`).then((res) => {
      setTitle(res.data.course.title);
      setDescription(res.data.course.description);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/lms/courses", { title, description });
      const createdCourseId = res.data.id;
      toast.success("Course created!");
      navigate(`/admin/lms/courses/${createdCourseId}/lectures/new`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transition-colors">
        <h1 className="text-2xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          {id ? "Edit Course" : "Create Course"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition"
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition resize-none h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            {loading ? "Saving…" : "Save Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCourseForm;
