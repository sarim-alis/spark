// Professional Gamma-Style PPT Generator
import pptxgen from 'pptxgenjs';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate professional PPT content with OpenAI
 */
const generateProfessionalContent = async (courseData, targetPages) => {
  try {
    const prompt = `Create a professional ${targetPages}-slide presentation for this course:

Title: ${courseData.title}
Description: ${courseData.description}
Level: ${courseData.level}
Lessons: ${courseData.lessons?.length || 0}

Structure:
- Slide 1: Title with engaging tagline
- Slide 2: Course outline (list all ${courseData.lessons?.length || 0} lessons)
- Slides 3-${targetPages-1}: Content slides with key points
- Slide ${targetPages}: Conclusion with next steps

For each slide provide:
{
  "slide_title": "Clear title",
  "slide_content": ["3-5 concise bullet points"],
  "slide_type": "title|outline|content|conclusion"
}

Return JSON only:
{"slides": [...]}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional presentation designer. Return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    let jsonText = data.choices[0].message.content.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI generation error:', error);
    return null;
  }
};

/**
 * Generate fallback content
 */
const generateFallbackContent = (courseData, targetPages) => {
  const slides = [];
  const lessons = courseData.lessons || [];
  
  // Title slide
  slides.push({
    slide_title: courseData.title,
    slide_content: [
      courseData.description,
      `${courseData.level} Level`,
      `${lessons.length} Comprehensive Lessons`
    ],
    slide_type: 'title'
  });
  
  // Outline slide
  slides.push({
    slide_title: 'What You\'ll Learn',
    slide_content: lessons.map((l, i) => `${i + 1}. ${l.title}`),
    slide_type: 'outline'
  });
  
  // Content slides
  const contentSlides = targetPages - 3;
  for (let i = 0; i < Math.min(contentSlides, lessons.length); i++) {
    const lesson = lessons[i];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = lesson.content || '';
    const bullets = Array.from(tempDiv.querySelectorAll('li'))
      .map(li => li.textContent.trim())
      .slice(0, 5);
    
    slides.push({
      slide_title: lesson.title,
      slide_content: bullets.length > 0 ? bullets : [
        'Core concepts and fundamentals',
        'Practical applications',
        'Real-world examples',
        'Best practices'
      ],
      slide_type: 'content'
    });
  }
  
  // Conclusion
  slides.push({
    slide_title: 'Ready to Get Started?',
    slide_content: [
      'Complete all lessons at your pace',
      'Practice with hands-on projects',
      'Earn your certificate',
      'Join our learning community'
    ],
    slide_type: 'conclusion'
  });
  
  return { slides: slides.slice(0, targetPages) };
};

/**
 * Create professional Gamma-style PPT
 */
export const generateProfessionalPPT = async (courseData, targetPages = 10, useAI = true) => {
  try {
    let pptContent;
    
    if (useAI && OPENAI_API_KEY) {
      pptContent = await generateProfessionalContent(courseData, targetPages);
    }
    
    if (!pptContent) {
      pptContent = generateFallbackContent(courseData, targetPages);
    }
    
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'CourseSpark AI';
    pptx.title = courseData.title;
    
    // Professional color palette
    const colors = {
      primary: '6366F1',      // Indigo-500
      secondary: '8B5CF6',    // Violet-500
      accent: '10B981',       // Emerald-500
      dark: '1E293B',         // Slate-800
      medium: '475569',       // Slate-600
      light: '94A3B8',        // Slate-400
      bg: 'F8FAFC',           // Slate-50
      white: 'FFFFFF'
    };
    
    pptContent.slides.forEach((slideData, index) => {
      const slide = pptx.addSlide();
      const type = slideData.slide_type || 'content';
      
      if (type === 'title') {
        // TITLE SLIDE - Gamma Style
        slide.background = { color: colors.white };
        
        // Top gradient bar
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: 0.3,
          fill: { type: 'solid', color: colors.primary }
        });
        
        // Large number badge
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 1, y: 1.5, w: 1.2, h: 1.2,
          fill: { color: colors.primary }
        });
        
        slide.addText('1', {
          x: 1, y: 1.5, w: 1.2, h: 1.2,
          fontSize: 48, bold: true, color: colors.white,
          align: 'center', valign: 'middle', fontFace: 'Segoe UI'
        });
        
        // Main title
        slide.addText(slideData.slide_title, {
          x: 2.5, y: 1.5, w: 7, h: 1.2,
          fontSize: 48, bold: true, color: colors.dark,
          valign: 'middle', fontFace: 'Segoe UI'
        });
        
        // Description box
        if (slideData.slide_content && slideData.slide_content[0]) {
          slide.addShape(pptx.ShapeType.rect, {
            x: 1, y: 3.2, w: 8.5, h: 2,
            fill: { color: colors.bg },
            line: { color: colors.light, width: 1 }
          });
          
          slide.addText(slideData.slide_content[0], {
            x: 1.3, y: 3.5, w: 8, h: 1.5,
            fontSize: 20, color: colors.medium,
            fontFace: 'Segoe UI'
          });
        }
        
        // Info badges at bottom
        if (slideData.slide_content && slideData.slide_content.length > 1) {
          const badges = slideData.slide_content.slice(1);
          badges.forEach((badge, i) => {
            slide.addShape(pptx.ShapeType.rect, {
              x: 1 + (i * 2.5), y: 5.7, w: 2.2, h: 0.5,
              fill: { color: colors.primary },
              line: { type: 'none' }
            });
            
            slide.addText(badge, {
              x: 1 + (i * 2.5), y: 5.7, w: 2.2, h: 0.5,
              fontSize: 14, color: colors.white, bold: true,
              align: 'center', valign: 'middle', fontFace: 'Segoe UI'
            });
          });
        }
        
      } else if (type === 'outline') {
        // OUTLINE SLIDE - Two Column Layout
        slide.background = { color: colors.white };
        
        // Header section
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: 1.3,
          fill: { color: colors.bg }
        });
        
        slide.addText(slideData.slide_title, {
          x: 0.5, y: 0.3, w: 9, h: 0.7,
          fontSize: 40, bold: true, color: colors.dark,
          fontFace: 'Segoe UI'
        });
        
        // Decorative line
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5, y: 1.1, w: 3, h: 0.08,
          fill: { color: colors.accent }
        });
        
        // Two-column content
        const items = slideData.slide_content || [];
        const mid = Math.ceil(items.length / 2);
        const leftItems = items.slice(0, mid);
        const rightItems = items.slice(mid);
        
        // Left column
        leftItems.forEach((item, i) => {
          // Number circle
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 0.7, y: 1.8 + (i * 0.6), w: 0.4, h: 0.4,
            fill: { color: colors.primary }
          });
          
          slide.addText(`${i + 1}`, {
            x: 0.7, y: 1.8 + (i * 0.6), w: 0.4, h: 0.4,
            fontSize: 16, bold: true, color: colors.white,
            align: 'center', valign: 'middle', fontFace: 'Segoe UI'
          });
          
          // Text
          slide.addText(item.replace(/^\d+\.\s*/, ''), {
            x: 1.3, y: 1.8 + (i * 0.6), w: 3.8, h: 0.5,
            fontSize: 16, color: colors.dark,
            valign: 'middle', fontFace: 'Segoe UI'
          });
        });
        
        // Right column
        rightItems.forEach((item, i) => {
          const num = mid + i + 1;
          slide.addShape(pptx.ShapeType.ellipse, {
            x: 5.5, y: 1.8 + (i * 0.6), w: 0.4, h: 0.4,
            fill: { color: colors.secondary }
          });
          
          slide.addText(`${num}`, {
            x: 5.5, y: 1.8 + (i * 0.6), w: 0.4, h: 0.4,
            fontSize: 16, bold: true, color: colors.white,
            align: 'center', valign: 'middle', fontFace: 'Segoe UI'
          });
          
          slide.addText(item.replace(/^\d+\.\s*/, ''), {
            x: 6.1, y: 1.8 + (i * 0.6), w: 3.8, h: 0.5,
            fontSize: 16, color: colors.dark,
            valign: 'middle', fontFace: 'Segoe UI'
          });
        });
        
      } else if (type === 'conclusion') {
        // CONCLUSION SLIDE
        slide.background = { color: colors.white };
        
        // Gradient background
        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: '100%',
          fill: { type: 'solid', color: colors.bg }
        });
        
        // Large icon/badge
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 4, y: 1, w: 2, h: 2,
          fill: { color: colors.accent }
        });
        
        slide.addText('✓', {
          x: 4, y: 1, w: 2, h: 2,
          fontSize: 72, bold: true, color: colors.white,
          align: 'center', valign: 'middle'
        });
        
        // Title
        slide.addText(slideData.slide_title, {
          x: 1, y: 3.3, w: 8, h: 0.7,
          fontSize: 40, bold: true, color: colors.dark,
          align: 'center', fontFace: 'Segoe UI'
        });
        
        // Content with checkmarks
        if (slideData.slide_content) {
          slideData.slide_content.forEach((point, i) => {
            slide.addText('✓', {
              x: 2, y: 4.3 + (i * 0.5), w: 0.4, h: 0.4,
              fontSize: 20, bold: true, color: colors.accent,
              align: 'center', valign: 'middle'
            });
            
            slide.addText(point, {
              x: 2.6, y: 4.3 + (i * 0.5), w: 5.5, h: 0.4,
              fontSize: 18, color: colors.dark,
              valign: 'middle', fontFace: 'Segoe UI'
            });
          });
        }
        
      } else {
        // CONTENT SLIDE - Professional Layout
        slide.background = { color: colors.white };
        
        // Slide number badge
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 0.5, y: 0.5, w: 0.6, h: 0.6,
          fill: { color: colors.primary }
        });
        
        slide.addText(`${index + 1}`, {
          x: 0.5, y: 0.5, w: 0.6, h: 0.6,
          fontSize: 20, bold: true, color: colors.white,
          align: 'center', valign: 'middle', fontFace: 'Segoe UI'
        });
        
        // Title
        slide.addText(slideData.slide_title, {
          x: 1.3, y: 0.5, w: 8.2, h: 0.6,
          fontSize: 32, bold: true, color: colors.dark,
          valign: 'middle', fontFace: 'Segoe UI'
        });
        
        // Accent line
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5, y: 1.3, w: 2.5, h: 0.06,
          fill: { color: colors.accent }
        });
        
        // Content with modern bullets
        if (slideData.slide_content) {
          slideData.slide_content.forEach((point, i) => {
            // Modern square bullet
            slide.addShape(pptx.ShapeType.rect, {
              x: 0.7, y: 2 + (i * 0.8), w: 0.15, h: 0.15,
              fill: { color: colors.accent }
            });
            
            // Text with proper spacing
            slide.addText(point, {
              x: 1.1, y: 1.9 + (i * 0.8), w: 8.4, h: 0.7,
              fontSize: 18, color: colors.dark,
              valign: 'top', fontFace: 'Segoe UI',
              lineSpacing: 28
            });
          });
        }
      }
      
      // Footer (except title slide)
      if (type !== 'title') {
        slide.addText(`${courseData.title}`, {
          x: 0.5, y: 6.8, w: 7, h: 0.3,
          fontSize: 10, color: colors.light,
          italic: true, fontFace: 'Segoe UI'
        });
        
        slide.addText(`${index + 1}`, {
          x: 9, y: 6.8, w: 0.5, h: 0.3,
          fontSize: 10, color: colors.light,
          align: 'right', fontFace: 'Segoe UI'
        });
      }
    });
    
    const fileName = `${courseData.title.replace(/[^a-z0-9]/gi, '_')}_Professional.pptx`;
    const blob = await pptx.write({ outputType: 'blob' });
    
    return {
      success: true,
      fileName,
      blob,
      message: 'Professional PPT generated!'
    };
  } catch (error) {
    console.error('PPT generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate PPT'
    };
  }
};

export default generateProfessionalPPT;
