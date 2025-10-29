// Imports.
import { useEffect, useState } from 'react';
import CoursePromptForm from '@/components/course-creator/CoursePromptForm';
import GeneratedCoursePreview from '@/components/course-creator/GeneratedCoursePreview';
import PPTConfigModal from '@/components/course-creator/PPTConfigModal';
import { User } from '@/api/entities';
import { courseAPI } from '@/services/courseApi';
import { generateCourseWithAI } from '@/services/aiCourseGenerator';
import { generateCoursePPT } from '@/services/pptGenerator';
import { generateGammaProPPT } from '@/services/gammaProPptGenerator';
import { generateGoogleSlides, openPresentation } from '@/services/googleSlidesGenerator';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Sparkles, FileDown, ExternalLink } from 'lucide-react';


// Frontend.
export default function CourseCreator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [showPPTModal, setShowPPTModal] = useState(false);

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
      
      // Call AI to generate course content.
      const result = await generateCourseWithAI(form);
      
      message.destroy();
      
      if (result.success) {
        const aiCourse = result.data;
        
        // Create preview URL for uploaded image.
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
          price: form.price || 0,
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

  const handleGeneratePPT = async (pageCount, downloadOnly = false) => {
    if (!draft) return null;
    
    setIsGeneratingPPT(true);
    try {
      message.loading(`Generating ${pageCount}-slide PowerPoint presentation...`, 0);
      
      const result = await generateGammaProPPT({
        ...draft,
        audience: formData?.audience || 'All learners'
      }, pageCount, true); // true = use AI
      
      message.destroy();
      
      if (result.success) {
        // Download the file
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        message.success('Gamma-quality PPT downloaded successfully!');
        
        // Return the blob and filename for upload if not download-only
        if (!downloadOnly) {
          return { blob: result.blob, fileName: result.fileName };
        }
      } else {
        message.error(result.error || 'Failed to generate PPT');
      }
    } catch (error) {
      message.destroy();
      message.error('Failed to generate PPT. Please try again.');
      console.error('PPT generation error:', error);
    } finally {
      setIsGeneratingPPT(false);
    }
    return null;
  };

  const handleGenerateGoogleSlides = async () => {
    if (!draft) return;
    
    setIsGeneratingPPT(true);
    try {
      message.loading('Generating PowerPoint via Google Slides API...', 0);
      
      const result = await generateGoogleSlides({
        ...draft,
        audience: formData?.audience || 'All learners'
      });
      
      message.destroy();
      
      if (result.success) {
        message.success(`PowerPoint downloaded: ${result.fileName}`);
      } else {
        // Check if it's a popup blocking issue
        if (result.error && result.error.includes('popup')) {
          message.error({
            content: 'Please allow popups for this site and try again.',
            duration: 5,
          });
        } else {
          message.error(result.error || 'Failed to generate PowerPoint');
        }
      }
    } catch (error) {
      message.destroy();
      const errorMsg = error.message || 'Failed to generate PowerPoint. Please try again.';
      if (errorMsg.includes('popup')) {
        message.error({
          content: 'Popup blocked! Please allow popups for this site in your browser settings.',
          duration: 6,
        });
      } else {
        message.error(errorMsg);
      }
      console.error('Google Slides generation error:', error);
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const handleSave = async () => {
    if (!draft || !formData) return;
    try {
      message.loading('Saving course...', 0);
      
      // Prepare FormData for file upload.
      const formDataToSend = new FormData();
      formDataToSend.append('title', draft.title);
      formDataToSend.append('description', draft.description || '');
      formDataToSend.append('lessons', JSON.stringify(draft.lessons || []));
      formDataToSend.append('audience', formData.audience);
      formDataToSend.append('level', draft.level || formData.level);
      formDataToSend.append('duration_hours', draft.duration_hours || formData.duration);
      formDataToSend.append('category', draft.category || formData.category);
      formDataToSend.append('price', draft.price || formData.price || 0);
      
      // Add external_url if it exists
      if (draft.external_url) {
        formDataToSend.append('external_url', draft.external_url);
      }
      
      // Add image if selected.
      if (formData.thumbnailUrl) {
        formDataToSend.append('thumbnail_url', formData.thumbnailUrl);
      }

      // Save to backend API.
      const response = await courseAPI.create(formDataToSend);
      
      if (response.data.success) {
        const courseId = response.data.data.id;
        message.destroy();
        message.success('Course created successfully!');
        
        // Generate and upload PPT
        message.loading('Generating and uploading PowerPoint...', 0);
        try {
          const pptResult = await generateGammaProPPT({
            ...draft,
            audience: formData?.audience || 'All learners'
          }, 10, true); // Default 10 slides
          
          if (pptResult.success && pptResult.blob) {
            // Create File object from blob.
            const pptFile = new File([pptResult.blob], pptResult.fileName, {
              type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            });
            
            // Upload to backend.
            await courseAPI.uploadPowerPoint(courseId, pptFile);
            message.destroy();
            message.success('Course saved successfully!');
          } else {
            message.destroy();
            message.warning('Course saved, but PPT generation failed');
          }
        } catch (pptError) {
          console.error('PPT upload error:', pptError);
          message.destroy();
          message.warning('Course saved, but PPT upload failed');
        }
        
        navigate(createPageUrl('MyCourses'));
      }
    } catch (e) {
      message.destroy();
      console.error('Failed to save course', e);
      message.error(e.response?.data?.message || 'Failed to save course. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
       <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-xl">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold text-slate-800">AI Course Creator</h1>
       </div>
       <div className="text-center mb-6">
          <p className="text-slate-600 text-xs md:text-sm max-w-2xl mx-auto">Describe your course idea and let AI create a comprehensive curriculum for you</p>
       </div>

        {!draft ? (
          <CoursePromptForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        ) : (
          <>
            <div className="mb-4 flex justify-end gap-3">
              <button 
                onClick={handleGenerateGoogleSlides} 
                disabled={isGeneratingPPT} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-4 h-4" />
                {isGeneratingPPT ? 'Generating...' : 'Generate PPT (Google API)'}
              </button>
              <button 
                onClick={() => setShowPPTModal(true)} 
                disabled={isGeneratingPPT} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-4 h-4" />
                {isGeneratingPPT ? 'Generating...' : 'Generate PPT (Local)'}
              </button>
            </div>
            <GeneratedCoursePreview course={draft} onEdit={handleEdit} onSave={handleSave} onBack={() => setDraft(null)} />
            
            {/* PPT Configuration Modal */}
            <PPTConfigModal
              isOpen={showPPTModal}
              onClose={() => setShowPPTModal(false)}
              onGenerate={(pageCount) => handleGeneratePPT(pageCount, true)}
              totalLessons={draft?.lessons?.length || 0}
            />
          </>
        )}
      </div>
    </div>
  );
}
