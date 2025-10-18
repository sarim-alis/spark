import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, Linkedin, Trophy, Star } from 'lucide-react';
import { User } from '@/api/entities';

export default function CourseCompletion({ course, enrollment }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const completionDate = new Date(enrollment.updated_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateCertificate = async () => {
    setIsGenerating(true);
    try {
      const user = await User.me();
      
      // Create certificate canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#fef3c7');
      gradient.addColorStop(1, '#fed7aa');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);

      // Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 1140, 740);

      // Title
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', 600, 150);

      // Divider
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 180);
      ctx.lineTo(900, 180);
      ctx.stroke();

      // Student name
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(user.full_name, 600, 280);

      // Course info
      ctx.font = '28px Arial';
      ctx.fillStyle = '#475569';
      ctx.fillText('has successfully completed', 600, 340);
      
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(course.title, 600, 400);

      // Date
      ctx.font = '24px Arial';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`Completed on ${completionDate}`, 600, 480);

      // Score
      if (enrollment.completion_percentage) {
        ctx.fillText(`Final Score: ${enrollment.completion_percentage}%`, 600, 520);
      }

      // Signature line
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 620);
      ctx.lineTo(800, 620);
      ctx.stroke();

      ctx.font = '20px Arial';
      ctx.fillStyle = '#64748b';
      ctx.fillText(course.instructor_name || 'Instructor', 600, 650);
      ctx.fillText('Course Instructor', 600, 680);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${course.title.replace(/\s+/g, '_')}_Certificate.png`;
        a.click();
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      setIsGenerating(false);
    }
  };

  const shareOnLinkedIn = () => {
    const text = `I just completed "${course.title}" on Course Spark! 🎓`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=600');
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Course Completion',
          text: `I just completed "${course.title}"!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-0 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Congratulations!</h1>
            <p className="text-lg text-slate-600">You've completed the course</p>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h2>
            <p className="text-slate-600 mb-4">Completed on {completionDate}</p>
            
            {enrollment.completion_percentage && (
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-slate-700">
                  Final Score: {enrollment.completion_percentage}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm">
              <Award className="w-4 h-4 mr-2" />
              Certificate Earned
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Course Completed
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={generateCertificate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </Button>
            
            <Button
              onClick={shareOnLinkedIn}
              variant="outline"
              className="border-[#0077b5] text-[#0077b5] hover:bg-[#0077b5] hover:text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>

            {navigator.share && (
              <Button onClick={shareCertificate} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Your achievement has been recorded. Share it with your network to showcase your new skills!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}