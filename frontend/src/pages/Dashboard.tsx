import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import MumbaiUniversityUpdates from "@/components/MumbaiUniversityUpdates";
import ResourcesTabs from "@/components/ResourcesTabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sparkles, Menu, BookOpen, Crown, Play } from "lucide-react";
import DashboardGuideModal from "@/components/DashboardGuideModal";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../App";
import API from "../services/api";
import { auth } from "../firebaseClient";

type RecentActivityItem = {
  title: string;
  time: string;
};

const Dashboard: React.FC = () => {
  const { user, role } = useContext(AuthContext); // ✅ only read from context
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { addActivity, loadActivity, clearAuthData } = useLocalStorage();
  const recentActivity: RecentActivityItem[] = loadActivity();

  const [successCenterOpen, setSuccessCenterOpen] = useState(false);

  const [coursesCount, setCoursesCount] = useState<number | null>(null);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);
  const [loadingLmsStats, setLoadingLmsStats] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      clearAuthData();
      navigate("/login");
    } else {
      setIsReady(true);
      loadProfileAndProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfileAndProgress = async () => {
    try {
      setLoadingLmsStats(true);
      if (!auth.currentUser) return;

      const token = await auth.currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      // 🔑 1. Fetch courses
      try {
        const coursesRes = await API.get("/lms/courses", { headers });
        const coursesArray = coursesRes?.data?.courses || [];
        setCoursesCount(coursesArray.length);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCoursesCount(null);
      }

      // 🔑 2. User progress
      try {
        const progressRes = await API.get("/lms/users/me/progress", { headers });
        const progress = progressRes?.data?.progress || [];
        const completed = progress.filter((p: any) => p.completed).length;
        const incomplete = Math.max(0, (progress.length ? progress.length : 0) - completed);
        setIncompleteCount(incomplete);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
        setIncompleteCount(0);
      }
    } catch (err) {
      console.error("Failed to load LMS stats", err);
    } finally {
      setLoadingLmsStats(false);
    }
  };

  // Quick actions
  const goToCourses = () => {
    addActivity("Opened Courses");
    navigate("/lms/courses");
  };

  const goToContinueLearning = () => {
    addActivity("Opened Continue Learning");
    navigate("/lms/courses");
  };

  const goToAdminManage = () => {
    addActivity("Opened LMS Admin");
    navigate("/admin/lms"); // ✅ client-side navigation only
  };

  if (!user || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-slate-100 to-blue-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-2xl z-10">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-5"></div>
            <h3 className="text-lg font-bold text-primary mb-3 tracking-wide">
              Authenticating...
            </h3>
            <p className="text-slate-500">Please wait while we verify your session</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-tr from-[#e9edfb] via-[#f6f8ff] to-[#e8f2fe] dark:from-[#1a2139] dark:via-[#232848] dark:to-[#19233b] transition-colors duration-500">
      {/* Success Center button */}
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

      {/* Study Guide Button */}
      <button
        aria-label="Open AI Study Guide"
        className="fixed bottom-7 left-7 z-40 bg-gradient-to-r from-indigo-500 to-violet-600 p-5 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/20 flex items-center group"
        onClick={() => {
          addActivity("Opened AI Study Guide");
          navigate("/study-guide");
        }}
      >
        <Sparkles className="w-7 h-7 text-white animate-float" />
        <span className="ml-3 hidden sm:inline text-white font-semibold group-hover:underline tracking-wide transition-all">
          Study Guide
        </span>
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start">
        {/* Header */}
        <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-blue-700 to-violet-500 dark:from-indigo-300 dark:to-blue-400 drop-shadow-xl mb-3 animate-fade-in">
            Welcome, <span className="font-black">{user.displayName || user.email}</span>
          </h1>
          <span className="inline-block w-32 h-1 bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-50 rounded-full mb-3"></span>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-normal tracking-wide mb-2 animate-fade-in">
            Your Mumbai University Portal
          </p>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-4xl flex flex-col gap-8 px-4 sm:px-6 lg:px-8 pb-14">
          {/* University updates */}
          <Card className="bg-gradient-to-tr from-white via-indigo-50 to-blue-50/90 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 border-0 shadow-lg animate-fade-in">
            <CardContent>
              <MumbaiUniversityUpdates />
            </CardContent>
          </Card>

          {/* LMS Quick Access Card */}
          <Card className="bg-white/95 dark:bg-slate-800/95 border-0 shadow-xl rounded-2xl animate-fade-in">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-2 text-blue-800 dark:text-blue-200 tracking-wide">
                    <BookOpen className="w-5 h-5" /> Learning Management System
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Access courses, lectures and track progress.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-600 dark:text-slate-300 text-right">
                    <div>
                      Courses: <span className="font-semibold">{coursesCount ?? "—"}</span>
                    </div>
                    <div>
                      To finish: <span className="font-semibold">{incompleteCount}</span>
                    </div>
                    <div className="text-xs mt-1 text-slate-400">
                      {loadingLmsStats ? "Loading..." : "Updated"}
                    </div>
                  </div>

                  {/* Admin badge */}
                  {role === "admin" && (
                    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded-md border border-yellow-100 dark:border-yellow-800">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goToCourses}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
                >
                  <BookOpen className="w-4 h-4" /> Browse Courses
                </button>

                <button
                  onClick={goToContinueLearning}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-md"
                >
                  <Play className="w-4 h-4" /> Continue Learning
                </button>

                {role === "admin" && (
                  <button
                    onClick={goToAdminManage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md shadow"
                  >
                    <Crown className="w-4 h-4" /> Manage LMS
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resources tabs */}
          <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl rounded-2xl animate-fade-in">
            <CardContent>
              <ResourcesTabs />
            </CardContent>
          </Card>

          {/* Recent Activity */}
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
    </div>
  );
};

export default Dashboard;
