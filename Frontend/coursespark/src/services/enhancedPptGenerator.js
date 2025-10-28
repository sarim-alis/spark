            0// Enhanced PPT Generation Service - Gamma.app style
import pptxgen from 'pptxgenjs';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate enhanced PPT content using OpenAI with specific page count
 */
const generateEnhancedPPTContent = async (courseData, targetPages) => {
  try {
    const lessonCount = courseData.lessons?.length || 0;
    
    const prompt = `You are an expert presentation designer creating a ${targetPages}-slide PowerPoint presentation.

Course Information:
- Title: ${courseData.title}
- Description: ${courseData.description}
- Level: ${courseData.level}
- Category: ${courseData.category}
- Number of Lessons: ${lessonCount}

Create EXACTLY ${targetPages} slides following this structure:

1. Slide 1: Title slide with course name and tagline
2. Slide 2: Course outline listing all ${lessonCount} lessons
3. Slides 3-${targetPages-1}: Detailed content slides covering lessons and key concepts
4. Slide ${targetPages}: Conclusion and next steps

For each slide, provide:
- slide_title: Clear, engaging title
- slide_content: Array of 3-5 concise bullet points
- slide_type: "title", "outline", "content", or "conclusion"
- slide_notes: Brief speaker notes

Make the content engaging, professional, and well-distributed across all ${targetPages} slides.

Return ONLY a JSON object:
{
  "slides": [
    {
      "slide_title": "Title",
      "slide_content": ["Point 1", "Point 2", "Point 3"],
      "slide_type": "title",
      "slide_notes": "Notes"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert presentation designer. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      console.error('OpenAI API Error:', response.status);
      return null;
    }

    const data = await response.json();
    let jsonText = data.choices[0].message.content.trim();
    
    // Clean up markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating PPT content with AI:', error);
    return null;
  }
};

/**
 * Generate fallback PPT content without AI
 */
const generateFallbackPPTContent = (courseData, targetPages) => {
  const slides = [];
  const lessons = courseData.lessons || [];
  
  // Slide 1: Title
  slides.push({
    slide_title: courseData.title,
    slide_content: [
      courseData.description,
      `Level: ${courseData.level}`,
      `Category: ${courseData.category}`,
      `${lessons.length} Comprehensive Lessons`
    ],
    slide_type: 'title',
    slide_notes: 'Course introduction'
  });
  
  // Slide 2: Outline
  slides.push({
    slide_title: 'Course Outline',
    slide_content: lessons.map((lesson, idx) => `${idx + 1}. ${lesson.title}`).slice(0, 8),
    slide_type: 'outline',
    slide_notes: 'Complete course structure'
  });
  
  // Content slides - distribute lessons across remaining pages
  const contentSlides = targetPages - 3; // Minus title, outline, and conclusion
  const lessonsPerSlide = Math.ceil(lessons.length / contentSlides);
  
  for (let i = 0; i < contentSlides && i < lessons.length; i++) {
    const lesson = lessons[i];
    
    // Extract bullet points from lesson content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = lesson.content || '';
    const listItems = tempDiv.querySelectorAll('li');
    const bulletPoints = Array.from(listItems)
      .map(li => li.textContent.trim())
      .slice(0, 5);
    
    // If no bullet points, extract from paragraphs
    if (bulletPoints.length === 0) {
      const paragraphs = tempDiv.querySelectorAll('p');
      bulletPoints.push(...Array.from(paragraphs)
        .map(p => p.textContent.trim())
        .filter(text => text.length > 20 && text.length < 150)
        .slice(0, 4));
    }
    
    slides.push({
      slide_title: `${i + 1}. ${lesson.title}`,
      slide_content: bulletPoints.length > 0 ? bulletPoints : [
        'Key concepts and fundamentals',
        'Practical examples and applications',
        'Hands-on exercises',
        'Learning outcomes'
      ],
      slide_type: 'content',
      slide_notes: `Duration: ${lesson.duration_minutes || 30} minutes`
    });
  }
  
  // Fill remaining slides if needed
  while (slides.length < targetPages - 1) {
    const remainingLessons = lessons.slice(slides.length - 2);
    if (remainingLessons.length > 0) {
      const lesson = remainingLessons[0];
      slides.push({
        slide_title: `More on: ${lesson.title}`,
        slide_content: [
          'Advanced concepts',
          'Real-world applications',
          'Best practices',
          'Common pitfalls to avoid'
        ],
        slide_type: 'content',
        slide_notes: 'Additional insights'
      });
    } else {
      break;
    }
  }
  
  // Conclusion slide
  slides.push({
    slide_title: 'What\'s Next?',
    slide_content: [
      'Complete all lessons at your own pace',
      'Practice with real-world projects',
      'Join our community for support',
      'Earn your certificate of completion',
      'Continue your learning journey'
    ],
    slide_type: 'conclusion',
    slide_notes: 'Course wrap-up and next steps'
  });
  
  return { slides: slides.slice(0, targetPages) };
};

/**
 * Create Gamma-style PPT file
 */
export const generateGammaStylePPT = async (courseData, targetPages = 10, useAI = true) => {
  try {
    let pptContent;
    
    // Try AI generation first
    if (useAI && OPENAI_API_KEY) {
      console.log('🤖 Generating Gamma-style PPT with OpenAI...');
      pptContent = await generateEnhancedPPTContent(courseData, targetPages);
    }
    
    // Fallback to manual generation
    if (!pptContent) {
      console.log('📝 Using fallback PPT generation...');
      pptContent = generateFallbackPPTContent(courseData, targetPages);
    }
    
    // Create presentation
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.author = 'CourseSpark AI';
    pptx.company = 'CourseSpark';
    pptx.title = courseData.title;
    pptx.subject = courseData.category;
    pptx.layout = 'LAYOUT_WIDE'; // 16:9 aspect ratio like Gamma
    
    // Modern color scheme (Gamma-inspired)
    const colors = {
      primary: '4F46E5',      // Indigo
      secondary: '7C3AED',    // Purple
      accent: '06B6D4',       // Cyan
      text: '1E293B',         // Slate-900
      textLight: '64748B',    // Slate-500
      background: 'FFFFFF',
      bgLight: 'F8FAFC'       // Slate-50
    };
    
    // Create slides
    pptContent.slides.forEach((slideData, index) => {
      const slide = pptx.addSlide();
      const slideType = slideData.slide_type || 'content';
      
      if (slideType === 'title') {
        // Title Slide - Gamma style
        slide.background = { color: colors.background };
        
        // Large gradient background shape
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: '100%',
          h: '40%',
          fill: { 
            type: 'solid',
            color: colors.primary,
            transparency: 5
          }
        });
        
        // Main title
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 2.5,
          w: 9,
          h: 1.5,
          fontSize: 54,
          bold: true,
          color: colors.text,
          align: 'center',
          valign: 'middle',
          fontFace: 'Arial'
        });
        
        // Subtitle/description
        if (slideData.slide_content && slideData.slide_content.length > 0) {
          slide.addText(slideData.slide_content[0], {
            x: 1,
            y: 4.2,
            w: 8,
            h: 0.8,
            fontSize: 20,
            color: colors.textLight,
            align: 'center',
            fontFace: 'Arial'
          });
          
          // Additional info
          const additionalInfo = slideData.slide_content.slice(1).join(' • ');
          if (additionalInfo) {
            slide.addText(additionalInfo, {
              x: 1,
              y: 5.2,
              w: 8,
              h: 0.5,
              fontSize: 16,
              color: colors.textLight,
              align: 'center',
              fontFace: 'Arial'
            });
          }
        }
        
        // Decorative accent
        slide.addShape(pptx.ShapeType.rect, {
          x: 4.5,
          y: 5.8,
          w: 1,
          h: 0.08,
          fill: { color: colors.accent }
        });
        
      } else if (slideType === 'outline') {
        // Outline Slide
        slide.background = { color: colors.bgLight };
        
        // Header with gradient
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: '100%',
          h: 1.2,
          fill: { color: colors.primary }
        });
        
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.6,
          fontSize: 36,
          bold: true,
          color: 'FFFFFF',
          fontFace: 'Arial'
        });
        
        // Outline items in two columns
        const items = slideData.slide_content || [];
        const midPoint = Math.ceil(items.length / 2);
        const leftItems = items.slice(0, midPoint);
        const rightItems = items.slice(midPoint);
        
        // Left column
        leftItems.forEach((item, idx) => {
          slide.addText(`${idx + 1}`, {
            x: 0.5,
            y: 1.8 + (idx * 0.5),
            w: 0.5,
            h: 0.4,
            fontSize: 18,
            bold: true,
            color: colors.primary,
            align: 'center',
            valign: 'middle'
          });
          
          slide.addText(item.replace(/^\d+\.\s*/, ''), {
            x: 1.1,
            y: 1.8 + (idx * 0.5),
            w: 3.8,
            h: 0.4,
            fontSize: 16,
            color: colors.text,
            valign: 'middle',
            fontFace: 'Arial'
          });
        });
        
        // Right column
        rightItems.forEach((item, idx) => {
          const num = midPoint + idx + 1;
          slide.addText(`${num}`, {
            x: 5.2,
            y: 1.8 + (idx * 0.5),
            w: 0.5,
            h: 0.4,
            fontSize: 18,
            bold: true,
            color: colors.primary,
            align: 'center',
            valign: 'middle'
          });
          
          slide.addText(item.replace(/^\d+\.\s*/, ''), {
            x: 5.8,
            y: 1.8 + (idx * 0.5),
            w: 3.8,
            h: 0.4,
            fontSize: 16,
            color: colors.text,
            valign: 'middle',
            fontFace: 'Arial'
          });
        });
        
      } else if (slideType === 'conclusion') {
        // Conclusion Slide
        slide.background = { color: colors.background };
        
        // Gradient background
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          fill: {
            type: 'solid',
            color: colors.primary,
            transparency: 95
          }
        });
        
        // Title
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 1,
          w: 9,
          h: 0.8,
          fontSize: 44,
          bold: true,
          color: colors.primary,
          align: 'center',
          fontFace: 'Arial'
        });
        
        // Content with icons
        if (slideData.slide_content && slideData.slide_content.length > 0) {
          slideData.slide_content.forEach((point, idx) => {
            // Bullet circle
            slide.addShape(pptx.ShapeType.ellipse, {
              x: 2,
              y: 2.5 + (idx * 0.7),
              w: 0.3,
              h: 0.3,
              fill: { color: colors.accent }
            });
            
            slide.addText(point, {
              x: 2.5,
              y: 2.5 + (idx * 0.7),
              w: 6,
              h: 0.5,
              fontSize: 20,
              color: colors.text,
              valign: 'middle',
              fontFace: 'Arial'
            });
          });
        }
        
      } else {
        // Content Slide - Default
        slide.background = { color: colors.background };
        
        // Side accent bar
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 0.15,
          h: '100%',
          fill: { color: colors.primary }
        });
        
        // Title
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 0.7,
          fontSize: 32,
          bold: true,
          color: colors.text,
          fontFace: 'Arial'
        });
        
        // Underline
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.5,
          y: 1.3,
          w: 2,
          h: 0.05,
          fill: { color: colors.accent }
        });
        
        // Content bullets
        if (slideData.slide_content && slideData.slide_content.length > 0) {
          slideData.slide_content.forEach((point, idx) => {
            // Modern bullet
            slide.addShape(pptx.ShapeType.rect, {
              x: 0.8,
              y: 2.2 + (idx * 0.8),
              w: 0.15,
              h: 0.15,
              fill: { color: colors.accent }
            });
            
            slide.addText(point, {
              x: 1.2,
              y: 2.1 + (idx * 0.8),
              w: 8.3,
              h: 0.6,
              fontSize: 18,
              color: colors.text,
              valign: 'top',
              fontFace: 'Arial',
              lineSpacing: 24
            });
          });
        }
      }
      
      // Footer on all slides except title
      if (slideType !== 'title') {
        slide.addText(`${courseData.title} | Slide ${index + 1}`, {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 10,
          color: colors.textLight,
          align: 'center',
          italic: true,
          fontFace: 'Arial'
        });
      }
      
      // Add speaker notes
      if (slideData.slide_notes) {
        slide.addNotes(slideData.slide_notes);
      }
    });
    
    // Generate the file as blob
    const fileName = `${courseData.title.replace(/[^a-z0-9]/gi, '_')}_Course.pptx`;
    const blob = await pptx.write({ outputType: 'blob' });
    
    return {
      success: true,
      fileName,
      blob,
      message: 'Gamma-style PPT generated successfully!'
    };
  } catch (error) {
    console.error('Error generating PPT:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate PPT'
    };
  }
};

export default generateGammaStylePPT;
