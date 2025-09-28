

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";
// import { Card } from "@/components/ui/card";
// import { toast } from "sonner";

// type Lecture = {
//   id: string;
//   title: string;
//   description?: string;
//   youtubeId?: string;
//   thumbnailUrl?: string;
// };

// export default function LecturePlayer() {
//   const { lectureId } = useParams<{ lectureId: string }>();
//   const [lecture, setLecture] = useState<Lecture | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [playing, setPlaying] = useState(false);
//   const [playedSeconds, setPlayedSeconds] = useState(0);
//   const [duration, setDuration] = useState<number | null>(null);
//   const [completed, setCompleted] = useState(false);
//   const [useIframe, setUseIframe] = useState(false);
//   const [useAlternative, setUseAlternative] = useState(false);

//   const progressInterval = useRef<NodeJS.Timeout | null>(null);
//   const lastSavedRef = useRef<number>(0);

//   useEffect(() => {
//     if (!lectureId) return;

//     setLoading(true);
//     API.get(`/lectures/${lectureId}`)
//       .then((res) => {
//         setLecture(res.data);
//         console.log("Lecture data:", res.data);
//       })
//       .catch((err) => {
//         console.error("Failed to load lecture:", err);
//         toast.error("Failed to load lecture");
//       })
//       .finally(() => setLoading(false));

//     // Record view
//     API.post(`/lectures/${lectureId}/view`).catch(console.error);
//   }, [lectureId]);

//   const saveProgress = useCallback(async (seconds: number, markComplete: boolean) => {
//     if (!lectureId) return;
//     try {
//       await API.post(`/lectures/${lectureId}/progress`, {
//         progressSeconds: Math.floor(seconds),
//         completed: markComplete,
//       });
//       if (markComplete) setCompleted(true);
//     } catch (err) {
//       console.error("saveProgress error", err);
//     }
//   }, [lectureId]);

//   // Start progress tracking when video starts playing
//   const startProgressTracking = useCallback(() => {
//     if (progressInterval.current) clearInterval(progressInterval.current);
    
//     progressInterval.current = setInterval(() => {
//       setPlayedSeconds(prev => {
//         const newSeconds = prev + 1;
        
//         // Save progress every 12 seconds
//         const now = Date.now();
//         if (now - lastSavedRef.current > 12000) {
//           saveProgress(newSeconds, false);
//           lastSavedRef.current = now;
//         }
        
//         return newSeconds;
//       });
//     }, 1000);
//   }, [saveProgress]);

//   const stopProgressTracking = useCallback(() => {
//     if (progressInterval.current) {
//       clearInterval(progressInterval.current);
//       progressInterval.current = null;
//     }
//   }, []);

//   const handleVideoEnd = useCallback(() => {
//     stopProgressTracking();
//     saveProgress(playedSeconds, true);
//     toast.success("Video completed!");
//   }, [playedSeconds, saveProgress, stopProgressTracking]);

//   const markCompleteClicked = () => {
//     saveProgress(playedSeconds, true);
//     toast.success("Marked complete");
//   };

//   const startVideo = useCallback(() => {
//     console.log("Starting video...");
//     setPlaying(true);
//     startProgressTracking();
//   }, [startProgressTracking]);

//   const pauseVideo = useCallback(() => {
//     setPlaying(false);
//     stopProgressTracking();
//   }, [stopProgressTracking]);

//   const tryIframe = useCallback(() => {
//     console.log("Trying iframe approach...");
//     setUseIframe(true);
//     setPlaying(true);
//     startProgressTracking();
//   }, [startProgressTracking]);

//   const tryAlternative = useCallback(() => {
//     console.log("Trying alternative approach...");
//     setUseAlternative(true);
//     setPlaying(true);
//     startProgressTracking();
//   }, [startProgressTracking]);

//   // Cleanup interval on unmount
//   useEffect(() => {
//     return () => {
//       if (progressInterval.current) {
//         clearInterval(progressInterval.current);
//       }
//     };
//   }, []);

//   if (loading) return <div className="p-6 text-center">Loading lecture…</div>;
//   if (!lecture) return <div className="p-6 text-center">Lecture not found</div>;

