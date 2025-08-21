import React, { useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  Users,
  Star,
  Calendar,
  User,
  Award,
  Play,
  Download,
  BookOpen,
  CheckCircle,
  Trophy,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Code,
  Database,
  Server,
  Layers,
} from "lucide-react";
import {
  AnimatedSection,
  StaggeredList,
  MagneticButton,
  FloatingElement,
  CountUp,
} from "@/components/AnimatedElements";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetails() {
  const { t } = useI18n();
  const isEgyptUser = useStore((state) => state.isEgyptUser);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const courseId = paramId || searchParams.get("id");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Sample courses data - in a real app, this would come from an API
  const coursesData = {
    "1": {
      id: 1,
      title: "French Course",
      subtitle:
        "Comprehensive French language course from beginner to intermediate level with native speakers",
      description:
        "This comprehensive French course takes you from complete beginner to intermediate level. You'll learn practical conversation skills, proper grammar, and cultural insights that will help you communicate effectively in French-speaking countries. Our native French speakers will guide you through interactive lessons and real-world scenarios.",
      image: "bg-gradient-to-br from-blue-500 to-indigo-600",
      price: { usd: "$299", egp: "4,800EGP" },
      originalPrice: { usd: "$399", egp: "6,400EGP" },
      discount: 25,
      rating: 4.9,
      reviewCount: 1820,
      students: 1820,
      duration: "16 weeks",
      level: "Beginner",
      category: "Global Languages",
      language: "English",
      subtitles: ["English", "Arabic"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Marie Dubois",
        title: "French Language Specialist",
        company: "Sorbonne University",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b788?w=150&h=150&fit=crop&crop=face",
        bio: "Marie is a native French speaker with over 8 years of experience teaching French to international students. She holds a Master's degree in French Literature and has helped thousands of students achieve fluency.",
        students: 8420,
        courses: 5,
        rating: 4.9,
      },
      skills: [
        "Basic French conversation and greetings",
        "Essential French grammar and sentence structure",
        "French pronunciation and accent training",
        "Everyday vocabulary for travel and work",
        "French culture and social customs",
        "Reading comprehension skills",
        "Writing skills for emails and letters",
        "Listening comprehension with native speakers",
      ],
      requirements: [
        "No previous French experience required",
        "Willingness to practice speaking regularly",
        "Computer with internet connection",
        "Microphone for speaking exercises",
      ],
    },
    "9": {
      id: 9,
      title: "Web Design – Front-End",
      subtitle:
        "Master modern front-end web development with HTML5, CSS3, JavaScript, and React",
      description:
        "This comprehensive course takes you from intermediate to advanced web development skills. You'll learn to build scalable, production-ready applications using modern technologies and best practices used by top tech companies.",
      image: "bg-gradient-to-br from-blue-500 to-purple-600",
      price: { usd: "$399", egp: "6,400EGP" },
      originalPrice: { usd: "$499", egp: "8,000EGP" },
      discount: 20,
      rating: 4.9,
      reviewCount: 2431,
      students: 2431,
      duration: "16 weeks",
      level: "Intermediate",
      category: "Programming & Technology",
      language: "English",
      subtitles: ["English", "Arabic"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Alex Rodriguez",
        title: "Senior Front-End Developer",
        company: "Google",
        avatar:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
        bio: "Alex is a senior software engineer with 8+ years of experience building scalable web applications. He has worked at top tech companies and taught thousands of students worldwide.",
        students: 15420,
        courses: 8,
        rating: 4.9,
      },
      skills: [
        "Modern React development with hooks and context",
        "Building responsive layouts with CSS Grid and Flexbox",
        "JavaScript ES6+ features and best practices",
        "HTML5 semantic elements and accessibility",
        "CSS animations and transitions",
        "Version control with Git and GitHub",
        "Web performance optimization",
        "Testing frontend applications",
        "Deployment strategies",
        "Code organization and architecture patterns",
      ],
      requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript",
        "Understanding of programming fundamentals",
        "Familiarity with command line/terminal",
        "Computer with internet connection",
      ],
    },
    "2": {
      id: 2,
      title: "French Advanced",
      subtitle:
        "Advanced French language course focusing on business communication and cultural nuances",
      description:
        "Take your French skills to the next level with advanced grammar, business communication, and deep cultural insights. Perfect for professionals and students who want to achieve fluency in French.",
      image: "bg-gradient-to-br from-purple-500 to-blue-600",
      price: { usd: "$399", egp: "6,400EGP" },
      originalPrice: { usd: "$499", egp: "8,000EGP" },
      discount: 20,
      rating: 4.8,
      reviewCount: 1240,
      students: 1240,
      duration: "20 weeks",
      level: "Advanced",
      category: "Global Languages",
      language: "English",
      subtitles: ["English", "Arabic"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: false,
      startDate: "January 15, 2025",
      instructor: {
        name: "Pierre Laurent",
        title: "Senior French Instructor",
        company: "Sorbonne University",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Pierre is a senior French instructor with 12 years of experience teaching advanced French to international professionals and students.",
        students: 6200,
        courses: 3,
        rating: 4.8,
      },
      skills: [
        "Advanced French grammar and syntax",
        "Business French communication",
        "French literature and culture",
        "Professional presentation skills in French",
        "Advanced conversation techniques",
        "French writing for business and academia",
      ],
      requirements: [
        "Intermediate French level required",
        "Basic understanding of French grammar",
        "Willingness to engage in complex conversations",
        "Computer with internet connection",
      ],
    },
    "8": {
      id: 8,
      title: "Quran Kareem",
      subtitle:
        "Learn proper Quran recitation with Tajweed rules and Arabic language fundamentals",
      description:
        "Master the beautiful art of Quran recitation with proper Tajweed rules. This comprehensive course covers Arabic pronunciation, Quranic vocabulary, and the spiritual aspects of recitation.",
      image: "bg-gradient-to-br from-green-600 to-emerald-700",
      price: { usd: "$149", egp: "2,400EGP" },
      originalPrice: { usd: "$229", egp: "3,700EGP" },
      discount: 35,
      rating: 4.9,
      reviewCount: 2800,
      students: 2800,
      duration: "24 weeks",
      level: "All Levels",
      category: "Global Languages",
      language: "Arabic",
      subtitles: ["Arabic", "English"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Sheikh Ahmad Hassan",
        title: "Quran & Tajweed Specialist",
        company: "Islamic University",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        bio: "Sheikh Ahmad has 20 years of experience teaching Quran recitation and Tajweed to students worldwide.",
        students: 12000,
        courses: 4,
        rating: 4.9,
      },
      skills: [
        "Proper Quran recitation with Tajweed",
        "Arabic alphabet and pronunciation",
        "Quranic vocabulary and meanings",
        "Spiritual aspects of recitation",
        "Memorization techniques",
        "Understanding of basic Arabic grammar",
      ],
      requirements: [
        "No previous Arabic knowledge required",
        "Sincere intention to learn",
        "Quiet space for practice",
        "Computer with internet connection",
      ],
    },
    "18": {
      id: 18,
      title: "Arabic Calligraphy Course",
      subtitle:
        "Master the art of Arabic calligraphy from traditional scripts to modern artistic expressions",
      description:
        "Discover the beauty of Arabic calligraphy in this comprehensive course. Learn traditional scripts, modern techniques, and develop your own artistic style.",
      image: "bg-gradient-to-br from-amber-500 to-orange-600",
      price: { usd: "$299", egp: "4,800EGP" },
      originalPrice: { usd: "$399", egp: "6,400EGP" },
      discount: 25,
      rating: 4.9,
      reviewCount: 1456,
      students: 1456,
      duration: "18 weeks",
      level: "All Levels",
      category: "Design & Creative Arts",
      language: "Arabic",
      subtitles: ["Arabic", "English"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Ustaz Mahmoud Al-Khattat",
        title: "Master Calligrapher",
        company: "Cairo Institute of Arts",
        avatar:
          "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        bio: "Ustaz Mahmoud is a master calligrapher with 25 years of experience in traditional and modern Arabic calligraphy.",
        students: 5600,
        courses: 6,
        rating: 4.9,
      },
      skills: [
        "Traditional Arabic calligraphy scripts",
        "Modern calligraphy techniques",
        "Pen and ink mastery",
        "Composition and layout design",
        "Digital calligraphy tools",
        "Creating artistic pieces",
      ],
      requirements: [
        "Basic Arabic reading ability helpful but not required",
        "Interest in art and design",
        "Calligraphy pens and paper (provided guidance)",
        "Computer with internet connection",
      ],
    },
    "10": {
      id: 10,
      title: "FullStack – Python",
      subtitle:
        "Complete full-stack development with Python, Django, and modern web technologies",
      description:
        "Master full-stack web development from scratch! Learn Python, Django, React, and deploy production-ready applications. This course covers everything from backend APIs to frontend interfaces and database management.",
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
      price: { usd: "$499", egp: "8,000EGP" },
      originalPrice: { usd: "$599", egp: "9,600EGP" },
      discount: 17,
      rating: 4.8,
      reviewCount: 1876,
      students: 1876,
      duration: "24 weeks",
      level: "Advanced",
      category: "Programming & Technology",
      language: "English",
      subtitles: ["English", "Arabic"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Dr. Emily Chen",
        title: "Python Full-Stack Expert",
        company: "Microsoft",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        bio: "Dr. Emily is a senior software engineer with 12+ years of experience building scalable web applications at top tech companies.",
        students: 15420,
        courses: 8,
        rating: 4.8,
      },
      skills: [
        "Python programming from basics to advanced",
        "Django framework and REST API development",
        "React frontend development",
        "Database design with PostgreSQL",
        "Authentication and security implementation",
        "Cloud deployment on AWS/Heroku",
        "Testing and debugging techniques",
        "Version control with Git",
      ],
      requirements: [
        "Basic programming knowledge helpful but not required",
        "Computer with internet connection",
        "Willingness to code 2-3 hours daily",
        "English language proficiency",
      ],
    },
    "23": {
      id: 23,
      title: "Kids Craft Art Course",
      subtitle:
        "Fun and creative art course designed specifically for children aged 6-14",
      description:
        "Unlock your child's creativity with this engaging art course! Kids will learn painting, drawing, crafting, and digital art while having tons of fun. Perfect for developing artistic skills and boosting confidence.",
      image: "bg-gradient-to-br from-yellow-400 to-pink-500",
      price: { usd: "$149", egp: "2,400EGP" },
      originalPrice: { usd: "$199", egp: "3,200EGP" },
      discount: 25,
      rating: 4.9,
      reviewCount: 3456,
      students: 3456,
      duration: "12 weeks",
      level: "Beginner",
      category: "Design & Creative Arts",
      language: "English",
      subtitles: ["English", "Arabic"],
      lastUpdated: "November 2024",
      certificate: true,
      featured: true,
      startDate: "January 15, 2025",
      instructor: {
        name: "Emma Collins",
        title: "Children's Art Instructor",
        company: "Creative Kids Academy",
        avatar:
          "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
        bio: "Emma is a passionate children's art teacher with 6 years of experience helping kids discover their artistic talents.",
        students: 8500,
        courses: 5,
        rating: 4.9,
      },
      skills: [
        "Basic drawing and sketching techniques",
        "Watercolor and acrylic painting",
        "Paper crafts and collage making",
        "Digital art on tablets",
        "Color theory for kids",
        "Creative storytelling through art",
        "Art history made fun",
        "Building artistic confidence",
      ],
      requirements: [
        "Age 6-14 years old",
        "Basic art supplies (list provided)",
        "Tablet or computer for digital lessons",
        "Parent supervision for younger children",
      ],
    },
  };

  // Add modules data for courses
  const getModulesForCourse = (courseId) => {
    if (courseId === "1" || courseId === "2") {
      return [
        {
          title: "French Basics and Pronunciation",
          lessons: 6,
          duration: "2.5 hours",
          icon: Code,
          topics: [
            "French alphabet and sounds",
            "Basic greetings and introductions",
            "Numbers and counting",
            "Days of the week and months",
            "Essential pronunciation rules",
            "Common expressions",
          ],
        },
        {
          title: "Grammar Fundamentals",
          lessons: 8,
          duration: "4 hours",
          icon: Layers,
          topics: [
            "Noun genders and articles",
            "Present tense verbs",
            "Question formation",
            "Adjective agreement",
            "Prepositions",
            "Negative sentences",
          ],
        },
        {
          title: "Practical Conversations",
          lessons: 6,
          duration: "3 hours",
          icon: MessageCircle,
          topics: [
            "At the restaurant",
            "Shopping and prices",
            "Asking for directions",
            "Talking about family",
            "Hobbies and interests",
            "Travel situations",
          ],
        },
      ];
    } else if (courseId === "8") {
      return [
        {
          title: "Quran Basics and Arabic Letters",
          lessons: 8,
          duration: "3 hours",
          icon: Code,
          topics: [
            "Arabic alphabet recognition",
            "Letter shapes and forms",
            "Basic pronunciation rules",
            "Connecting letters",
            "Short vowels (Harakat)",
            "Reading simple words",
          ],
        },
        {
          title: "Tajweed Rules Foundation",
          lessons: 10,
          duration: "4.5 hours",
          icon: Layers,
          topics: [
            "Introduction to Tajweed",
            "Makharij (points of articulation)",
            "Sifaat (characteristics of letters)",
            "Noon Sakinah and Tanween rules",
            "Meem Sakinah rules",
            "Qalqalah",
          ],
        },
        {
          title: "Advanced Recitation",
          lessons: 12,
          duration: "5 hours",
          icon: MessageCircle,
          topics: [
            "Madd (elongation) rules",
            "Waqf (stopping) rules",
            "Ibtida (starting) rules",
            "Beautiful recitation practice",
            "Memorization techniques",
            "Spiritual aspects of recitation",
          ],
        },
      ];
    } else if (courseId === "18") {
      return [
        {
          title: "Calligraphy Foundations",
          lessons: 6,
          duration: "3 hours",
          icon: Code,
          topics: [
            "History of Arabic calligraphy",
            "Tools and materials",
            "Basic pen techniques",
            "Letter proportions",
            "Naskh script basics",
            "Practice exercises",
          ],
        },
        {
          title: "Traditional Scripts",
          lessons: 8,
          duration: "4 hours",
          icon: Layers,
          topics: [
            "Thuluth script",
            "Diwani script",
            "Kufic script",
            "Ruq'ah script",
            "Script characteristics",
            "Advanced letter forms",
          ],
        },
        {
          title: "Artistic Composition",
          lessons: 6,
          duration: "3 hours",
          icon: Monitor,
          topics: [
            "Layout and composition",
            "Decorative elements",
            "Color theory in calligraphy",
            "Modern adaptations",
            "Digital calligraphy",
            "Creating masterpieces",
          ],
        },
      ];
    } else if (courseId === "10") {
      return [
        {
          title: "Python Fundamentals",
          lessons: 8,
          duration: "4 hours",
          icon: Code,
          topics: [
            "Python syntax and basics",
            "Variables and data types",
            "Control structures",
            "Functions and modules",
            "Object-oriented programming",
            "Error handling",
          ],
        },
        {
          title: "Django Backend Development",
          lessons: 10,
          duration: "5 hours",
          icon: Server,
          topics: [
            "Django project setup",
            "Models and databases",
            "Views and URLs",
            "Django REST Framework",
            "Authentication system",
            "API development",
          ],
        },
        {
          title: "React Frontend Integration",
          lessons: 8,
          duration: "4 hours",
          icon: Layers,
          topics: [
            "React components",
            "State management",
            "API integration",
            "Routing",
            "UI/UX best practices",
            "Testing frontend",
          ],
        },
      ];
    } else if (courseId === "23") {
      return [
        {
          title: "Art Basics for Kids",
          lessons: 6,
          duration: "2 hours",
          icon: Code,
          topics: [
            "Drawing shapes and lines",
            "Understanding colors",
            "Basic painting techniques",
            "Using different art tools",
            "Creative warm-up exercises",
            "Art safety rules",
          ],
        },
        {
          title: "Fun Craft Projects",
          lessons: 8,
          duration: "3 hours",
          icon: Layers,
          topics: [
            "Paper crafts and origami",
            "Collage and mixed media",
            "Nature crafts",
            "Holiday decorations",
            "3D art projects",
            "Recycled art creations",
          ],
        },
        {
          title: "Digital Art for Kids",
          lessons: 4,
          duration: "1.5 hours",
          icon: Monitor,
          topics: [
            "Introduction to digital drawing",
            "Using art apps on tablets",
            "Creating digital stories",
            "Sharing artwork safely online",
          ],
        },
      ];
    } else {
      return [
        {
          title: "Introduction to Modern Web Development",
          lessons: 5,
          duration: "2 hours",
          icon: Code,
          topics: [
            "Course overview",
            "Development environment setup",
            "Modern JavaScript features",
            "Git and version control",
            "Project structure",
          ],
        },
        {
          title: "React Fundamentals and Advanced Patterns",
          lessons: 8,
          duration: "4 hours",
          icon: Layers,
          topics: [
            "Components and JSX",
            "State and props",
            "Hooks",
            "Context API",
            "Performance optimization",
            "Advanced patterns",
          ],
        },
        {
          title: "Responsive Design and CSS",
          lessons: 6,
          duration: "3 hours",
          icon: Monitor,
          topics: [
            "CSS Grid and Flexbox",
            "Mobile-first design",
            "CSS animations",
            "Sass/SCSS",
            "Design systems",
            "Browser compatibility",
          ],
        },
      ];
    }
  };

  // Get the course data based on ID, fallback to default course
  const course = coursesData[courseId] || {
    id: 1,
    title: "Course Not Found",
    subtitle: "The requested course could not be found",
    description:
      "Please return to the courses page to browse available courses.",
    image: "bg-gradient-to-br from-gray-500 to-gray-600",
    price: { usd: "$0", egp: "0 EGP" },
    originalPrice: { usd: "$0", egp: "0 EGP" },
    discount: 0,
    rating: 0,
    reviewCount: 0,
    students: 0,
    duration: "0 weeks",
    level: "Unknown",
    category: "Unknown",
    language: "English",
    subtitles: ["English"],
    lastUpdated: "Never",
    certificate: false,
    featured: false,
    startDate: "TBD",
    instructor: {
      name: "Unknown",
      title: "Unknown",
      company: "Unknown",
      avatar: "",
      bio: "Course not found.",
      students: 0,
      courses: 0,
      rating: 0,
    },
    skills: ["Course not available"],
    requirements: ["Course not available"],
  };

  // Add modules to the course object
  course.modules = getModulesForCourse(courseId);

  // Course features and reviews data
  const courseFeatures = [
    { icon: Monitor, text: "12 hours of HD video content" },
    { icon: Download, text: "Downloadable resources" },
    { icon: Smartphone, text: "Mobile and TV access" },
    { icon: Trophy, text: "Certificate of completion" },
    { icon: Globe, text: "Lifetime access" },
    { icon: Headphones, text: "24/7 student support" },
  ];

  const courseReviews = [
    {
      id: 1,
      name: "Ahmed Hassan",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      comment:
        "Excellent course! The instructor explains everything clearly and the projects are very practical.",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1fe?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      comment:
        "This course transformed my career. I got a job as a full-stack developer after completing it!",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Mohammed Ali",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      comment:
        "Great content and well-structured. Would recommend to anyone serious about web development.",
      date: "3 weeks ago",
    },
  ];

  const handleEnroll = () => {
    setIsEnrolled(true);
    toast({
      title: "Successfully Enrolled! 🎉",
      description:
        "Welcome to the course! You can now access all course materials.",
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked
        ? "Course removed from your saved list"
        : "Course saved to your bookmarks",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Course link copied to clipboard",
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <FloatingElement className="absolute top-20 right-20 w-32 h-32 bg-primary/5 rounded-full" />
          <FloatingElement className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <AnimatedSection animation="fade-up">
                  <div className="flex items-center gap-4 mb-6">
                    {course.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="px-4 py-2">
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2">
                      {course.category}
                    </Badge>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                    {course.title}
                  </h1>

                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    {course.subtitle}
                  </p>

                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-muted-foreground">
                        ({course.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        {course.students.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{course.language}</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                      />
                      <AvatarFallback>
                        {course.instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Instructor
                      </p>
                      <h3 className="text-lg font-semibold">
                        {course.instructor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor.title} at {course.instructor.company}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>
                          {course.instructor.students.toLocaleString()} students
                        </span>
                        <span>{course.instructor.courses} courses</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.instructor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Course Video & Enrollment */}
              <div className="lg:col-span-1">
                <AnimatedSection animation="slide-right" delay={200}>
                  <div className="sticky top-24">
                    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/20 transition-all duration-500">
                      {/* Video Preview */}
                      <div
                        className={`aspect-video ${course.image} relative cursor-pointer group`}
                      >
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MagneticButton>
                            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors duration-300">
                              <Play className="h-8 w-8 text-primary ml-1" />
                            </div>
                          </MagneticButton>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-black/50 text-white">
                            Preview
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        {/* Pricing */}
                        <div className="text-center mb-6">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-4xl font-bold">
                              {isEgyptUser === true
                                ? course.price.egp
                                : course.price.usd}
                            </span>
                            <span className="text-xl line-through text-muted-foreground">
                              {isEgyptUser === true
                                ? course.originalPrice.egp
                                : course.originalPrice.usd}
                            </span>
                            {course.discount > 0 && (
                              <Badge className="bg-red-500 text-white">
                                {course.discount}% OFF
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            One-time payment • Lifetime access
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-6">
                          <MagneticButton>
                            <Button
                              className="w-full h-12 btn-professional text-lg"
                              onClick={handleEnroll}
                              disabled={isEnrolled}
                            >
                              {isEnrolled ? (
                                <>
                                  <CheckCircle className="mr-2 h-5 w-5" />
                                  Enrolled
                                </>
                              ) : (
                                <>
                                  <Zap className="mr-2 h-5 w-5" />
                                  Enroll Now
                                </>
                              )}
                            </Button>
                          </MagneticButton>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={handleBookmark}
                            >
                              <Bookmark
                                className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                              />
                              {isBookmarked ? "Saved" : "Save"}
                            </Button>
                            <Button variant="outline" onClick={handleShare}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Course Features */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">
                            This course includes:
                          </h4>
                          {courseFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-sm"
                            >
                              <feature.icon className="h-4 w-4 text-primary" />
                              <span>{feature.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Guarantee */}
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              30-day money-back guarantee
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-12">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-12">
                {/* What You'll Learn */}
                <AnimatedSection animation="fade-up">
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Target className="h-6 w-6 text-primary" />
                        What you'll learn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaggeredList
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        itemClassName="group"
                        delay={100}
                      >
                        {course.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 group"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="group-hover:text-primary transition-colors duration-300">
                              {skill}
                            </span>
                          </div>
                        ))}
                      </StaggeredList>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Requirements */}
                <AnimatedSection animation="fade-up" delay={200}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Course Description */}
                <AnimatedSection animation="fade-up" delay={400}>
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {course.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-8">
                <AnimatedSection animation="fade-up">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                      Course Curriculum
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      <CountUp
                        end={course.modules.reduce(
                          (acc, module) => acc + module.lessons,
                          0,
                        )}
                      />{" "}
                      lessons • <CountUp end={15} /> hours
                    </p>
                  </div>

                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {course.modules.map((module, index) => (
                          <AccordionItem
                            key={index}
                            value={`module-${index}`}
                            className="border-border/50"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-accent/20 transition-colors duration-300">
                              <div className="flex items-center gap-4 w-full">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                  <module.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 text-left">
                                  <h3 className="font-semibold">
                                    {module.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {module.lessons} lessons • {module.duration}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <div className="space-y-3">
                                {module.topics.map((topic, topicIndex) => (
                                  <div
                                    key={topicIndex}
                                    className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg"
                                  >
                                    <Play className="h-4 w-4 text-primary" />
                                    <span className="flex-1">{topic}</span>
                                    <span className="text-sm text-muted-foreground">
                                      5 min
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-8">
                <AnimatedSection animation="fade-up">
                  <Card className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="text-center md:text-left">
                          <FloatingElement>
                            <Avatar className="h-32 w-32 mx-auto md:mx-0 mb-6">
                              <AvatarImage
                                src={course.instructor.avatar}
                                alt={course.instructor.name}
                              />
                              <AvatarFallback className="text-2xl">
                                {course.instructor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </FloatingElement>
                          <h2 className="text-2xl font-bold mb-2">
                            {course.instructor.name}
                          </h2>
                          <p className="text-lg text-primary mb-4">
                            {course.instructor.title}
                          </p>
                          <p className="text-muted-foreground mb-6">
                            {course.instructor.company}
                          </p>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                <CountUp
                                  end={course.instructor.students}
                                  suffix="+"
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Students
                              </p>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                <CountUp end={course.instructor.courses} />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Courses
                              </p>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                {course.instructor.rating}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Rating
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-4">
                            About the Instructor
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            {course.instructor.bio}
                          </p>

                          <div className="space-y-4">
                            <h4 className="font-semibold">Expertise</h4>
                            <div className="flex flex-wrap gap-2">
                              {courseId === "1"
                                ? [
                                    "French",
                                    "Language Teaching",
                                    "Culture",
                                    "Pronunciation",
                                    "Grammar",
                                    "Conversation",
                                  ].map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="px-3 py-1"
                                    >
                                      {skill}
                                    </Badge>
                                  ))
                                : [
                                    "React",
                                    "Node.js",
                                    "JavaScript",
                                    "HTML5",
                                    "CSS3",
                                    "Git",
                                  ].map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="secondary"
                                      className="px-3 py-1"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-8">
                <AnimatedSection animation="fade-up">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Student Reviews</h2>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="text-4xl font-bold">{course.rating}</div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          {course.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                  </div>

                  <StaggeredList
                    className="space-y-6"
                    itemClassName="group"
                    delay={150}
                  >
                    {courseReviews.map((review) => (
                      <Card
                        key={review.id}
                        className="bg-card/80 backdrop-blur-sm hover:bg-card transition-colors duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage
                                src={review.avatar}
                                alt={review.name}
                              />
                              <AvatarFallback>
                                {review.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{review.name}</h4>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.date}
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </StaggeredList>
                </AnimatedSection>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <FloatingElement className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full" />
        <FloatingElement className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full" />

        <div className="container mx-auto px-4 text-center relative">
          <AnimatedSection animation="scale-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to start learning?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who have already transformed their
              careers with this course.
            </p>
            <MagneticButton>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg"
                onClick={handleEnroll}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Enroll Now -{" "}
                {isEgyptUser === true ? course.price.egp : course.price.usd}
              </Button>
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
