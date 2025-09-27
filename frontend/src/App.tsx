import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "./firebaseClient";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "@/components/Navbar";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/Contact";
import OurAim from "./pages/OurAim";
import GeminiStudyGuide from "./pages/GeminiStudyGuide";

// === Existing LMS pages ===
import CourseList from "./pages/CourseList";
import CoursePage from "./pages/CoursePage";
import LecturePlayer from "./pages/LecturePlayer";

// === Admin pages ===
import AdminCourses from "./pages/AdminCourses";
import AdminCourseForm from "./pages/AdminCourseForm";
import AdminLectureForm from "./pages/AdminLectureForm";

// === New Video-Lecture components ===
import LectureList from "./lectures/LectureList";
import LectureDetail from "./lectures/LectureDetail";
import AdminCreateLecture from "./lectures/AdminCreateLecture";

const queryClient = new QueryClient();

export const AuthContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  role: string;
}>({
  user: null,
  setUser: () => {},
  role: "student",
});

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, role } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRole(userData.role || "student");
          } else {
            console.warn("User doc not found, defaulting to student role");
            setRole("student");
          }
        } catch (err) {
          console.error("Error fetching user role from Firestore:", err);
          setRole("student");
        }
      } else {
        setRole("student");
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthContext.Provider value={{ user, setUser, role }}>
          <BrowserRouter>
            <Navbar />
            <div className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/our-aim" element={<OurAim />} />
                <Route path="*" element={<NotFound />} />

                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={user ? <Dashboard /> : <Navigate to="/login" replace />}
                />

                {/* AI Study Guide */}
                <Route
                  path="/study-guide"
                  element={user ? <GeminiStudyGuide /> : <Navigate to="/login" replace />}
                />

                {/* === Existing LMS === */}
                <Route
                  path="/lms/courses"
                  element={user ? <CourseList /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/lms/courses/:courseId"
                  element={user ? <CoursePage /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/lms/courses/:courseId/lectures/:lectureId"
                  element={user ? <LecturePlayer /> : <Navigate to="/login" replace />}
                />

                {/* === New Video-Lecture LMS === */}
                <Route
                  path="/lectures"
                  element={user ? <LectureList /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/lectures/:id"
                  element={user ? <LectureDetail /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/admin/lectures/new"
                  element={
                    <AdminRoute>
                      <AdminCreateLecture />
                    </AdminRoute>
                  }
                />

                {/* === Admin Course Management === */}
                <Route
                  path="/admin/lms"
                  element={
                    <AdminRoute>
                      <AdminCourses />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/lms/courses/new"
                  element={
                    <AdminRoute>
                      <AdminCourseForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/lms/courses/:id/edit"
                  element={
                    <AdminRoute>
                      <AdminCourseForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/lms/courses/:courseId/lectures/new"
                  element={
                    <AdminRoute>
                      <AdminLectureForm />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/lms/courses/:courseId/lectures/:lectureId/edit"
                  element={
                    <AdminRoute>
                      <AdminLectureForm />
                    </AdminRoute>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
