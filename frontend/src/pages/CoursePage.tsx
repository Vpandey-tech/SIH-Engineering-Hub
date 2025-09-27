import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

type Lecture = {
  id: string;
  title: string;
  youtubeId?: string;
  description?: string;
  thumbnailUrl?: string;
};

type Course = {
  id: string;
  title: string;
  description?: string;
  lectures?: Lecture[];
};

type ProgressItem = { lectureId: string; completed: boolean };

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [progressIds, setProgressIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    let mounted = true;

    const fetchData = async () => {
      try {
        const [courseRes, progRes] = await Promise.all([
          API.get(`/lms/courses/${courseId}`),
          API.get("/lms/users/me/progress"),
        ]);

        if (!mounted) return;

        const courseData: Course = { ...courseRes.data.course, id: courseRes.data.course.id };
        setCourse(courseData);

        const doneMap: Record<string, boolean> = {};
        (progRes.data.progress || []).forEach((p: ProgressItem) => {
          if (p.completed) doneMap[p.lectureId] = true;
        });
        setProgressIds(doneMap);
      } catch (err) {
        console.error("Failed to fetch course or progress", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [courseId]);

  if (loading) return <div className="p-6 text-center">Loading course…</div>;
  if (!course) return <div className="p-6 text-center">Course not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="rounded-2xl shadow-lg">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          {course.description && <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>}

          <h2 className="text-xl font-semibold mb-3">Lectures</h2>
          <ul className="space-y-3">
            {course.lectures?.map((l) => (
              <li key={l.id} className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {l.thumbnailUrl && <img src={l.thumbnailUrl} alt={l.title} className="w-24 h-16 object-cover rounded" />}
                  <div>
                    <Link to={`/lms/courses/${course.id}/lectures/${l.id}`} className="text-lg font-medium text-blue-700">
                      {l.title}
                    </Link>
                    {l.description && <div className="text-sm text-gray-500">{l.description}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {progressIds[l.id] ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5 mr-1" /> Completed
                    </span>
                  ) : (
                    <Link
                      to={`/lms/courses/${course.id}/lectures/${l.id}`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Start
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
