// Imports.
const USE_API = true;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Generate mock course.
const generateMockCourse = (formData) => {
  const numLessons = Math.ceil(formData.duration / 1.5);
  const lessons = [];
  
  for (let i = 0; i < numLessons; i++) {
    lessons.push({
      title: `${formData.topic} - Lesson ${i + 1}: Core Fundamentals`,
      outline: `• Understanding core principles of ${formData.topic}\n• Learning practical applications in ${formData.category}`,
      content: `<h3>Understanding core principles of ${formData.topic}</h3>\n<p>This section introduces you to the core principles that form the foundation of ${formData.topic}. You'll learn how these concepts work, why they're essential for ${formData.audience}, and how to apply them effectively in your work. We'll explore the fundamental building blocks that professionals use daily, examining both theoretical frameworks and practical implementations. You'll gain a deep understanding of the underlying mechanisms, best practices, and common patterns that make ${formData.topic} so powerful. By the end of this section, you'll have a solid grasp of the core concepts and be ready to apply them in real-world scenarios.</p>\n\n<h3>Learning practical applications in ${formData.category}</h3>\n<p>Discover how professionals apply ${formData.topic} in real-world scenarios. You'll see practical examples, learn industry best practices, and gain techniques you can use immediately in your projects. This section covers hands-on applications, real-world case studies, and proven strategies that successful practitioners use. We'll walk through step-by-step implementations, discuss common challenges and their solutions, and explore advanced techniques that can elevate your work. You'll learn not just what to do, but why it works and when to apply specific approaches for maximum impact.</p>`,
      duration_minutes: 30 + (i * 10),
      order: i + 1
    });
  }
  
  return {
    title: `Master ${formData.topic}: ${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Course`,
    description: `This comprehensive ${formData.level}-level course takes you on a complete learning journey through ${formData.topic}, specifically designed for ${formData.audience}. You'll start with foundational concepts and progressively build toward advanced applications, gaining both theoretical understanding and practical skills along the way. Each lesson is carefully structured to maximize learning retention and real-world applicability.

Throughout this course, you'll develop a deep understanding of ${formData.category} principles, learn industry best practices, and gain hands-on experience through practical examples and case studies. The curriculum balances conceptual knowledge with actionable techniques you can implement immediately in your work or projects.

Whether you're looking to advance your career, start a new venture, or simply expand your knowledge, this course provides the comprehensive education you need. By the end, you'll have the confidence and competence to tackle real-world challenges in ${formData.topic} and continue learning independently.`,
    lessons
  };
};

// Generate course wtih ai.
export const generateCourseWithAI = async (formData) => {
  try {
    if (!USE_API) {
      console.log('🎭 Using mock data (USE_API = false)');
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = generateMockCourse(formData);
      return {
        success: true,
        data: mockData
      };
    }

    console.log('🤖 Using OpenAI API (USE_API = true)');
    
    const prompt = `You are an expert course creator and instructional designer. Generate a comprehensive, professional course based on the following details:

Topic: ${formData.topic}
Target Audience: ${formData.audience}
Difficulty Level: ${formData.level}
Duration: ${formData.duration} hours
Category: ${formData.category}

Please generate a course with the following structure in JSON format:
{
  "title": "Course title (concise, engaging, and professional)",
  "description": "A broad, comprehensive course overview consisting of 2-3 full paragraphs. The first paragraph should explain what the course covers and its main objectives. The second paragraph should describe the learning journey and key skills students will gain. The third paragraph (optional) should explain who this course is for and what outcomes they can expect. Make this detailed and compelling.",
  "lessons": [
    {
      "title": "Lesson title (clear and descriptive)",
      "outline": "EXACTLY 2 bullet points (each on a new line, starting with •). Each point should be a complete, descriptive sentence (8-12 words maximum) that clearly explains what will be learned. Keep titles concise to fit on one line. Example format:\n• Understanding Vue.js architecture and reactive data binding\n• Setting up your development environment and first application",
      "content": "EXACTLY 2 sections in HTML format. Each section MUST have:\n1. An <h3> heading that matches the outline point EXACTLY (word-for-word)\n2. ONE paragraph (<p> tag) with 7-8 lines (120-150 words) explaining that point in comprehensive detail\n\nFormat:\n<h3>[First outline point text]</h3>\n<p>Comprehensive explanation in 7-8 lines covering: the key concepts in depth, theoretical foundations, practical applications with examples, why it matters for learners, common use cases, best practices, potential challenges and solutions, and actionable takeaways. Make it educational, detailed, and valuable.</p>\n\n<h3>[Second outline point text]</h3>\n<p>Comprehensive explanation in 7-8 lines covering: the key concepts in depth, theoretical foundations, practical applications with examples, why it matters for learners, common use cases, best practices, potential challenges and solutions, and actionable takeaways. Make it educational, detailed, and valuable.</p>\n\nMake each paragraph comprehensive, informative, and rich with details. Each section will be displayed on its own slide.",
      "duration_minutes": estimated duration in minutes (realistic based on content depth)
    }
  ]
}

Generate ${Math.ceil(formData.duration / 1.5)} lessons that cover the topic comprehensively from fundamentals to advanced concepts.
Make the content highly educational, engaging, detailed, and appropriate for ${formData.audience} at ${formData.level} level.
Each lesson should be substantial (500-800 words of content) with real learning value, proper structure, and clear explanations.
Include practical examples, real-world applications, and actionable insights in every lesson.

Return ONLY the JSON object, no additional text.`;

    console.log('Calling OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert course creator and instructional designer. Always respond with valid JSON only. Create detailed, comprehensive, and educational content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // If quota exceeded, use mock data
      if (response.status === 429) {
        console.warn('⚠️ OpenAI quota exceeded, using mock data');
        const mockData = generateMockCourse(formData);
        return {
          success: true,
          data: mockData
        };
      }
      
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received:', data);
    
    if (!data.choices || !data.choices[0]) {
      console.error('❌ No choices in response');
      throw new Error('No content generated');
    }
    
    const text = data.choices[0].message.content;
    console.log('📝 Raw AI text:', text);
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    console.log('🔧 Cleaned JSON text:', jsonText);
    
    const courseData = JSON.parse(jsonText);
    console.log('✨ Parsed course data:', courseData);
    
    // Add order to lessons.
    courseData.lessons = courseData.lessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1
    }));
    
    return {
      success: true,
      data: courseData
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate course content'
    };
  }
};

export default generateCourseWithAI;
