// Imports.
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate AI response based on code and user question
 * @param {Object} params - Parameters for AI code help
 * @param {string} params.code - The code snippet to analyze
 * @param {string} params.question - User's question about the code
 * @param {string} params.language - Programming language (optional)
 * @returns {Promise<Object>} Response with success status and AI-generated content
 */
export const getAICodeHelp = async ({ code, question, language = 'javascript' }) => {
  try {
    if (!OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found');
      return {
        success: false,
        error: 'OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.'
      };
    }

    const prompt = `You are an expert programming tutor. A student has provided the following ${language} code and has a question about it.

Code:
\`\`\`${language}
${code}
\`\`\`

Student's Question: ${question}

Please provide a clear, helpful, and educational response. Include:
1. A direct answer to their question
2. Explanation of relevant code concepts
3. Best practices or suggestions if applicable
4. Examples if helpful

Keep your response concise but thorough, and use a friendly, encouraging tone.`;

    console.log('🤖 Calling OpenAI API for code help...');
    
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
            content: 'You are an expert programming tutor who provides clear, helpful explanations about code. You are patient, encouraging, and focus on helping students understand concepts deeply.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      if (response.status === 429) {
        return {
          success: false,
          error: 'OpenAI API rate limit exceeded. Please try again in a moment.'
        };
      }
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid OpenAI API key. Please check your configuration.'
        };
      }
      
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received');
    
    if (!data.choices || !data.choices[0]) {
      console.error('❌ No choices in response');
      throw new Error('No content generated');
    }
    
    const aiResponse = data.choices[0].message.content;
    console.log('📝 AI Response generated successfully');
    
    return {
      success: true,
      response: aiResponse,
      usage: data.usage // Token usage information
    };
  } catch (error) {
    console.error('AI Code Help Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate AI response'
    };
  }
};

/**
 * Explain code without a specific question
 * @param {Object} params - Parameters for code explanation
 * @param {string} params.code - The code snippet to explain
 * @param {string} params.language - Programming language (optional)
 * @returns {Promise<Object>} Response with success status and explanation
 */
export const explainCode = async ({ code, language = 'javascript' }) => {
  try {
    if (!OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found');
      return {
        success: false,
        error: 'OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your environment variables.'
      };
    }

    const prompt = `Analyze and explain the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. A brief overview of what the code does
2. Explanation of key components and logic
3. Any notable patterns or techniques used
4. Potential improvements or considerations

Keep the explanation clear and educational.`;

    console.log('🤖 Calling OpenAI API for code explanation...');
    
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
            content: 'You are an expert code reviewer and educator. Provide clear, insightful explanations of code.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      if (response.status === 429) {
        return {
          success: false,
          error: 'OpenAI API rate limit exceeded. Please try again in a moment.'
        };
      }
      
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No content generated');
    }
    
    const explanation = data.choices[0].message.content;
    
    return {
      success: true,
      explanation: explanation,
      usage: data.usage
    };
  } catch (error) {
    console.error('Code Explanation Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to explain code'
    };
  }
};

/**
 * Get code suggestions and improvements
 * @param {Object} params - Parameters for code review
 * @param {string} params.code - The code snippet to review
 * @param {string} params.language - Programming language (optional)
 * @returns {Promise<Object>} Response with suggestions
 */
export const getCodeSuggestions = async ({ code, language = 'javascript' }) => {
  try {
    if (!OPENAI_API_KEY) {
      return {
        success: false,
        error: 'OpenAI API key is not configured.'
      };
    }

    const prompt = `Review the following ${language} code and provide suggestions for improvement:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. Code quality assessment
2. Specific suggestions for improvement
3. Best practices that could be applied
4. Potential bugs or issues to watch out for

Be constructive and educational in your feedback.`;

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
            content: 'You are an expert code reviewer focused on helping developers improve their code quality and skills.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No content generated');
    }
    
    return {
      success: true,
      suggestions: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('Code Suggestions Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate suggestions'
    };
  }
};

export default { getAICodeHelp, explainCode, getCodeSuggestions };
