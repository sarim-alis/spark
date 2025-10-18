import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Lock, PlayCircle, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

export default function LessonSidebar({ course, enrollment, activeLesson, onLessonClick, isLessonLocked }) {
  const getLessonStatus = (lesson) => {
    const progress = enrollment.progress.find(p => p.lesson_order === lesson.order);
    if (progress?.completed) return 'completed';
    if (isLessonLocked(lesson)) return 'locked';
    return 'unlocked';
  };

  const statusIcons = {
    completed: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    locked: <Lock className="w-4 h-4 text-slate-400" />,
    unlocked: <PlayCircle className="w-4 h-4 text-blue-500" />,
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <Link to={createPageUrl('MyCourses')}>
            <p className="text-xs text-slate-500 hover:text-amber-600">&larr; Back to My Courses</p>
        </Link>
        <h2 className="text-xl font-bold mt-1">{course.title}</h2>
        <div className="mt-2 space-y-1">
          <Progress value={enrollment.completion_percentage} className="h-2" />
          <p className="text-xs text-slate-600">{Math.round(enrollment.completion_percentage)}% complete</p>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">Lessons</h3>
        {course.lessons
          .sort((a, b) => a.order - b.order)
          .map((lesson) => {
            const status = getLessonStatus(lesson);
            const isLocked = status === 'locked';

            return (
              <button
                key={lesson.order}
                disabled={isLocked}
                onClick={() => onLessonClick(lesson)}
                className={cn(
                  "w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                  isLocked 
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "hover:bg-slate-200",
                  activeLesson?.order === lesson.order && !isLocked
                    ? "bg-amber-100 border border-amber-300 shadow-sm" 
                    : ""
                )}
              >
                {statusIcons[status]}
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{lesson.title}</p>
                  <span className="text-xs text-slate-500">{lesson.duration_minutes} min</span>
                </div>
                {lesson.quiz && (
                  <Badge variant="outline" className="text-xs font-mono bg-white">QUIZ</Badge>
                )}
              </button>
            );
        })}
      </div>
    </div>
  );
}