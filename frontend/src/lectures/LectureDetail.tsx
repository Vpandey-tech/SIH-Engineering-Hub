import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ReactPlayer from "react-player";
import { Lecture } from "./types";
import { getAuth } from "firebase/auth";

const LectureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [progress, setProgress] = useState<number>(0); // in seconds
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    if (!id) return;
    API.get(`/lms/lectures/${id}`).then(res => setLecture(res.data));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchProgress = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const res = await API.get(`/lms/lectures/${id}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(res.data.progress?.progressSeconds || 0);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, [id]);

  // Save progress periodically
  const handleProgress = async (state: { playedSeconds: number }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !id) return;

      const token = await user.getIdToken();
      const playedSeconds = Math.floor(state.playedSeconds);

      // Only update if progress increased
      if (playedSeconds > progress) {
        setProgress(playedSeconds);
        await API.post(`/lms/lectures/${id}/progress`, 
          { progressSeconds: playedSeconds }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const handleEnded = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !id) return;

      const token = await user.getIdToken();
      await API.post(`/lms/lectures/${id}/progress`, 
        { completed: true, progressSeconds: lecture?.duration || 0 }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(lecture?.duration || 0);
    } catch (err) {
      console.error("Failed to mark completed", err);
    }
  };

  if (!lecture) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{lecture.title}</h1>
      {lecture.youtubeId && (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${lecture.youtubeId}`}
            width="100%"
            height="100%"
            controls
            playing
            onProgress={handleProgress}
            onEnded={handleEnded}
          />
        </div>
      )}
      {lecture.description && (
        <p className="text-gray-700 dark:text-gray-300">{lecture.description}</p>
      )}
      {progress > 0 && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Progress: {progress} seconds
        </p>
      )}
    </div>
  );
};

export default LectureDetail;
