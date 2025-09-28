import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link ,  useNavigate} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { getAuth } from "firebase/auth";
import { toast } from "@/components/ui/sonner";

type Course = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  youtubeId?: string;
};

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    API.get("/lms/courses")
      .then((r) => mounted && setCourses(r.data.courses || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch courses");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const getThumbnail = (c: Course) =>
    c.thumbnail ||
    (c.youtubeId
      ? `https://img.youtube.com/vi/${c.youtubeId}/maxresdefault.jpg`
      : undefined);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrolling(courseId);

      const { data } = await API.get(`/lms/courses/${courseId}`);
      const lectures = data.course.lectures || [];
      if (!lectures.length) {
        toast.error("No lectures to enroll in yet.");
        return;
      }

      const user = getAuth().currentUser;
      if (!user) {
        toast.error("Please sign in to enroll.");
        return;
      }
      const token = await user.getIdToken();

      // enroll each lecture
      await Promise.all(
        lectures.map((lec: any) =>
          API.post(`/lectures/${lec.id}/enroll`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      toast.success("Successfully enrolled! Check 'Continue Learning'.");
      navigate("/my-courses");
    } catch (err) {
      console.error(err);
      toast.error("Enrollment failed.");
    } finally {
      setEnrolling(null);
    }
  };


  if (loading) return <div className="p-6 text-center">Loading courses…</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">Courses</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <Card
            key={c.id}
            className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-tr from-purple-100 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 hover:shadow-2xl"
          >
            {getThumbnail(c) && (
              <img src={getThumbnail(c)} alt={c.title} className="w-full h-48 object-cover" />
            )}
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {c.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {c.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/lms/courses/${c.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View course
                </Link>
                <button
                  onClick={() => handleEnroll(c.id)}
                  disabled={enrolling === c.id}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {enrolling === c.id ? "Enrolling…" : "Enroll Now"}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
