// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle, Users, Star } from "lucide-react";
import StudentLayout from "@/components/studentLayout";

interface Course {
  id: string;
  title: string;
  image: string;
  // per-user/computed:
  progress: number; // 0-100
  isCompleted: boolean;
  instructor: string;
  totalLessons: number;
  completedLessons: number; // from enrollment (0 if not enrolled)
  category: string;
  rating: number;
  students: number;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "enrolled">(
    "all"
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // new: display name state (for dynamic welcome)
  const [displayName, setDisplayName] = useState<string | null>(null);

  // watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // new: load the display name (prefer Firestore users/{uid} firstName/lastName)
  useEffect(() => {
    const loadName = async () => {
      if (!user?.uid) {
        setDisplayName(null);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data() as any;
          const first = (data.firstName ?? "").toString().trim();
          const last = (data.lastName ?? "").toString().trim();
          const full = `${first} ${last}`.trim();
          if (full) {
            setDisplayName(first);
            return;
          }
        }

        // fallback to auth displayName
        if (user.displayName && user.displayName.trim()) {
          setDisplayName(user.displayName.trim());
          return;
        }

        // fallback to email local-part
        if (user.email) {
          const local = user.email.split("@")[0];
          if (local) {
            // capitalize first letter
            setDisplayName(local.charAt(0).toUpperCase() + local.slice(1));
            return;
          }
        }

        // final fallback
        setDisplayName("John");
      } catch (err) {
        console.error("Failed to load user name:", err);
        // don't block UI — fallback gracefully
        setDisplayName(user?.displayName ?? (user?.email?.split("@")[0] ?? "John"));
      }
    };

    loadName();
  }, [user]);

  // subscribe to courses + optionally enrollments (merged)
  useEffect(() => {
    setLoading(true);
    setError(null);

    let unsubCourses: Unsubscribe | null = null;
    let unsubEnrollments: Unsubscribe | null = null;

    // 1) subscribe to all courses
    const coursesQ = query(collection(db, "courses"), orderBy("title"));
    unsubCourses = onSnapshot(
      coursesQ,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const raw = d.data() as any;
          return {
            id: d.id,
            title: raw.title ?? "Untitled Course",
            image: raw.image ?? "",
            instructor: raw.instructor ?? "Unknown",
            totalLessons:
              typeof raw.totalLessons === "number" ? raw.totalLessons : 0,
            // will be filled/overwritten after merging enrollments:
            completedLessons: 0,
            progress: 0,
            isCompleted: false,
            category: raw.category ?? "General",
            rating: typeof raw.rating === "number" ? raw.rating : 0,
            students: typeof raw.students === "number" ? raw.students : 0,
          } as Course;
        });

        setCourses((prev) => {
          // If enrollments already merged in prev, preserve integrity by remapping:
          // simplest: return docs and allow enrollment snapshot to merge shortly after.
          return docs;
        });

        setLoading(false);
      },
      (err) => {
        console.error("courses snapshot err", err);
        setError(err.message || "Failed to load courses");
        setLoading(false);
      }
    );

    // 2) if user logged in subscribe to their enrollments and merge
    if (user?.uid) {
      const enrollRef = collection(db, "users", user.uid, "enrollments");
      unsubEnrollments = onSnapshot(
        enrollRef,
        (snap) => {
          const enrollMap = new Map<string, any>();
          snap.docs.forEach((d) => {
            const raw = d.data() as any;
            const courseId = d.id ?? raw.courseId;
            enrollMap.set(courseId, {
              completedLessons:
                typeof raw.completedLessons === "number" ? raw.completedLessons : 0,
              startedAt: raw.startedAt ?? null,
              lastSeenAt: raw.lastSeenAt ?? null,
              status: raw.status ?? "in-progress",
            });
          });

          setCourses((prevCourses) =>
            prevCourses.map((c) => {
              const e = enrollMap.get(c.id);
              const completedLessons = e ? e.completedLessons : 0;
              const totalLessons = c.totalLessons ?? 0;
              const progress =
                totalLessons > 0
                  ? Math.round((completedLessons / totalLessons) * 100)
                  : 0;
              const isCompleted =
                totalLessons > 0 ? completedLessons >= totalLessons : false;
              return {
                ...c,
                completedLessons,
                progress,
                isCompleted,
              };
            })
          );
        },
        (err) => {
          console.error("enrollments snapshot err", err);
        }
      );
    } else {
      // user not logged in: ensure all courses have 0 progress (we already set that in courses snapshot)
      setCourses((prev) =>
        prev.map((c) => ({
          ...c,
          completedLessons: 0,
          progress: 0,
          isCompleted: false,
        }))
      );
    }

    return () => {
      if (unsubCourses) unsubCourses();
      if (unsubEnrollments) unsubEnrollments();
    };
  }, [user?.uid]);

  const completedCourses = courses.filter((course) => course.isCompleted);
  const enrolledCourses = courses.filter((course) => !course.isCompleted);

  const getDisplayCourses = () => {
    switch (activeTab) {
      case "completed":
        return completedCourses;
      case "enrolled":
        return enrolledCourses;
      default:
        return courses;
    }
  };

  const getProgressColor = (progress: number, isCompleted: boolean) => {
    if (isCompleted) return "bg-success";
    if (progress >= 75) return "bg-warning";
    if (progress >= 50) return "bg-primary";
    return "bg-muted-foreground";
  };

  return (
    <StudentLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {displayName ?? "John"}!
        </h2>
        <p className="text-slate-600">Continue your learning journey and achieve your goals.</p>
      </div>

      {/* Loading / Error */}
      {loading && <div className="py-6 text-center">Loading courses...</div>}
      {error && <div className="py-6 text-center text-red-600">Error: {error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary/10 to-purple-100 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Courses</p>
                <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-success/10 to-green-100 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{completedCourses.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-warning/10 to-yellow-100 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
          className="rounded-full"
        >
          All Courses ({courses.length})
        </Button>
        <Button
          variant={activeTab === "enrolled" ? "default" : "outline"}
          onClick={() => setActiveTab("enrolled")}
          className="rounded-full"
        >
          Currently Enrolled ({enrolledCourses.length})
        </Button>
        <Button
          variant={activeTab === "completed" ? "default" : "outline"}
          onClick={() => setActiveTab("completed")}
          className="rounded-full"
        >
          Completed ({completedCourses.length})
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getDisplayCourses().map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {course.isCompleted && (
                <div className="absolute top-3 right-3 bg-success text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Complete</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700">
                {course.category}
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-warning text-warning" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{(course.students / 1000).toFixed(0)}k students</span>
                </div>
              </div>
              <p className="text-sm text-slate-600">by {course.instructor}</p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Progress: {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                        course.progress,
                        course.isCompleted
                      )}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <Link to="/Learn" className="w-full">
                  <Button
                    className="w-full mt-2"
                    variant={course.isCompleted ? "outline" : "default"}
                  >
                    {course.isCompleted ? "Review Course" : "Continue Learning"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getDisplayCourses().length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-600">
            {activeTab === "completed"
              ? "You haven't completed any courses yet."
              : "You're not enrolled in any courses yet."}
          </p>
        </div>
      )}
    </StudentLayout>
  );
}