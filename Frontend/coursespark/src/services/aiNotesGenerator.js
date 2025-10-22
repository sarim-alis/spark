// Imports.
const USE_API = true;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Generate mock notes.
const generateMockNotes = (topic, depth) => {
  const depthContent = {
    comprehensive: `# **${topic} - Comprehensive Study Notes**

## **Overview**
${topic} is a fundamental concept that plays a crucial role in its field. Understanding this topic requires grasping both theoretical foundations and practical applications.

## **Key Concepts**

### **Core Principles**
- **Principle 1**: Foundation concept that establishes the basis
- **Principle 2**: Building upon the foundation with advanced ideas
- **Principle 3**: Integration of concepts into practical frameworks

### **Important Definitions**
- **Term 1**: A critical component that defines the scope
- **Term 2**: Related concept that extends understanding
- **Term 3**: Application-focused definition

## **Detailed Explanations**

### **Section 1: Fundamentals**
The fundamental aspects of ${topic} involve understanding the basic building blocks. These include theoretical frameworks, historical context, and foundational principles that have shaped current understanding.

### **Section 2: Applications**
Practical applications demonstrate how ${topic} is used in real-world scenarios. This includes case studies, examples, and hands-on implementations.

### **Section 3: Advanced Topics**
Advanced concepts build upon the fundamentals, introducing complexity and nuance. This section explores cutting-edge developments and future directions.

## **Common Misconceptions**
- **Misconception 1**: Many believe X, but actually Y is true
- **Misconception 2**: A common error is assuming A when B is correct
- **Misconception 3**: Often confused with related concept Z

## **Summary**
${topic} encompasses a wide range of concepts from basic principles to advanced applications. Mastery requires understanding both theoretical and practical aspects.

## **Further Reading**
- Recommended textbooks and academic papers
- Online resources and tutorials
- Practice exercises and projects`,

    detailed: `# **${topic} - Highly Detailed Study Notes**

## **Comprehensive Overview**
${topic} represents a complex and multifaceted area of study that requires deep understanding across multiple dimensions. This detailed guide explores every aspect in depth.

## **Historical Context and Development**

### **Origins**
The concept of ${topic} emerged from early research and has evolved significantly over time. Key milestones include:
- **Early Period**: Initial discoveries and foundational work
- **Development Phase**: Refinement and expansion of core ideas
- **Modern Era**: Current state-of-the-art understanding

### **Evolution of Understanding**
As research progressed, our understanding of ${topic} has undergone several paradigm shifts, each contributing to a more nuanced and comprehensive framework.

## **Theoretical Foundations**

### **Core Theoretical Framework**
The theoretical basis of ${topic} rests on several key pillars:

1. **First Principle**: Detailed explanation of the foundational concept
   - Sub-concept A: In-depth analysis
   - Sub-concept B: Comprehensive breakdown
   - Sub-concept C: Detailed examination

2. **Second Principle**: Advanced theoretical considerations
   - Mathematical foundations (where applicable)
   - Logical structure and reasoning
   - Relationship to other theories

3. **Third Principle**: Integration and synthesis
   - How concepts interconnect
   - Emergent properties
   - System-level understanding

### **Mathematical/Logical Framework**
For topics requiring formal analysis:
- Equations and formulas with detailed explanations
- Proofs and derivations
- Step-by-step problem-solving approaches

## **In-Depth Concept Analysis**

### **Concept 1: [Primary Concept]**
**Definition**: Precise and comprehensive definition

**Characteristics**:
- Feature 1: Detailed description with examples
- Feature 2: Analysis of properties and behaviors
- Feature 3: Comparison with related concepts

**Applications**:
- Use case 1: Real-world application with detailed walkthrough
- Use case 2: Industry-specific implementation
- Use case 3: Research applications

**Limitations and Considerations**:
- Boundary conditions
- Assumptions and prerequisites
- Common pitfalls

### **Concept 2: [Secondary Concept]**
**Definition**: Complete definition with context

**Deep Dive**:
- Technical details and specifications
- Implementation considerations
- Best practices and guidelines

**Relationship to Other Concepts**:
- How it connects to Concept 1
- Dependencies and prerequisites
- Synergies and interactions

### **Concept 3: [Advanced Concept]**
**Definition**: Sophisticated understanding

**Advanced Analysis**:
- Complex interactions
- Edge cases and special scenarios
- Cutting-edge developments

## **Practical Applications and Case Studies**

### **Application Domain 1**
**Context**: Industry or field of application

**Case Study 1**:
- Background and problem statement
- Solution approach using ${topic}
- Results and outcomes
- Lessons learned

**Case Study 2**:
- Different scenario and challenges
- Alternative implementation
- Comparative analysis

### **Application Domain 2**
**Real-World Examples**:
- Example 1: Step-by-step breakdown
- Example 2: Complex scenario analysis
- Example 3: Innovative applications

### **Hands-On Implementation**
**Practical Exercises**:
1. Beginner level: Foundational practice
2. Intermediate level: Applied problems
3. Advanced level: Complex challenges

## **Common Misconceptions and Pitfalls**

### **Misconception 1: [Common Error]**
**What people think**: Incorrect understanding
**Reality**: Correct explanation
**Why the confusion**: Root cause analysis
**How to avoid**: Prevention strategies

### **Misconception 2: [Frequent Mistake]**
**Common belief**: Widespread but incorrect idea
**Actual truth**: Accurate information
**Clarification**: Detailed correction

### **Misconception 3: [Typical Confusion]**
**Mistaken assumption**: What's often assumed
**Correct understanding**: Proper explanation
**Distinguishing factors**: Key differences

## **Advanced Topics and Current Research**

### **Emerging Trends**
- Recent developments in the field
- Cutting-edge research directions
- Future possibilities

### **Controversial Topics**
- Debates and discussions
- Different schools of thought
- Unresolved questions

### **Interdisciplinary Connections**
- Links to other fields
- Cross-domain applications
- Integrated approaches

## **Problem-Solving Strategies**

### **Approach 1: Systematic Method**
1. Problem identification
2. Analysis framework
3. Solution development
4. Validation and testing

### **Approach 2: Creative Thinking**
- Lateral thinking techniques
- Innovation strategies
- Alternative perspectives

### **Approach 3: Analytical Framework**
- Structured problem decomposition
- Logical reasoning
- Evidence-based decision making

## **Assessment and Evaluation**

### **Self-Check Questions**
1. Fundamental understanding questions
2. Application-based problems
3. Critical thinking challenges

### **Practice Problems**
- Worked examples with solutions
- Progressive difficulty levels
- Real-world scenarios

## **Resources and Further Study**

### **Essential Reading**
- **Primary Sources**: Foundational texts and papers
- **Secondary Sources**: Comprehensive guides
- **Advanced Materials**: Cutting-edge research

### **Online Resources**
- Video lectures and tutorials
- Interactive simulations
- Community forums and discussions

### **Practical Tools**
- Software and applications
- Frameworks and libraries
- Development environments

## **Summary and Key Takeaways**

### **Core Principles Recap**
1. Essential understanding point 1
2. Critical concept 2
3. Fundamental principle 3

### **Practical Applications Summary**
- Key use cases
- Implementation guidelines
- Best practices

### **Next Steps**
- Recommended learning path
- Advanced topics to explore
- Practical projects to undertake

## **Glossary**
- **Term 1**: Comprehensive definition
- **Term 2**: Detailed explanation
- **Term 3**: Technical specification

## **References and Citations**
- Academic papers and research
- Industry standards and documentation
- Expert opinions and analyses`
  };

  return depthContent[depth] || depthContent.comprehensive;
};

