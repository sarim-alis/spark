// Gamma Pro-Level PPT Generator
import pptxgen from 'pptxgenjs';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate Gamma-quality content with AI
 */
const generateGammaContent = async (courseData, targetPages) => {
  try {
    const prompt = `Create a ${targetPages}-slide presentation like Gamma.app for:

Course: ${courseData.title}
Description: ${courseData.description}
Level: ${courseData.level}
Lessons: ${courseData.lessons?.map(l => l.title).join(', ')}

Create slides with:
1. Title slide - engaging headline + subtitle
2. Overview/Outline - what students will learn
3-${targetPages-1}. Content slides - each with:
   - Clear heading
   - 2-4 concise points (not full sentences)
   - Key takeaways
${targetPages}. Conclusion - next steps

Make content:
- Conversational and engaging
- Short bullet points (5-10 words max)
- Action-oriented
- Student-focused

Return JSON:
{
  "slides": [
    {
      "title": "Main heading",
      "subtitle": "Supporting text (optional)",
      "points": ["Short point 1", "Short point 2"],
      "type": "title|content|outline|conclusion",
      "highlight": "Key takeaway (optional)"
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
          { role: 'system', content: 'You are a Gamma.app presentation designer. Create engaging, visual presentations. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 3500
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    let jsonText = data.choices[0].message.content.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI error:', error);
    return null;
  }
};

/**
 * Fallback content generator
 */
const generateFallbackGammaContent = (courseData, targetPages) => {
  const slides = [];
  const lessons = courseData.lessons || [];
  
  // Title
  slides.push({
    title: courseData.title,
    subtitle: courseData.description,
    points: [`${courseData.level} Level`, `${lessons.length} Lessons`, 'Learn at your own pace'],
    type: 'title'
  });
  
  // Overview
  slides.push({
    title: 'What You\'ll Master',
    points: lessons.slice(0, 6).map(l => l.title),
    type: 'outline',
    highlight: `Complete ${lessons.length}-lesson curriculum`
  });
  
  // Content slides
  const contentCount = targetPages - 3;
  for (let i = 0; i < Math.min(contentCount, lessons.length); i++) {
    const lesson = lessons[i];
    const div = document.createElement('div');
    div.innerHTML = lesson.content || '';
    const bullets = Array.from(div.querySelectorAll('li'))
      .map(li => li.textContent.trim().substring(0, 60))
      .slice(0, 4);
    
    slides.push({
      title: lesson.title,
      points: bullets.length > 0 ? bullets : [
        'Master core concepts',
        'Practice with real examples',
        'Build practical skills',
        'Apply what you learn'
      ],
      type: 'content',
      highlight: `Lesson ${i + 1} of ${lessons.length}`
    });
  }
  
  // Conclusion
  slides.push({
    title: 'Ready to Start Learning?',
    points: [
      'Access all lessons instantly',
      'Learn at your own pace',
      'Get hands-on practice',
      'Earn your certificate'
    ],
    type: 'conclusion',
    highlight: 'Start your journey today!'
  });
  
  return { slides: slides.slice(0, targetPages) };
};

/**
 * Create Gamma-quality PPT
 */
export const generateGammaProPPT = async (courseData, targetPages = 10, useAI = true) => {
  try {
    let content;
    
    if (useAI && OPENAI_API_KEY) {
      content = await generateGammaContent(courseData, targetPages);
    }
    
    if (!content) {
      content = generateFallbackGammaContent(courseData, targetPages);
    }
    
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'CourseSpark';
    pptx.title = courseData.title;
    
    // Gamma color palette
    const theme = {
      primary: '5B21B6',     // Purple-800
      secondary: '7C3AED',   // Violet-600
      accent: '10B981',      // Emerald-500
      blue: '3B82F6',        // Blue-500
      dark: '111827',        // Gray-900
      text: '374151',        // Gray-700
      light: '6B7280',       // Gray-500
      bg: 'F9FAFB',          // Gray-50
      white: 'FFFFFF'
    };
    
    content.slides.forEach((slide, idx) => {
      const pptSlide = pptx.addSlide();
      const type = slide.type || 'content';
      
      if (type === 'title') {
        // TITLE SLIDE - Gamma Hero Style
        pptSlide.background = { color: theme.white };
        
        // Large colored background shape (left side)
        pptSlide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: 5, h: 7.5,
          fill: { color: theme.primary }
        });
        
        // White content area
        pptSlide.addShape(pptx.ShapeType.rect, {
          x: 5, y: 0, w: 5, h: 7.5,
          fill: { color: theme.white }
        });
        
        // Main title on colored background
        pptSlide.addText(slide.title, {
          x: 0.5, y: 2.5, w: 4, h: 2,
          fontSize: 44, bold: true, color: theme.white,
          fontFace: 'Calibri', breakLine: true,
          valign: 'middle'
        });
        
        // Subtitle on white side
        if (slide.subtitle) {
          pptSlide.addText(slide.subtitle, {
            x: 5.5, y: 2, w: 4, h: 1.5,
            fontSize: 20, color: theme.text,
            fontFace: 'Calibri', lineSpacing: 32
          });
        }
        
        // Info badges on white side
        if (slide.points) {
          slide.points.forEach((point, i) => {
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: 5.5, y: 4 + (i * 0.5), w: 0.08, h: 0.08,
              fill: { color: theme.accent }
            });
            
            pptSlide.addText(point, {
              x: 5.8, y: 3.95 + (i * 0.5), w: 3.5, h: 0.3,
              fontSize: 14, color: theme.text,
              fontFace: 'Calibri'
            });
          });
        }
        
      } else if (type === 'outline') {
        // OUTLINE SLIDE - Gamma Grid Style
        pptSlide.background = { color: theme.bg };
        
        // Title section
        pptSlide.addText(slide.title, {
          x: 0.7, y: 0.7, w: 8.6, h: 0.8,
          fontSize: 40, bold: true, color: theme.dark,
          fontFace: 'Calibri'
        });
        
        // Highlight text
        if (slide.highlight) {
          pptSlide.addText(slide.highlight, {
            x: 0.7, y: 1.6, w: 8.6, h: 0.4,
            fontSize: 16, color: theme.light,
            fontFace: 'Calibri', italic: true
          });
        }
        
        // Grid of cards (2 columns)
        const points = slide.points || [];
        const cols = 2;
        const cardWidth = 4;
        const cardHeight = 1;
        const gap = 0.3;
        
        points.forEach((point, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = 0.7 + (col * (cardWidth + gap));
          const y = 2.5 + (row * (cardHeight + gap));
          
          // Card background
          pptSlide.addShape(pptx.ShapeType.rect, {
            x, y, w: cardWidth, h: cardHeight,
            fill: { color: theme.white },
            line: { color: 'E5E7EB', width: 1 }
          });
          
          // Number badge
          pptSlide.addShape(pptx.ShapeType.rect, {
            x: x + 0.2, y: y + 0.15, w: 0.35, h: 0.35,
            fill: { color: theme.primary }
          });
          
          pptSlide.addText(`${i + 1}`, {
            x: x + 0.2, y: y + 0.15, w: 0.35, h: 0.35,
            fontSize: 16, bold: true, color: theme.white,
            align: 'center', valign: 'middle', fontFace: 'Calibri'
          });
          
          // Text
          pptSlide.addText(point.replace(/^\d+\.\s*/, ''), {
            x: x + 0.7, y: y + 0.15, w: cardWidth - 0.9, h: 0.7,
            fontSize: 15, color: theme.dark,
            fontFace: 'Calibri', valign: 'middle'
          });
        });
        
      } else if (type === 'conclusion') {
        // CONCLUSION SLIDE - Gamma CTA Style
        pptSlide.background = { color: theme.primary };
        
        // Large icon area
        pptSlide.addShape(pptx.ShapeType.ellipse, {
          x: 3.5, y: 1.5, w: 3, h: 3,
          fill: { color: theme.white, transparency: 10 }
        });
        
        pptSlide.addText('🎓', {
          x: 3.5, y: 1.5, w: 3, h: 3,
          fontSize: 80, align: 'center', valign: 'middle'
        });
        
        // Title
        pptSlide.addText(slide.title, {
          x: 1, y: 4.8, w: 8, h: 0.7,
          fontSize: 36, bold: true, color: theme.white,
          align: 'center', fontFace: 'Calibri'
        });
        
        // Points
        if (slide.points) {
          slide.points.forEach((point, i) => {
            pptSlide.addText('→', {
              x: 2.5, y: 5.7 + (i * 0.35), w: 0.3, h: 0.3,
              fontSize: 18, color: theme.accent,
              bold: true, align: 'center'
            });
            
            pptSlide.addText(point, {
              x: 3, y: 5.7 + (i * 0.35), w: 4.5, h: 0.3,
              fontSize: 16, color: theme.white,
              fontFace: 'Calibri'
            });
          });
        }
        
      } else {
        // CONTENT SLIDE - Gamma Modern Style
        pptSlide.background = { color: theme.white };
        
        // Colored accent bar (left side)
        pptSlide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: 0.15, h: 7.5,
          fill: { color: theme.primary }
        });
        
        // Title with underline
        pptSlide.addText(slide.title, {
          x: 0.7, y: 0.7, w: 8.6, h: 0.9,
          fontSize: 36, bold: true, color: theme.dark,
          fontFace: 'Calibri'
        });
        
        // Decorative line
        pptSlide.addShape(pptx.ShapeType.rect, {
          x: 0.7, y: 1.7, w: 2, h: 0.05,
          fill: { color: theme.accent }
        });
        
        // Content cards
        if (slide.points) {
          slide.points.forEach((point, i) => {
            const y = 2.3 + (i * 1.1);
            
            // Card background
            pptSlide.addShape(pptx.ShapeType.rect, {
              x: 0.7, y, w: 8.6, h: 0.9,
              fill: { color: theme.bg },
              line: { type: 'none' }
            });
            
            // Icon/bullet
            pptSlide.addShape(pptx.ShapeType.ellipse, {
              x: 1, y: y + 0.25, w: 0.4, h: 0.4,
              fill: { color: theme.blue }
            });
            
            pptSlide.addText('✓', {
              x: 1, y: y + 0.25, w: 0.4, h: 0.4,
              fontSize: 16, bold: true, color: theme.white,
              align: 'center', valign: 'middle'
            });
            
            // Text
            pptSlide.addText(point, {
              x: 1.6, y: y + 0.15, w: 7.5, h: 0.7,
              fontSize: 18, color: theme.dark,
              fontFace: 'Calibri', valign: 'middle'
            });
          });
        }
        
        // Highlight box at bottom
        if (slide.highlight) {
          pptSlide.addShape(pptx.ShapeType.rect, {
            x: 0.7, y: 6.3, w: 8.6, h: 0.7,
            fill: { color: theme.primary, transparency: 90 },
            line: { color: theme.primary, width: 1 }
          });
          
          pptSlide.addText(`💡 ${slide.highlight}`, {
            x: 1, y: 6.4, w: 8, h: 0.5,
            fontSize: 14, color: theme.primary,
            fontFace: 'Calibri', italic: true, valign: 'middle'
          });
        }
      }
      
      // Footer (not on title slide)
      if (type !== 'title') {
        pptSlide.addText(courseData.title, {
          x: 0.5, y: 7.1, w: 8, h: 0.3,
          fontSize: 9, color: theme.light,
          fontFace: 'Calibri'
        });
        
        pptSlide.addText(`${idx + 1} / ${content.slides.length}`, {
          x: 8.8, y: 7.1, w: 0.7, h: 0.3,
          fontSize: 9, color: theme.light,
          align: 'right', fontFace: 'Calibri'
        });
      }
    });
    
    const fileName = `${courseData.title.replace(/[^a-z0-9]/gi, '_')}_Gamma.pptx`;
    const blob = await pptx.write({ outputType: 'blob' });
    
    return {
      success: true,
      fileName,
      blob,
      message: 'Gamma-quality PPT created!'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default generateGammaProPPT;
