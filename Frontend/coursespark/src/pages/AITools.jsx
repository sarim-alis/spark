// Imports.
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, Loader2, Download, Sparkles, Lock, Star, Save } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { User } from '@/api/entities';
import ReactMarkdown from 'react-markdown';
import { generateNotesWithAI } from '@/services/aiNotesGenerator';
import { noteAPI } from '@/services/noteApi';


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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setNotes('');
    setSaveMessage('');

    try {
      const result = await generateNotesWithAI(topic, depth);
      
      if (result.success) {
        setNotes(result.data);
      } else {
        setNotes('Error generating notes. Please try again.');
      }
    } catch (error) {
      console.error('Notes generation error:', error);
      setNotes('Error generating notes. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!notes.trim() || !topic.trim()) return;
    
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await noteAPI.create({
        topic: topic,
        depth: depth,
        content: notes
      });
      
      if (response.data.success) {
        setSaveMessage('✅ Notes saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('❌ Failed to save notes');
      }
    } catch (error) {
      console.error('Save notes error:', error);
      setSaveMessage('❌ Error saving notes');
    }
    setIsSaving(false);
  };

  const handleDownload = () => {
    // Create a temporary div to render markdown as HTML
    const tempDiv = document.createElement('div');
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    
    // Convert markdown to HTML (basic conversion)
    let html = notes
      .replace(/### \*\*(.*?)\*\*/g, '<h3 style="color: #7c3aed; font-weight: bold; margin-top: 20px;">$1</h3>')
      .replace(/## \*\*(.*?)\*\*/g, '<h2 style="color: #8b5cf6; font-weight: bold; margin-top: 25px;">$1</h2>')
      .replace(/# \*\*(.*?)\*\*/g, '<h1 style="color: #6d28d9; font-weight: bold; margin-bottom: 20px;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
      .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
      .replace(/\n/g, '<br>');
    
    tempDiv.innerHTML = `<div style="max-width: 800px; margin: 0 auto;">${html}</div>`;
    document.body.appendChild(tempDiv);
    
    // Use html2pdf to generate PDF
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 1,
        filename: `${topic.replace(/\s+/g, '_')}_notes.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf.default().set(opt).from(tempDiv).save().then(() => {
        document.body.removeChild(tempDiv);
      });
    }).catch(() => {
      // Fallback to markdown download if html2pdf fails
      document.body.removeChild(tempDiv);
      const element = document.createElement('a');
      const file = new Blob([notes], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${topic.replace(/\s+/g, '_')}_notes.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                size="sm"
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDownload} 
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              saveMessage.includes('✅') 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {saveMessage}
            </div>
          )}
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
      const prompt = `You are a professional resume writer. Create a highly customized, ATS-friendly resume using EXACTLY the information provided below. Do NOT add generic filler content or make up information.

**Full Name:** ${formData.name}
**Email:** ${formData.email}
**Phone:** ${formData.phone}

**Professional Summary:**
${formData.summary || 'Not provided'}

**Work Experience:**
${formData.experience || 'Not provided'}

**Education:**
${formData.education || 'Not provided'}

**Skills:**
${formData.skills || 'Not provided'}

IMPORTANT INSTRUCTIONS:
1. Use ONLY the information provided above - do not invent or add fake details
2. If a section has "Not provided", create a minimal placeholder or skip it
3. Enhance the writing style and make it professional, but keep the SAME facts and details
4. Add action verbs and improve sentence structure while maintaining accuracy
5. Format with clear sections: Name, Contact, Summary, Technical Skills, Experience, Education
6. Use bullet points (•) for achievements
7. Keep it ATS-friendly (no tables, simple formatting)
8. Make each bullet point impactful with strong action verbs
9. If numbers/metrics are provided, keep them; don't add fake ones

Output the resume in clean, well-structured plain text format.`;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      // InvokeLLM returns an object with {response, usage}, extract the response text
      const resumeText = typeof result === 'object' && result.response ? result.response : result;
      setResume(resumeText);
    } catch (error) {
      setResume('Error generating resume. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    // Create a temporary div to render resume as HTML
    const tempDiv = document.createElement('div');
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';
    tempDiv.style.maxWidth = '800px';
    tempDiv.style.margin = '0 auto';
    
    // Convert resume text to HTML with proper formatting
    let html = resume
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^(Summary:|Technical Skills:|Experience:|Projects:|Education:|Skills:)/gm, '<h3 style="color: #7c3aed; font-weight: bold; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">$1</h3>')
      .replace(/^• (.*?)$/gm, '<li style="margin-left: 20px;">$1</li>')
      .replace(/^- (.*?)$/gm, '<li style="margin-left: 20px;">$1</li>')
      .replace(/\n\n/g, '</p><p style="margin: 10px 0;">')
      .replace(/\n/g, '<br>');
    
    // Add name styling at the top
    html = html.replace(new RegExp(`^${formData.name}`, 'i'), `<h1 style="color: #6d28d9; font-weight: bold; margin-bottom: 5px; font-size: 28px;">${formData.name}</h1>`);
    
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);
    
    // Use html2pdf to generate PDF
    import('html2pdf.js').then((html2pdf) => {
      const opt = {
        margin: 0.5,
        filename: `${formData.name.replace(/\s+/g, '_')}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      html2pdf.default().set(opt).from(tempDiv).save().then(() => {
        document.body.removeChild(tempDiv);
      });
    }).catch(() => {
      // Fallback to text download if html2pdf fails
      document.body.removeChild(tempDiv);
      const element = document.createElement('a');
      const file = new Blob([resume], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${formData.name.replace(/\s+/g, '_')}_resume.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
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
            placeholder="Professional Summary (2-3 sentences about your expertise and experience)"
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={3}
          />
          <Textarea
            placeholder="Work Experience (Format: Job Title | Company | Date Range\nBullet points of achievements and responsibilities)"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            rows={6}
          />
          <Textarea
            placeholder="Education (Format: Degree | Institution | Year/CGPA)"
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            rows={3}
          />
          <Textarea
            placeholder="Skills (Categorize: Frontend, Backend, DevOps, Database, etc.)"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            rows={3}
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
            <Button 
              onClick={handleDownload} 
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
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
