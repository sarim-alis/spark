import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import QuizView from './QuizView';

export default function LessonContent({ lesson, onQuizComplete, enrollment }) {
  const [showQuiz, setShowQuiz] = useState(false);
  
  const lessonProgress = enrollment.progress.find(p => p.lesson_order === lesson.order);
  const quizTaken = lessonProgress && typeof lessonProgress.quiz_score === 'number';

  // If there's a quiz and it hasn't been taken yet, automatically show it.
  // Otherwise, only show it if the user clicks.
  const shouldShowQuizInitially = lesson.quiz && !quizTaken;
  
  // Use a derived state from the initial condition to avoid re-renders.
  const [isQuizVisible, setIsQuizVisible] = useState(shouldShowQuizInitially);
  
  React.useEffect(() => {
    // Reset quiz visibility when lesson changes
    setShowQuiz(lesson.quiz && !quizTaken);
  }, [lesson.order, lesson.quiz, quizTaken]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">{lesson.title}</h1>
      <div 
        className="prose prose-lg max-w-none prose-slate"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      
      {lesson.quiz && (
        <div className="mt-8 pt-8 border-t">
          {isQuizVisible ? (
            <QuizView 
              quiz={lesson.quiz}
              onComplete={onQuizComplete}
              lessonProgress={lessonProgress}
            />
          ) : (
            <div className="text-center">
              <button 
                onClick={() => setIsQuizVisible(true)}
                className="bg-amber-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors"
              >
                {quizTaken ? "Retake Quiz" : "Start Quiz"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}