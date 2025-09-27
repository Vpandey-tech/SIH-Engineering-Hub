import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import API from "../services/api";
import { auth } from "../firebaseClient";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
};

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const res = await API.get("/lms/courses", { headers });
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = (courseId: string) => {
    navigate(`/admin/lms/courses/${courseId}/lectures/new`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/admin/lms/courses/${courseId}/edit`);
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/lms/courses/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      setDeletingId(courseId);
      if (!auth.currentUser) return;
      const token = await auth.currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      await API.delete(`/lms/courses/${courseId}`, { headers });
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Failed to delete course:", err);
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateCourse = () => {
    navigate("/admin/lms/courses/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 dark:text-purple-300">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-[#f6f0ff] via-[#fce7f3] to-[#ffe5e5] dark:bg-slate-900 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">
          Manage Courses
        </h1>

        <Button
          onClick={handleCreateCourse}
          className="flex items-center gap-2 px-5 py-2 text-white font-semibold rounded-xl shadow-lg
                     bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                     hover:scale-105 transition-transform duration-200"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            )}
            <CardContent>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {course.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" onClick={() => handleViewCourse(course.id)}>
                  <Eye className="w-4 h-4" /> View
                </Button>
                <Button variant="default" size="sm" onClick={() => handleEditCourse(course.id)}>
                  <Edit className="w-4 h-4" /> Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1 bg-purple-600 text-white hover:bg-pink-600"
                  onClick={() => handleCreateLecture(course.id)}
                >
                  <Plus className="w-4 h-4" /> Add Lecture
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDeleteCourse(course.id)}
                  disabled={deletingId === course.id}
                >
                  <Trash2 className="w-4 h-4" /> {deletingId === course.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCourses;
