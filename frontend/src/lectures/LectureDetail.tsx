import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Lecture } from './types';

const LectureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    axios.get<Lecture>(`/api/lectures/${id}`).then(res => setLecture(res.data));
  }, [id]);

  if (!lecture) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{lecture.title}</h1>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${lecture.youtubeId}`}
          width="100%"
          height="100%"
          controls
        />
      </div>
      <p className="text-gray-700 dark:text-gray-300">{lecture.description}</p>
    </div>
  );
};

export default LectureDetail;
