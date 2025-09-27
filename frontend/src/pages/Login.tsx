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
import API from "../services/api"; 
import { auth } from "../firebaseClient";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
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
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await API.post("/login", { email });
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } catch (error: any) {
      console.error("Login error:", error);

      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Please register first") {
        toast.error("No account found.", {
          action: { label: "Sign Up", onClick: () => navigate("/signup") },
        });
      } else if (backendMessage === "Please verify your email") {
        setShowResend(true);
        toast.error("Please verify your email to log in.", {
          description: "Didn’t receive the email? Click 'Resend Verification Email'.",
        });
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        toast.error("Incorrect email or password");
      } else {
        toast.error(backendMessage || "Login failed. Please try again.");
      }

      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const res = await API.post("/resend-verification", { email });

      if (res.data.link) {
        toast.info("Verification link (dev): " + res.data.link, {
          duration: 10000,
        });
      } else {
        toast.success(res.data.message || "Verification email sent!");
      }
    } catch (err: any) {
      console.error("Resend verification error:", err);
      toast.error(
        err.response?.data?.message || "Failed to resend verification email."
      );
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
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="test@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-3 bg-white/30 dark:bg-slate-800/30 border-slate-300 dark:border-slate-700 text-slate-200 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
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

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:scale-105 transition-all text-white py-3 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Resend verification */}
            {showResend && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  {isLoading ? "Resending..." : "Resend Verification Email"}
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-slate-200">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-300 underline hover:text-blue-100 font-semibold"
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
