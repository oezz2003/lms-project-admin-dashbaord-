import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/studentLayout";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  Volume2,
  Settings,
  Maximize,
  SkipBack,
  SkipForward,
  User,
  Star,
  Download,
  MessageSquare
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  videoUrl: string;
  description: string;
  resources?: string[];
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  progress: number;
  category: string;
  lessons: Lesson[];
}

const mockCourse: Course = {
  id: "1",
  title: "Complete React Developer Course 2024",
  instructor: "Jonas Schmedtmann",
  instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  totalLessons: 12,
  completedLessons: 8,
  totalDuration: "42 hours",
  progress: 67,
  category: "Frontend Development",
  lessons: [
    {
      id: "1",
      title: "Introduction to React",
      duration: "12:34",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Learn the fundamentals of React and why it's so popular",
      resources: ["Slides.pdf", "Code Examples.zip"]
    },
    {
      id: "2", 
      title: "Setting Up Your Development Environment",
      duration: "18:22",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Set up Node.js, VS Code, and create your first React app",
      resources: ["Setup Guide.pdf"]
    },
    {
      id: "3",
      title: "Understanding JSX",
      duration: "25:16",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Deep dive into JSX syntax and how it works",
      resources: ["JSX Cheat Sheet.pdf"]
    },
    {
      id: "4",
      title: "Components and Props",
      duration: "32:45",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Learn how to create and use React components with props"
    },
    {
      id: "5",
      title: "State and Event Handling",
      duration: "28:33",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Master React state management and event handling"
    },
    {
      id: "6",
      title: "Working with Forms",
      duration: "35:12",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Build interactive forms with controlled components"
    },
    {
      id: "7",
      title: "useEffect Hook",
      duration: "29:48",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Learn the useEffect hook for side effects and lifecycle"
    },
    {
      id: "8",
      title: "React Router - Navigation",
      duration: "24:56",
      isCompleted: true,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Implement client-side routing with React Router"
    },
    {
      id: "9",
      title: "Context API",
      duration: "31:22",
      isCompleted: false,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Share state across components with Context API"
    },
    {
      id: "10",
      title: "Custom Hooks",
      duration: "26:18",
      isCompleted: false,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Create reusable logic with custom React hooks"
    },
    {
      id: "11",
      title: "Performance Optimization",
      duration: "38:42",
      isCompleted: false,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Optimize your React apps for better performance"
    },
    {
      id: "12",
      title: "Building and Deployment",
      duration: "22:15",
      isCompleted: false,
      videoUrl: "https://youtu.be/GhTu53CRtJc?si=iDQN6rWAt0ElzP_X",
      description: "Build and deploy your React application to production"
    }
  ]
};

export default function Learning() {
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState<Lesson>(mockCourse.lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [progress, setProgress] = useState(0);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const markAsCompleted = (lessonId: string) => {
    // In a real app, this would update the backend
    const lesson = mockCourse.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.isCompleted = true;
      mockCourse.completedLessons += 1;
      mockCourse.progress = Math.round((mockCourse.completedLessons / mockCourse.totalLessons) * 100);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = mockCourse.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < mockCourse.lessons.length - 1) {
      setCurrentLesson(mockCourse.lessons[currentIndex + 1]);
      setIsPlaying(false);
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = mockCourse.lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      setCurrentLesson(mockCourse.lessons[currentIndex - 1]);
      setIsPlaying(false);
    }
  };

  return (
    <StudentLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{mockCourse.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{mockCourse.instructor}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{mockCourse.completedLessons}/{mockCourse.totalLessons} lessons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{mockCourse.totalDuration}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{mockCourse.progress}% Complete</p>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mockCourse.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-1 border-r border-slate-200 bg-slate-50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="font-semibold text-slate-900">Course Content</h2>
              <p className="text-sm text-slate-600">{mockCourse.totalLessons} lessons • {mockCourse.totalDuration}</p>
            </div>
            
            <div className="overflow-y-auto h-full">
              <div className="space-y-1 p-2">
                {mockCourse.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLesson.id === lesson.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">
                            {index + 1}. {lesson.title}
                          </span>
                          {currentLesson.id === lesson.id && (
                            <Play className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{lesson.duration}</span>
                          {lesson.isCompleted && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2 flex flex-col bg-black">
            <div className="flex-1 flex items-center justify-center relative">
              <video
                className="w-full h-full object-contain"
                controls
                poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop"
                src={currentLesson.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Video Controls & Info */}
            <div className="bg-white border-t border-slate-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{currentLesson.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{currentLesson.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousLesson}
                      disabled={mockCourse.lessons[0].id === currentLesson.id}
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    
                    {!currentLesson.isCompleted && (
                      <Button
                        onClick={() => markAsCompleted(currentLesson.id)}
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextLesson}
                      disabled={mockCourse.lessons[mockCourse.lessons.length - 1].id === currentLesson.id}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Lesson Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-medium text-slate-900 mb-2">Lesson Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentLesson.resources.map((resource, index) => (
                        <Button key={index} variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-2" />
                          {resource}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Q&A
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Rate Lesson
                    </Button>
                  </div>
                  
                  <div className="text-sm text-slate-600">
                    Lesson {mockCourse.lessons.findIndex(l => l.id === currentLesson.id) + 1} of {mockCourse.totalLessons}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
