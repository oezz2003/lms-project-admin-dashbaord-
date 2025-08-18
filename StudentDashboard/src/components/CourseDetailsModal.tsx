import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Star, 
  Clock, 
  Users, 
  Play, 
  CheckCircle, 
  Globe, 
  Award, 
  Download,
  Smartphone,
  Monitor,
  Infinity,
  ShoppingCart,
  Heart
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  students: number;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  tags: string[];
  features: string[];
  isPopular: boolean;
  isBestseller: boolean;
  isNew: boolean;
  lastUpdated: string;
  language: string;
  certificate: boolean;
}

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (courseId: string) => void;
  onToggleWishlist: (courseId: string) => void;
  isInCart: boolean;
  isInWishlist: boolean;
}

const courseCurriculum = [
  {
    section: "Getting Started",
    lessons: [
      { title: "Introduction to React", duration: "12:34", isPreview: true },
      { title: "Setting Up Development Environment", duration: "18:22", isPreview: false },
      { title: "Your First React Component", duration: "15:45", isPreview: true },
    ]
  },
  {
    section: "React Fundamentals",
    lessons: [
      { title: "Understanding JSX", duration: "25:16", isPreview: false },
      { title: "Components and Props", duration: "32:45", isPreview: false },
      { title: "State Management", duration: "28:33", isPreview: false },
      { title: "Event Handling", duration: "22:18", isPreview: false },
    ]
  },
  {
    section: "Advanced React",
    lessons: [
      { title: "Hooks Deep Dive", duration: "45:22", isPreview: false },
      { title: "Context API", duration: "35:12", isPreview: false },
      { title: "Performance Optimization", duration: "38:42", isPreview: false },
    ]
  },
  {
    section: "Project Building",
    lessons: [
      { title: "Building a Todo App", duration: "1:12:34", isPreview: false },
      { title: "E-commerce Dashboard", duration: "1:45:22", isPreview: false },
      { title: "Deployment Strategies", duration: "22:15", isPreview: false },
    ]
  }
];

export default function CourseDetailsModal({ 
  course, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isInCart,
  isInWishlist 
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "reviews">("overview");

  if (!isOpen) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const totalCurriculumTime = courseCurriculum.reduce((total, section) => {
    return total + section.lessons.reduce((sectionTotal, lesson) => {
      const [minutes, seconds] = lesson.duration.split(':').map(Number);
      return sectionTotal + (minutes + (seconds || 0) / 60);
    }, 0);
  }, 0);

  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {course.isBestseller && (
              <Badge className="bg-orange-500 text-white">Bestseller</Badge>
            )}
            {course.isNew && (
              <Badge className="bg-green-500 text-white">New</Badge>
            )}
            {course.isPopular && (
              <Badge className="bg-purple-500 text-white">Popular</Badge>
            )}
          </div>

          {/* Course Info Overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
                <span>({course.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{(course.students / 1000).toFixed(0)}k students</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "curriculum", label: "Curriculum" },
                { id: "instructor", label: "Instructor" },
                { id: "reviews", label: "Reviews" }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex-1"
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">What you'll learn</h3>
                    <p className="text-slate-700 leading-relaxed">{course.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Course Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{course.duration} total</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{course.language}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">
                          {course.certificate ? "Certificate included" : "No certificate"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">#{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "curriculum" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Course Curriculum</h3>
                    <div className="text-sm text-slate-600">
                      {courseCurriculum.length} sections • {formatTotalTime(totalCurriculumTime)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {courseCurriculum.map((section, sectionIndex) => (
                      <Card key={sectionIndex}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{section.section}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                              <div className="flex items-center space-x-3">
                                <Play className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-700">{lesson.title}</span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">Preview</Badge>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "instructor" && (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.instructor}</h3>
                      <p className="text-slate-600">Senior Full Stack Developer</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.9 instructor rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>250k+ students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed">
                    {course.instructor} is a passionate educator and experienced developer with over 10 years 
                    in the industry. He has worked with companies like Google, Facebook, and Netflix, 
                    building scalable web applications that serve millions of users. His teaching style 
                    focuses on practical, real-world examples that help students understand not just 
                    the "how" but also the "why" behind modern web development.
                  </p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">{course.rating}</div>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">Course Rating</div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Based on {course.reviews.toLocaleString()} reviews
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Johnson", rating: 5, comment: "Excellent course! Very comprehensive and well-structured.", date: "2 days ago" },
                      { name: "Mike Chen", rating: 5, comment: "Jonas is an amazing instructor. Complex concepts made simple.", date: "1 week ago" },
                      { name: "Emma Wilson", rating: 4, comment: "Great content, though some sections could be more detailed.", date: "2 weeks ago" }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-slate-100 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{review.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium text-slate-900">{review.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-slate-50 border-l border-slate-200 p-6">
            <div className="sticky top-6">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-bold text-slate-900">${course.price}</span>
                  {course.originalPrice && (
                    <span className="text-lg text-slate-500 line-through">${course.originalPrice}</span>
                  )}
                  {course.discount && (
                    <Badge className="bg-red-500 text-white">{course.discount}% OFF</Badge>
                  )}
                </div>
                {course.originalPrice && (
                  <p className="text-sm text-green-600">
                    Save ${(course.originalPrice - course.price).toFixed(2)}
                  </p>
                )}
                <Badge className={`mt-2 ${getLevelColor(course.level)}`}>
                  {course.level}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => onAddToCart(course.id)}
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onToggleWishlist(course.id)}
                  className="w-full"
                  size="lg"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Course Includes */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">This course includes:</h4>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Infinity className="w-4 h-4 text-slate-500" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-slate-500" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
