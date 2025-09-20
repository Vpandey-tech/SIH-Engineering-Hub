import { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { AuthContext } from "../App";

const VIDEO_SRC = "/videos/engineering-bg.mp4";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResend(false);

    if (!email || !password) {
      toast.error("Please fill in all fields", {
        duration: 4000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address", {
        duration: 4000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        duration: 4000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await axios.post(`http://${window.location.hostname}:5000/api/login`, { email });

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast.success("Login successful! Redirecting to dashboard...", {
        duration: 4000,
        position: "top-center",
        style: { background: "#dcfce7", color: "#166534" },
      });
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 900);
    } catch (error: any) {
      console.error("Login error:", error);
      const backendMessage = error.response?.data?.message;
      if (backendMessage === "Please register first") {
        toast.error("Please register first", {
          duration: 4000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
          action: {
            label: "Sign Up",
            onClick: () => navigate("/signup"),
          },
        });
      } else if (backendMessage === "Please verify your email") {
        setShowResend(true);
        toast.error("Please verify your email to log in.", {
          duration: 6000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
          description: "Didn’t receive the email? Click 'Resend Verification Email' below.",
        });
      } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Incorrect email or password", {
          duration: 4000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
        });
      } else {
        toast.error(backendMessage || "Login failed. Please try again.", {
          duration: 4000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
        });
      }
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://${window.location.hostname}:5000/api/resend-verification`, { email });

      toast.success(response.data.message, {
        duration: 6000,
        position: "top-center",
        style: { background: "#dcfce7", color: "#166534" },
        description: "If you don’t see the email, please check your spam or junk folder.",
      });
    } catch (error: any) {
      console.error("Resend verification error:", error.response?.data?.message || error.message);
      const backendMessage = error.response?.data?.message;
      if (backendMessage === "Too many resend attempts") {
        toast.error("Too many resend attempts. Please try again in 5 minutes.", {
          duration: 6000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
        });
      } else {
        toast.error(backendMessage || "Failed to resend verification email.", {
          duration: 6000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#b91c1c" },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-2 py-6 overflow-hidden">
      <Toaster theme="light" richColors />
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
      <Link to="/" className="absolute top-6 left-6 z-30">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-slate-200/90 hover:text-white shadow-lg bg-black/30 hover:bg-black/50 rounded-full px-5 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <div className="w-full max-w-md relative z-30">
        <Card
          className="backdrop-blur-lg bg-white/10 dark:bg-slate-900/60 border border-white/20 shadow-2xl animate-fade-in animate-scale-in transition-all duration-700"
          style={{ boxShadow: "0 8px 48px 0 rgba(60,60,200,0.18)" }}
        >
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-purple-600 to-indigo-700 shadow-xl border-4 border-white/20">
              <Lock className="h-10 w-10 text-white drop-shadow-md" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-tr from-blue-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent drop-shadow">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-slate-100/80 font-medium">
              Sign in to your <span className="text-blue-200">Engineering Hub</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 dark:focus:border-blue-400 rounded-xl text-slate-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="123456 (minimum 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 dark:focus:border-blue-400 rounded-xl text-slate-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 z-10"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <Label htmlFor="rememberMe" className="text-slate-200 font-medium">
                  Remember Me
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            {showResend && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10"
                >
                  {isLoading ? "Resending..." : "Resend Verification Email"}
                </Button>
              </div>
            )}
            <div className="mt-6 text-center text-sm text-slate-200">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-300 underline underline-offset-4 hover:text-blue-100 font-semibold hover-scale"
              >
                Sign up for free
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;