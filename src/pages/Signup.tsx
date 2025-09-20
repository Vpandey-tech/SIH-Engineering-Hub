import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../App";
import { toast, Toaster } from "sonner";

const Signup = () => {
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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!", {
        duration: 4000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      toast.success(response.data.message, {
        duration: 6000,
        position: "top-center",
        style: { background: "#dcfce7", color: "#166534" },
        description: "If you don’t see the email, please check your spam or junk folder.",
      });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.", {
        duration: 4000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#b91c1c" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster theme="light" richColors />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-purple-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full blur-lg animate-pulse delay-1000" />
      </div>

      <Link to="/" className="absolute top-6 left-6 z-20">
        <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Join Engineering Hub
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Create your account and start your engineering journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="engineer@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-slate-300 dark:border-slate-600"
                  required
                />
                <span className="text-slate-600 dark:text-slate-400">
                  I agree to the{" "}
                  <Link
                    to="#"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="#"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">What you get:</p>
              <div className="space-y-2">
                {["Access to 10K+ study resources", "AI-powered learning assistant", "Join 50K+ engineering community"].map(
                  (benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;