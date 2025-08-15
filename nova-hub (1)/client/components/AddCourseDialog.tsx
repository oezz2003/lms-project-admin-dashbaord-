import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Upload, Trash2, Video } from 'lucide-react';
import { VideoContent } from '@/lib/coursesData';

interface AddCourseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddCourse: (course: any) => void;
  categories: string[];
}

export default function AddCourseDialog({ open, setOpen, onAddCourse, categories }: AddCourseDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructors: [''],
    category: '',
    price: '',
    duration: '',
    status: 'draft',
    thumbnail: '/placeholder.svg',
    videos: [] as VideoContent[],
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, thumbnail: fakeUrl });
    }
  };

  const addVideo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    const newVideo: VideoContent = {
      id: Date.now(),
      title: '',
      description: '',
      url: '',
      duration: '',
      order: formData.videos.length + 1,
    };
    setFormData({ ...formData, videos: [...formData.videos, newVideo] });
  };

  const removeVideo = (videoId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    setFormData({ ...formData, videos: formData.videos.filter((video) => video.id !== videoId) });
  };

  const updateVideo = (videoId: number, field: keyof VideoContent, value: string) => {
    setFormData({
      ...formData,
      videos: formData.videos.map((video) =>
        video.id === videoId ? { ...video, [field]: value } : video
      ),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructors: [''],
      category: '',
      price: '',
      duration: '',
      status: 'draft',
      thumbnail: '/placeholder.svg',
      videos: [],
    });
  };

  const handleSubmit = () => {
    onAddCourse(formData);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course with video content and cover image
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Course Image Upload */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Course Cover Image</Label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-20 border border-border rounded-lg overflow-hidden bg-muted">
                <img src={formData.thumbnail} alt="Course cover" className="w-full h-full object-cover" />
              </div>
              <div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Recommended size: 1920x1080px</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>

          {/* Basic Course Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter course title" />
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
                        instructors: [...formData.instructors, '']
                      });
                    }}>+</Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Course description" rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 8 weeks" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: string) => setFormData({ ...formData, status: value })}>
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

          {/* Videos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Course Videos</Label>
              <Button type="button" size="sm" onClick={addVideo}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
            {formData.videos.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg">
                <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No videos added yet</p>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addVideo}>
                  Add First Video
                </Button>
              </div>
            ) : (
              formData.videos.map((video, index) => (
                <div key={video.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Video {index + 1}</h4>
                    <Button type="button" variant="ghost" size="sm" onClick={(e) => removeVideo(video.id, e)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Video Title</Label>
                      <Input value={video.title} onChange={(e) => updateVideo(video.id, 'title', e.target.value)} placeholder="Video title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input value={video.duration} onChange={(e) => updateVideo(video.id, 'duration', e.target.value)} placeholder="e.g. 25:30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Video Description</Label>
                    <Textarea value={video.description} onChange={(e) => updateVideo(video.id, 'description', e.target.value)} placeholder="Video description" rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input value={video.url} onChange={(e) => updateVideo(video.id, 'url', e.target.value)} placeholder="https://example.com/video" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Course</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
