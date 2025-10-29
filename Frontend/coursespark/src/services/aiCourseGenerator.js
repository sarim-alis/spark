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
      content: `
        <h2>Lesson ${i + 1}: Core Fundamentals</h2>
        
        <h3>Overview</h3>
        <p>This lesson introduces you to the essential concepts of ${formData.topic} that form the foundation of your learning journey. Understanding these fundamentals is crucial for ${formData.audience} who want to build a strong knowledge base in ${formData.category}.</p>
        <p>We'll explore key principles, examine real-world applications, and provide you with practical frameworks you can apply immediately. By the end of this lesson, you'll have clarity on how these concepts work together to create meaningful outcomes.</p>
        
        <h3>Key Concepts</h3>
        <p>The core of ${formData.topic} revolves around several interconnected ideas. First, we examine the theoretical foundations that experts in ${formData.category} rely on daily. These principles have been refined over years of practice and research, giving you a proven roadmap to follow.</p>
        <p>Second, we look at how these concepts translate into practical applications. You'll see how professionals use these ideas to solve real problems, make decisions, and create value. This bridges the gap between theory and practice, making your learning immediately actionable.</p>
        <p>Finally, we discuss common pitfalls and how to avoid them. Learning from others' mistakes accelerates your progress and helps you develop good habits from the start.</p>
        
        <h3>What You'll Learn</h3>
        <ul>
          <li>Master the fundamental principles that underpin ${formData.topic}</li>
          <li>Understand how to apply theoretical concepts to real-world scenarios</li>
          <li>Recognize patterns and connections between different aspects of ${formData.category}</li>
          <li>Develop critical thinking skills specific to this domain</li>
          <li>Build confidence in your ability to tackle more advanced topics</li>
          <li>Create a personal framework for continued learning and growth</li>
        </ul>
        
        <h3>Practical Examples</h3>
        <p>Consider a real-world scenario where ${formData.audience} need to apply ${formData.topic} knowledge. For instance, professionals in this field regularly face challenges that require quick decision-making based on core principles. By understanding the fundamentals, you can analyze situations systematically and choose the best approach.</p>
        <p>We'll walk through case studies showing both successful implementations and common mistakes. These examples demonstrate how small differences in understanding can lead to vastly different outcomes, reinforcing why mastering fundamentals matters.</p>
        
        <h3>Summary</h3>
        <p>This lesson established the foundational knowledge you need to progress confidently in ${formData.topic}. You've learned the key concepts, seen practical applications, and understand how to avoid common pitfalls. With this solid base, you're ready to explore more advanced topics and start applying what you've learned in your own context. Remember, mastery comes from practice—so take time to reflect on these concepts and look for opportunities to use them.</p>
      `,
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
      "content": "Rich, detailed lesson content in HTML format. Structure each lesson with:
        - <h2>Lesson Title</h2>
        - <h3>Overview</h3> with 1-2 paragraphs explaining what this lesson covers and why it matters
        - <h3>Key Concepts</h3> with detailed explanations (2-3 paragraphs) of the main ideas
        - <h3>What You'll Learn</h3> with <ul><li> bullet points (4-6 items) listing specific skills/knowledge
        - <h3>Practical Examples</h3> with 1-2 paragraphs showing real-world applications
        - <h3>Summary</h3> with a concluding paragraph reinforcing key takeaways
        
        Make the content substantive, educational, and detailed. Each lesson should feel like a complete learning module with clear explanations, examples, and actionable insights.",
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
        model: 'gpt-3.5-turbo-16k',
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
        max_tokens: 4000
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
