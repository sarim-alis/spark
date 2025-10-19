// Imports.
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, Loader2, Download, Sparkles, Lock, Star } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { User } from '@/api/entities';
import ReactMarkdown from 'react-markdown';


// Frontend.
export default function AITools() {
  const [user, setUser] = React.useState(null);
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsCheckingAccess(true);
    try {
      const userData = await User.me();
      setUser(userData);
      setIsUnlocked(userData?.ai_tools_unlocked === true);
    } catch (error) {
      console.error('Error loading user:', error);
    }
    setIsCheckingAccess(false);
  };

  // Handle unlock.
  const handleUnlock = async () => {
    const stripeLink = 'https://buy.stripe.com/5kQdR83PeglF5vEaCLaMU01';
    console.log('Opening Stripe link:', stripeLink);
    window.top.location.href = stripeLink; // Changed this line
    // The unlock status will be updated via a webhook after successful payment,
    // so no direct state change here.
  };

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
            <CardTitle className="text-3xl font-extrabold">Unlock AI Tools</CardTitle>
            <p className="text-slate-600 mt-2">
              Generate study notes and professional resumes with AI
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>AI-powered notes generation for any topic</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Professional resume builder with smart formatting</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Download generated content as PDF or Markdown</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Customizable depth and detail levels</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
              <p className="text-sm text-slate-600 mb-4">
                Unlock AI Tools and supercharge your learning and career
              </p>
              <Button 
                onClick={handleUnlock}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg w-full"
              >
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
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">AI-Powered Tools</h1>
          </div>
          <p className="text-slate-600">Generate study notes and professional resumes with AI</p>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes Generator
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Resume Builder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <NotesGenerator />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeBuilder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NotesGenerator() {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('comprehensive');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setNotes('');

    try {
      const prompt = `Create ${depth} study notes on the topic: "${topic}"

Please include:
- Clear definition and overview
- Key concepts and principles
- Important examples and applications
- Common misconceptions to avoid
- Summary of main points
- Suggested further reading or practice

Format the notes in a clear, organized manner with headers and bullet points.`;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: true
      });

      setNotes(result);
    } catch (error) {
      setNotes('Error generating notes. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_')}_notes.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Configure Your Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input
              placeholder="e.g., Quantum Physics, World War II, Marketing Strategy"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Depth</label>
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="brief">Brief Overview</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="detailed">Highly Detailed</option>
            </select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Notes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Notes</CardTitle>
          {notes && (
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {notes ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Your generated notes will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResumeBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });
  const [resume, setResume] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResume('');

    try {
      const prompt = `Create a professional resume based on the following information:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Professional Summary: ${formData.summary}
Work Experience: ${formData.experience}
Education: ${formData.education}
Skills: ${formData.skills}

Please format this as a professional resume with:
- Clear section headers
- Bullet points for achievements
- Professional language
- ATS-friendly format
- Modern, clean structure`;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setResume(result);
    } catch (error) {
      setResume('Error generating resume. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([resume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.name.replace(/\s+/g, '_')}_resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <Textarea
            placeholder="Professional Summary (2-3 sentences)"
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={3}
          />
          <Textarea
            placeholder="Work Experience (one per line)"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            rows={4}
          />
          <Textarea
            placeholder="Education (degrees, institutions)"
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            rows={2}
          />
          <Textarea
            placeholder="Skills (comma-separated)"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            rows={2}
          />

          <Button
            onClick={handleGenerate}
            disabled={!formData.name.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Generated Resume</CardTitle>
          {resume && (
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {resume ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-xs bg-slate-50 p-4 rounded-lg">
              {resume}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Your generated resume will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
