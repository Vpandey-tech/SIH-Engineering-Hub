import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Lecture } from "./types";
import ReactPlayer from "react-player";

const LectureList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Lecture[]>("/api/lectures")
      .then((res) => setLectures(res.data))
      .catch((err) => console.error("Failed to fetch lectures:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading lectures…</div>;

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {lectures.map((l) => (
        <div
          key={l.id}
          className="rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-300"
        >
          <div
            className="relative cursor-pointer"
            onClick={() => setPlayingId(playingId === l.id ? null : l.id)}
          >
            {playingId === l.id ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${l.youtubeId}`}
                controls
                width="100%"
                height="200px"
                playing
              />
            ) : (
              <img
                src={l.thumbnailUrl}
                alt={l.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {playingId !== l.id && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                  ▶ Play
                </button>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{l.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {l.description}
            </p>
            {l.courseId ? (
              <Link
                to={`/lms/courses/${l.courseId}/lectures/${l.id}`}
                className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Go to Lecture
              </Link>
            ) : (
              <span className="inline-block mt-3 px-4 py-2 bg-gray-400 text-white rounded-lg">
                No Course Assigned
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LectureList;