// Generate notes with AI.
export const generateNotesWithAI = async (topic, depth) => {
  try {
    if (!USE_API) {
      console.log('🎭 Using mock data (USE_API = false)');
      // Add small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = generateMockNotes(topic, depth);
      return {
        success: true,
        data: mockData
      };
    }

    console.log('🤖 Using OpenAI API (USE_API = true)');
    
    const depthInstructions = {
      brief: 'Create a VERY brief overview with ONLY the most essential points and key concepts. MAXIMUM 150 words. Keep it extremely concise - just the core takeaways.',
      comprehensive: 'Create comprehensive study notes with clear sections, key concepts, and examples. MAXIMUM 300 words. Well-structured and detailed but not too long.',
      detailed: 'Create detailed study notes with extensive explanations, examples, and thorough analysis. MAXIMUM 600 words. Deep coverage of all important aspects.'
    };

    const prompt = `You are an expert educator and note-taker. Generate ${depth} study notes on the topic: "${topic}"

${depthInstructions[depth]}

Structure the notes with:
- Clear markdown formatting with headers (##, ###)
- Overview and introduction
- Key concepts and principles with detailed explanations
- Important definitions and terminology
- Practical examples and applications
- Common misconceptions to avoid
- Advanced topics (for detailed notes)
- Summary of main points
- Further reading suggestions

Make the notes educational, well-organized, and easy to understand. Use bullet points, numbered lists, and clear sections.

Return the notes in markdown format.`;

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
            content: 'You are an expert educator who creates comprehensive, well-structured study notes. Always use markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: depth === 'brief' ? 250 : (depth === 'comprehensive' ? 500 : 1000)
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // If quota exceeded, use mock data
      if (response.status === 429) {
        console.warn('⚠️ OpenAI quota exceeded, using mock data');
        const mockData = generateMockNotes(topic, depth);
        return {
          success: true,
          data: mockData
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
    
    const notes = data.choices[0].message.content;
    console.log('📝 Generated notes');
    
    return {
      success: true,
      data: notes
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate notes'
    };
  }
};

export default generateNotesWithAI;
