import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

type ProgressItem = {
  lectureId: string;
  enrolledAt?: { seconds: number; nanoseconds: number };
  progressSeconds?: number;
  completed?: boolean;
  lastSeenAt?: { seconds: number; nanoseconds: number };
};

type Lecture = {
  id: string;
  title: string;
  description?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  courseId?: string;
};

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [lectures, setLectures] = useState<Record<string, Lecture>>({});

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          alert("Please sign in to see your courses.");
          return;
        }
        const token = await user.getIdToken();

        // 1. Get all enrolled lectures for the current user
        const res = await API.get("/lectures/users/me/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list: ProgressItem[] = res.data.progress || [];
        setProgressList(list);

        // 2. Fetch details of each lecture
        const details: Record<string, Lecture> = {};
        await Promise.all(
          list.map(async (p) => {
            try {
              const lec = await API.get(`/lectures/${p.lectureId}`);
              details[p.lectureId] = lec.data;
            } catch (err) {
              console.error("Failed to fetch lecture", p.lectureId, err);
            }
          })
        );
        setLectures(details);
      } catch (err) {
        console.error("Failed to load progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading your courses…</div>;
  }

  if (!progressList.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">My Courses</h1>
        <p>You haven’t enrolled in any lectures yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">
        My Enrolled Lectures
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressList.map((p) => {
          const l = lectures[p.lectureId];
          if (!l) return null;
          return (
            <div
              key={p.lectureId}
              className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition hover:shadow-xl"
            >
              {l.thumbnailUrl && (
                <img
                  src={l.thumbnailUrl}
                  alt={l.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">
                  {l.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {l.description}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    to={`/lms/courses/${l.courseId || ""}/lectures/${l.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Go to Lecture
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {p.completed ? "Completed" : `Progress: ${p.progressSeconds || 0}s`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCourses;
