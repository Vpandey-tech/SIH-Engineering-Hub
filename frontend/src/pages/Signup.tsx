// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
// import { toast, Toaster } from "sonner";
// import { auth, db } from "../firebaseClient";
// import {
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   updateProfile,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { AuthContext } from "../App";

// const VIDEO_SRC = "/videos/engineering-bg.mp4";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!email || !password || !name) {
//       toast.error("Please fill in all fields");
//       setIsLoading(false);
//       return;
//     }
//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // 1) Create Firebase Auth user
//       const cred = await createUserWithEmailAndPassword(auth, email, password);
//       const user = cred.user;

//       // 2) Update Auth profile with displayName
//       await updateProfile(user, { displayName: name });

//       // 3) Force reload so local user object has the displayName
//       await user.reload();
//       const refreshedUser = auth.currentUser;

//       // 4) Save to Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         uid: user.uid,
//         name,
//         email,
//         role: "student",
//         createdAt: new Date().toISOString(),
//       });

//       // 5) Send email verification
//       await sendEmailVerification(user);

//       // 6) Update global context with refreshed user
//       setUser(refreshedUser);

//       toast.success("Signup successful! Please check your email to verify.", {
//         duration: 5000,
//       });

//       setTimeout(() => navigate("/login", { replace: true }), 1500);
//     } catch (error: any) {
//       console.error("Signup error:", error);
//       if (error.code === "auth/email-already-in-use") {
//         toast.error("Email already in use. Try logging in instead.");
//       } else {
//         toast.error(error.message || "Signup failed. Try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-2 py-6 overflow-hidden">
//       <Toaster theme="light" richColors />

//       {/* Background */}
//       <video
//         className="fixed inset-0 w-full h-full object-cover z-0"
//         src={VIDEO_SRC}
//         autoPlay
//         loop
//         muted
//         playsInline
//         poster="/placeholder.svg"
//       />
//       <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/100 to-blue-900/30 z-10" />
//       <div className="fixed inset-0 z-20 pointer-events-none">
//         <div className="absolute top-20 left-10 w-36 h-36 bg-purple-500/30 rounded-full blur-3xl" />
//         <div className="absolute bottom-24 right-20 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
//         <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float" />
//       </div>

//       {/* Back button */}
//       <Link to="/" className="absolute top-6 left-6 z-30">
//         <Button
//           variant="ghost"
//           className="flex items-center gap-2 text-slate-200/90 hover:text-white shadow-lg bg-black/30 hover:bg-black/50 rounded-full px-5 py-2"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Home
//         </Button>
//       </Link>

//       {/* Card */}
//       <div className="w-full max-w-md relative z-30">
//         <Card className="backdrop-blur-lg bg-white/10 dark:bg-slate-900/60 border border-white/20 shadow-2xl">
//           <CardHeader className="space-y-2 text-center">
//             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-red-600 shadow-xl border-4 border-white/20">
//               <User className="h-10 w-10 text-white drop-shadow-md" />
//             </div>
//             <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-tr from-purple-400 via-pink-300 to-red-400 bg-clip-text text-transparent drop-shadow">
//               Create Account
//             </CardTitle>
//             <CardDescription className="text-base text-slate-100/80 font-medium">
//               Join the <span className="text-pink-200">Engineering Hub</span>
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-slate-200 font-medium">
//                   Full Name
//                 </Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="name"
//                     type="text"
//                     placeholder="John Doe"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="pl-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-slate-200 font-medium">
//                   Email Address
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="test@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-slate-200 font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-12 pr-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:scale-105 transition-all text-white py-3 rounded-xl"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating account..." : "Sign Up"}
//               </Button>
//             </form>

//             {/* Footer */}
//             <div className="mt-6 text-center text-sm text-slate-200">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-pink-300 underline hover:text-pink-100 font-semibold"
//               >
//                 Log in here
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "axios";

const VIDEO_SRC = "/videos/engineering-bg.mp4";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message, {
        description: "Please check your inbox to complete registration.",
        duration: 5000,
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-2 py-6 overflow-hidden">
      <Toaster theme="light" richColors />

      {/* Background */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        poster="/placeholder.svg"
      />
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/100 to-blue-900/30 z-10" />
      <div className="fixed inset-0 z-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-36 h-36 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-20 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float" />
      </div>

      {/* Back button */}
      <Link to="/" className="absolute top-6 left-6 z-30">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-slate-200/90 hover:text-white shadow-lg bg-black/30 hover:bg-black/50 rounded-full px-5 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md relative z-30">
        <Card className="backdrop-blur-lg bg-white/10 dark:bg-slate-900/60 border border-white/20 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-red-600 shadow-xl border-4 border-white/20">
              <User className="h-10 w-10 text-white drop-shadow-md" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-tr from-purple-400 via-pink-300 to-red-400 bg-clip-text text-transparent drop-shadow">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-slate-100/80 font-medium">
              Join the <span className="text-pink-200">Engineering Hub</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="test@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 hover:scale-105 transition-all text-white py-3 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-slate-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-300 underline hover:text-pink-100 font-semibold"
              >
                Log in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}