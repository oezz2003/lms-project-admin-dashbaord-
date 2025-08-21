import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddCourseDialog from '../components/AddCourseDialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { collection, addDoc, getDocs, setDoc, doc} from "firebase/firestore";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Users,
  Star,
  Clock,
  DollarSign,
  BookOpen,
  MoreHorizontal,
  Video,
  Upload,
  Image as ImageIcon,
  Play,
  Save
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { db } from '@/lib/firebase';
import { CourseWithVideos, VideoContent, coursesWithContent } from '@/lib/coursesData';

async function addCourse(course: Course) {
  try {
    const docRef = await addDoc(collection(db, "courses"), course);
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding document:", e);
  }
}

async function getCourses(): Promise<Course[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses: Course[] = querySnapshot.docs.map(doc => doc.data() as Course);
    console.log("Fetched courses:", courses);
    return courses;
  } catch (e) {
    console.error("Error fetching courses:", e);
    return [];
  }
}


// Use shared types and data for consistency
type Course = Omit<CourseWithVideos, 'id' | 'instructor'> & { id: string; instructors: string[] };
const initialCourses: Course[] = coursesWithContent.map(c => ({
  ...c,
  id: c.id.toString(),
  instructors: c.instructor ? [c.instructor] : [],
}));


const categories = ["Programming", "Data Science", "AI/ML", "Design", "Business", "Marketing"];

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditContentDialogOpen, setIsEditContentDialogOpen] = useState(false);
  const [selectedCourseForContent, setSelectedCourseForContent] = useState<Course | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructors: [""],
    category: "",
    price: "",
    duration: "",
    status: "draft" as Course['status'],
    thumbnail: "/placeholder.svg",
    videos: [] as VideoContent[]
  });

  // Content editing state
  const [contentFormData, setContentFormData] = useState({
    title: "",
    description: "",
    videos: [] as VideoContent[]
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructors.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // For now, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, thumbnail: fakeUrl });
    }
  };

  const addVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const newVideo: VideoContent = {
      id: Date.now(),
      title: "",
      description: "",
      url: "",
      duration: "",
      order: formData.videos.length + 1
    };
    setFormData({ ...formData, videos: [...formData.videos, newVideo] });
  };

  const removeVideo = (videoId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setFormData({
      ...formData,
      videos: formData.videos.filter(video => video.id !== videoId)
    });
  };

  const updateVideo = (videoId: number, field: keyof VideoContent, value: string) => {
    setFormData({
      ...formData,
      videos: formData.videos.map(video =>
        video.id === videoId ? { ...video, [field]: value } : video
      )
    });
  };

  const addContentVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const newVideo: VideoContent = {
      id: Date.now(),
      title: "",
      description: "",
      url: "",
      duration: "",
      order: contentFormData.videos.length + 1
    };
    setContentFormData({ ...contentFormData, videos: [...contentFormData.videos, newVideo] });
  };

  const removeContentVideo = (videoId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setContentFormData({
      ...contentFormData,
      videos: contentFormData.videos.filter(video => video.id !== videoId)
    });
  };

  const updateContentVideo = (videoId: number, field: keyof VideoContent, value: string) => {
    setContentFormData({
      ...contentFormData,
      videos: contentFormData.videos.map(video =>
        video.id === videoId ? { ...video, [field]: value } : video
      )
    });
  };

