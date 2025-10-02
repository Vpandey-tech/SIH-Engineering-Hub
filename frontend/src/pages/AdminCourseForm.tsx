

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "sonner";
import { Search, X, PlusCircle, Film } from "lucide-react";

interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
}
interface Lecture extends YoutubeVideo {}

const AdminCourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [youtubeQuery, setYoutubeQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<YoutubeVideo[]>([]);
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
  const [selectedLectures, setSelectedLectures] = useState<Lecture[]>([]);

  const handleYoutubeSearch = async () => {
    if (!youtubeQuery.trim()) {
      toast.info("Please enter a search term.");
      return;
    }
    setIsYoutubeLoading(true);
    setYoutubeResults([]);
    try {
      const res = await API.get("/lms/youtube-search", {
        params: { query: youtubeQuery },
      });
      setYoutubeResults(res.data.results);
      if (res.data.results.length === 0) {
        toast.info("No videos found for your query.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to search YouTube.");
    } finally {
      setIsYoutubeLoading(false);
    }
  };

  const addLectureToList = (video: YoutubeVideo) => {
    if (selectedLectures.find(lecture => lecture.videoId === video.videoId)) {
      toast.warning("This video is already in your playlist.");
      return;
    }
    setSelectedLectures(prev => [...prev, video]);
    toast.success(`Added "${video.title}" to the playlist.`);
  };
  
  const removeLectureFromList = (videoId: string) => {
    setSelectedLectures(prev => prev.filter(lecture => lecture.videoId !== videoId));
  };


  // FINAL CORRECTED SUBMIT FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Course title is required.");
      return;
    }
    if (selectedLectures.length === 0) {
      toast.error("Please add at least one lecture to the playlist.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        lectures: selectedLectures,
      };

      // --- THIS IS THE FIX ---
      // 1. Capture the response from the API call
      const res = await API.post("/lms/courses", payload);
      // 2. Get the new course ID from the response
      const newCourseId = res.data.id;
      
      toast.success("Course and all lectures created successfully!");
      
      // 3. Navigate to the newly created course's page
      navigate(`/lms/courses/${newCourseId}`);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to create course.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // The rest of the JSX is the same as the previous version...
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transition-colors">
        <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          Create New Course
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
            <input
              type="text"
              placeholder="e.g., Introduction to Machine Learning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition bg-white dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Description</label>
            <textarea
              placeholder="A brief summary of what the course is about."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition resize-none h-32 bg-white dark:bg-slate-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Saving…" : "Save Course and Finalize Playlist"}
          </button>
        </form>

        <hr className="my-8 border-gray-200 dark:border-gray-600" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">Add Lectures from YouTube</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search YouTube..."
                value={youtubeQuery}
                onChange={(e) => setYoutubeQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleYoutubeSearch()}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 transition bg-white dark:bg-slate-700"
              />
              <button onClick={handleYoutubeSearch} disabled={isYoutubeLoading} className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50">
                <Search />
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {isYoutubeLoading && <p className="text-center">Searching...</p>}
              {youtubeResults.map(video => (
                <div key={video.videoId} className="flex gap-3 items-center bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-2">{video.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{video.channelTitle}</p>
                  </div>
                  <button onClick={() => addLectureToList(video)} className="p-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition">
                    <PlusCircle />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">Course Playlist ({selectedLectures.length})</h2>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg">
              {selectedLectures.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Film size={48} className="mx-auto mb-2" />
                  Your selected videos will appear here.
                </div>
              ) : (
                selectedLectures.map((lecture, index) => (
                  <div key={lecture.videoId} className="flex gap-3 items-center bg-white dark:bg-slate-700 p-2 rounded-lg shadow-sm">
                    <span className="font-bold text-purple-500">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm line-clamp-1">{lecture.title}</p>
                    </div>
                    <button onClick={() => removeLectureFromList(lecture.videoId)} className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition">
                      <X />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseForm;