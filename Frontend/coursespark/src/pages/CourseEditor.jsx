
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Course } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus, Save, ArrowLeft, BrainCircuit } from "lucide-react";
import { createPageUrl } from "@/utils";
import QuizEditor from "../components/course-editor/QuizEditor";

export default function CourseEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setCourseId] = useState(null); // New state for course ID
  const [activeQuizEditor, setActiveQuizEditor] = useState(null);

  // Effect to extract course ID from URL params or search parameters
  useEffect(() => {
    const { id: routeId } = useParams();
    if (routeId) {
      setCourseId(routeId);
    } else {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      setCourseId(id);
    }
  }, [location.search]); // Re-run if URL search parameters change

  // Effect to fetch course data when courseId state changes
  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) { // Only fetch if courseId is available
        try {
          setIsLoading(true); // Start loading
          const courseData = await Course.get(courseId);
          setCourse(courseData);
        } catch (error) {
          console.error("Failed to fetch course:", error);
          setCourse(null); // Set course to null if fetch fails
        } finally {
          setIsLoading(false); // Always stop loading, regardless of success or failure
        }
      } else {
        setIsLoading(false); // If no courseId, immediately stop loading as there's nothing to fetch
      }
    };
    fetchCourse();
  }, [courseId]); // Depend on courseId state

  const handleInputChange = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...course.lessons];
    newLessons[index][field] = value;
    setCourse(prev => ({ ...prev, lessons: newLessons }));
  };

  const addLesson = () => {
    const newLesson = { title: "New Lesson", content: "<p>Start writing...</p>", order: (course.lessons?.length || 0) + 1, duration_minutes: 10 };
    setCourse(prev => ({ ...prev, lessons: [...(prev.lessons || []), newLesson] }));
  };
  
  const removeLesson = (index) => {
    const newLessons = course.lessons.filter((_, i) => i !== index);
    setCourse(prev => ({...prev, lessons: newLessons}));
  };
  
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(course.lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedItems = items.map((item, index) => ({...item, order: index + 1}));
    setCourse(prev => ({...prev, lessons: updatedItems}));
  };
  
  const handleSaveCourse = async () => {
    if (!course) return; // Prevent saving if course object is null
    await Course.update(course.id, course);
    alert("Course saved successfully!");
    navigate(createPageUrl('MyCourses'));
  };

  const handleQuizChange = (lessonIndex, updatedQuiz) => {
    const newLessons = [...course.lessons];
    newLessons[lessonIndex].quiz = updatedQuiz;
    setCourse(prev => ({...prev, lessons: newLessons}));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-slate-600">Course not found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-4 md:space-y-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl('MyCourses'))} className="flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Edit Course</h1>
        </div>

        {/* Course Details Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 pt-0">
            <Input 
              placeholder="Course Title" 
              value={course.title} 
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="md:col-span-2"
            />
            <Textarea 
              placeholder="Course Description" 
              value={course.description} 
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="md:col-span-2"
              rows={3}
            />
            <Input 
              type="number" 
              placeholder="Price" 
              value={course.price} 
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))} 
            />
            <Select value={course.level} onValueChange={(v) => handleInputChange('level', v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Thumbnail URL" 
              value={course.thumbnail_url} 
              onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
              className="md:col-span-2"
            />
            <Input 
              placeholder="External Purchase URL (optional)" 
              value={course.external_url || ''} 
              onChange={(e) => handleInputChange('external_url', e.target.value)}
              className="md:col-span-2"
            />
            <p className="text-xs text-slate-500 md:col-span-2 -mt-2">
              If provided, the "Buy Now" button will redirect to this external URL instead of using the built-in payment system.
            </p>
          </CardContent>
        </Card>

        {/* Lessons Editor Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 gap-3">
            <CardTitle className="text-lg md:text-xl">Lessons</CardTitle>
            <Button onClick={addLesson} className="w-full sm:w-auto text-sm md:text-base">
              <Plus className="w-4 h-4 mr-2" />Add Lesson
            </Button>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="lessons">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 md:space-y-4">
                    {(course.lessons || []).map((lesson, index) => (
                      <Draggable key={`lesson-${index}`} draggableId={`lesson-${index}`} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} className="p-3 md:p-4 border rounded-lg bg-slate-50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                              <span {...provided.dragHandleProps} className="cursor-grab touch-none order-first sm:order-none">
                                <GripVertical className="w-4 h-4 md:w-5 md:h-5" />
                              </span>
                              <Input 
                                value={lesson.title} 
                                onChange={(e) => handleLessonChange(index, 'title', e.target.value)} 
                                className="font-bold flex-1 text-sm md:text-base"
                                placeholder="Lesson title"
                              />
                              <Input 
                                type="number" 
                                value={lesson.duration_minutes} 
                                onChange={(e) => handleLessonChange(index, 'duration_minutes', parseInt(e.target.value))} 
                                className="w-full sm:w-20 md:w-24 text-sm md:text-base" 
                                placeholder="Duration"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveQuizEditor(activeQuizEditor === index ? null : index)}
                                className={activeQuizEditor === index ? 'bg-amber-100' : ''}
                              >
                                <BrainCircuit className="w-4 h-4 mr-2"/>
                                Quiz
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeLesson(index)}
                                className="order-last sm:order-none flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            {activeQuizEditor === index && (
                              <QuizEditor
                                quiz={lesson.quiz}
                                onQuizChange={(updatedQuiz) => handleQuizChange(index, updatedQuiz)}
                              />
                            )}
                            <div className={`[&_.ql-editor]:min-h-[100px] [&_.ql-toolbar]:text-sm ${activeQuizEditor === index ? 'mt-4' : ''}`}>
                              <ReactQuill 
                                theme="snow" 
                                value={lesson.content} 
                                onChange={(content) => handleLessonChange(index, 'content', content)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
        
        <div className="flex justify-center md:justify-end">
          <Button 
            onClick={handleSaveCourse} 
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg text-sm md:text-base"
          >
            <Save className="w-4 h-4 mr-2"/> Save Course
          </Button>
        </div>
      </div>
    </div>
  );
}
