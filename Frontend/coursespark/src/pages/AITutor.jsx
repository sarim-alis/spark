// Imports.
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Send, Sparkles, Loader2, BookOpen, Lock, Star } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { Course } from '@/api/entities';
import { User } from '@/api/entities';


// Frontend.
export default function AITutor() {
  // States.
  const [messages, setMessages] = useState([{ role: 'assistant',content: 'Hi! I\'m your AI Learning Assistant. 👋\n\nI can help you with:\n• Explaining course concepts\n• Answering questions about lessons\n• Providing study tips and resources\n• Breaking down complex topics\n\nSelect a course to get started, or ask me anything!'}]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // Load data.
  const loadData = async () => {
    setIsCheckingAccess(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setIsUnlocked(userData?.ai_tutor_unlocked === true);
      
      const userCourses = await Course.filter({ created_by: userData.email });
      setCourses(userCourses);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsCheckingAccess(false);
  };

  // Handle unlock.
  const handleUnlock = () => {
    const stripeLink = 'https://buy.stripe.com/5kQdR83PeglF5vEaCLaMU01'; // Updated Stripe link
    console.log('Opening Stripe link:', stripeLink);
    window.top.location.href = stripeLink;
  };

  // Scroll to buttom.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send.
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let context = `You are an expert AI tutor helping students learn effectively. 
You provide clear, patient explanations and break down complex topics into simple terms.
Be encouraging and supportive.

Student question: ${userMessage}`;

      if (selectedCourse) {
        const course = courses.find(c => c.id === selectedCourse);
        context = `You are an expert AI tutor for the course "${course.title}".

Course description: ${course.description}
Course topics: ${course.lessons?.map(l => l.title).join(', ') || 'General topics'}

Student question: ${userMessage}

Provide a detailed, helpful explanation. Use examples and analogies when appropriate.`;
      }

      const response = await InvokeLLM({
        prompt: context,
        add_context_from_internet: !selectedCourse
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking again!' 
      }]);
    }
    setIsLoading(false);
  };

  const quickPrompts = [
    'Explain this concept in simple terms',
    'Give me a real-world example',
    'What are the key points to remember?',
    'How can I practice this skill?'
  ];

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-extrabold">Unlock AI Learning Assistant</CardTitle>
            <p className="text-slate-600 mt-2">Get instant help from your personal AI tutor, available 24/7</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Ask questions about any lesson or concept</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Get explanations in simple, easy-to-understand terms</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Real-world examples and practice suggestions</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Study tips tailored to your courses</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-600 mb-4">Unlock the AI Learning Assistant and never feel stuck again</p>
              <Button onClick={handleUnlock}size="lg"className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg w-full">
                Unlock Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">AI Learning Assistant</h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base">Your personal tutor, available 24/7</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Course Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>General Questions</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quick Prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickPrompts.map((prompt, idx) => (
                  <Button key={idx} variant="outline" size="sm" className="w-full text-left justify-start text-xs" onClick={() => {setInput(prompt);}}>
                    {prompt}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-slate-50">
                <div className="flex gap-3">
                  <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="Ask anything about your course..." disabled={isLoading} className="flex-1 h-8" />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()}className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
