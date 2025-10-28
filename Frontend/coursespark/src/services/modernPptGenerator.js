// Modern PPT Generator with Images and Card Layouts
import pptxgen from 'pptxgenjs';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Fetch image and convert to base64 (bypasses CORS)
 */
const fetchImageAsBase64 = async (keyword) => {
  try {
    // Use Picsum Photos (free, no API key, CORS-friendly)
    const imageUrl = `https://picsum.photos/800/600?random=${Math.random()}`;
    
    // Fetch through CORS proxy
    const proxyUrl = 'https://corsproxy.io/?';
    const response = await fetch(proxyUrl + encodeURIComponent(imageUrl));
    
    if (!response.ok) throw new Error('Image fetch failed');
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Image fetch error:', error);
    return null;
  }
};

/**
 * Generate content with AI
 */
const generateModernContent = async (courseData, targetPages) => {
  try {
    const prompt = `Create a ${targetPages}-slide professional presentation for:

Course: ${courseData.title}
Description: ${courseData.description}
Lessons: ${courseData.lessons?.map((l, i) => `${i + 1}. ${l.title}`).join('\n')}

Create slides with this structure:
- Slide 1: Title slide with course name and tagline
- Slide 2: Overview with 3 key benefits/features in cards
- Slides 3+: Content slides with heading, subheading, and 3-4 bullet points

For each slide return:
{
  "title": "Main heading",
  "subheading": "Secondary heading or description",
  "points": ["Point 1", "Point 2", "Point 3"],
  "type": "title|cards|content",
  "imageKeyword": "relevant search term for image"
}

Return JSON only: {"slides": [...]}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a presentation designer. Return only valid JSON.' },
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
    console.error('AI error:', error);
    return null;
  }
};

/**
 * Fallback content generator
 */
const generateModernFallback = (courseData, targetPages) => {
  const slides = [];
  const lessons = courseData.lessons || [];
  
  // Slide 1: Title
  slides.push({
    title: courseData.title,
    subheading: courseData.description,
    type: 'title',
    imageKeyword: courseData.category || 'education'
  });
  
  // Slide 2: Overview with 3 cards
  slides.push({
    title: 'What You\'ll Learn',
    subheading: `${lessons.length} comprehensive lessons`,
    points: [
      lessons[0]?.title || 'Core fundamentals',
      lessons[1]?.title || 'Practical applications',
      lessons[2]?.title || 'Advanced techniques'
    ],
    type: 'cards',
    imageKeyword: 'learning'
  });
  
  // Content slides
  const contentCount = Math.min(targetPages - 3, lessons.length);
  for (let i = 0; i < contentCount; i++) {
    const lesson = lessons[i];
    const div = document.createElement('div');
    div.innerHTML = lesson.content || '';
    const bullets = Array.from(div.querySelectorAll('li'))
      .map(li => li.textContent.trim())
      .slice(0, 4);
    
    slides.push({
      title: lesson.title,
      subheading: `Lesson ${i + 1} of ${lessons.length}`,
      points: bullets.length > 0 ? bullets : [
        'Master key concepts',
        'Practice with examples',
        'Build real projects',
        'Apply your knowledge'
      ],
      type: 'content',
      imageKeyword: lesson.title.split(' ').slice(0, 2).join(' ')
    });
  }
  
  // Conclusion
  slides.push({
    title: 'Ready to Start?',
    subheading: 'Begin your learning journey today',
    points: [
      'Access all lessons',
      'Learn at your pace',
      'Earn certificate'
    ],
    type: 'cards',
    imageKeyword: 'success'
  });
  
  return { slides: slides.slice(0, targetPages) };
};

/**
 * Create modern PPT with images and cards
 */
export const generateGammaProPPT = async (courseData, targetPages = 10, useAI = true) => {
  try {
    let content;
    
    if (useAI && OPENAI_API_KEY) {
      content = await generateModernContent(courseData, targetPages);
    }
    
    if (!content) {
      content = generateModernFallback(courseData, targetPages);
    }
    
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'CourseSpark';
    pptx.title = courseData.title;
    
    // Color scheme
    const colors = {
      primary: '6366F1',
      secondary: '8B5CF6',
      accent: '10B981',
      dark: '1E293B',
      gray: '64748B',
      lightGray: 'E2E8F0',
      bg: 'F8FAFC',
      white: 'FFFFFF'
    };
    
    // Process slides sequentially with async/await
    for (let idx = 0; idx < content.slides.length; idx++) {
      const slide = content.slides[idx];
      const s = pptx.addSlide();
      const type = slide.type || 'content';
      
      if (type === 'title') {
        // TITLE SLIDE - 75/25 split (text left, image right)
        s.background = { color: colors.white };
        
        // Left side - Content (~75%)
        const leftWidth = 7.0;
        
        s.addText(slide.title, {
          x: 0.8, y: 2.0, w: leftWidth, h: 1.8,
          fontSize: 54, bold: true, color: colors.dark,
          fontFace: 'Arial', breakLine: true, lineSpacing: 40
        });
        
        if (slide.subheading) {
          s.addText(slide.subheading, {
            x: 0.8, y: 4.1, w: leftWidth, h: 1.2,
            fontSize: 18, color: colors.gray,
            fontFace: 'Arial', lineSpacing: 28
          });
        }
        
        // Decorative accent line
        s.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 5.6, w: 2, h: 0.1,
          fill: { color: colors.primary }
        });
        
        // Right side - Image (~25%)
        const titleImageData = await fetchImageAsBase64(slide.imageKeyword || courseData.category);
        if (titleImageData) {
          s.addImage({
            data: titleImageData,
            x: 7.5, y: 0.5, w: 2.5, h: 7,
            sizing: { type: 'cover' }
          });
        } else {
          // Fallback with gradient
          s.addShape(pptx.ShapeType.rect, {
            x: 7.5, y: 0.5, w: 2.5, h: 7,
            fill: { color: colors.primary, transparency: 15 }
          });
          s.addText('📚', {
            x: 7.5, y: 3, w: 2.5, h: 1.5,
            fontSize: 100, align: 'center', valign: 'middle'
          });
        }
        
      } else if (type === 'cards') {
        // CARDS SLIDE - 3 grey cards layout
        s.background = { color: colors.bg };
        
        // Main heading
        s.addText(slide.title, {
          x: 0.7, y: 0.7, w: 8.6, h: 0.8,
          fontSize: 40, bold: true, color: colors.dark,
          fontFace: 'Arial'
        });
        
        // Subheading
        if (slide.subheading) {
          s.addText(slide.subheading, {
            x: 0.7, y: 1.6, w: 8.6, h: 0.4,
            fontSize: 18, color: colors.gray,
            fontFace: 'Arial'
          });
        }
        
        // 3 Cards in a row
        const points = slide.points || [];
        const cardWidth = 2.7;
        const cardHeight = 3.5;
        const gap = 0.3;
        const startX = 0.7;
        const startY = 2.5;
        
        points.slice(0, 3).forEach((point, i) => {
          const x = startX + (i * (cardWidth + gap));
          
          // Card background
          s.addShape(pptx.ShapeType.rect, {
            x, y: startY, w: cardWidth, h: cardHeight,
            fill: { color: colors.white },
            line: { color: colors.lightGray, width: 1 }
          });
          
          // Number badge
          s.addShape(pptx.ShapeType.ellipse, {
            x: x + 0.3, y: startY + 0.3, w: 0.5, h: 0.5,
            fill: { color: colors.primary }
          });
          
          s.addText(`${i + 1}`, {
            x: x + 0.3, y: startY + 0.3, w: 0.5, h: 0.5,
            fontSize: 20, bold: true, color: colors.white,
            align: 'center', valign: 'middle', fontFace: 'Arial'
          });
          
          // Card title/content
          s.addText(point, {
            x: x + 0.2, y: startY + 1, w: cardWidth - 0.4, h: 2.3,
            fontSize: 16, color: colors.dark,
            fontFace: 'Arial', valign: 'top',
            breakLine: true, lineSpacing: 28
          });
        });
        
      } else {
        // CONTENT SLIDE - 75/25 split (text left, image right)
        s.background = { color: colors.white };
        
        // Right - Image (~25%)
        const contentImageData = await fetchImageAsBase64(slide.imageKeyword || slide.title);
        if (contentImageData) {
          s.addImage({
            data: contentImageData,
            x: 7.5, y: 0.3, w: 2.5, h: 6.8,
            sizing: { type: 'cover' }
          });
        } else {
          // Fallback gradient panel
          s.addShape(pptx.ShapeType.rect, {
            x: 7.5, y: 0.3, w: 2.5, h: 6.8,
            fill: { color: colors.primary, transparency: 15 }
          });
        }
        
        // Left - Text content (~75%)
        s.addText(slide.title, {
          x: 0.8, y: 0.8, w: 6.4, h: 1.2,
          fontSize: 40, bold: true, color: colors.dark,
          fontFace: 'Arial', lineSpacing: 38
        });
        
        if (slide.subheading) {
          s.addText(slide.subheading, {
            x: 0.8, y: 2.2, w: 6.4, h: 0.6,
            fontSize: 18, color: colors.gray,
            fontFace: 'Arial', italic: true
          });
        }
        
        // Decorative accent line under subheading
        s.addShape(pptx.ShapeType.rect, {
          x: 0.8, y: 3.1, w: 2, h: 0.08,
          fill: { color: colors.accent }
        });
        
        // Bullet points (single column)
        const points = slide.points || [];
        const startY = 3.6;
        const lineGap = 0.8;
        points.forEach((point, i) => {
          const yPos = startY + (i * lineGap);
          // Bullet dot
          s.addShape(pptx.ShapeType.ellipse, {
            x: 0.9, y: yPos, w: 0.22, h: 0.22,
            fill: { color: colors.primary }
          });
          // Bullet text
          s.addText(point, {
            x: 1.3, y: yPos - 0.05, w: 5.9, h: 0.7,
            fontSize: 16, color: colors.dark,
            fontFace: 'Arial', valign: 'top',
            lineSpacing: 24, breakLine: true
          });
        });
      }
      
      // Footer (not on first slide)
      if (idx > 0) {
        s.addText(`${courseData.title}`, {
          x: 0.5, y: 7.1, w: 7, h: 0.3,
          fontSize: 10, color: colors.gray,
          fontFace: 'Arial'
        });
        
        s.addText(`${idx + 1}`, {
          x: 9, y: 7.1, w: 0.5, h: 0.3,
          fontSize: 10, color: colors.gray,
          align: 'right', fontFace: 'Arial'
        });
      }
    }
    
    const fileName = `${courseData.title.replace(/[^a-z0-9]/gi, '_')}_Modern.pptx`;
    const blob = await pptx.write({ outputType: 'blob' });
    
    return {
      success: true,
      fileName,
      blob,
      message: 'Modern PPT with images created!'
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
