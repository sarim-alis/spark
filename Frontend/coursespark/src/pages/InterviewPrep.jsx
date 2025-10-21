// Imports.
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Sparkles, Award, Play } from 'lucide-react';
import axios from 'axios';
import { generateInterviewQuestionsWithAI, generateInterviewFeedbackWithAI } from '@/services/aiInterviewGenerator';
import { courseAPI } from '@/services/courseApi';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


// Frontend.
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

//   Load data.
  const loadData = async () => {
    try {
      // Get authenticated user from localStorage
      const authUser = localStorage.getItem('auth_user');
      if (!authUser) {
        console.error('No authenticated user found');
        return;
      }
      
      const userData = JSON.parse(authUser);
      setUser(userData);

      // Get ALL published courses (not just user's courses)
      const coursesResponse = await courseAPI.list({
        is_published: 1
      });
      const allPublishedCourses = coursesResponse.data.data || [];
      setCourses(allPublishedCourses);
      const token = localStorage.getItem('auth_token');
      const interviewResponse = await axios.get(`${API_URL}/interview-prep/me`, {headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}});

      if (interviewResponse.data.success && interviewResponse.data.data) {
        setInterviewPrep(interviewResponse.data.data);
      }
    } catch (error) {
      console.error('Error loading interview prep data:', error);
    }
  };

  const startNewSession = async (jobRole, courseIds, difficulty, interviewType) => {
    setIsGenerating(true);
    try {
      // Ensure courseIds is an array
      const courseIdsArray = Array.isArray(courseIds) ? courseIds : [courseIds];
      
      // Get course titles
      const courseTitles = courses
        .filter(c => courseIdsArray.includes(String(c.id)))
        .map(c => c.title)
        .join(', ') || 'General Topics';

      // Generate AI interview questions
      const result = await generateInterviewQuestionsWithAI({
        jobRole,
        courseTitles,
        difficulty,
        interviewType
      });

      if (!result.success) {
        throw new Error('Failed to generate questions');
      }

      const questions = {
        questions: result.data
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

      // Save to API
      const token = localStorage.getItem('auth_token');
      
      if (interviewPrep) {
        // Update existing
        const response = await axios.put(
          `${API_URL}/interview-prep/${interviewPrep.id}`,
          {
            job_role: jobRole,
            course_ids: courseIdsArray,
            difficulty,
            interview_type: interviewType
          }, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}}
        );
        setInterviewPrep(response.data.data);
      } else {
        // Create new.
        const response = await axios.post(
          `${API_URL}/interview-prep`,
          {
            user_email: user.email,
            job_role: jobRole,
            course_ids: courseIdsArray,
            difficulty,
            interview_type: interviewType,
            sessions: [],
            total_sessions: 0,
            average_score: 0
          },
          { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}}
        );
        setInterviewPrep(response.data.data);
      }
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
      
      // Get AI feedback on the answer
      const result = await generateInterviewFeedbackWithAI({
        question: question.question,
        idealAnswerPoints: question.ideal_answer_points,
        userAnswer: userAnswer
      });

      if (!result.success) {
        throw new Error('Failed to generate feedback');
      }

      const feedback = result.data;

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

    // Update interview prep in API
    const token = localStorage.getItem('auth_token');
    const response = await axios.put(
      `${API_URL}/interview-prep/${interviewPrep.id}`,
      {
        sessions: updatedSessions,
        total_sessions: newTotalSessions,
        average_score: newAvgScore
      }, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}}
    );
    
    setInterviewPrep(response.data.data);
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
            {/* Display current interview prep info if exists */}
            {interviewPrep && interviewPrep.course_ids && interviewPrep.course_ids.length > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Current Interview Prep Setup:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">
                        <span className="font-semibold">Role:</span> {interviewPrep.job_role || 'Not set'}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <span className="font-semibold">Difficulty:</span> {interviewPrep.difficulty || 'intermediate'}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <span className="font-semibold">Type:</span> {interviewPrep.interview_type || 'mixed'}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">Selected Courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {interviewPrep.course_ids.map(courseId => {
                          const course = courses.find(c => String(c.id) === String(courseId));
                          return course ? (
                            <Badge key={courseId} className="bg-purple-500 text-white">
                              {course.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
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
                          {courses.length > 0 ? (
                            courses.map(course => (
                              <SelectItem key={course.id} value={String(course.id)}>
                                {course.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No published courses available
                            </SelectItem>
                          )}
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