import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/studentLayout";
import CourseDetailsModal from "@/components/CourseDetailsModal";
import { 
  ShoppingCart, 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen,
  Award,
  Filter,
  Search,
  Heart,
  Share2,
  Download,
  CheckCircle,
  Tag,
  TrendingUp,
  Zap,
  Shield
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

const recommendedCourses: Course[] = [
  {
    id: "rec1",
    title: "Complete React Developer Course 2024",
    description: "Master React from beginner to advanced level. Build real-world projects including e-commerce, social media, and more.",
    instructor: "Jonas Schmedtmann",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    price: 89.99,
    originalPrice: 199.99,
    discount: 55,
    rating: 4.8,
    reviews: 12450,
    students: 85000,
    duration: "42 hours",
    lessons: 156,
    level: "Intermediate",
    category: "Frontend Development",
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    features: ["Lifetime Access", "Mobile & Desktop", "Certificate", "30-day Money Back"],
    isPopular: true,
    isBestseller: true,
    isNew: false,
    lastUpdated: "December 2024",
    language: "English",
    certificate: true,
  },
  // {
  //   id: "rec2",
  //   title: "Python for Data Science and Machine Learning",
  //   description: "Learn Python programming for data analysis, visualization, and machine learning with hands-on projects.",
  //   instructor: "Dr. Sarah Chen",
  //   instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=100&h=100&fit=crop&crop=face",
  //   image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
  //   price: 79.99,
  //   originalPrice: 149.99,
  //   discount: 47,
  //   rating: 4.7,
  //   reviews: 8920,
  //   students: 45000,
  //   duration: "35 hours",
  //   lessons: 128,
  //   level: "Beginner",
  //   category: "Data Science",
  //   tags: ["Python", "Data Science", "Machine Learning", "Analytics"],
  //   features: ["Practical Projects", "Code Templates", "Community Access", "Expert Support"],
  //   isPopular: false,
  //   isBestseller: true,
  //   isNew: true,
  //   lastUpdated: "January 2025",
  //   language: "English",
  //   certificate: true,
  // },
  // {
  //   id: "rec3",
  //   title: "Full Stack Web Development Bootcamp",
  //   description: "Become a full-stack developer with Node.js, Express, MongoDB, and React. Build 10+ real projects.",
  //   instructor: "Michael Rodriguez",
  //   instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  //   image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
  //   price: 119.99,
  //   originalPrice: 299.99,
  //   discount: 60,
  //   rating: 4.9,
  //   reviews: 15670,
  //   students: 95000,
  //   duration: "65 hours",
  //   lessons: 220,
  //   level: "Advanced",
  //   category: "Full Stack",
  //   tags: ["Full Stack", "Node.js", "MongoDB", "Express"],
  //   features: ["10+ Projects", "Job Assistance", "1-on-1 Mentoring", "Interview Prep"],
  //   isPopular: true,
  //   isBestseller: false,
  //   isNew: false,
  //   lastUpdated: "November 2024",
  //   language: "English",
  //   certificate: true,
  // },
];

const mockCourses: Course[] = [
  {
    id: "1",
    title: "German Course",
    description:
        "Learn German from basics with emphasis on practical conversation and grammar.",
    instructor: "Jonas Schmedtmann",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    price: 89.99,
    originalPrice: 199.99,
    discount: 55,
    rating: 4.8,
    reviews: 12450,
    students: 85000,
    duration: "42 hours",
    lessons: 156,
    level: "Intermediate",
    category: "Frontend Development",
    tags: ["Global Languages"],
    features: ["Lifetime Access", "Mobile & Desktop", "Certificate", "30-day Money Back"],
    isPopular: true,
    isBestseller: true,
    isNew: false,
    lastUpdated: "December 2024",
    language: "English",
    certificate: true,
  },
  {
    id: "2", 
    title: "Python for Data Science and Machine Learning",
    description: "Learn Python programming for data analysis, visualization, and machine learning with hands-on projects.",
    instructor: "Dr. Sarah Chen",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c4?w=100&h=100&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    price: 79.99,
    originalPrice: 149.99,
    discount: 47,
    rating: 4.7,
    reviews: 8920,
    students: 45000,
    duration: "35 hours",
    lessons: 128,
    level: "Beginner",
    category: "Data Science",
    tags: ["Python", "Data Science", "Machine Learning", "Analytics"],
    features: ["Practical Projects", "Code Templates", "Community Access", "Expert Support"],
    isPopular: false,
    isBestseller: true,
    isNew: true,
    lastUpdated: "January 2025",
    language: "English",
    certificate: true,
  },
  {
    id: "3",
    title: "Full Stack Web Development Bootcamp",
    description: "Become a full-stack developer with Node.js, Express, MongoDB, and React. Build 10+ real projects.",
    instructor: "Michael Rodriguez",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    price: 119.99,
    originalPrice: 299.99,
    discount: 60,
    rating: 4.9,
    reviews: 15670,
    students: 95000,
    duration: "65 hours",
    lessons: 220,
    level: "Advanced",
    category: "Full Stack",
    tags: ["Full Stack", "Node.js", "MongoDB", "Express"],
    features: ["10+ Projects", "Job Assistance", "1-on-1 Mentoring", "Interview Prep"],
    isPopular: true,
    isBestseller: false,
    isNew: false,
    lastUpdated: "November 2024",
    language: "English",
    certificate: true,
  },
  {
    id: "4",
    title: "Advanced CSS and Sass Masterclass",
    description: "Master advanced CSS techniques, Flexbox, Grid, animations, and Sass preprocessing.",
    instructor: "Emma Williams",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    price: 59.99,
    rating: 4.6,
    reviews: 5430,
    students: 28000,
    duration: "28 hours",
    lessons: 95,
    level: "Intermediate",
    category: "Frontend Development",
    tags: ["CSS", "Sass", "Frontend", "Design"],
    features: ["Source Code", "Design Files", "Responsive Projects", "Modern Techniques"],
    isPopular: false,
    isBestseller: false,
    isNew: true,
    lastUpdated: "December 2024",
    language: "English",
    certificate: true,
  },
];

const categories = [
  "All Courses",
  "Languages",
  "Development",
  "Design",
  "Healthcare",
  "Business",
  "Math",
];

const priceRanges = [
  { label: "Free", min: 0, max: 0 },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-rotate recommended courses every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendedIndex((prev) => (prev + 1) % recommendedCourses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    const matchesPrice = !selectedPriceRange || 
      (course.price >= selectedPriceRange.min && course.price <= selectedPriceRange.max);
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const toggleWishlist = (courseId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(courseId)) {
        newWishlist.delete(courseId);
      } else {
        newWishlist.add(courseId);
      }
      return newWishlist;
    });
  };

  const toggleCart = (courseId: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(courseId)) {
        newCart.delete(courseId);
      } else {
        newCart.add(courseId);
      }
      return newCart;
    });
  };

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const totalCartValue = Array.from(cart).reduce((sum, courseId) => {
    const course = mockCourses.find(c => c.id === courseId);
    return sum + (course?.price || 0);
  }, 0);

  return (
    <StudentLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Recommendations</h1>
          <p className="text-slate-600">Discover and purchase premium courses to advance your skills</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {cart.size > 0 && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-slate-600" />
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs">
                  {cart.size}
                </Badge>
              </div>
              <div className="text-sm">
                <p className="font-medium text-slate-900">${totalCartValue.toFixed(2)}</p>
                <p className="text-slate-600">{cart.size} items</p>
              </div>
              <Button size="sm">Checkout</Button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses Bar */}
      <Card className="bg-gradient-to-r from-primary/10 via-purple-50 to-primary/10 border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-32 flex items-center">
            <div className="absolute inset-0 flex items-center transition-transform duration-1000 ease-in-out"
                 style={{ transform: `translateX(-${currentRecommendedIndex * 100}%)` }}>
              {recommendedCourses.map((course, index) => (
                <div key={course.id} className="min-w-full flex items-center px-6 space-x-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className="bg-primary text-white text-xs">Recommended</Badge>
                      {course.discount && (
                        <Badge className="bg-red-500 text-white text-xs">-{course.discount}%</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">{course.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <span>{course.instructor}</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-slate-900">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-slate-500 line-through">${course.originalPrice}</span>
                      )}
                    </div>
                    <Button
                      onClick={() => toggleCart(course.id)}
                      className="min-w-[100px]"
                    >
                      {cart.has(course.id) ? "Added" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {recommendedCourses.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentRecommendedIndex ? "bg-primary" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">150+</p>
            <p className="text-sm text-slate-600">Courses Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">50k+</p>
            <p className="text-sm text-slate-600">Happy Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">98%</p>
            <p className="text-sm text-slate-600">Completion Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">4.8</p>
            <p className="text-sm text-slate-600">Average Rating</p>
          </CardContent>
        </Card>
      </div>

      <div>
          <h1 className="text-3xl font-bold text-slate-900">Course Store</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(category)}
                  className="w-full justify-start text-sm"
                >
                  {category}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Price Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {priceRanges.map((range) => (
                <Button
                  key={range.label}
                  variant={selectedPriceRange?.min === range.min ? "default" : "ghost"}
                  onClick={() => setSelectedPriceRange(range)}
                  className="w-full justify-start text-sm"
                >
                  {range.label}
                </Button>
              ))}
              {selectedPriceRange && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedPriceRange(null)}
                  className="w-full text-sm"
                >
                  Clear Filter
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Sort Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sort By</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Course Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">{filteredCourses.length} courses found</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {course.isBestseller && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        Bestseller
                      </Badge>
                    )}
                    {course.isNew && (
                      <Badge className="bg-green-500 text-white text-xs">
                        New
                      </Badge>
                    )}
                    {course.isPopular && (
                      <Badge className="bg-purple-500 text-white text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>

                  {/* Discount */}
                  {course.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{course.discount}%
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleWishlist(course.id)}
                      className={wishlist.has(course.id) ? "text-red-600" : ""}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(course.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Course Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                          {course.level}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{course.rating}</span>
                          <span className="text-xs text-slate-500">({course.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                      
                      <h3
                        className="font-semibold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => openCourseModal(course)}
                      >
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 line-clamp-2 mt-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm text-slate-600">{course.instructor}</span>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="w-3 h-3" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{(course.students / 1000).toFixed(0)}k students</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      {course.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-slate-600">
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-slate-900">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                        </div>
                        {course.originalPrice && (
                          <p className="text-xs text-green-600">
                            Save ${(course.originalPrice - course.price).toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => toggleCart(course.id)}
                        variant={cart.has(course.id) ? "outline" : "default"}
                        size="sm"
                      >
                        {cart.has(course.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-600">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={closeCourseModal}
          onAddToCart={toggleCart}
          onToggleWishlist={toggleWishlist}
          isInCart={cart.has(selectedCourse.id)}
          isInWishlist={wishlist.has(selectedCourse.id)}
        />
      )}
    </StudentLayout>
  );
}