const handleAddCourse = async () => {
  try {
    // Step 1: Create a reference for a new doc (this generates the ID)
    const newDocRef = doc(collection(db, "courses"));

    // Step 2: Prepare your course object with Firestore ID as 'id'
    const newCourse: Course = {
      id: newDocRef.id, // Firestore's generated ID
      title: formData.title,
      description: formData.description,
  instructors: formData.instructors.filter(i => i.trim() !== ""),
      category: formData.category,
      price: Number(formData.price),
      duration: formData.duration,
      students: 0,
      rating: 0,
      status: formData.status,
      thumbnail: formData.thumbnail,
      createdAt: new Date().toISOString().split("T")[0],
      videos: formData.videos,
      progress: 0
    };

    // Step 3: Save the document to Firestore
    await setDoc(newDocRef, newCourse);

    // Step 4: Update local state
    setCourses([...courses, newCourse]);

    // Step 5: Close dialog & reset form
    setIsAddDialogOpen(false);
    resetForm();

    console.log("Course added with Firestore ID:", newDocRef.id);
  } catch (error) {
    console.error("Error adding course:", error);
  }
};

  const handleEditCourse = () => {
    if (!editingCourse) return;

    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id
        ? {
            ...course,
            title: formData.title,
            description: formData.description,
            instructors: formData.instructors.filter(i => i.trim() !== ""),
            category: formData.category,
            price: Number(formData.price),
            duration: formData.duration,
            status: formData.status,
            thumbnail: formData.thumbnail
          }
        : course
    );

    setCourses(updatedCourses);
    setIsEditDialogOpen(false);
    setEditingCourse(null);
    resetForm();
  };

  const handleEditContent = () => {
    if (!selectedCourseForContent) return;

    const updatedCourses = courses.map(course =>
      course.id === selectedCourseForContent.id
        ? {
            ...course,
            title: contentFormData.title,
            description: contentFormData.description,
            videos: contentFormData.videos
          }
        : course
    );

    setCourses(updatedCourses);
    setIsEditContentDialogOpen(false);
    setSelectedCourseForContent(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
  instructors: course.instructors,
      category: course.category,
      price: course.price.toString(),
      duration: course.duration,
      status: course.status,
      thumbnail: course.thumbnail,
      videos: course.videos
    });
    setIsEditDialogOpen(true);
  };

  const openEditContentDialog = (course: Course) => {
    setSelectedCourseForContent(course);
    setContentFormData({
      title: course.title,
      description: course.description,
      videos: [...course.videos]
    });
    setIsEditContentDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
  instructors: [""],
      category: "",
      price: "",
      duration: "",
      status: "draft",
      thumbnail: "/placeholder.svg",
      videos: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground">Manage your educational content and course offerings</p>
        </div>

        <AddCourseDialog
          open={isAddDialogOpen}
          setOpen={setIsAddDialogOpen}
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses or instructors..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(course)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditContentDialog(course)}>
                      <Video className="w-4 h-4 mr-2" />
                      Edit Content
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Course
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{course.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {course.videos.length > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Play className="w-3 h-3 mr-1" />
                  {course.videos.length} videos
                </div>
              )}
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="mt-1">
                    By {course.instructors && course.instructors.length > 0 ? course.instructors.join(", ") : "N/A"}
                  </CardDescription>
                </div>
                <Badge variant={course.status === "active" ? "default" : course.status === "draft" ? "secondary" : "outline"}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {course.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      {course.students}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                      {course.rating || "New"}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {course.price}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <div className="p-4 pt-0 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/course/${course.id}`, { state: { course } })}
              >
                View Full Info
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters or add a new course.</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course information below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Course Image Upload */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Course Cover Image</Label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-20 border border-border rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={formData.thumbnail} 
                    alt="Course cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended size: 1920x1080px
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label>Instructors</Label>
                {formData.instructors.map((inst, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={inst}
                      onChange={e => {
                        const newInstructors = [...formData.instructors];
                        newInstructors[idx] = e.target.value;
                        setFormData({ ...formData, instructors: newInstructors });
                      }}
                      placeholder={`Instructor ${idx + 1}`}
                    />
                    {formData.instructors.length > 1 && (
                      <Button type="button" size="icon" variant="ghost" onClick={() => {
                        setFormData({
                          ...formData,
                          instructors: formData.instructors.filter((_, i) => i !== idx)
                        });
                      }}>-</Button>
                    )}
                    {idx === formData.instructors.length - 1 && (
                      <Button type="button" size="icon" variant="ghost" onClick={() => {
                        setFormData({
                          ...formData,
                          instructors: [...formData.instructors, ""]
                        });
                      }}>+</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 8 weeks"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Course['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingCourse(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditCourse}>Update Course</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditContentDialogOpen} onOpenChange={setIsEditContentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course Content</DialogTitle>
            <DialogDescription>
              Update course title, description, and video content
            </DialogDescription>
          </DialogHeader>
          {selectedCourseForContent && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content-title">Course Title</Label>
                <Input
                  id="content-title"
                  value={contentFormData.title}
                  onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-description">Description</Label>
                <Textarea
                  id="content-description"
                  value={contentFormData.description}
                  onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Course Videos</Label>
                  <Button type="button" size="sm" onClick={(e) => addContentVideo(e)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                </div>
                
                {contentFormData.videos.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No videos added yet</p>
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={(e) => addContentVideo(e)}>
                      Add First Video
                    </Button>
                  </div>
                ) : (
                  contentFormData.videos.map((video, index) => (
                    <div key={video.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Video {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => removeContentVideo(video.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Video Title</Label>
                          <Input
                            value={video.title}
                            onChange={(e) => updateContentVideo(video.id, 'title', e.target.value)}
                            placeholder="Video title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={video.duration}
                            onChange={(e) => updateContentVideo(video.id, 'duration', e.target.value)}
                            placeholder="e.g. 25:30"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Video Description</Label>
                        <Textarea
                          value={video.description}
                          onChange={(e) => updateContentVideo(video.id, 'description', e.target.value)}
                          placeholder="Video description"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Video URL</Label>
                        <Input
                          value={video.url}
                          onChange={(e) => updateContentVideo(video.id, 'url', e.target.value)}
                          placeholder="https://example.com/video"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setIsEditContentDialogOpen(false);
                  setSelectedCourseForContent(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleEditContent}>
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
