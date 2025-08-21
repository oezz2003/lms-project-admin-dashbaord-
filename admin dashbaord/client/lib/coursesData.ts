// Shared course data and types
export interface VideoContent {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: string;
  order: number;
}

export interface CourseWithVideos {
  id: number;
  title: string;
  description: string;
  instructor: string;
  students: number;
  rating: number;
  status: string;
  progress: number;
  videos: VideoContent[];
  category: string;
  price: number;
  duration: string;
  thumbnail: string;
  createdAt?: string;
}

export const coursesWithContent: CourseWithVideos[] = [
  {
    id: 1,
    title: "Advanced React Development",
    description: "Master advanced React concepts including hooks, context, and performance optimization",
    instructor: "John Doe",
    students: 45,
    rating: 4.8,
    status: "active",
    progress: 78,
    videos: [
      { id: 1, title: "React Hooks Deep Dive", description: "Understanding useState, useEffect, and custom hooks", url: "https://example.com/video1", duration: "25:30", order: 1 },
      { id: 2, title: "Context API Mastery", description: "Creating and managing context for state", url: "https://example.com/video2", duration: "18:45", order: 2 },
      { id: 3, title: "Performance Optimization", description: "Memo, useMemo, and useCallback techniques", url: "https://example.com/video3", duration: "32:15", order: 3 }
    ],
    category: "Programming",
    price: 99,
    duration: "12h",
    thumbnail: "/placeholder.svg",
    createdAt: "2025-08-01"
  },
  {
    id: 2,
    title: "Python for Data Science",
    description: "Learn Python programming with focus on data analysis and machine learning",
    instructor: "Jane Smith",
    students: 32,
    rating: 4.9,
    status: "active",
    progress: 65,
    videos: [
      { id: 4, title: "Python Fundamentals", description: "Variables, data types, and control structures", url: "https://example.com/video4", duration: "28:20", order: 1 },
      { id: 5, title: "Pandas for Data Analysis", description: "Working with DataFrames and data manipulation", url: "https://example.com/video5", duration: "35:10", order: 2 }
    ],
    category: "Data Science",
    price: 120,
    duration: "15h",
    thumbnail: "/placeholder.svg",
    createdAt: "2025-07-15"
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and practical applications",
    instructor: "Mike Johnson",
    students: 28,
    rating: 4.7,
    status: "draft",
    progress: 45,
    videos: [
      { id: 6, title: "ML Introduction", description: "Overview of machine learning concepts", url: "https://example.com/video6", duration: "22:30", order: 1 }
    ],
    category: "AI/ML",
    price: 150,
    duration: "10h",
    thumbnail: "/placeholder.svg",
    createdAt: "2025-06-20"
  }
];