//   const youtubeId = lecture.youtubeId?.trim();
//   const thumbnailUrl = lecture.thumbnailUrl || 
//     (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <Card className="rounded-2xl shadow-md flex flex-col md:flex-row gap-6 p-4 hover:shadow-lg transition">
//         {/* Video Container */}
//         <div className="relative w-full md:w-2/5 aspect-video rounded-lg overflow-hidden bg-black">
//           {youtubeId ? (
//             <>
//               {/* Method 1: Standard iframe embed */}
//               {playing && !useIframe && !useAlternative && (
//                 <iframe
//                   src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
//                   width="100%"
//                   height="100%"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                   allowFullScreen
//                   title={lecture.title}
//                   onLoad={() => console.log("iframe loaded")}
//                   style={{ border: 'none' }}
//                 />
//               )}

//               {/* Method 2: iframe with different parameters */}
//               {playing && useIframe && !useAlternative && (
//                 <iframe
//                   src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&fs=1&enablejsapi=1`}
//                   width="100%"
//                   height="100%"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   title={lecture.title}
//                   referrerPolicy="strict-origin-when-cross-origin"
//                   style={{ border: 'none' }}
//                 />
//               )}

//               {/* Method 3: Alternative embed approach */}
//               {playing && useAlternative && (
//                 <div className="w-full h-full">
//                   <iframe
//                     src={`https://www.youtube.com/embed/${youtubeId}?controls=1&showinfo=1&rel=0&fs=1&playsinline=1&enablejsapi=0`}
//                     width="100%"
//                     height="100%"
//                     frameBorder="0"
//                     allowFullScreen
//                     title={lecture.title}
//                     allow="autoplay; encrypted-media"
//                     style={{ border: 'none' }}
//                   />
//                 </div>
//               )}

//               {/* Thumbnail Overlay - Show when not playing */}
//               {!playing && (
//                 <div className="absolute inset-0 z-10">
//                   <div
//                     className="absolute inset-0 cursor-pointer flex items-center justify-center transition hover:bg-black hover:bg-opacity-20"
//                     onClick={startVideo}
//                   >
//                     {thumbnailUrl ? (
//                       <img
//                         src={thumbnailUrl}
//                         alt={lecture.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           const target = e.currentTarget as HTMLImageElement;
//                           if (youtubeId && !target.src.includes('hqdefault')) {
//                             target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
//                           }
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gray-800 flex items-center justify-center">
//                         <span className="text-white text-lg">Click to play video</span>
//                       </div>
//                     )}
                    
//                     {/* Play Button */}
//                     <div className="absolute text-white bg-red-600 bg-opacity-80 rounded-full w-20 h-20 flex items-center justify-center hover:bg-opacity-100 transition-all hover:scale-110 shadow-2xl">
//                       <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M8 5v14l11-7z"/>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Alternative Methods Panel */}
//               {playing && (
//                 <div className="absolute top-2 right-2 z-20">
//                   <div className="bg-black bg-opacity-75 rounded-lg p-2 space-y-1">
//                     {!useIframe && !useAlternative && (
//                       <button
//                         onClick={tryIframe}
//                         className="block w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
//                       >
//                         Try Method 2
//                       </button>
//                     )}
//                     {!useAlternative && (
//                       <button
//                         onClick={tryAlternative}
//                         className="block w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
//                       >
//                         Try Method 3
//                       </button>
//                     )}
//                     <button
//                       onClick={pauseVideo}
//                       className="block w-full px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition"
//                     >
//                       Close Video
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             /* No Video Available */
//             <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
//               <div className="text-white text-center">
//                 <div className="text-gray-400 text-4xl mb-4">🎥</div>
//                 <span className="text-lg">No video available</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Details Section */}
//         <div className="flex-1 flex flex-col justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {lecture.title}
//             </h1>
//             {lecture.description && (
//               <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-5">
//                 {lecture.description}
//               </p>
//             )}
            
