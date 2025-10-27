import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Course } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, DollarSign, Clock, BarChart3 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CourseViewOnly() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Badge variant={course.is_published ? 'default' : 'secondary'}>
              {course.is_published ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Course Header Card */}
        <Card className="mb-8 border-0 shadow-lg overflow-hidden">
          {/* Thumbnail */}
          {course.thumbnail_url && (
            <div className="flex justify-center items-center bg-slate-100 p-4">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="h-32 md:h-40 object-cover rounded-lg"
              />
            </div>
          )}

          <CardContent className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-lg mb-6">
              {course.description}
            </p>

            {/* Course Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="text-xl font-bold text-slate-800">
                    ${course.price || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-500">Level</p>
                  <p className="text-xl font-bold text-slate-800 capitalize">
                    {course.level || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="text-xl font-bold text-slate-800">
                    {course.duration_hours || 0} hours
                  </p>
                </div>
              </div>
            </div>

            {/* External Purchase Link */}
            {course.external_url && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      External Purchase Link
                    </p>
                    <p className="text-sm text-purple-700 break-all">
                      {course.external_url}
                    </p>
                  </div>
                  <Button
                    asChild
                    className="ml-4 bg-purple-600 hover:bg-purple-700"
                  >
                    <a
                      href={course.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Visit
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lessons Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-2xl">
              Course Lessons ({course.lessons?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-6">
                {course.lessons
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((lesson, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                    >
                      {/* Lesson Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
                            {lesson.order || index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {lesson.title}
                          </h3>
                        </div>
                        {lesson.duration_minutes && (
                          <Badge variant="outline" className="ml-2">
                            {lesson.duration_minutes} min
                          </Badge>
                        )}
                      </div>

                      {/* Lesson Content - Read-only ReactQuill */}
                      <div className="prose max-w-none">
                        <ReactQuill
                          value={lesson.content || '<p>No content available</p>'}
                          readOnly={true}
                          theme="bubble"
                          className="border-0"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No lessons available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
