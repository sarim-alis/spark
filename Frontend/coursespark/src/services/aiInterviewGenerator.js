// Imports.
const USE_API = true;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Generate mock interview questions.
const generateMockQuestions = (formData) => {
  const { jobRole, courseTitles, difficulty, interviewType } = formData;
  
  const questions = [
    {
      question: `What are the key responsibilities of a ${jobRole}?`,
      ideal_answer_points: [
        'Understanding of core technical skills',
        'Team collaboration and communication',
        'Problem-solving abilities'
      ]
    },
    {
      question: `Describe a challenging project you worked on related to ${courseTitles}.`,
      ideal_answer_points: [
        'Clear problem statement',
        'Your approach and solution',
        'Results and learnings'
      ]
    },
    {
      question: `How do you stay updated with the latest trends in ${courseTitles}?`,
      ideal_answer_points: [
        'Continuous learning habits',
        'Industry resources and communities',
        'Practical application of knowledge'
      ]
    },
    {
      question: `Tell me about a time you had to work under pressure.`,
      ideal_answer_points: [
        'Specific situation description',
        'Actions taken',
        'Positive outcome'
      ]
    },
    {
      question: `What makes you a good fit for a ${jobRole} position?`,
      ideal_answer_points: [
        'Relevant skills and experience',
        'Passion for the field',
        'Alignment with role requirements'
      ]
    }
  ];
  
  return questions;
};

// Generate interview questions with AI.
export const generateInterviewQuestionsWithAI = async (formData) => {
  try {
    const { jobRole, courseTitles, difficulty, interviewType } = formData;
    
    if (!USE_API || !OPENAI_API_KEY) {
      console.log('🎭 Using mock interview questions (USE_API = false or no API key)');
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockQuestions = generateMockQuestions(formData);
      return {
        success: true,
        data: mockQuestions
      };
    }

    console.log('🤖 Using OpenAI API for interview questions (USE_API = true)');
    
    const prompt = `You are an expert technical interviewer and career coach. Generate 5 ${interviewType} interview questions for a ${jobRole} position, based on skills from these courses: ${courseTitles}.

Difficulty level: ${difficulty}

Requirements:
- Questions should be relevant to ${jobRole} role
- Mix of technical and behavioral questions based on interview type
- Appropriate for ${difficulty} level candidates
- Related to topics covered in: ${courseTitles}

Return a JSON array with this exact structure:
[
  {
    "question": "the interview question text",
    "ideal_answer_points": ["key point 1", "key point 2", "key point 3"]
  }
]

Make questions realistic, practical, and commonly asked in actual interviews.
Return ONLY the JSON array, no additional text.`;

    console.log('Calling OpenAI API for interview questions...');
    
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
            content: 'You are an expert technical interviewer. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // If quota exceeded or error, use mock data
      if (response.status === 429 || response.status === 401) {
        console.warn('⚠️ OpenAI API issue, using mock questions');
        const mockQuestions = generateMockQuestions(formData);
        return {
          success: true,
          data: mockQuestions
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
    
    const questions = JSON.parse(jsonText);
    console.log('✨ Parsed interview questions:', questions);
    
    return {
      success: true,
      data: questions
    };
  } catch (error) {
    console.error('AI Interview Question Generation Error:', error);
    
    // Fallback to mock questions on error
    console.warn('⚠️ Falling back to mock questions due to error');
    const mockQuestions = generateMockQuestions(formData);
    return {
      success: true,
      data: mockQuestions
    };
  }
};

// Generate AI feedback for interview answer.
export const generateInterviewFeedbackWithAI = async (formData) => {
  try {
    const { question, idealAnswerPoints, userAnswer } = formData;
    
    if (!USE_API || !OPENAI_API_KEY) {
      console.log('🎭 Using mock feedback (USE_API = false or no API key)');
      // Mock feedback based on answer length
      const answerLength = userAnswer.trim().split(' ').length;
      const rating = Math.min(10, Math.max(5, Math.floor(answerLength / 10) + 5));
      
      return {
        success: true,
        data: {
          rating: rating,
          strengths: [
            'Clear communication',
            'Relevant examples provided',
            'Good structure'
          ],
          improvements: [
            'Could provide more specific details',
            'Consider adding quantifiable results',
            'Expand on technical aspects'
          ],
          feedback_text: `Your answer demonstrates a good understanding of the topic. You've provided relevant information and structured your response well. To improve, consider adding more specific examples and quantifiable results. Overall, this is a solid answer that covers the key points.`
        }
      };
    }

    console.log('🤖 Using OpenAI API for feedback');
    
    const prompt = `You are an expert interview coach providing constructive feedback.

Interview Question: ${question}

Ideal Answer Should Include: ${idealAnswerPoints.join(', ')}

Candidate's Answer: ${userAnswer}

Provide constructive feedback on this answer. Rate it from 1-10, identify strengths, and suggest improvements.

Return JSON with this exact structure:
{
  "rating": number (1-10),
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback_text": "detailed constructive feedback paragraph"
}

Be encouraging but honest. Focus on what they did well and how they can improve.
Return ONLY the JSON object, no additional text.`;

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
            content: 'You are an expert interview coach. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`OpenAI API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No content generated');
    }
    
    const text = data.choices[0].message.content;
    
    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const feedback = JSON.parse(jsonText);
    console.log('✨ Parsed feedback:', feedback);
    
    return {
      success: true,
      data: feedback
    };
  } catch (error) {
    console.error('AI Feedback Generation Error:', error);
    
    // Fallback to mock feedback
    const answerLength = userAnswer.trim().split(' ').length;
    const rating = Math.min(10, Math.max(5, Math.floor(answerLength / 10) + 5));
    
    return {
      success: true,
      data: {
        rating: rating,
        strengths: [
          'Clear communication',
          'Relevant examples provided',
          'Good structure'
        ],
        improvements: [
          'Could provide more specific details',
          'Consider adding quantifiable results',
          'Expand on technical aspects'
        ],
        feedback_text: `Your answer demonstrates a good understanding of the topic. You've provided relevant information and structured your response well. To improve, consider adding more specific examples and quantifiable results. Overall, this is a solid answer that covers the key points.`
      }
    };
  }
};

export default { generateInterviewQuestionsWithAI, generateInterviewFeedbackWithAI };
