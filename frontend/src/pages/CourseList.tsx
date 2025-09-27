import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    let mounted = true;
    API.get("/lms/courses")
      .then((r) => {
        if (mounted) setCourses(r.data.courses || []);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getThumbnail = (course: Course) => {
    if (course.thumbnail) return course.thumbnail;
    if (course.youtubeId) return `https://img.youtube.com/vi/${course.youtubeId}/maxresdefault.jpg`;
    return undefined;
  };

  if (loading) return <div className="p-6 text-center">Loading courses…</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">Courses</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <Card
            key={c.id}
            className="rounded-2xl shadow-lg overflow-hidden bg-gradient-to-tr from-purple-100 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 transition-colors hover:shadow-2xl"
          >
            {getThumbnail(c) && (
              <img
                src={getThumbnail(c)}
                alt={c.title}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{c.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/lms/courses/${c.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View course
                </Link>
                <Link
                  to={`/lms/courses/${c.id}/lectures`}
                  className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Open
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
