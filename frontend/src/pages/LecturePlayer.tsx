import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import API from "../services/api";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Lecture = {
  id: string;
  title: string;
  description?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
};

export default function LecturePlayer() {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

const playerRef = useRef<ReactPlayer>(null!);
  const lastSavedRef = useRef<number>(0);

  useEffect(() => {
    if (!lectureId) return;

    setLoading(true);
    API.get(`/lectures/${lectureId}`)
      .then((res) => setLecture(res.data))
      .catch(() => toast.error("Failed to load lecture"))
      .finally(() => setLoading(false));

    // Record view
    API.post(`/lectures/${lectureId}/view`).catch(console.error);
  }, [lectureId]);

  const saveProgress = async (seconds: number, markComplete: boolean) => {
    if (!lectureId) return;
    try {
      await API.post(`/lectures/${lectureId}/progress`, {
        progressSeconds: Math.floor(seconds),
        completed: markComplete,
      });
      if (markComplete) setCompleted(true);
    } catch (err) {
      console.error("saveProgress error", err);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);

    if (!duration && playerRef.current) {
      const dur = playerRef.current.getDuration?.();
      if (dur) setDuration(dur);
    }

    const now = Date.now();
    if (now - lastSavedRef.current > 12000) {
      saveProgress(state.playedSeconds, false).catch(() => {});
      lastSavedRef.current = now;
    }
  };

  const handleEnded = () => saveProgress(duration || playedSeconds, true).catch(() => {});

  const markCompleteClicked = () => {
    saveProgress(playedSeconds, true);
    toast.success("Marked complete");
  };

  if (loading) return <div className="p-6 text-center">Loading lecture…</div>;
  if (!lecture) return <div className="p-6 text-center">Lecture not found</div>;

  const videoUrl = lecture.youtubeId ? `https://www.youtube.com/watch?v=${lecture.youtubeId}` : undefined;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="rounded-2xl shadow-md flex flex-col md:flex-row gap-6 p-4 hover:shadow-lg transition">
        {/* Video */}
        <div className="relative w-full md:w-2/5 aspect-video rounded-lg overflow-hidden bg-black">
          {playing && videoUrl && (
            <ReactPlayer
              ref={playerRef}
              url={videoUrl}
              playing
              controls
              width="100%"
              height="100%"
              onProgress={handleProgress}
              onEnded={handleEnded}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    origin: window.location.origin,
                  },
                },
              }}
            />
          )}

          {/* Overlay before playing */}
          {!playing && lecture.thumbnailUrl && (
            <div
              className="absolute inset-0 cursor-pointer flex items-center justify-center transition"
              onClick={() => setPlaying(true)}
            >
              <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute text-white text-6xl font-bold pointer-events-none">
                ▶
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lecture.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-5">
              {lecture.description}
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Progress: {Math.floor(playedSeconds)}s
              {duration ? ` / ${Math.floor(duration)}s` : ""}
            </div>
            <button
              onClick={markCompleteClicked}
              disabled={completed}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                completed
                  ? "bg-green-500 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {completed ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
