import React, { useEffect, useState } from 'react';
import CoursePromptForm from '@/components/course-creator/CoursePromptForm';
import GeneratedCoursePreview from '@/components/course-creator/GeneratedCoursePreview';
import { Course, User } from '@/api/entities';
import { courseAPI } from '@/services/courseApi';
import { generateCourseWithAI } from '@/services/aiCourseGenerator';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function CourseCreator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    (async () => {
      try { setUser(await User.me()); } catch { setUser(null); }
    })();
  }, []);

  const handleGenerate = async (form) => {
    setIsGenerating(true);
    setFormData(form); // Store form data for later use
    
    try {
      message.loading('Generating course with AI...', 0);
      
      // Call AI to generate course content
      const result = await generateCourseWithAI(form);
      
      message.destroy(); // Clear loading message
      
      if (result.success) {
        const aiCourse = result.data;
        
        // Create preview URL for uploaded image
        const imagePreviewUrl = form.thumbnailUrl 
          ? URL.createObjectURL(form.thumbnailUrl)
          : 'https://images.unsplash.com/photo-1517512006864-9d8466f3b542?w=800';
        
        setDraft({
          id: 'draft-' + Date.now(),
          title: aiCourse.title,
          description: aiCourse.description,
          level: form.level,
          category: form.category,
          duration_hours: form.duration,
          price: 49,
          thumbnail_url: imagePreviewUrl,
          lessons: aiCourse.lessons,
          created_by: user?.email || 'dev@localhost.com',
        });
        
        message.success('Course generated successfully!');
      } else {
        message.error(result.error || 'Failed to generate course');
        console.error('AI Generation failed:', result.error);
      }
    } catch (error) {
      message.destroy();
      message.error('Failed to generate course. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (updated) => setDraft(updated);

  const handleSave = async () => {
    if (!draft || !formData) return;
    try {
      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', draft.title);
      formDataToSend.append('description', draft.description || '');
      formDataToSend.append('lessons', JSON.stringify(draft.lessons || []));
      formDataToSend.append('audience', formData.audience);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('duration_hours', formData.duration);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      
      // Add image if selected
      if (formData.thumbnailUrl) {
        formDataToSend.append('thumbnail_url', formData.thumbnailUrl);
      }

      // Save to backend API
      const response = await courseAPI.create(formDataToSend);
      
      if (response.data.success) {
        message.success('Course created successfully!');
        navigate(createPageUrl('MyCourses'));
      }
    } catch (e) {
      console.error('Failed to save course', e);
      message.error(e.response?.data?.message || 'Failed to save course. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Create a New Course</h1>
          <p className="text-slate-600 text-sm">Use AI to generate a draft, then tweak and publish.</p>
        </div>

        {!draft ? (
          <CoursePromptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        ) : (
          <GeneratedCoursePreview
            course={draft}
            onEdit={handleEdit}
            onSave={handleSave}
            onBack={() => setDraft(null)}
          />
        )}
      </div>
    </div>
  );
}
