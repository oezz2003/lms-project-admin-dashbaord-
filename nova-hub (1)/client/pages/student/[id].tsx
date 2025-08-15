import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { BookOpen, Mail, Phone, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { coursesWithContent } from "../../lib/coursesData";

interface Course {
  id: number;
  title: string;
  // Add other course fields as needed
}

interface PendingRequest {
  id: number;
  studentName: string;
  email: string;
  phone: string;
  courseRequested: string;
  appliedDate: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  courses: Course[];
  totalCourses: number;
  completedCourses: number;
  country: string;
  requests?: PendingRequest[];
}

export default function StudentProfile() {
  const { id } = useParams();
  const location = useLocation();
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (location.state && location.state.student) {
      setStudent(location.state.student);
    } else {
      // fallback: fetch student by id from backend or shared data if needed
    }
  }, [location.state]);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground">We couldn't find this student profile.</p>
      </div>
    );
  }

  // Get courses not already enrolled
  const availableCourses = coursesWithContent.filter(
    (course) => !student.courses.some((c) => c.id === course.id)
  );

  const handleEnroll = () => {
    if (selectedCourseId) {
      const courseToAdd = coursesWithContent.find((c) => c.id === selectedCourseId);
      if (courseToAdd) {
        setStudent({
          ...student,
          courses: [...student.courses, courseToAdd],
          totalCourses: student.totalCourses + 1,
        });
        setSelectedCourseId(null);
      }
    }
  };

  const handleRemove = (courseId: number) => {
    setStudent({
      ...student,
      courses: student.courses.filter((c) => c.id !== courseId),
      totalCourses: student.totalCourses - 1,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> {student.email}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4" /> {student.phone}
            </div>
            <Badge variant={student.status === "active" ? "default" : "secondary"} className="mt-2">
              {student.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {student.courses.length === 0 ? (
            <p className="text-muted-foreground">No courses enrolled.</p>
          ) : (
            <ul className="space-y-2">
              {student.courses.map((course) => (
                <li key={course.id} className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>{course.title}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-2"
                    title="Remove from course"
                    onClick={() => handleRemove(course.id)}
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {/* Enroll in new course */}
          <div className="mt-6 flex items-center gap-2">
            <Select
              value={selectedCourseId ? String(selectedCourseId) : ""}
              onValueChange={(val) => setSelectedCourseId(Number(val))}
              disabled={availableCourses.length === 0}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select course to enroll" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleEnroll}
              disabled={!selectedCourseId}
              variant="default"
            >
              Enroll
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {student.requests && student.requests.length > 0 ? (
            <ul className="space-y-2">
              {student.requests.map((req, idx) => (
                <li key={idx} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                  <span className="font-medium">{req.courseRequested}</span>
                  <span className="text-xs text-muted-foreground">Status: {req.status}</span>
                  <span className="text-xs text-muted-foreground">Applied: {new Date(req.appliedDate).toLocaleDateString()}</span>
                  <span className="text-xs text-muted-foreground">Message: {req.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No enrollment requests.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
