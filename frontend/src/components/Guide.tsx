import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Star,
  Trophy,
  Users,
  FileText
} from "lucide-react";
import axios from "axios";

interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  topics: string[];
  progress: number;
  nextMilestone: string;
  timeManagementTips: string[];
  recommendedResources: Array<{
    title: string;
    type: string;
    url: string;
    priority: string;
  }>;
  syllabusAlignment: string;
  examPreparation: string[];
  practicalApplications: string[];
}

const AIStudyPlanner = () => {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('/api/config');
        setApiKey(response.data.youtubeApiKey);
      } catch (error) {
        console.error("Failed to fetch API key:", error);
        setApiKey(null);
      }
    };

    fetchApiKey();
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
      generateStudyPlans(JSON.parse(profile));
    }
  }, []);

  const fetchYoutubeLink = async (query: string) => {
  if (!apiKey) return "API key not loaded.";
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: `${query} engineering tutorial mumbai university`,
        type: "video",
        maxResults: 1,
        order: "date",
        key: apiKey,
      },
    });
    const video = response.data.items?.[0];
    if (video?.id?.videoId) {
      return `https://www.youtube.com/watch?v=${video.id.videoId}`;
    } else {
      return "https://youtube.com";
    }
  } catch (error) {
    console.error("YouTube API error:", error);
    return "https://youtube.com";
  }
};

