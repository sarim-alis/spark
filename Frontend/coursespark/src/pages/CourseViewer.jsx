// Imports.
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { Course } from '@/api/entities';
import { Enrollment } from '@/api/entities';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LessonSidebar from '../components/course-viewer/LessonSidebar';
import LessonContent from '../components/course-viewer/LessonContent';
import CourseCompletion from '../components/course-viewer/CourseCompletion';


// Frontend.
export default function CourseViewer() {
  // States.
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const { id: routeId } = useParams();
  const courseId = routeId || new URLSearchParams(location.search).get('id');

  // Load data.
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const courseData = await Course.get(courseId);

      if (!courseData) {
        console.error("Course not found:", courseId);
        navigate(createPageUrl("MyCourses")); // Course doesn't exist, navigate away.
        return;
      }

      setCourse(courseData); // Always set course data if found.

      const enrollments = await Enrollment.filter({ student_email: user.email, course_id: courseId });
      
      if (enrollments.length === 0) {
        setEnrollment(null); // Course exists, but user not enrolled. Set enrollment to null to trigger purchase UI.
        setActiveLesson(null); // No active lesson if not enrolled.
      } else {
        setEnrollment(enrollments[0]);

        const lastCompletedLessonOrder = enrollments[0].progress
          .filter(p => p.completed)
          .reduce((max, p) => Math.max(max, p.lesson_order), 0);
        
        const nextLessonOrder = lastCompletedLessonOrder + 1;
        const firstLesson = courseData.lessons.find(l => l.order === nextLessonOrder) || courseData.lessons[0];
        setActiveLesson(firstLesson);
      }

    } catch (error) {
      console.error("Error loading course viewer:", error);
      navigate(createPageUrl("MyCourses"));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    if (courseId) {
      loadData();
    }
  }, [courseId, loadData]);

  // Handle lesson select.
  const handleLessonSelect = (lesson) => {
    setActiveLesson(lesson);
  };

  // Handle quiz complete.
  const handleQuizComplete = async (score, passed) => {
    const lessonOrder = activeLesson.order;
    let newProgress = [...(enrollment.progress || [])];
    const progressIndex = newProgress.findIndex(p => p.lesson_order === lessonOrder);
    const progressUpdate = { lesson_order: lessonOrder, completed: passed, completed_date: new Date().toISOString(), quiz_score: score, quiz_passed: passed,};

    if (progressIndex > -1) {
      newProgress[progressIndex] = progressUpdate;
    } else {
      newProgress.push(progressUpdate);
    }

    const completedLessons = newProgress.filter(p => p.completed).length;
    const totalLessons = course.lessons.length;
    const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Update enrollment.
    const updatedEnrollment = await Enrollment.update(enrollment.id, {
      progress: newProgress,
      completion_percentage: completionPercentage,
    });
    setEnrollment(updatedEnrollment);
    
    if (passed) {
      const nextLesson = course.lessons.find(l => l.order === lessonOrder + 1);
      if (nextLesson) {
        setActiveLesson(nextLesson);
      } else {
        // All lessons completed, fetch recommendations.
        const allCourses = await Course.filter({ is_published: true });
        const recommendations = allCourses
          .filter(c => c.id !== course.id && c.category === course.category)
          .slice(0, 3);
        setRecommendedCourses(recommendations);
      }
    }
    setIsQuizMode(false);
  };
  
  const isCourseCompleted = enrollment?.completion_percentage === 100;

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <div className="w-1/4 h-full p-4 border-r"><Skeleton className="h-full w-full" /></div>
        <div className="w-3/4 h-full p-8"><Skeleton className="h-full w-full" /></div>
      </div>
    );
  }

  // If course data itself wasn't loaded (e.g., bad ID, server error).
  if (!course) {
    return <div className="text-center p-8">Course not found.</div>;
  }

  // If course exists but user is not enrolled, show purchase option.
  if (course && !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <img 
              src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{course.title}</h1>
            <p className="text-slate-600 mb-6">{course.description}</p>
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-slate-500 mb-1">Course Price</p>
                <p className="text-4xl font-bold text-purple-600">${course.price || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Duration</p>
                <p className="text-lg font-semibold text-slate-800">{course.duration_hours || 0} hours</p>
              </div>
            </div>

            <Button 
              onClick={(e) => {
                e.preventDefault();
                const stripeLink = 'https://buy.stripe.com/5kQdR83PeglF5vEaCLaMU01';
                console.log('Opening Stripe link:', stripeLink);
                window.top.location.href = stripeLink;
              }}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg"
            >
              Enroll Now - ${course.price || 0}
            </Button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              Get lifetime access to all course materials
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Is lesson locked.
  const isLessonLocked = (lesson) => {
    if (lesson.order === 1) return false;
    const prevLesson = course.lessons.find(l => l.order === lesson.order - 1);
    if (!prevLesson) return false;
    if (prevLesson.quiz) {
      const prevLessonProgress = enrollment.progress.find(p => p.lesson_order === prevLesson.order);
      return !prevLessonProgress?.quiz_passed;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="flex h-[calc(100vh-4rem)] bg-white">
        <div className="w-full md:w-1/4 h-full overflow-y-auto border-r bg-slate-50">
          <LessonSidebar course={course} enrollment={enrollment} activeLesson={activeLesson} onLessonClick={handleLessonSelect} isLessonLocked={isLessonLocked} />
        </div>

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          {isCourseCompleted ? (
            <CourseCompletion course={course} enrollment={enrollment} recommendedCourses={recommendedCourses} />
          ) : activeLesson ? (
            <LessonContent lesson={activeLesson} onQuizComplete={handleQuizComplete} enrollment={enrollment} onQuizModeChange={setIsQuizMode} />
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Select a lesson to get started.</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
