// PPT Generation Service using OpenAI and pptxgenjs
import pptxgen from 'pptxgenjs';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate PPT content structure using OpenAI
 */
const generatePPTContentWithAI = async (courseData) => {
  try {
    const prompt = `You are an expert presentation designer. Create a comprehensive PowerPoint presentation structure for the following course:

Title: ${courseData.title}
Description: ${courseData.description}
Level: ${courseData.level}
Category: ${courseData.category}
Number of Lessons: ${courseData.lessons?.length || 0}

Generate a presentation structure with:
1. A title slide
2. An overview slide
3. One slide for each lesson with key points
4. A conclusion slide

For each slide, provide:
- slide_title: The title of the slide
- slide_content: An array of bullet points (3-5 points per slide)
- slide_notes: Speaker notes (optional)

Return ONLY a JSON object in this format:
{
  "slides": [
    {
      "slide_title": "Title",
      "slide_content": ["Point 1", "Point 2"],
      "slide_notes": "Additional notes"
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
        max_tokens: 2000
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
const generateFallbackPPTContent = (courseData) => {
  const slides = [];
  
  // Title slide
  slides.push({
    slide_title: courseData.title,
    slide_content: [
      courseData.description,
      `Level: ${courseData.level}`,
      `Category: ${courseData.category}`
    ],
    slide_notes: 'Course introduction'
  });
  
  // Overview slide
  slides.push({
    slide_title: 'Course Overview',
    slide_content: [
      `Total Lessons: ${courseData.lessons?.length || 0}`,
      `Duration: ${courseData.duration_hours || 0} hours`,
      `Target Audience: ${courseData.audience || 'All learners'}`,
      'Comprehensive curriculum designed for practical learning'
    ],
    slide_notes: 'Overview of the course structure'
  });
  
  // Lesson slides
  if (courseData.lessons && courseData.lessons.length > 0) {
    courseData.lessons.forEach((lesson, index) => {
      // Extract key points from lesson content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = lesson.content || '';
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Get first 3 sentences or paragraphs as bullet points
      const points = textContent
        .split(/[.!?]\s+/)
        .filter(s => s.trim().length > 20)
        .slice(0, 4)
        .map(s => s.trim().substring(0, 100) + (s.length > 100 ? '...' : ''));
      
      slides.push({
        slide_title: `Lesson ${index + 1}: ${lesson.title}`,
        slide_content: points.length > 0 ? points : [
          'Key concepts and fundamentals',
          'Practical examples and applications',
          'Hands-on exercises',
          'Learning outcomes'
        ],
        slide_notes: `Duration: ${lesson.duration_minutes || 30} minutes`
      });
    });
  }
  
  // Conclusion slide
  slides.push({
    slide_title: 'Conclusion',
    slide_content: [
      'Thank you for taking this course!',
      'Apply what you\'ve learned',
      'Continue practicing and exploring',
      'Stay curious and keep learning'
    ],
    slide_notes: 'Course wrap-up'
  });
  
  return { slides };
};

/**
 * Create PPT file from course data
 */
export const generateCoursePPT = async (courseData, useAI = true) => {
  try {
    let pptContent;
    
    // Try to generate content with AI if enabled
    if (useAI && OPENAI_API_KEY) {
      console.log('🤖 Generating PPT content with OpenAI...');
      pptContent = await generatePPTContentWithAI(courseData);
    }
    
    // Fallback to manual generation if AI fails or is disabled
    if (!pptContent) {
      console.log('📝 Using fallback PPT generation...');
      pptContent = generateFallbackPPTContent(courseData);
    }
    
    // Create presentation
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.author = 'CourseSpark AI';
    pptx.company = 'CourseSpark';
    pptx.title = courseData.title;
    pptx.subject = courseData.category;
    
    // Define color scheme
    const colors = {
      primary: 'F97316', // Orange
      secondary: '1E293B', // Dark slate
      accent: 'FCD34D', // Yellow
      text: '334155', // Slate
      background: 'FFFFFF'
    };
    
    // Create slides
    pptContent.slides.forEach((slideData, index) => {
      const slide = pptx.addSlide();
      
      // Add background
      slide.background = { color: colors.background };
      
      if (index === 0) {
        // Title slide with special styling
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 2.0,
          w: 9,
          h: 1.5,
          fontSize: 44,
          bold: true,
          color: colors.primary,
          align: 'center',
          valign: 'middle'
        });
        
        // Subtitle/description
        if (slideData.slide_content && slideData.slide_content.length > 0) {
          slide.addText(slideData.slide_content.join('\n'), {
            x: 1,
            y: 4,
            w: 8,
            h: 1.5,
            fontSize: 18,
            color: colors.text,
            align: 'center'
          });
        }
        
        // Add decorative shape
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 10,
          h: 0.3,
          fill: { color: colors.primary }
        });
      } else {
        // Regular content slides
        // Add header bar
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 10,
          h: 0.8,
          fill: { color: colors.primary }
        });
        
        // Add title
        slide.addText(slideData.slide_title, {
          x: 0.5,
          y: 0.15,
          w: 9,
          h: 0.5,
          fontSize: 28,
          bold: true,
          color: 'FFFFFF',
          align: 'left'
        });
        
        // Add content bullets
        if (slideData.slide_content && slideData.slide_content.length > 0) {
          const bulletPoints = slideData.slide_content.map(point => ({
            text: point,
            options: { 
              bullet: true,
              fontSize: 18,
              color: colors.text,
              paraSpaceBefore: 12,
              paraSpaceAfter: 12
            }
          }));
          
          slide.addText(bulletPoints, {
            x: 0.8,
            y: 1.5,
            w: 8.4,
            h: 4.5,
            valign: 'top'
          });
        }
        
        // Add footer
        slide.addText(`${courseData.title} | Slide ${index + 1}`, {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 10,
          color: colors.text,
          align: 'center',
          italic: true
        });
      }
      
      // Add speaker notes if available
      if (slideData.slide_notes) {
        slide.addNotes(slideData.slide_notes);
      }
    });
    
    // Generate the file
    const fileName = `${courseData.title.replace(/[^a-z0-9]/gi, '_')}_Course.pptx`;
    
    // Get the blob for upload
    const blob = await pptx.write({ outputType: 'blob' });
    
    return {
      success: true,
      fileName,
      blob,
      message: 'PPT generated successfully!'
    };
  } catch (error) {
    console.error('Error generating PPT:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate PPT'
    };
  }
};

export default generateCoursePPT;
