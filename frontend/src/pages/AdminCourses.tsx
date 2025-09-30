// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Trash2, Edit, Plus, Eye } from "lucide-react";
// import { toast } from "@/components/ui/sonner";
// import API from "../services/api";

// type Course = { id: string; title: string; description: string; thumbnail?: string };
// type Lecture = { id: string; title: string; thumbnailUrl?: string };
// type EnrolledInfo = {
//   courseId: string;
//   courseTitle: string;
//   students: { uid: string; name: string; email: string; progress: number }[];
// };

// const AdminCourses: React.FC = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [lecturesMap, setLecturesMap] = useState<Record<string, Lecture[]>>({});
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [enrolledData, setEnrolledData] = useState<EnrolledInfo[]>([]);
//   const [loadingEnrollments, setLoadingEnrollments] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadCourses();
//     loadEnrollments();
//   }, []);

//   const loadCourses = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/lms/courses");
//       setCourses(res.data.courses || []);

//       // Fetch lectures in batch
//       const lecturesResp = await Promise.all(
//         (res.data.courses || []).map(async (c: Course) => {
//           const lRes = await API.get("/lms/lectures", { params: { courseId: c.id } });
//           return { courseId: c.id, lectures: lRes.data || [] };
//         })
//       );

//       const map: Record<string, Lecture[]> = {};
//       lecturesResp.forEach(r => (map[r.courseId] = r.lectures));
//       setLecturesMap(map);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadEnrollments = async () => {
//     try {
//       setLoadingEnrollments(true);
//       const res = await API.get("/lms/admin/enrollments");
//       setEnrolledData(res.data.enrollments || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load enrollments");
//     } finally {
//       setLoadingEnrollments(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId: string) => {
//     try {
//       setDeletingId(courseId);
//       await API.delete(`/lms/courses/${courseId}`);
//       toast.success("Course deleted");
//       setCourses(prev => prev.filter(c => c.id !== courseId));
//       setLecturesMap(prev => {
//         const copy = { ...prev };
//         delete copy[courseId];
//         return copy;
//       });
//       setEnrolledData(prev => prev.filter(e => e.courseId !== courseId));
//     } catch (err) {
//       console.error(err);
//       toast.error("Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleDeleteLecture = async (lectureId: string, courseId: string) => {
//     try {
//       await API.delete(`/lms/lectures/${lectureId}`);
//       toast.success("Lecture deleted");
//       setLecturesMap(prev => ({
//         ...prev,
//         [courseId]: prev[courseId].filter(l => l.id !== lectureId),
//       }));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete lecture");
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading courses…</div>;

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-tr from-[#f6f0ff] via-[#fce7f3] to-[#ffe5e5] dark:bg-slate-900">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Manage Courses</h1>
//         <Button onClick={() => navigate("/admin/lms/courses/new")} className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:scale-105">
//           <Plus className="w-4 h-4 mr-1" /> Create New Course
//         </Button>
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//         {courses.map(course => (
//           <Card key={course.id} className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow">
//             {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-40 object-cover" />}
//             <CardContent>
//               <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{course.description}</p>

//               <div className="flex flex-col gap-2">
//                 <div className="flex flex-wrap gap-2">
//                   <Button size="sm" onClick={() => navigate(`/lms/courses/${course.id}`)}><Eye className="w-4 h-4" /> View</Button>
//                   <Button size="sm" onClick={() => navigate(`/admin/lms/courses/${course.id}/edit`)}><Edit className="w-4 h-4" /> Edit</Button>
//                   <Button size="sm" className="bg-purple-600 text-white hover:bg-pink-600" onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/new`)}>
//                     <Plus className="w-4 h-4" /> Add Lecture
//                   </Button>
//                   <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" disabled={deletingId === course.id} onClick={() => handleDeleteCourse(course.id)}>
//                     <Trash2 className="w-4 h-4" /> {deletingId === course.id ? "Deleting…" : "Delete"}
//                   </Button>
//                 </div>

//                 {lecturesMap[course.id]?.length > 0 && (
//                   <div className="mt-3">
//                     <h3 className="font-semibold text-lg mb-1">Lectures:</h3>
//                     {lecturesMap[course.id].map(l => (
//                       <div key={l.id} className="flex justify-between items-center bg-gray-100 dark:bg-slate-700/30 rounded-md px-3 py-2 mb-1">
//                         <span>{l.title}</span>
//                         <div className="flex gap-2">
//                           <Button size="xs" onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/${l.id}/edit`)}><Edit className="w-3 h-3" /> Edit</Button>
//                           <Button size="xs" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleDeleteLecture(l.id, course.id)}><Trash2 className="w-3 h-3" /> Delete</Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4">Enrolled Students & Progress</h2>
//       {loadingEnrollments ? <p>Loading enrollment data…</p> :
//         enrolledData.length === 0 ? <p>No students enrolled yet.</p> :
//           <div className="space-y-6">
//             {enrolledData.map(item => (
//               <Card key={item.courseId} className="bg-white dark:bg-slate-800 shadow-md rounded-2xl">
//                 <CardContent>
//                   <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-300">{item.courseTitle}</h3>
//                   <ul className="space-y-2">
//                     {item.students.map(s => (
//                       <li key={s.uid} className="flex justify-between bg-slate-100/70 dark:bg-slate-700/40 rounded-md px-3 py-2">
//                         <span>{s.name || s.email}</span>
//                         <span className="text-sm text-slate-600 dark:text-slate-300">{s.progress}% complete</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//       }
//     </div>
//   );
// };

// export default AdminCourses;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Eye, BookOpen, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import API from "../services/api";

type Course = { id: string; title: string; description: string; thumbnail?: string };
type Lecture = { id: string; title: string; thumbnailUrl?: string };
type EnrolledInfo = {
  courseId: string;
  courseTitle: string;
  students: { uid: string; name: string; email: string; progress: number }[];
};

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturesMap, setLecturesMap] = useState<Record<string, Lecture[]>>({});
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [enrolledData, setEnrolledData] = useState<EnrolledInfo[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lms/courses");
      setCourses(res.data.courses || []);

      // Fetch lectures in batch
      const lecturesResp = await Promise.all(
        (res.data.courses || []).map(async (c: Course) => {
          const lRes = await API.get("/lms/lectures", { params: { courseId: c.id } });
          return { courseId: c.id, lectures: lRes.data || [] };
        })
      );

      const map: Record<string, Lecture[]> = {};
      lecturesResp.forEach(r => (map[r.courseId] = r.lectures));
      setLecturesMap(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      const res = await API.get("/lms/admin/enrollments");
      setEnrolledData(res.data.enrollments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load enrollments");
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    try {
      setDeletingId(courseId);
      await API.delete(`/lms/courses/${courseId}`);
      toast.success("Course deleted successfully");
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setLecturesMap(prev => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });
      setEnrolledData(prev => prev.filter(e => e.courseId !== courseId));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLecture = async (lectureId: string, courseId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    
    try {
      await API.delete(`/lms/lectures/${lectureId}`);
      toast.success("Lecture deleted successfully");
      setLecturesMap(prev => ({
        ...prev,
        [courseId]: prev[courseId].filter(l => l.id !== lectureId),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lecture");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-purple-700 dark:text-purple-300 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                Manage Courses
              </h1>
              <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
              </p>
            </div>
            <Button 
              onClick={() => navigate("/admin/lms/courses/new")} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create New Course
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        {courses.length === 0 ? (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-purple-200 dark:border-purple-800">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No courses yet</h3>
            <p className="text-slate-500 dark:text-slate-400">Create your first course to get started</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Card key={course.id} className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-purple-100 dark:border-purple-900">
                {course.thumbnail ? (
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/80" />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 line-clamp-2">
                    {course.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 text-sm">
                    {course.description}
                  </p>

                  {/* Lecture Count Badge */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-purple-600 dark:text-purple-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">
                      {lecturesMap[course.id]?.length || 0} Lectures
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/lms/courses/${course.id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/admin/lms/courses/${course.id}/edit`)}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
                      onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/new`)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Lecture
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-500 hover:bg-red-600 text-white" 
                      disabled={deletingId === course.id} 
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> 
                      {deletingId === course.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>

                  {/* Lectures List */}
                  {lecturesMap[course.id]?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-900">
                      <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Lectures
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {lecturesMap[course.id].map(l => (
                          <div 
                            key={l.id} 
                            className="flex justify-between items-center bg-purple-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 hover:bg-purple-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <span className="text-sm text-slate-700 dark:text-slate-200 truncate flex-1">
                              {l.title}
                            </span>
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                className="h-7 px-2 bg-amber-500 hover:bg-amber-600 text-white text-xs"
                                onClick={() => navigate(`/admin/lms/courses/${course.id}/lectures/${l.id}/edit`)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white text-xs" 
                                onClick={() => handleDeleteLecture(l.id, course.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Section */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-purple-200 dark:border-purple-800">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            Enrolled Students & Progress
          </h2>
          
          {loadingEnrollments ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Loading enrollment data...</p>
            </div>
          ) : enrolledData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg text-slate-600 dark:text-slate-300">No students enrolled yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Students will appear here once they enroll in courses</p>
            </div>
          ) : (
            <div className="space-y-6">
              {enrolledData.map(item => (
                <Card 
                  key={item.courseId} 
                  className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-700 shadow-md rounded-2xl border border-purple-200 dark:border-purple-800 overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {item.courseTitle}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {item.students.length} {item.students.length === 1 ? 'Student' : 'Students'} Enrolled
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {item.students.map(s => (
                        <div 
                          key={s.uid} 
                          className="flex justify-between items-center bg-white dark:bg-slate-700/50 rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                              {(s.name || s.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 dark:text-slate-100">
                                {s.name || s.email}
                              </p>
                              {s.name && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">{s.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                {s.progress}%
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Complete</p>
                            </div>
                            <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${s.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;