import { Link } from 'react-router-dom';
// Dashboard statistics cards data
const stats = [
  {
    title: "Total Courses",
    value: "24",
    change: "+12%",
    changeType: "increase" as const,
    icon: BookOpen,
    color: "bg-blue-500"
  },
  {
    title: "Active Students", 
    value: "1,247",
    change: "+8%",
    changeType: "increase" as const,
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Video Content",
    value: "156",
    change: "+20%",
    changeType: "increase" as const,
    icon: Video,
    color: "bg-purple-500"
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+15%",
    changeType: "increase" as const,
    icon: TrendingUp,
    color: "bg-green-600"
  }
];

import React, { useState } from 'react';
import { CourseWithVideos, VideoContent, coursesWithContent } from '@/lib/coursesData';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddCourseDialog from '../components/AddCourseDialog';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  TrendingUp, 
  Star,
  Calendar,
  Clock,
  Award,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Video,
  Trash2,
  Save
} from 'lucide-react';

export default function Dashboard() {
  const [courses, setCourses] = useState<CourseWithVideos[]>(coursesWithContent);
  const [editingCourse, setEditingCourse] = useState<CourseWithVideos | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const categories = ["Programming", "Data Science", "AI/ML", "Design", "Business", "Marketing"];
  const [isUploadVideoDialogOpen, setIsUploadVideoDialogOpen] = useState(false);
  const [isScheduleEventDialogOpen, setIsScheduleEventDialogOpen] = useState(false);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', description: '', courseId: '' });
  const [isIssueCertificateDialogOpen, setIsIssueCertificateDialogOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [certificateForm, setCertificateForm] = useState({ student: '', courseId: '', date: '' });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [uploadVideos, setUploadVideos] = useState([{ title: "", description: "", duration: "", file: null, uploadProgress: 0, url: "" }]);
  // Handle video file upload for upload dialog
  const handleUploadDialogVideoFileChange = (file, index) => {
    if (!file) return;
    const videoName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `videos/${videoName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const updatedVideos = [...uploadVideos];
        updatedVideos[index].uploadProgress = progress;
        setUploadVideos(updatedVideos);
      },
      (error) => {
        alert('Video upload failed: ' + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedVideos = [...uploadVideos];
          updatedVideos[index].url = downloadURL;
          updatedVideos[index].uploadProgress = 100;
          setUploadVideos(updatedVideos);
        });
      }
    );
  };

  const addUploadDialogVideo = () => {
    setUploadVideos([...uploadVideos, { title: "", description: "", duration: "", file: null, uploadProgress: 0, url: "" }]);
  };

  const removeUploadDialogVideo = (index) => {
    setUploadVideos(uploadVideos.filter((_, i) => i !== index));
  };

  const handleUploadVideosToCourse = () => {
    if (!selectedCourseId) return;
    setCourses(courses.map(course => {
      if (course.id.toString() === selectedCourseId) {
        const nextOrder = course.videos.length + 1;
        const newVideos = uploadVideos.filter(v => v.url).map((v, i) => ({
          id: Date.now() + i,
          title: v.title,
          description: v.description,
          url: v.url,
          duration: v.duration,
          order: nextOrder + i
        }));
        return { ...course, videos: [...course.videos, ...newVideos] };
      }
      return course;
    }));
    setIsUploadVideoDialogOpen(false);
    setSelectedCourseId("");
    setUploadVideos([{ title: "", description: "", duration: "", file: null, uploadProgress: 0, url: "" }]);
  };
  
  // New course form state
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    videos: [{ title: "", description: "", url: "", duration: "", file: null, uploadProgress: 0 }]
  });

  // Edit course form state
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    videos: [] as (VideoContent & { file?: any; uploadProgress?: number })[]
  });

  // Handle video file upload for edit dialog
  const handleEditVideoFileChange = (file, index) => {
    if (!file) return;
    const videoName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `videos/${videoName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const updatedVideos = [...editFormData.videos];
        updatedVideos[index].uploadProgress = progress;
        setEditFormData({ ...editFormData, videos: updatedVideos });
      },
      (error) => {
        alert('Video upload failed: ' + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedVideos = [...editFormData.videos];
          updatedVideos[index].url = downloadURL;
          updatedVideos[index].uploadProgress = 100;
          setEditFormData({ ...editFormData, videos: updatedVideos });
        });
      }
    );
  };

  const openEditDialog = (course: CourseWithVideos) => {
    setEditingCourse(course);
    setEditFormData({
      title: course.title,
      description: course.description,
      videos: [...course.videos]
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id
        ? {
            ...course,
            title: editFormData.title,
            description: editFormData.description,
            videos: editFormData.videos
          }
        : course
    );
    
    setCourses(updatedCourses);
    setIsEditDialogOpen(false);
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    const newCourseData: CourseWithVideos = {
      id: Date.now(),
      title: newCourse.title,
      description: newCourse.description,
      instructor: newCourse.instructor,
      students: 0,
      rating: 0,
      status: "draft",
      progress: 0,
      category: "General", // Default or get from form if you have it
      price: 0, // Default or get from form if you have it
      duration: "0h 0m", // Default or calculate from videos if you want
      thumbnail: "", // Default or get from form/file upload if you have it
      videos: newCourse.videos.map((video, index) => ({
        id: Date.now() + index,
        title: video.title,
        description: video.description,
        url: video.url,
        duration: video.duration,
        order: index + 1
      }))
    };

    setCourses([...courses, newCourseData]);
    setIsAddCourseDialogOpen(false);
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      videos: [{ title: "", description: "", url: "", duration: "", file: null, uploadProgress: 0 }]
    });
  };

  const addVideoToNewCourse = () => {
    setNewCourse({
      ...newCourse,
      videos: [...newCourse.videos, { title: "", description: "", url: "", duration: "", file: null, uploadProgress: 0 }]
    });
  };

  // Handle video file upload
  const handleVideoFileChange = (file, index) => {
    if (!file) return;
    const videoName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `videos/${videoName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const updatedVideos = [...newCourse.videos];
        updatedVideos[index].uploadProgress = progress;
        setNewCourse({ ...newCourse, videos: updatedVideos });
      },
      (error) => {
        alert('Video upload failed: ' + error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const updatedVideos = [...newCourse.videos];
          updatedVideos[index].url = downloadURL;
          updatedVideos[index].uploadProgress = 100;
          setNewCourse({ ...newCourse, videos: updatedVideos });
        });
      }
    );
  };

  const addVideoToEditCourse = () => {
    setEditFormData({
      ...editFormData,
      videos: [...editFormData.videos, {
        id: Date.now(),
        title: "",
        description: "",
        url: "",
        duration: "",
        order: editFormData.videos.length + 1
      }]
    });
  };

  const removeVideoFromEditCourse = (videoId: number) => {
    setEditFormData({
      ...editFormData,
      videos: editFormData.videos.filter(video => video.id !== videoId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your course content and platform.</p>
        </div>
        <AddCourseDialog
          open={isAddCourseDialogOpen}
          setOpen={setIsAddCourseDialogOpen}
          categories={categories}
          onAddCourse={(newCourse) => {
            setCourses([
              ...courses,
              {
                ...newCourse,
                id: Date.now().toString(),
                instructors: newCourse.instructors.filter((i) => i.trim() !== ""),
                videos: newCourse.videos.map((v, idx) => ({ ...v, order: idx + 1, id: v.id || Date.now() + idx })),
                students: 0,
                rating: 0,
                status: newCourse.status,
                progress: 0,
                thumbnail: newCourse.thumbnail,
              },
            ]);
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.changeType === "increase" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  <span className={stat.changeType === "increase" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Courses</span>
              <Button variant="ghost" size="sm">View All</Button>
            </CardTitle>
            <CardDescription>
              Manage and monitor your latest courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="block hover:bg-accent/40 transition rounded-lg"
              >
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-foreground">{course.title}</h3>
                      <Badge variant={course.status === "active" ? "default" : "secondary"}>
                        {course.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By {course.instructor}</span>
                      <span>{course.students} students</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                        {course.rating}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Course Content Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Course Content</span>
              <Badge variant="secondary">{courses.length}</Badge>
            </CardTitle>
            <CardDescription>
              Edit course titles and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-foreground">{course.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Video className="w-3 h-3 mr-1" />
                    {course.videos.length} videos
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.status}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full text-xs h-7"
                  onClick={() => openEditDialog(course)}
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit Content
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => setIsAddCourseDialogOpen(true)}>
              <BookOpen className="w-6 h-6 mb-2" />
              <span>Add New Course</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setIsUploadVideoDialogOpen(true)}>
              <Video className="w-6 h-6 mb-2" />
              <span>Upload Videos</span>
            </Button>
      {/* Upload Videos Dialog */}
      <Dialog open={isUploadVideoDialogOpen} onOpenChange={setIsUploadVideoDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Videos to Course</DialogTitle>
            <DialogDescription>
              Select a course and upload one or more videos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-course">Select Course</Label>
              <select
                id="select-course"
                className="w-full border rounded px-2 py-1"
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
              >
                <option value="">-- Select a course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Videos</Label>
                <Button type="button" size="sm" onClick={addUploadDialogVideo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
              {uploadVideos.map((video, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Video {index + 1}</h4>
                    {uploadVideos.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeUploadDialogVideo(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Video Title</Label>
                      <Input
                        value={video.title}
                        onChange={e => {
                          const updated = [...uploadVideos];
                          updated[index].title = e.target.value;
                          setUploadVideos(updated);
                        }}
                        placeholder="Video title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={video.duration}
                        onChange={e => {
                          const updated = [...uploadVideos];
                          updated[index].duration = e.target.value;
                          setUploadVideos(updated);
                        }}
                        placeholder="e.g. 25:30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Video Description</Label>
                    <Textarea
                      value={video.description}
                      onChange={e => {
                        const updated = [...uploadVideos];
                        updated[index].description = e.target.value;
                        setUploadVideos(updated);
                      }}
                      placeholder="Video description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Video File</Label>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          handleUploadDialogVideoFileChange(file, index);
                        }
                      }}
                    />
                    {video.uploadProgress > 0 && video.uploadProgress < 100 && (
                      <div className="text-xs text-blue-600">Uploading: {video.uploadProgress.toFixed(0)}%</div>
                    )}
                    {video.url && (
                      <div className="text-xs text-green-600">Uploaded!</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsUploadVideoDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadVideosToCourse} disabled={!selectedCourseId || uploadVideos.some(v => !v.url)}>
                Upload to Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setIsScheduleEventDialogOpen(true)}>
              <Calendar className="w-6 h-6 mb-2" />
              <span>Schedule Event</span>
            </Button>
      {/* Schedule Event Dialog */}
      <Dialog open={isScheduleEventDialogOpen} onOpenChange={setIsScheduleEventDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
            <DialogDescription>
              Create and schedule an event for a course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                value={eventForm.title}
                onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventForm.date}
                  onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={eventForm.time}
                  onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-course">Related Course</Label>
              <select
                id="event-course"
                className="w-full border rounded px-2 py-1"
                value={eventForm.courseId}
                onChange={e => setEventForm({ ...eventForm, courseId: e.target.value })}
              >
                <option value="">-- Select a course (optional) --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventForm.description}
                onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Event description"
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsScheduleEventDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setScheduledEvents([...scheduledEvents, { ...eventForm, id: Date.now() }]);
                  setIsScheduleEventDialogOpen(false);
                  setEventForm({ title: '', date: '', time: '', description: '', courseId: '' });
                }}
                disabled={!eventForm.title || !eventForm.date || !eventForm.time}
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
            <Button variant="outline" className="h-20 flex-col" onClick={() => setIsIssueCertificateDialogOpen(true)}>
              <Award className="w-6 h-6 mb-2" />
              <span>Issue Certificate</span>
            </Button>
      {/* Issue Certificate Dialog */}
      <Dialog open={isIssueCertificateDialogOpen} onOpenChange={setIsIssueCertificateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>
              Select a course and enter student details to issue a certificate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cert-student">Student Name or Email</Label>
              <Input
                id="cert-student"
                value={certificateForm.student}
                onChange={e => setCertificateForm({ ...certificateForm, student: e.target.value })}
                placeholder="Enter student name or email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-course">Course</Label>
              <select
                id="cert-course"
                className="w-full border rounded px-2 py-1"
                value={certificateForm.courseId}
                onChange={e => setCertificateForm({ ...certificateForm, courseId: e.target.value })}
              >
                <option value="">-- Select a course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-date">Date</Label>
              <Input
                id="cert-date"
                type="date"
                value={certificateForm.date}
                onChange={e => setCertificateForm({ ...certificateForm, date: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsIssueCertificateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setCertificates([...certificates, { ...certificateForm, id: Date.now() }]);
                  setIsIssueCertificateDialogOpen(false);
                  setCertificateForm({ student: '', courseId: '', date: '' });
                }}
                disabled={!certificateForm.student || !certificateForm.courseId || !certificateForm.date}
              >
                Issue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course Content</DialogTitle>
            <DialogDescription>
              Update course information and video content
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Course Videos</Label>
                  <Button type="button" size="sm" onClick={addVideoToEditCourse}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
                
                {editFormData.videos.map((video, index) => (
                  <div key={video.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Video {index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeVideoFromEditCourse(video.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Video Title</Label>
                        <Input
                          value={video.title}
                          onChange={(e) => {
                            const updatedVideos = editFormData.videos.map(v =>
                              v.id === video.id ? { ...v, title: e.target.value } : v
                            );
                            setEditFormData({ ...editFormData, videos: updatedVideos });
                          }}
                          placeholder="Video title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={video.duration}
                          onChange={(e) => {
                            const updatedVideos = editFormData.videos.map(v =>
                              v.id === video.id ? { ...v, duration: e.target.value } : v
                            );
                            setEditFormData({ ...editFormData, videos: updatedVideos });
                          }}
                          placeholder="e.g. 25:30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Video Description</Label>
                      <Textarea
                        value={video.description}
                        onChange={(e) => {
                          const updatedVideos = editFormData.videos.map(v =>
                            v.id === video.id ? { ...v, description: e.target.value } : v
                          );
                          setEditFormData({ ...editFormData, videos: updatedVideos });
                        }}
                        placeholder="Video description"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Video File</Label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            handleEditVideoFileChange(file, index);
                          }
                        }}
                      />
                      {video.uploadProgress > 0 && video.uploadProgress < 100 && (
                        <div className="text-xs text-blue-600">Uploading: {video.uploadProgress.toFixed(0)}%</div>
                      )}
                      {video.url && (
                        <div className="text-xs text-green-600">Uploaded!</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCourse}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
