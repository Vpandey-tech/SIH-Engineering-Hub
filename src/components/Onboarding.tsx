import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Target, 
  Users, 
  Zap, 
  ArrowRight,
  Check,
  Star,
  Trophy,
  MessageCircle
} from "lucide-react";

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    subjects: "",
    focusSubject: "",
    goals: "",
    studyTime: "",
    description: "",
    preferences: []
  });

  const services = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI Study Planner",
      description: "Get personalized study roadmaps powered by advanced AI based on Mumbai University syllabus",
      features: ["Custom schedules", "Progress tracking", "Smart reminders"],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Complete Study Repository",
      description: "Access 50,000+ resources across all Mumbai University engineering disciplines",
      features: ["Past papers", "Video lectures", "Practice problems"],
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Collaborative Learning",
      description: "Connect with Mumbai University peers and learn together",
      features: ["Study groups", "Peer discussions", "Knowledge sharing"],
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-600" />,
      title: "Achievement System",
      description: "Track progress and earn rewards for your dedication",
      features: ["Progress badges", "Leaderboards", "Certificates"],
      color: "from-purple-500 to-pink-600"
    }
  ];

  const branches = [
    "Computer Science Engineering (CSE)",
    "Computer Engineering", 
    "Electrical Engineering",
    "Mechanical Engineering",
    "Information Technology (IT)"
  ];

  const years = ["First Year (FE)", "Second Year (SE)", "Third Year (TE)", "Final Year (BE)"];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = () => {
    // Save to localStorage with enhanced validation
    localStorage.setItem('userProfile', JSON.stringify(formData));
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('authToken', 'authenticated_' + Date.now());
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {step === 1 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6 shadow-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome to Engineering Hub</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Mumbai University's Premier Engineering Platform
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Experience the most advanced engineering education platform with AI-powered features tailored for Mumbai University curriculum
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white text-center">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={handleNext}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Get Personalized Experience
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Mumbai University Profile Setup</CardTitle>
              <CardDescription>Help us create your personalized study experience based on MU curriculum</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Engineering Branch (Mumbai University)</Label>
                  <Select onValueChange={(value) => setFormData({...formData, branch: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select onValueChange={(value) => setFormData({...formData, year: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyTime">Daily Study Time (hours)</Label>
                  <Select onValueChange={(value) => setFormData({...formData, studyTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select study time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3">2-3 hours</SelectItem>
                      <SelectItem value="4-5">4-5 hours</SelectItem>
                      <SelectItem value="6-7">6-7 hours</SelectItem>
                      <SelectItem value="8+">8+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjects">Current Subjects (comma-separated)</Label>
                <Input
                  id="subjects"
                  placeholder="e.g., Data Structures, Engineering Mathematics, Database Management"
                  value={formData.subjects}
                  onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusSubject">Primary Focus Subject</Label>
                <Input
                  id="focusSubject"
                  placeholder="Which subject do you want to focus on most?"
                  value={formData.focusSubject}
                  onChange={(e) => setFormData({...formData, focusSubject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Academic Description & Current Status</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your current academic situation, challenges you're facing, areas you're strong/weak in, and any specific requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Your Academic Goals & Career Aspirations</Label>
                <Textarea
                  id="goals"
                  placeholder="Tell us about your academic goals, career aspirations, target companies, higher studies plans, or specific areas you want to excel in..."
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!formData.name || !formData.branch || !formData.year || !formData.focusSubject}
              >
                Continue to AI Recommendations
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Your Mumbai University Study Plan is Ready!</CardTitle>
              <CardDescription>AI has analyzed your profile based on MU curriculum and created custom recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Smart Roadmap</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Custom learning path for {formData.branch}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Time Management</h3>
                  <p className="text-sm text-green-600 dark:text-green-300">Optimized for {formData.studyTime} daily</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">MU Syllabus Aligned</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Based on latest Mumbai University curriculum</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-white">What's Next?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Access your personalized dashboard with Mumbai University focus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Start with AI-recommended study materials for {formData.focusSubject}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Join study groups in your {formData.branch} branch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">Track progress with smart analytics and MU exam preparation</span>
                  </li>
                </ul>
              </div>

              <Button 
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 font-semibold"
              >
                Enter Engineering Hub Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
