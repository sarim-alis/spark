// Add your OpenAI API key here

// Mock course generator as fallback
const generateMockCourse = (formData) => {
  const numLessons = Math.ceil(formData.duration / 1.5);
  const lessons = [];
  
  for (let i = 0; i < numLessons; i++) {
    lessons.push({
      title: `${formData.topic} - Lesson ${i + 1}`,
      content: `<h2>Lesson ${i + 1}: Introduction</h2><p>This lesson covers fundamental concepts of ${formData.topic}. You'll learn practical skills that are essential for ${formData.audience}.</p><ul><li>Key concept 1</li><li>Key concept 2</li><li>Practical examples</li></ul><p>By the end of this lesson, you'll have a solid understanding of the core principles.</p>`,
      duration_minutes: 30 + (i * 10),
      order: i + 1
    });
  }
  
  return {
    title: `${formData.topic} - ${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Course`,
    description: `A comprehensive ${formData.level} level course on ${formData.topic}, designed for ${formData.audience}. Learn essential skills and practical knowledge in ${formData.category}.`,
    lessons
  };
};

export const generateCourseWithAI = async (formData) => {
  try {
    const prompt = `You are an expert course creator. Generate a comprehensive course based on the following details:

Topic: ${formData.topic}
Target Audience: ${formData.audience}
Difficulty Level: ${formData.level}
Duration: ${formData.duration} hours
Category: ${formData.category}

Please generate a course with the following structure in JSON format:
{
  "title": "Course title (concise and engaging)",
  "description": "A detailed 2-3 sentence course description",
  "lessons": [
    {
      "title": "Lesson title",
      "content": "Detailed lesson content in HTML format with <h2>, <p>, <ul>, <li> tags. Include practical examples and explanations.",
      "duration_minutes": estimated duration in minutes
    }
  ]
}

Generate ${Math.ceil(formData.duration / 1.5)} lessons that cover the topic comprehensively.
Make the content educational, engaging, and appropriate for ${formData.audience} at ${formData.level} level.
Each lesson should be substantial with real learning value.

Return ONLY the JSON object, no additional text.`;

    console.log('Calling OpenAI API...');
    
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
            content: 'You are an expert course creator. Always respond with valid JSON only.'
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
    
    // Add order to lessons
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
