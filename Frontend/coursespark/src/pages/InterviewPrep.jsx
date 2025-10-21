import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Sparkles, TrendingUp, Award, Play } from 'lucide-react';

export default function InterviewPrep() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Mock user data
      const userData = {
        email: 'user@example.com',
        name: 'John Doe'
      };
      setUser(userData);

      // Mock course data
      const userCourses = [
        { id: 'course-1', title: 'Course 1' },
        { id: 'course-2', title: 'Course 2' },
        { id: 'course-3', title: 'Course 3' }
      ];
      setCourses(userCourses);

      // Mock interview prep data
      const mockInterviewPrep = {
        id: 'mock-prep-1',
        user_email: userData.email,
        job_role: 'Software Developer',
        course_ids: [],
        difficulty: 'intermediate',
        interview_type: 'mixed',
        total_sessions: 3,
        average_score: 75,
        sessions: [
          {
            session_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            overall_score: 70,
            questions: []
          },
          {
            session_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            overall_score: 75,
            questions: []
          },
          {
            session_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            overall_score: 80,
            questions: []
          }
        ]
      };
      setInterviewPrep(mockInterviewPrep);
    } catch (error) {
      console.error('Error loading interview prep data:', error);
    }
  };

  const startNewSession = async (jobRole, courseIds, difficulty, interviewType) => {
    setIsGenerating(true);
    try {
      // Mock AI-generated questions
      const courseTitles = courses
        .filter(c => courseIds.includes(c.id))
        .map(c => c.title)
        .join(', ');

      const questions = {
        questions: [
          {
            question: `What are the key responsibilities of a ${jobRole}?`,
            ideal_answer_points: [
              'Understanding of core technical skills',
              'Team collaboration and communication',
              'Problem-solving abilities'
            ]
          },
          {
            question: `Describe a challenging project you worked on related to ${courseTitles}.`,
            ideal_answer_points: [
              'Clear problem statement',
              'Your approach and solution',
              'Results and learnings'
            ]
          },
          {
            question: `How do you stay updated with the latest trends in ${courseTitles}?`,
            ideal_answer_points: [
              'Continuous learning habits',
              'Industry resources and communities',
              'Practical application of knowledge'
            ]
          },
          {
            question: `Tell me about a time you had to work under pressure.`,
            ideal_answer_points: [
              'Specific situation description',
              'Actions taken',
              'Positive outcome'
            ]
          },
          {
            question: `What makes you a good fit for a ${jobRole} position?`,
            ideal_answer_points: [
              'Relevant skills and experience',
              'Passion for the field',
              'Alignment with role requirements'
            ]
          }
        ]
      };

      const session = {
        session_date: new Date().toISOString(),
        questions: questions.questions.map(q => ({
          question: q.question,
          ideal_answer_points: q.ideal_answer_points,
          user_answer: '',
          ai_feedback: '',
          rating: 0
        })),
        overall_score: 0,
        strengths: [],
        improvement_areas: []
      };

      setCurrentSession(session);
      setCurrentQuestion(0);
      setShowFeedback(false);

      // Update mock interview prep
      const updatedPrep = {
        ...interviewPrep,
        job_role: jobRole,
        course_ids: courseIds,
        difficulty,
        interview_type: interviewType
      };
      setInterviewPrep(updatedPrep);
    } catch (error) {
      console.error('Error starting interview session:', error);
      alert('Failed to generate interview questions');
    }
    setIsGenerating(false);
  };

  const submitAnswer = async () => {
    setIsGenerating(true);
    try {
      const question = currentSession.questions[currentQuestion];
      
      // Mock AI feedback
      const answerLength = userAnswer.trim().split(' ').length;
      const rating = Math.min(10, Math.max(5, Math.floor(answerLength / 10) + 5));
      
      const feedback = {
        rating: rating,
        strengths: [
          'Clear communication',
          'Relevant examples provided',
          'Good structure'
        ],
        improvements: [
          'Could provide more specific details',
          'Consider adding quantifiable results',
          'Expand on technical aspects'
        ],
        feedback_text: `Your answer demonstrates a good understanding of the topic. You've provided relevant information and structured your response well. To improve, consider adding more specific examples and quantifiable results. Overall, this is a solid answer that covers the key points.`
      };

      // Update session with feedback
      currentSession.questions[currentQuestion] = {
        ...question,
        user_answer: userAnswer,
        ai_feedback: feedback.feedback_text,
        rating: feedback.rating,
        strengths: feedback.strengths,
        improvements: feedback.improvements
      };

      setCurrentSession({...currentSession});
      setShowFeedback(true);
    } catch (error) {
      console.error('Error getting feedback:', error);
      alert('Failed to get feedback');
    }
    setIsGenerating(false);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentSession.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    const totalRating = currentSession.questions.reduce((sum, q) => sum + (q.rating || 0), 0);
    const avgScore = (totalRating / currentSession.questions.length) * 10;

    const allStrengths = currentSession.questions.flatMap(q => q.strengths || []);
    const allImprovements = currentSession.questions.flatMap(q => q.improvements || []);

    currentSession.overall_score = avgScore;
    currentSession.strengths = [...new Set(allStrengths)].slice(0, 5);
    currentSession.improvement_areas = [...new Set(allImprovements)].slice(0, 5);

    const updatedSessions = [...(interviewPrep.sessions || []), currentSession];
    const newTotalSessions = updatedSessions.length;
    const newAvgScore = updatedSessions.reduce((sum, s) => sum + s.overall_score, 0) / newTotalSessions;

    // Update mock interview prep
    const updatedPrep = {
      ...interviewPrep,
      sessions: updatedSessions,
      total_sessions: newTotalSessions,
      average_score: newAvgScore
    };
    setInterviewPrep(updatedPrep);
    setCurrentSession(null);
  };

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            AI Interview Prep
          </h1>
          <p className="text-slate-600 mt-2">
            Practice with AI-generated interview questions based on your courses
          </p>
        </header>

        {!currentSession ? (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Start New Practice Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  startNewSession(
                    formData.get('jobRole'),
                    [formData.get('courseId')],
                    formData.get('difficulty'),
                    formData.get('interviewType')
                  );
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Job Role</label>
                      <Input name="jobRole" placeholder="e.g., Frontend Developer, Product Manager" required />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Based on Course</label>
                      <Select name="courseId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Difficulty</label>
                      <Select name="difficulty" defaultValue="intermediate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Interview Type</label>
                      <Select name="interviewType" defaultValue="mixed">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Interview Practice
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1} of {currentSession.questions.length}</CardTitle>
                <Progress value={((currentQuestion + 1) / currentSession.questions.length) * 100} className="w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-lg text-slate-800 font-medium">
                  {currentSession.questions[currentQuestion].question}
                </p>
              </div>

              {!showFeedback ? (
                <>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[200px]"
                  />

                  <Button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Getting Feedback...
                      </>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Your Answer</h4>
                    <p className="text-sm text-blue-800">{currentSession.questions[currentQuestion].user_answer}</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Score: {currentSession.questions[currentQuestion].rating}/10
                    </h4>
                    <p className="text-sm text-emerald-800 mb-3">
                      {currentSession.questions[currentQuestion].ai_feedback}
                    </p>

                    {currentSession.questions[currentQuestion].strengths && currentSession.questions[currentQuestion].strengths.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-emerald-900 mb-1">Strengths:</p>
                        <ul className="text-xs text-emerald-800 space-y-1">
                          {currentSession.questions[currentQuestion].strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentSession.questions[currentQuestion].improvements && currentSession.questions[currentQuestion].improvements.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-emerald-900 mb-1">Areas to Improve:</p>
                        <ul className="text-xs text-emerald-800 space-y-1">
                          {currentSession.questions[currentQuestion].improvements.map((i, idx) => (
                            <li key={idx}>• {i}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button onClick={nextQuestion} className="w-full">
                    {currentQuestion < currentSession.questions.length - 1 ? 'Next Question' : 'Finish Session'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}