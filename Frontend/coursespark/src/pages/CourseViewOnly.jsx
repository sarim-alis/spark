// Imports.
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


// Frontend.
export default function CourseViewOnly() {
  // States.
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch course.
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await Course.get(id);
        
        // Parse lessons if it's a JSON string
        if (courseData && typeof courseData.lessons === 'string') {
          try {
            courseData.lessons = JSON.parse(courseData.lessons);
          } catch (e) {
            console.error('Failed to parse lessons:', e);
            courseData.lessons = [];
          }
        }
        
        // Ensure lessons is an array
        if (courseData && !Array.isArray(courseData.lessons)) {
          courseData.lessons = [];
        }
        
        setCourse(courseData);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-96 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Course Not Found</h2>
          <p className="text-slate-600 mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">View Course</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Details Card */}
        <Card className="mb-6 border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Thumbnail Image */}
            {course.thumbnail_url && (
              <div className="flex justify-center items-center bg-transparent p-4 rounded-lg">
                <img src={course.thumbnail_url} alt={course.title} className="h-32 md:h-40 object-cover rounded-lg" />
              </div>
            )}

            {/* Title */}
            <div>
              <input type="text" value={course.title} readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default" />
            </div>

            {/* Description */}
            <div>
              <textarea value={course.description || ''} readOnly rows={5} className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 resize-none cursor-default"
              />
            </div>

            {/* Price and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input type="text" value={course.price || ''} readOnly placeholder="Price" className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default" />
              </div>
              <div>
                <input type="text" value={course.level || ''} readOnly placeholder="Level" className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default capitalize" />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <input type="text" value={course.thumbnail_url || ''} readOnly placeholder="Thumbnail URL" className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default" />
            </div>

            {/* External Purchase URL */}
            <div>
              <input type="text" value={course.external_url || ''} readOnly placeholder="External Purchase URL (optional)" className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default" />
              <p className="text-xs text-slate-500 mt-4">
                If provided, the "Buy Now" button will redirect to this external URL instead of using the built-in payment system.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Lessons</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((lesson, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    {/* Lesson Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-slate-400">☰</span>
                        <input type="text" value={lesson.title} readOnly className="flex-1 px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 cursor-default font-medium" />
                      </div>
                      <input type="number" value={lesson.duration_minutes || ''} readOnly placeholder="Duration" className="w-20 px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 text-center cursor-default" />
                      {lesson.quiz && (
                        <span className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg">
                          Quiz
                        </span>
                      )}
                    </div>

                    {/* Lesson Content - Read-only ReactQuill */}
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <ReactQuill value={lesson.content || '<p>Start writing...</p>'} readOnly={true} theme="snow" modules={{ toolbar: false }} className="read-only-quill" />
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                No lessons available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .read-only-quill .ql-container {
          border: none !important;
        }
        .read-only-quill .ql-editor {
          padding: 12px;
          min-height: 100px;
        }
      `}</style>
    </div>
  );
}
