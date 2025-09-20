// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import MumbaiUniversityUpdates from "@/components/MumbaiUniversityUpdates";
// import ResourcesTabs from "@/components/ResourcesTabs";
// import { useLocalStorage } from "@/hooks/useLocalStorage";
// import { Sparkles, Menu } from "lucide-react";
// import AIPlannerMiniModal from "@/components/AIPlannerMiniModal";
// import DashboardGuideModal from "@/components/DashboardGuideModal";
// import { formatDistanceToNow } from "date-fns";
// import { AuthContext } from "../App";

// const Dashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [isReady, setIsReady] = useState(false);
//   const navigate = useNavigate();
//   const { addActivity, loadActivity, clearAuthData } = useLocalStorage();
//   const recentActivity = loadActivity();

//   const [plannerOpen, setPlannerOpen] = useState(false);
//   const [successCenterOpen, setSuccessCenterOpen] = useState(false);

//   useEffect(() => {
//     if (!user) {
//       clearAuthData();
//       navigate("/login");
//     } else {
//       setIsReady(true);
//     }
//   }, [user, navigate, clearAuthData]);

//   if (!user || !isReady) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-slate-100 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
//         <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl z-10">
//           <CardContent className="p-12 text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-5"></div>
//             <h3 className="text-lg font-bold text-primary mb-3 tracking-wide">Authenticating...</h3>
//             <p className="text-slate-500">Please wait while we verify your session</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
//       {/* Student Success Center button */}
//       <button
//         aria-label="Open Student Success Center"
//         className="fixed top-20 right-7 z-50 bg-white/90 dark:bg-slate-800/90 border-2 border-indigo-100 dark:border-slate-700 p-3 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 hover:scale-105 group backdrop-blur-md"
//         onClick={() => {
//           addActivity("Opened Student Success Center");
//           setSuccessCenterOpen(true);
//         }}
//       >
//         <Menu className="w-7 h-7 text-indigo-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
//       </button>
//       <DashboardGuideModal open={successCenterOpen} onOpenChange={setSuccessCenterOpen} />

//       {/* Study Guide Button */}
//       <button
//         aria-label="Open AI Study Guide"
//         className="fixed bottom-7 left-7 z-40 bg-gradient-to-r from-indigo-500 to-violet-600 p-5 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/20 flex items-center group"
//         onClick={() => {
//           addActivity("Opened AI Study Guide");
//           setPlannerOpen(true);
//         }}
//       >
//         <Sparkles className="w-7 h-7 text-white animate-float" />
//         <span className="ml-3 hidden sm:inline text-white font-semibold group-hover:underline tracking-wide transition-all">
//           Study Guide
//         </span>
//       </button>

//       <AIPlannerMiniModal open={plannerOpen} onOpenChange={setPlannerOpen} />

//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-start">
//         {/* Header */}
//         <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
//           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-700 to-violet-500 dark:from-indigo-300 dark:to-blue-400 drop-shadow-xl mb-3 animate-fade-in">
//             Welcome, <span className="font-black">{user.name || user.email}</span>
//           </h1>
//           <span className="inline-block w-32 h-1 bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-50 rounded-full mb-3"></span>
//           <p className="text-lg text-slate-600 dark:text-slate-300 font-normal tracking-wide mb-2 animate-fade-in">
//             Your Mumbai University Portal
//           </p>
//         </header>

//         <main className="w-full max-w-4xl flex flex-col gap-10 px-4 sm:px-6 lg:px-8 pb-14">
//           <Card className="bg-gradient-to-tr from-white via-indigo-50 to-blue-50/90 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 border-0 shadow-lg animate-fade-in">
//             <CardContent>
//               <MumbaiUniversityUpdates />
//             </CardContent>
//           </Card>

//           <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl rounded-2xl animate-fade-in">
//             <CardContent>
//               <ResourcesTabs />
//             </CardContent>
//           </Card>

//           <Card className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl rounded-2xl animate-fade-in">
//             <CardContent>
//               <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200 tracking-wide">
//                 Recent Activity
//               </h2>
//               <ul className="space-y-3">
//                 {recentActivity.length === 0 ? (
//                   <li className="text-slate-400">No activity yet.</li>
//                 ) : (
//                   recentActivity.map((activity, idx) => (
//                     <li
//                       key={idx}
//                       className="flex flex-col md:flex-row md:items-center justify-between gap-1 py-2 px-2 rounded-lg bg-slate-100/60 dark:bg-slate-700/70 hover-scale"
//                     >
//                       <span className="font-semibold">{activity.title}</span>
//                       <span className="text-xs text-slate-500 font-light">
//                         {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
//                       </span>
//                     </li>
//                   ))
//                 )}
//               </ul>
//             </CardContent>
//           </Card>
//         </main>
//       </div>