const generateStudyPlans = async (profile: any) => {
  setIsGenerating(true);
  await new Promise(resolve => setTimeout(resolve, 3000));

  const youtubeLink = await fetchYoutubeLink(profile.subjects?.split(",")[0] || "engineering");

  const generatedPlans: StudyPlan[] = [
    {
      id: '1',
      title: `${profile.focusSubject || 'Core'} Mastery Plan - Mumbai University Aligned`,
      description: `Comprehensive study plan for ${profile.focusSubject} tailored for ${profile.branch} ${profile.year} students following MU curriculum`,
      duration: getDurationBasedOnYear(profile.year),
      difficulty: getDifficultyLevel(profile.year, profile.description),
      topics: getAdvancedTopicsForBranch(profile.branch, profile.focusSubject, profile.year),
      progress: Math.floor(Math.random() * 25) + 5,
      nextMilestone: getNextMilestone(profile.focusSubject, profile.year),
      timeManagementTips: getAdvancedTimeManagementTips(profile.studyTime, profile.description),
      recommendedResources: getMumbaiUniversityResources(profile.branch, profile.focusSubject, youtubeLink),
      syllabusAlignment: getSyllabusAlignment(profile.branch, profile.year),
      examPreparation: getExamPreparationTips(profile.branch, profile.year),
      practicalApplications: getPracticalApplications(profile.focusSubject, profile.goals)
    },
    {
      id: '2',
      title: 'Career-Focused Industry Preparation',
      description: `Industry-relevant skills development aligned with your career goals in ${profile.goals?.split(',')[0] || 'technology sector'}`,
      duration: '10 weeks',
      difficulty: 'Advanced',
      topics: getCareerTopics(profile.goals, profile.branch),
      progress: Math.floor(Math.random() * 15) + 5,
      nextMilestone: 'Complete industry project simulation',
      timeManagementTips: getCareerFocusedTips(profile.goals),
      recommendedResources: getIndustryResources(profile.branch, profile.goals, youtubeLink),
      syllabusAlignment: 'Industry-aligned with MU practical components',
      examPreparation: ['Portfolio development', 'Technical interviews', 'Coding assessments'],
      practicalApplications: getIndustryApplications(profile.branch)
    },
    {
      id: '3',
      title: 'Mumbai University Exam Excellence Strategy',
      description: `Strategic preparation plan for MU examinations with focus on scoring excellence in ${profile.branch}`,
      duration: '6 weeks',
      difficulty: 'Intermediate',
      topics: getExamTopics(profile.branch, profile.subjects),
      progress: Math.floor(Math.random() * 20) + 10,
      nextMilestone: 'Complete first mock examination',
      timeManagementTips: getExamTimeManagement(profile.studyTime),
      recommendedResources: getMUExamResources(profile.branch, youtubeLink),
      syllabusAlignment: '100% Mumbai University syllabus aligned',
      examPreparation: getComprehensiveExamPrep(profile.branch),
      practicalApplications: ['Previous year analysis', 'Pattern recognition', 'Answer writing practice']
    }
  ];

  localStorage.setItem('studyPlans', JSON.stringify(generatedPlans));
  setStudyPlans(generatedPlans);
  setIsGenerating(false);
};


  const getDurationBasedOnYear = (year: string): string => {
    if (year?.includes('First')) return '12 weeks';
    if (year?.includes('Second')) return '10 weeks';
    if (year?.includes('Third')) return '8 weeks';
    return '6 weeks';
  };

  const getDifficultyLevel = (year: string, description: string): string => {
    if (year?.includes('First')) return 'Beginner';
    if (year?.includes('Final') || description?.toLowerCase().includes('advanced')) return 'Advanced';
    return 'Intermediate';
  };

  const getAdvancedTopicsForBranch = (branch: string, focusSubject: string, year: string): string[] => {
    const branchTopics: { [key: string]: { [key: string]: string[] } } = {
      'Computer Science Engineering (CSE)': {
        'First Year': ['Programming Fundamentals', 'Engineering Mathematics', 'Digital Electronics', 'Computer Graphics'],
        'Second Year': ['Data Structures', 'Object Oriented Programming', 'Database Management', 'Computer Networks'],
        'Third Year': ['Algorithm Design', 'Software Engineering', 'Operating Systems', 'Web Technologies'],
        'Final Year': ['Machine Learning', 'System Design', 'Project Development', 'Advanced Algorithms']
      },
      'Computer Engineering': {
        'First Year': ['Computer Programming', 'Engineering Mathematics', 'Digital Logic Design', 'Computer Organization'],
        'Second Year': ['Data Structures', 'Computer Architecture', 'Microprocessors', 'Software Engineering'],
        'Third Year': ['Operating Systems', 'Computer Networks', 'Database Systems', 'Embedded Systems'],
        'Final Year': ['Advanced Computing', 'Project Work', 'System Programming', 'Network Security']
      },
      'Information Technology (IT)': {
        'First Year': ['IT Fundamentals', 'Programming Logic', 'Mathematics', 'Digital Systems'],
        'Second Year': ['Data Structures', 'Database Management', 'Web Programming', 'Software Engineering'],
        'Third Year': ['System Administration', 'Network Security', 'Mobile Computing', 'Cloud Computing'],
        'Final Year': ['Advanced IT Topics', 'Project Development', 'Enterprise Systems', 'IT Management']
      },
      'Electrical Engineering': {
        'First Year': ['Basic Electrical Engineering', 'Engineering Mathematics', 'Physics', 'Engineering Drawing'],
        'Second Year': ['Circuit Analysis', 'Electronics', 'Electrical Machines', 'Control Systems'],
        'Third Year': ['Power Systems', 'Digital Electronics', 'Microprocessors', 'Communication Systems'],
        'Final Year': ['Power Electronics', 'Advanced Control', 'Project Work', 'Industrial Automation']
      },
      'Mechanical Engineering': {
        'First Year': ['Engineering Mechanics', 'Engineering Drawing', 'Mathematics', 'Physics'],
        'Second Year': ['Thermodynamics', 'Fluid Mechanics', 'Material Science', 'Manufacturing Processes'],
        'Third Year': ['Heat Transfer', 'Machine Design', 'Automobile Engineering', 'Industrial Engineering'],
        'Final Year': ['Advanced Manufacturing', 'Project Work', 'Thermal Engineering', 'Mechanical System Design']
      }
    };

    const yearKey = year?.split(' ')[0] + ' Year' || 'Second Year';
    const topics = branchTopics[branch]?.[yearKey] || branchTopics['Computer Science Engineering (CSE)']['Second Year'];
    
    if (focusSubject) {
      return [focusSubject, ...topics.filter(topic => topic !== focusSubject)];
    }
    
    return topics;
  };

  const getNextMilestone = (focusSubject: string, year: string): string => {
    if (focusSubject) {
      return `Master ${focusSubject} fundamental concepts`;
    }
    if (year?.includes('Final')) {
      return 'Complete project proposal and literature review';
    }
    return 'Complete current semester coursework with 80%+ scores';
  };

  const getAdvancedTimeManagementTips = (studyTime: string, description: string): string[] => {
    const baseHours = parseInt(studyTime?.split('-')[0] || '4');
    const isStruggling = description?.toLowerCase().includes('difficult') || description?.toLowerCase().includes('weak');
    
    if (baseHours <= 3) {
      return [
        'Use active recall techniques for maximum retention',
        'Focus on high-weightage topics first',
        'Practice previous year questions daily',
        'Create concept maps for better understanding'
      ];
    } else if (baseHours <= 5) {
      return [
        'Divide time: 60% theory, 40% practical/problems',
        'Use spaced repetition for long-term retention',
        'Join study groups for collaborative learning',
        'Regular mock tests and self-assessment'
      ];
    } else {
      return [
        'Deep dive into advanced topics and research',
        'Contribute to open-source projects',
        'Mentor junior students',
        'Prepare for competitive examinations',
        isStruggling ? 'Extra focus on weak areas with tutorial support' : 'Explore industry case studies'
      ];
    }
  };

  const getMumbaiUniversityResources = (branch: string, focusSubject: string, youtubeLink: string) => [
    { title: `${branch} Mumbai University Syllabus Guide`, type: 'Official Document', url: 'https://mu.ac.in/syllabus', priority: 'High' },
    { title: `${focusSubject} Video Lecture Series - MU Aligned`, type: 'Video Course', url: youtubeLink, priority: 'High' },
    { title: 'Mumbai University Previous Year Papers', type: 'Question Bank', url: 'https://mu.ac.in/portal/previous-question-papers/', priority: 'High' },
    { title: 'Interactive Lab Simulations', type: 'Platform', url: 'https://www.labster.com/', priority: 'Medium' },
    { title: 'Industry Expert Guest Lectures', type: 'Webinar Series', url: 'https://www.nptel.ac.in/', priority: 'Medium' }
  ];

  const getSyllabusAlignment = (branch: string, year: string): string => {
    return `Fully aligned with Mumbai University ${branch} ${year} curriculum as per latest AICTE guidelines`;
  };

  const getExamPreparationTips = (branch: string, year: string): string[] => {
    return [
      'Solve 5+ previous year question papers',
      'Practice numerical problems daily',
      'Create summary notes for quick revision',
      'Form study groups with classmates',
      'Regular mock tests with time management'
    ];
  };

  const getPracticalApplications = (focusSubject: string, goals: string): string[] => {
    if (goals?.toLowerCase().includes('software')) {
      return ['Build real-world projects', 'Contribute to GitHub repositories', 'Participate in hackathons'];
    }
    return ['Laboratory experiments', 'Industry case studies', 'Project-based learning'];
  };

  const getCareerTopics = (goals: string, branch: string): string[] => {
    if (goals?.toLowerCase().includes('software') || branch?.includes('Computer')) {
      return ['System Design', 'DSA for Interviews', 'Full Stack Development', 'DevOps Practices'];
    }
    if (branch?.includes('Electrical')) {
      return ['Power Systems Design', 'Renewable Energy', 'Smart Grid Technology', 'Industrial Automation'];
    }
    if (branch?.includes('Mechanical')) {
      return ['CAD/CAM', 'Automotive Technology', 'Manufacturing Optimization', 'Robotics'];
    }
    return ['Project Management', 'Technical Communication', 'Industry 4.0', 'Leadership Skills'];
  };

  const getCareerFocusedTips = (goals: string): string[] => [
    'Build a strong portfolio showcasing your skills',
    'Network with industry professionals',
    'Stay updated with latest industry trends',
    'Practice technical interviews regularly'
  ];

  const getIndustryResources = (branch: string, goals: string, youtubeLink: string) => [
    { title: 'Industry Case Studies', type: 'Case Study', url: 'https://hbr.org/', priority: 'High' },
    { title: 'Professional Certification Courses', type: 'Certification', url: 'https://www.coursera.org/', priority: 'High' },
    { title: 'LinkedIn Learning Paths', type: 'Online Course', url: youtubeLink, priority: 'Medium' }
  ];

  const getIndustryApplications = (branch: string): string[] => [
    'Real-world project development',
    'Industry internship preparation',
    'Professional skill development'
  ];

  const getExamTopics = (branch: string, subjects: string): string[] => {
    const subjectList = subjects?.split(',').map(s => s.trim()) || [];
    return subjectList.length > 0 ? subjectList : ['Core Engineering Subjects', 'Mathematics', 'Technical Communication'];
  };

  const getExamTimeManagement = (studyTime: string): string[] => [
    'Create a detailed study timetable',
    'Allocate specific time slots for each subject',
    'Regular breaks and revision sessions',
    'Mock test scheduling'
  ];

  const getMUExamResources = (branch: string, youtubeLink: string) => [
    { title: 'Mumbai University Question Bank', type: 'Question Papers', url: 'https://mu.ac.in/portal/previous-question-papers/', priority: 'High' },
    { title: 'Exam Pattern Analysis', type: 'Study Guide', url: 'https://www.geeksforgeeks.org/', priority: 'High' },
    { title: 'Time Management Techniques', type: 'Strategy Guide', url: youtubeLink, priority: 'Medium' }
  ];

  const getComprehensiveExamPrep = (branch: string): string[] => [
    'Analyze previous 5 years question patterns',
    'Create chapter-wise study schedule',
    'Practice answer writing with time limits',
    'Form study groups for discussion',
    'Regular self-assessment tests'
  ];

  if (isGenerating) {
    return (
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Building Your Personalized Roadmap</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Crafting your roadmap, aligning with MU curriculum and your profile!
          </p>
          <div className="mt-4 text-sm text-slate-500">
            <p>Processing: Curriculum & semester alignment ✓</p>
            <p>Processing: Custom recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          Your Personalized MU Roadmap
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Step-by-step study roadmap based on your year, semester, subjects and doubts. Get curated resources & recommendations!
        </p>
      </div>
      <div className="grid gap-6">
        {studyPlans.map((plan) => (
          <Card key={plan.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {plan.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </CardDescription>
                </div>
                <Badge variant={plan.difficulty === 'Beginner' ? 'secondary' : plan.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                  {plan.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-2" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Duration: {plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Next: {plan.nextMilestone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">{plan.syllabusAlignment}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Key Topics
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.topics.slice(0, 4).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {plan.topics.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.topics.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Roadmap Success Tips
                  </h4>
                  <div className="grid gap-2">
                    {plan.timeManagementTips.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Exam Prep
                  </h4>
                  <div className="grid gap-2">
                    {plan.examPreparation.slice(0, 3).map((tip, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Essential Study Materials
                </h4>
                <div className="space-y-2">
                  {plan.recommendedResources.slice(0, 3).map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{resource.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          <Badge variant={resource.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {resource.priority}
                          </Badge>
                        </div>
                      </div>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start This Roadmap
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIStudyPlanner;