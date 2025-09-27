// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Navbar from "@/components/Navbar";
// // import Index from "./pages/Index";
// // import Dashboard from "./pages/Dashboard";
// // import Login from "./pages/Login";
// // import Signup from "./pages/Signup";
// // import NotFound from "./pages/NotFound";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <BrowserRouter>
// //         <Navbar />
// //         <div className="pt-16">
// //           <Routes>
// //             <Route path="/" element={<Index />} />
// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/login" element={<Login />} />
// //             <Route path="/signup" element={<Signup />} />
// //             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
// //             <Route path="*" element={<NotFound />} />
// //           </Routes>
// //         </div>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;

// // src/App.tsx
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { createContext, useState, useEffect } from "react";
// import { auth } from "./firebase";
// import Navbar from "@/components/Navbar";
// import Index from "./pages/Index";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// export const AuthContext = createContext<{ user: any; setUser: (user: any) => void }>({
//   user: null,
//   setUser: () => {},
// });

// const App = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <AuthContext.Provider value={{ user, setUser }}>
//           <BrowserRouter>
//             <Navbar />
//             <div className="pt-16">
//               <Routes>
//                 <Route path="/" element={<Index />} />
//                 <Route
//                   path="/dashboard"
//                   element={
//                     user ? <Dashboard /> : <Navigate to="/login" replace />
//                   }
//                 />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/signup" element={<Signup />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </div>
//           </BrowserRouter>
//         </AuthContext.Provider>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;

// src/App.tsx
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/Contact";
import OurAim from "./pages/OurAim";
import GeminiStudyGuide from "./pages/GeminiStudyGuide"; // <-- ADD THIS IMPORT

const queryClient = new QueryClient();

export const AuthContext = createContext<{ user: any; setUser: (user: any) => void }>({
  user: null,
  setUser: () => {},
});

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthContext.Provider value={{ user, setUser }}>
          <BrowserRouter>
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/dashboard"
                  element={
                    user ? <Dashboard /> : <Navigate to="/login" replace />
                  }
                />
                {/* ADD THE NEW ROUTE FOR THE STUDY GUIDE */}
                <Route
                  path="/study-guide"
                  element={
                    user ? <GeminiStudyGuide /> : <Navigate to="/login" replace />
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/our-aim" element={<OurAim />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;