//       {/* Background decoration */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
//       >
//         <div className="absolute top-[10%] left-[60%] w-96 h-96 bg-indigo-100/40 dark:bg-indigo-900/40 rounded-full blur-3xl rotate-12 animate-enter" />
//         <div className="absolute bottom-[-80px] right-[-60px] w-40 h-40 bg-blue-200/60 dark:bg-blue-800/30 rounded-full blur-2xl animate-float" />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // <-- This import is updated
import { Card, CardContent } from "@/components/ui/card";
import MumbaiUniversityUpdates from "@/components/MumbaiUniversityUpdates";
import ResourcesTabs from "@/components/ResourcesTabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sparkles, Menu } from "lucide-react";
// AIPlannerMiniModal is no longer needed
import DashboardGuideModal from "@/components/DashboardGuideModal";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../App";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate(); // <-- Initialize the navigate hook
  const { addActivity, loadActivity, clearAuthData } = useLocalStorage();
  const recentActivity = loadActivity();

  // The 'plannerOpen' state is no longer needed
  const [successCenterOpen, setSuccessCenterOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      clearAuthData();
      navigate("/login");
    } else {
      setIsReady(true);
    }
  }, [user, navigate, clearAuthData]);

  if (!user || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-slate-100 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl z-10">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-5"></div>
            <h3 className="text-lg font-bold text-primary mb-3 tracking-wide">Authenticating...</h3>
            <p className="text-slate-500">Please wait while we verify your session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
      {/* Student Success Center button (Unchanged) */}
      <button
        aria-label="Open Student Success Center"
        className="fixed top-20 right-7 z-50 bg-white/90 dark:bg-slate-800/90 border-2 border-indigo-100 dark:border-slate-700 p-3 rounded-xl shadow-md hover:shadow-2xl transition-all duration-200 hover:scale-105 group backdrop-blur-md"
        onClick={() => {
          addActivity("Opened Student Success Center");
          setSuccessCenterOpen(true);
        }}
      >
        <Menu className="w-7 h-7 text-indigo-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors" />
      </button>
      <DashboardGuideModal open={successCenterOpen} onOpenChange={setSuccessCenterOpen} />

      {/* Study Guide Button (Updated) */}
      <button
        aria-label="Open AI Study Guide"
        className="fixed bottom-7 left-7 z-40 bg-gradient-to-r from-indigo-500 to-violet-600 p-5 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/20 flex items-center group"
        onClick={() => {
          addActivity("Opened AI Study Guide");
          navigate('/study-guide'); // <-- This now navigates to the new page
        }}
      >
        <Sparkles className="w-7 h-7 text-white animate-float" />
        <span className="ml-3 hidden sm:inline text-white font-semibold group-hover:underline tracking-wide transition-all">
          Study Guide
        </span>
      </button>

      {/* The AIPlannerMiniModal component is now removed */}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start">
        {/* Header (Unchanged) */}
        <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-700 to-violet-500 dark:from-indigo-300 dark:to-blue-400 drop-shadow-xl mb-3 animate-fade-in">
            Welcome, <span className="font-black">{user.displayName || user.email}</span>
          </h1>
          <span className="inline-block w-32 h-1 bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-50 rounded-full mb-3"></span>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-normal tracking-wide mb-2 animate-fade-in">
            Your Mumbai University Portal
          </p>
        </header>

        {/* Main Content (Unchanged) */}
        <main className="w-full max-w-4xl flex flex-col gap-10 px-4 sm:px-6 lg:px-8 pb-14">
          <Card className="bg-gradient-to-tr from-white via-indigo-50 to-blue-50/90 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 border-0 shadow-lg animate-fade-in">
            <CardContent>
              <MumbaiUniversityUpdates />
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl rounded-2xl animate-fade-in">
            <CardContent>
              <ResourcesTabs />
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl rounded-2xl animate-fade-in">
            <CardContent>
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200 tracking-wide">
                Recent Activity
              </h2>
              <ul className="space-y-3">
                {recentActivity.length === 0 ? (
                  <li className="text-slate-400">No activity yet.</li>
                ) : (
                  recentActivity.map((activity, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-1 py-2 px-2 rounded-lg bg-slate-100/60 dark:bg-slate-700/70 hover-scale"
                    >
                      <span className="font-semibold">{activity.title}</span>
                      <span className="text-xs text-slate-500 font-light">
                        {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Background decoration (Unchanged) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute top-[10%] left-[60%] w-96 h-96 bg-indigo-100/40 dark:bg-indigo-900/40 rounded-full blur-3xl rotate-12 animate-enter" />
        <div className="absolute bottom-[-80px] right-[-60px] w-40 h-40 bg-blue-200/60 dark:bg-blue-800/30 rounded-full blur-2xl animate-float" />
      </div>
    </div>
  );
};

export default Dashboard;