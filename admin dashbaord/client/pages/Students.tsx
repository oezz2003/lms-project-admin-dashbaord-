import { CourseWithVideos, coursesWithContent } from '../lib/coursesData';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Mail,
  Phone,
  BookOpen,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  UserCheck,
  UserX,
  GraduationCap,
  Eye
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending';
  courses: CourseWithVideos[];
  totalCourses: number;
  completedCourses: number;
  country: string;
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

async function addStudent(student: Student) {
  try {
    const docRef = await addDoc(collection(db, "users"), student);
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

async function getStudent(): Promise<Student[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const students: Student[] = querySnapshot.docs.map(doc => doc.data() as Student);
    return students;
  } catch (e) {
    console.error("Error fetching students:", e);
    return [];
  }
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 111-2222",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    status: "active",
    courses: [coursesWithContent[0], coursesWithContent[1]],
    totalCourses: 2,
    completedCourses: 1,
    country: "USA"
  },
  {
    id: 2,
    name: "Frank Miller",
    email: "frank@example.com",
    phone: "+1 (555) 333-4444",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    status: "inactive",
    courses: [coursesWithContent[1]],
    totalCourses: 1,
    completedCourses: 0,
    country: "Canada"
  },
  {
    id: 3,
    name: "Grace Liu",
    email: "grace@example.com",
    phone: "+1 (555) 555-6666",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "active",
    courses: [coursesWithContent[2]],
    totalCourses: 1,
    completedCourses: 1,
    country: "China"
  }
];

const initialRequests: PendingRequest[] = [
  {
    id: 1,
    studentName: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 111-2222",
    courseRequested: "Advanced React Development",
    appliedDate: "2024-01-25",
    message: "I'm a frontend developer looking to advance my React skills for my current project.",
    status: "pending"
  },
  {
    id: 2,
    studentName: "Frank Miller",
    email: "frank@example.com",
    phone: "+1 (555) 333-4444",
    courseRequested: "Python for Data Science",
    appliedDate: "2024-01-24",
    message: "I want to transition into data science and heard great things about this course.",
    status: "pending"
  },
  {
    id: 3,
    studentName: "Grace Liu",
    email: "grace@example.com",
    phone: "+1 (555) 555-6666",
    courseRequested: "Machine Learning Basics",
    appliedDate: "2024-01-23",
    message: "I have a background in statistics and want to learn ML applications.",
    status: "pending"
  }
];

// --- Students Component ---
export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id' | 'courses' | 'totalCourses' | 'completedCourses'>>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    status: 'active',
    country: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = requests.filter(request => request.status === "pending");

  const handleRejectRequest = (requestId: number) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: "rejected" as const } : r
    ));
  };

  const handleToggleStudentStatus = (studentId: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === "active" ? "inactive" : "active" }
        : student
    ));
  };

  const openStudentDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  };

  const openRequestDialog = (request: PendingRequest) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student accounts and enrollment requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {students.length} Total Students
          </Badge>
          <Badge variant="outline" className="text-sm">
            {pendingRequests.length} Pending Requests
          </Badge>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="default" className="ml-2">Add Student</Button>
        </div>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault();
              setStudents(prev => [
                ...prev,
                {
                  id: prev.length ? Math.max(...prev.map(s => s.id)) + 1 : 1,
                  ...newStudent,
                  avatar: newStudent.avatar || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random()*10)}.jpg`,
                  courses: [],
                  totalCourses: 0,
                  completedCourses: 0
                }
              ]);
              setIsAddDialogOpen(false);
              setNewStudent({
                name: '', email: '', phone: '', avatar: '', status: 'active', country: ''
              });
            }}
            className="space-y-4"
          >
            <Input required placeholder="Name" value={newStudent.name} onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))} />
            <Input required placeholder="Email" value={newStudent.email} onChange={e => setNewStudent(s => ({ ...s, email: e.target.value }))} />
            <Input required placeholder="Phone" value={newStudent.phone} onChange={e => setNewStudent(s => ({ ...s, phone: e.target.value }))} />
            <Input placeholder="Country" value={newStudent.country} onChange={e => setNewStudent(s => ({ ...s, country: e.target.value }))} />
            <Input placeholder="Avatar URL (optional)" value={newStudent.avatar} onChange={e => setNewStudent(s => ({ ...s, avatar: e.target.value }))} />
            <Select value={newStudent.status} onValueChange={v => setNewStudent(s => ({ ...s, status: v as any }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button type="submit">Add Student</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Active Students</TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Students Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {student.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/student/${student.id}`, { state: { student } })}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStudentStatus(student.id)}>
                            {student.status === "active" ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 mr-2" />
                      {student.phone}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="font-medium">{student.completedCourses}/{student.courses.length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {student.courses.length} course{student.courses.length !== 1 ? 's' : ''} enrolled
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card>
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No students found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Pending Requests */}
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{request.studentName}</CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {request.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {request.phone}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        Applied {new Date(request.appliedDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Course Requested:</h4>
                      <div className="flex items-center text-sm">
                        <BookOpen className="w-3 h-3 mr-2 text-primary" />
                        {request.courseRequested}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-1">Message:</h4>
                      <p className="text-sm text-muted-foreground">{request.message}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRequestDialog(request)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject {request.studentName}'s application for {request.courseRequested}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRejectRequest(request.id)}>
                                Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pendingRequests.length === 0 && (
            <Card>
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <UserCheck className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">No pending requests</h3>
                    <p className="text-muted-foreground">All student enrollment requests have been processed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Student Details Dialog */}
      <Dialog open={isStudentDialogOpen} onOpenChange={(open) => {
        setIsStudentDialogOpen(open);
        if (!open) setSelectedStudent(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.name} />
                  <AvatarFallback className="text-lg">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                  <Badge variant={selectedStudent.status === "active" ? "default" : "secondary"}>
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Phone: {selectedStudent.phone}</div>
                    <div>country: {selectedStudent.country}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Course Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div>Total Courses: {selectedStudent.totalCourses}</div>
                    <div>Completed: {selectedStudent.completedCourses}</div>
                    <div>In Progress: {selectedStudent.totalCourses - selectedStudent.completedCourses}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Enrolled Courses</h4>
                <div className="space-y-2">
                  {selectedStudent.courses.map((course, index) => (
                    <div key={index} className="flex items-center p-2 border rounded-lg">
                      <BookOpen className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm">{course.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enrollment Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selectedRequest.studentName}</h3>
                <p className="text-muted-foreground">{selectedRequest.email}</p>
                <p className="text-muted-foreground">{selectedRequest.phone}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Course Requested:</h4>
                <div className="flex items-center p-2 bg-accent rounded-lg">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <span>{selectedRequest.courseRequested}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Application Date:</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedRequest.appliedDate).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Message:</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {selectedRequest.message}
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleRejectRequest(selectedRequest.id);
                    setIsRequestDialogOpen(false);
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    //handleApproveRequest(selectedRequest.id);
                    setIsRequestDialogOpen(false);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { initialStudents, initialRequests };
