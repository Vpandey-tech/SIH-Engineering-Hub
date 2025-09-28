import { useNavigate } from "react-router-dom";
import { useContext } from "react"; // Corrected import from 'react'
import { Button } from "@/components/ui/button";
import { Book, Users, Rocket, MessageCircle, Brain, ArrowRight, CheckCircle, Star } from "lucide-react";
import { AuthContext } from "../App";

const features = [
  {
    icon: <Book className="w-8 h-8 text-blue-600" />,
    title: "Comprehensive Study Repository",
    desc: "Access complete syllabi, past papers, curated questions, and structured guides for all engineering disciplines.",
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-600" />,
    title: "AI-Powered Learning",
    desc: "Get personalized study plans, smart recommendations, and interactive AI assistance tailored to your progress.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Collaborative Community",
    desc: "Connect with peers, share notes, participate in study groups, and collaborate on engineering projects.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-orange-600" />,
    title: "Career Development",
    desc: "Access career roadmaps, coding challenges, mock interviews, and exclusive internship opportunities.",
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
    title: "24/7 Support",
    desc: "Get instant help from our engineering community and AI-powered support system anytime.",
  },
];

const stats = [
  { number: "50K+", label: "Active Engineers" },
  { number: "100+", label: "Study Resources" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "AI Support" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#f0f4fa] via-[#e2e6f8] to-[#f9fbff] dark:from-[#14192e] dark:via-[#202a48] dark:to-[#232942] overflow-hidden relative">
      {/* 3D Modern Gradient Blobs and Shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-24 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-200/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-44 h-44 bg-gradient-to-br from-indigo-400/40 to-pink-300/30 rounded-full blur-[80px] animate-bounce-slow" />
        <div className="absolute bottom-20 left-1/5 w-60 h-60 bg-gradient-to-tr from-sky-200/40 to-green-400/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 right-10 w-36 h-36 bg-gradient-to-br from-violet-500/20 to-blue-300/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-0 left-36 w-28 h-28 bg-gradient-to-br from-blue-100/40 to-violet-100/60 rotate-12 rounded-3xl blur-[32px]" />
        <div className="absolute bottom-2 right-0 w-32 h-32 bg-gradient-to-br from-purple-300/40 to-blue-400/20 rotate-45 rounded-3xl blur-[42px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700 rounded-full px-6 py-2 mb-8 shadow-xl backdrop-blur-md">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Trusted by Alumini</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-extrabold text-5xl md:text-7xl bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-8 drop-shadow-lg tracking-tighter animate-fade-in">
            Engineering Hub
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-blue-100 mb-3 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Your Complete Engineering Success Platform
          </p>
          
          <p className="text-lg text-slate-500 dark:text-slate-300 mb-12 max-w-xl mx-auto">
            Master your engineering journey with AI-powered study tools, expert guidance, and a vibrant engineer community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-indigo-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/70 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-50/50 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/dashboard")}
            >
              Explore Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-blue-800 dark:text-blue-200 font-semibold text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-800 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-4 tracking-tight">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-slate-600 dark:text-blue-100 max-w-2xl mx-auto">
              A comprehensive suite of tools and resources designed for real engineers and future leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="group relative transition-all hover:-translate-y-2 duration-300">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-indigo-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-white via-indigo-100/80 to-slate-50 dark:from-slate-700 dark:via-slate-800 rounded-xl mb-5 group-hover:scale-110 transition-transform shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-100 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-200 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700 rounded-3xl p-12 shadow-2xl backdrop-blur-md">
            <h3 className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 mb-5 tracking-tight">
              Join the Future of Engineering Education
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-200 mb-8 leading-relaxed max-w-2xl mx-auto">
              Start your journey with Engineering Hub and unlock your real potential with future-ready tools, real guidance, and a supportive network.
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Free to Start</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Instant Access</span>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={handleStartJourney}
            >
              Start Your Engineering Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 text-center z-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            © 2025 Engineering Hub · Empowering the next generation of engineers
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;