//             {/* Video Control Buttons */}
//             <div className="mt-4 space-y-2">
//               {!playing ? (
//                 <div className="space-x-2">
//                   <button
//                     onClick={startVideo}
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z"/>
//                     </svg>
//                     Play Video
//                   </button>
//                   <a
//                     href={`https://www.youtube.com/watch?v=${youtubeId}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//                   >
//                     Open in YouTube
//                   </a>
//                 </div>
//               ) : (
//                 <div className="space-x-2">
//                   <button
//                     onClick={pauseVideo}
//                     className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//                   >
//                     Close Video
//                   </button>
//                   <span className="text-sm text-gray-600">
//                     Method: {useAlternative ? '3' : useIframe ? '2' : '1'}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Troubleshooting Tips */}
//             {youtubeId && (
//               <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
//                 <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
//                   Video not loading? Try:
//                 </p>
//                 <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-xs">
//                   <li>• Click "Try Method 2" or "Try Method 3" buttons when video is playing</li>
//                   <li>• Use "Open in YouTube" to watch in a new tab</li>
//                   <li>• Disable ad blockers temporarily</li>
//                   <li>• Try a different browser or incognito mode</li>
//                 </ul>
//               </div>
//             )}
            
//             {/* Debug Info - Development Only */}
//             {process.env.NODE_ENV === 'development' && (
//               <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs space-y-1">
//                 <p><strong>YouTube ID:</strong> {youtubeId || 'Not set'}</p>
//                 <p><strong>Playing:</strong> {playing ? 'Yes' : 'No'}</p>
//                 <p><strong>Method:</strong> {useAlternative ? 'Alternative' : useIframe ? 'Iframe' : 'Standard'}</p>
//                 <p><strong>Progress:</strong> {Math.floor(playedSeconds)}s</p>
//                 <div className="mt-2 pt-2 border-t border-gray-300">
//                   <p><strong>Test Links:</strong></p>
//                   <a 
//                     href={`https://www.youtube.com/watch?v=${youtubeId}`}
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline block"
//                   >
//                     YouTube Direct Link
//                   </a>
//                   <a 
//                     href={`https://www.youtube.com/embed/${youtubeId}`}
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline block"
//                   >
//                     Embed Link
//                   </a>
//                   <a 
//                     href={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline block"
//                   >
//                     Thumbnail
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Progress and Actions */}
//           <div className="mt-6 space-y-4">
//             {/* Progress Bar */}
//             {playedSeconds > 0 && (
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <span>Progress: {Math.floor(playedSeconds / 60)}:{(playedSeconds % 60).toString().padStart(2, '0')}</span>
//                   {duration && <span>Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>}
//                 </div>
//                 {duration && (
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full transition-all"
//                       style={{ width: `${Math.min((playedSeconds / duration) * 100, 100)}%` }}
//                     ></div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//               <div className="text-sm text-gray-500">
//                 Watch time: {Math.floor(playedSeconds)}s
//               </div>
//               <button
//                 onClick={markCompleteClicked}
//                 disabled={completed}
//                 className={`px-6 py-2 rounded-lg font-semibold transition ${
//                   completed
//                     ? "bg-green-500 text-white cursor-not-allowed"
//                     : "bg-indigo-600 text-white hover:bg-indigo-700"
//                 }`}
//               >
//                 {completed ? "✓ Completed" : "Mark Complete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
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
  const [completed, setCompleted] = useState(false);
  const [embedMethod, setEmbedMethod] = useState(1);
  const [showMethodSwitcher, setShowMethodSwitcher] = useState(false);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<number>(0);

  useEffect(() => {
    if (!lectureId) return;

    setLoading(true);
    API.get(`/lectures/${lectureId}`)
      .then((res) => setLecture(res.data))
      .catch(() => toast.error("Failed to load lecture"))
      .finally(() => setLoading(false));

    API.post(`/lectures/${lectureId}/view`).catch(console.error);
  }, [lectureId]);

  const saveProgress = useCallback(async (seconds: number, markComplete: boolean) => {
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
  }, [lectureId]);

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      setPlayedSeconds(prev => {
        const newSeconds = prev + 1;
        const now = Date.now();
        if (now - lastSavedRef.current > 12000) {
          saveProgress(newSeconds, false);
          lastSavedRef.current = now;
        }
        return newSeconds;
      });
    }, 1000);
  }, [saveProgress]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);

  const startVideo = useCallback(() => {
    setPlaying(true);
    setShowMethodSwitcher(true);
    startProgressTracking();
  }, [startProgressTracking]);

  const stopVideo = useCallback(() => {
    setPlaying(false);
    setShowMethodSwitcher(false);
    stopProgressTracking();
  }, [stopProgressTracking]);

  const switchMethod = useCallback((method: number) => {
    setEmbedMethod(method);
    toast.success(`Switched to Method ${method}`);
  }, []);

  const markCompleteClicked = () => {
    saveProgress(playedSeconds, true);
    toast.success("Marked complete");
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  if (loading) return <div className="p-6 text-center">Loading lecture…</div>;
  if (!lecture) return <div className="p-6 text-center">Lecture not found</div>;

  const youtubeId = lecture.youtubeId?.trim();
  const thumbnailUrl = lecture.thumbnailUrl || 
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);

  const renderVideoEmbed = () => {
    if (!youtubeId || !playing) return null;

    const embedProps = {
      width: "100%",
      height: "100%",
      frameBorder: "0",
      allowFullScreen: true,
      title: lecture.title,
      style: { border: 'none' } as React.CSSProperties,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    };

    switch (embedMethod) {
      case 1:
        return (
          <iframe
            {...embedProps}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
          />
        );
      case 2:
        return (
          <iframe
            {...embedProps}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&fs=1&enablejsapi=1`}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        );
      case 3:
        return (
          <iframe
            {...embedProps}
            src={`https://www.youtube.com/embed/${youtubeId}?controls=1&showinfo=1&rel=0&fs=1&playsinline=1`}
            allow="autoplay; encrypted-media"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 p-6 hover:shadow-xl transition-shadow">
        {/* Video Container */}
        <div className="relative w-full md:w-2/5 aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-inner">
          {youtubeId ? (
            <>
              {/* Video Embed */}
              {renderVideoEmbed()}

              {/* Thumbnail Overlay */}
              {!playing && (
                <div 
                  className="absolute inset-0 cursor-pointer group"
                  onClick={startVideo}
                >
                  {/* Thumbnail Image */}
                  {thumbnailUrl ? (
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={lecture.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (youtubeId && !target.src.includes('hqdefault')) {
                            target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                          } else if (!target.src.includes('default.jpg')) {
                            target.src = `https://img.youtube.com/vi/${youtubeId}/default.jpg`;
                          }
                        }}
                      />
                      {/* Dark overlay for better contrast */}
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-gray-300">
                        <div className="text-4xl mb-2">🎥</div>
                        <span className="text-lg">Click to play</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 bg-opacity-90 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:bg-opacity-100 transition-all duration-300">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Method Switcher - Only show when video is playing and initially hidden */}
              {showMethodSwitcher && (
                <div className="absolute top-3 right-3 z-30">
                  <div className="bg-black bg-opacity-80 rounded-lg p-2 backdrop-blur-sm">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((method) => (
                        <button
                          key={method}
                          onClick={() => switchMethod(method)}
                          className={`w-8 h-8 rounded text-xs font-semibold transition-all ${
                            embedMethod === method
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                    {/* Hide button */}
                    <button
                      onClick={() => setShowMethodSwitcher(false)}
                      className="w-full mt-1 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              )}

              {/* Show method switcher button when hidden */}
              {playing && !showMethodSwitcher && (
                <div className="absolute top-3 right-3 z-30">
                  <button
                    onClick={() => setShowMethodSwitcher(true)}
                    className="bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Close button when playing */}
              {playing && (
                <div className="absolute top-3 left-3 z-30">
                  <button
                    onClick={stopVideo}
                    className="bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* No Video Available */
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-5xl mb-4">🎥</div>
                <span className="text-xl">No video available</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {lecture.title}
              </h1>
              {lecture.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                  {lecture.description}
                </p>
              )}
            </div>

            {/* Video Status */}
            {youtubeId && (
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${playing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {playing ? `Playing (Method ${embedMethod})` : 'Ready to play'}
                </span>
              </div>
            )}

            {/* Play Button (when not playing) */}
            {!playing && youtubeId && (
              <button
                onClick={startVideo}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span className="font-semibold">Start Lecture</span>
              </button>
            )}
          </div>

          {/* Progress Section */}
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Progress Display */}
            {playedSeconds > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Watch Progress
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.floor(playedSeconds / 60)}:{(playedSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((playedSeconds / Math.max(playedSeconds, 300)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {playedSeconds > 0 && `Watched: ${Math.floor(playedSeconds)}s`}
                {completed && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                )}
              </div>
              <button
                onClick={markCompleteClicked}
                disabled={completed}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  completed
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {completed ? "✓ Completed" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}