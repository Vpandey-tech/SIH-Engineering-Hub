
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageCircle, X, Sparkles, BookOpen, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const AIAssistantBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useLocalStorage();

  // Listen for AI planner open message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'OPEN_AI_PLANNER') {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const quickActions = [
    {
      icon: Brain,
      title: "AI Study Planner",
      description: "Get personalized study recommendations",
      action: () => {
        if (isAuthenticated) {
          navigate("/dashboard");
          setTimeout(() => {
            window.postMessage({ type: 'OPEN_AI_PLANNER' }, '*');
          }, 100);
        } else {
          navigate("/login");
        }
        setIsOpen(false);
      }
    },
    {
      icon: BookOpen,
      title: "Mumbai University Resources",
      description: "Access curriculum and study materials",
      action: () => {
        if (isAuthenticated) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
        setIsOpen(false);
      }
    },
    {
      icon: Target,
      title: "Set Study Goals",
      description: "Define your academic objectives",
      action: () => {
        if (isAuthenticated) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
        setIsOpen(false);
      }
    },
    {
      icon: Clock,
      title: "Time Management Tips",
      description: "Optimize your study schedule",
      action: () => {
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20 hover:scale-110"
          size="lg"
        >
          <div className="relative">
            <Brain className="h-6 w-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </Button>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-[95vw] p-0 gap-0 bg-white/95 dark:bg-slate-900/95 border border-white/20 shadow-2xl">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Study Assistant</CardTitle>
                    <CardDescription className="text-sm">
                      Your Mumbai University AI companion
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Smart Recommendations
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get AI-powered study plans tailored to Mumbai University curriculum with enhanced resource suggestions
                </p>
              </div>

              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    onClick={action.action}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <action.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Login to Get Started
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistantBot;
