import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import API from "../services/api";

type Course = { id: string; title: string; description: string; thumbnail?: string };
type Lecture = { id: string; title: string; thumbnailUrl?: string };
type EnrolledInfo = {
  courseId: string;
  courseTitle: string;
  students: { uid: string; name: string; email: string; progress: number }[];
};

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, Lecture[]>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [enrolledData, setEnrolledData] = useState<EnrolledInfo[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lms/courses");
      setCourses(res.data.courses || []);

      // Fetch lectures in batch
      const lecturesResp = await Promise.all(
        (res.data.courses || []).map(async (c: Course) => {
          const lRes = await API.get("/lms/lectures", { params: { courseId: c.id } });
          return { courseId: c.id, lectures: lRes.data || [] };
        })
      );

      const map: Record<string, Lecture[]> = {};
      lecturesResp.forEach(r => (map[r.courseId] = r.lectures));
      setLecturesMap(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      const res = await API.get("/lms/admin/enrollments");
      setEnrolledData(res.data.enrollments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load enrollments");
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setDeletingId(courseId);
      await API.delete(`/lms/courses/${courseId}`);
      toast.success("Course deleted");
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setLecturesMap(prev => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });
      setEnrolledData(prev => prev.filter(e => e.courseId !== courseId));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLecture = async (lectureId: string, courseId: string) => {
    try {
      await API.delete(`/lms/lectures/${lectureId}`);
      toast.success("Lecture deleted");
      setLecturesMap(prev => ({
        ...prev,
        [courseId]: prev[courseId].filter(l => l.id !== lectureId),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lecture");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading courses…</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-[#f6f0ff] via-[#fce7f3] to-[#ffe5e5] dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Manage Courses</h1>
        <Button onClick={() => navigate("/admin/lms/courses/new")} className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:scale-105">
          <Plus className="w-4 h-4 mr-1" /> Create New Course
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {courses.map(course => (
          <Card key={course.id} className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
            {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-40 object-cover" />}
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{course.description}</p>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate(`/lms/courses/${course.id}`)}><Eye className="w-4 h-4" /> View</Button>
                  <Button size="sm" onClick={() => navigate(`/admin/lms/courses/${course.id}/edit`)}><Edit className="w-4 h-4" /> Edit</Button>
                  <Button size="sm" className="bg-purple-600 text-white hover:bg-pink-600" onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/new`)}>
                    <Plus className="w-4 h-4" /> Add Lecture
                  </Button>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" disabled={deletingId === course.id} onClick={() => handleDeleteCourse(course.id)}>
                    <Trash2 className="w-4 h-4" /> {deletingId === course.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>

                {lecturesMap[course.id]?.length > 0 && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-lg mb-1">Lectures:</h3>
                    {lecturesMap[course.id].map(l => (
                      <div key={l.id} className="flex justify-between items-center bg-gray-100 dark:bg-slate-700/30 rounded-md px-3 py-2 mb-1">
                        <span>{l.title}</span>
                        <div className="flex gap-2">
                          <Button size="xs" onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/${l.id}/edit`)}><Edit className="w-3 h-3" /> Edit</Button>
                          <Button size="xs" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDeleteLecture(l.id, course.id)}><Trash2 className="w-3 h-3" /> Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4">Enrolled Students & Progress</h2>
      {loadingEnrollments ? <p>Loading enrollment data…</p> :
        enrolledData.length === 0 ? <p>No students enrolled yet.</p> :
          <div className="space-y-6">
            {enrolledData.map(item => (
              <Card key={item.courseId} className="bg-white dark:bg-slate-800 shadow-md rounded-2xl">
                <CardContent>
                  <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-300">{item.courseTitle}</h3>
                  <ul className="space-y-2">
                    {item.students.map(s => (
                      <li key={s.uid} className="flex justify-between bg-slate-100/70 dark:bg-slate-700/40 rounded-md px-3 py-2">
                        <span>{s.name || s.email}</span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{s.progress}% complete</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
      }
    </div>
  );
};

export default AdminCourses;
