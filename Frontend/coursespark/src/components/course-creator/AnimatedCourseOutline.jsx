// Imports.
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Clock, ChevronDown, ChevronUp, CheckCircle2, PlayCircle, FileText, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
gsap.registerPlugin(ScrollTrigger);


// Frontend.
export default function AnimatedCourseOutline({ lessons = [] }) {
  const [expandedLessons, setExpandedLessons] = useState(new Set([0]));
  const containerRef = useRef(null);
  const lessonRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate lessons on mount
    gsap.fromTo(lessonRefs.current,
      { opacity: 0, y: 50, scale: 0.95},
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none reverse'}}
    );

    // Parallax effect on scroll.
    lessonRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: -20 * (index % 3),
          scrollTrigger: { trigger: ref, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [lessons]);

  const toggleLesson = (index) => {
    setExpandedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const extractBulletPoints = (content) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = content;
    const listItems = tmp.querySelectorAll('li');
    return Array.from(listItems).map(li => li.textContent.trim()).slice(0, 4);
  };

  return (
    <div ref={containerRef} className="space-y-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Course Outline</h2>
        </div>
        <p className="text-slate-600 ml-14">
          {lessons.length} comprehensive lessons designed for your learning journey
        </p>
      </motion.div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const isExpanded = expandedLessons.has(index);
          const bulletPoints = extractBulletPoints(lesson.content);
          
          return (
            <motion.div
              key={lesson.order || index}
              ref={el => lessonRefs.current[index] = el}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <Card className="overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-2xl bg-white">
                {/* Lesson Header */}
                <motion.div
                  className="cursor-pointer"
                  onClick={() => toggleLesson(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="p-6 flex items-start gap-4">
                    {/* Lesson Number Badge */}
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {index + 1}
                    </motion.div>

                    {/* Lesson Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-slate-800 leading-tight">
                          {lesson.title}
                        </h3>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-slate-600" />
                          )}
                        </motion.div>
                      </div>

                      {/* Lesson Meta */}
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration_minutes || 30} minutes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PlayCircle className="w-4 h-4" />
                          <span>Lesson {lesson.order || index + 1}</span>
                        </div>
                      </div>

                      {/* Preview bullet points when collapsed */}
                      {!isExpanded && bulletPoints.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 space-y-1"
                        >
                          {bulletPoints.slice(0, 2).map((point, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{point}</span>
                            </div>
                          ))}
                          {bulletPoints.length > 2 && (
                            <span className="text-xs text-blue-600 font-medium">
                              +{bulletPoints.length - 2} more topics
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50">
                        {/* Bullet Points */}
                        {bulletPoints.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3 mb-4"
                          >
                            {bulletPoints.map((point, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + idx * 0.05 }}
                                className="flex items-start gap-3 group"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mt-0.5">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                  {point}
                                </p>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}

                        {/* Full Content Preview */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 p-4 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-slate-700">
                              Lesson Overview
                            </span>
                          </div>
                          <div 
                            className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: lesson.content.substring(0, 500) + (lesson.content.length > 500 ? '...' : '')
                            }}
                          />
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-4 flex gap-3"
                        >
                          </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative gradient line */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  style={{ originX: 0 }}
                />
              </Card>

              {/* Connecting line between lessons */}
              {index < lessons.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-blue-400 to-purple-400 -translate-x-1/2"
                  style={{ originY: 0 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-12 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Complete Course Journey
            </h3>
            <p className="text-slate-600">
              Master all {lessons.length} lessons and earn your certificate
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
