import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const isGeminiInitialized = () => {
  return genAI !== null && model !== null;
};

// Generate AI participant response
export const generateParticipantResponse = async (
  participantName: string,
  participantType: 'student' | 'mentor',
  topic: string,
  conversationHistory: string[],
  userMessage?: string
): Promise<string> => {
  if (!model) {
    throw new Error('Gemini API not initialized');
  }

  const context = conversationHistory.slice(-5).join('\n');
  
  let prompt = '';
  
  if (participantType === 'student') {
    prompt = `You are ${participantName}, a college student participating in a group discussion about "${topic}". 
    
    Context of recent conversation:
    ${context}
    
    ${userMessage ? `The user just said: "${userMessage}"` : ''}
    
    Respond as a student would - be engaging, thoughtful, but not overly formal or professional. Keep responses conversational and around 1-2 sentences. Show different perspectives and sometimes ask questions to keep the discussion flowing. Be natural and authentic.
    
    Generate only your response, no labels or formatting:`;
  } else {
    prompt = `You are ${participantName}, a mentor facilitating a group discussion about "${topic}". 
    
    Context of recent conversation:
    ${context}
    
    ${userMessage ? `The user just said: "${userMessage}"` : ''}
    
    As a mentor, occasionally guide the discussion, ask probing questions, summarize key points, or redirect if needed. Don't dominate - let students lead most of the time. Keep responses brief and supportive. Sometimes acknowledge good points made by participants.
    
    Generate only your response, no labels or formatting:`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating participant response:', error);
    return participantType === 'student' 
      ? "That's an interesting point. I'd like to hear more perspectives on this."
      : "Let's continue exploring this topic. What do others think?";
  }
};

// Generate real-time feedback for user input
export const generateLiveFeedback = async (
  userMessage: string,
  topic: string,
  sessionContext: string
): Promise<{
  clarity: number;
  relevance: number;
  confidence: number;
  participation: number;
  feedback: string;
}> => {
  if (!model) {
    throw new Error('Gemini API not initialized');
  }

  const prompt = `Analyze this group discussion contribution for a topic "${topic}":

  User's message: "${userMessage}"
  Session context: ${sessionContext}

  Provide scores (0-100) and brief feedback on:
  1. Clarity - How clear and well-articulated is the message?
  2. Relevance - How relevant is it to the topic?
  3. Confidence - How confident does the speaker sound?
  4. Participation - Quality of engagement with the discussion

  Respond in this exact JSON format:
  {
    "clarity": 85,
    "relevance": 90,
    "confidence": 80,
    "participation": 88,
    "feedback": "Good point with clear reasoning. Try to engage more with others' perspectives."
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      clarity: 75,
      relevance: 80,
      confidence: 70,
      participation: 75,
      feedback: "Keep contributing to the discussion!"
    };
  } catch (error) {
    console.error('Error generating live feedback:', error);
    return {
      clarity: 75,
      relevance: 80,
      confidence: 70,
      participation: 75,
      feedback: "Keep contributing to the discussion!"
    };
  }
};

// Generate comprehensive session analysis
export const generateSessionAnalysis = async (
  topic: string,
  userMessages: string[],
  sessionDuration: number,
  conversationHistory: string[]
): Promise<{
  overallScore: number;
  metrics: {
    participation: number;
    clarity: number;
    relevance: number;
    leadership: number;
    criticalThinking: number;
    activeListening: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  keyMoments: Array<{
    time: string;
    type: 'strength' | 'improvement';
    description: string;
  }>;
  detailedFeedback: string;
}> => {
  if (!model) {
    throw new Error('Gemini API not initialized');
  }

  const userContributions = userMessages.join('\n');
  const fullConversation = conversationHistory.join('\n');

  const prompt = `Analyze this group discussion session on "${topic}" (Duration: ${sessionDuration} minutes):

  User's contributions:
  ${userContributions}

  Full conversation context:
  ${fullConversation}

  Provide a comprehensive analysis in this exact JSON format:
  {
    "overallScore": 85,
    "metrics": {
      "participation": 80,
      "clarity": 85,
      "relevance": 90,
      "leadership": 75,
      "criticalThinking": 88,
      "activeListening": 82,
      "confidence": 78
    },
    "strengths": [
      "Clear articulation of ideas",
      "Strong logical reasoning",
      "Good use of examples"
    ],
    "improvements": [
      "Could engage more with others' points",
      "Try to take more initiative in leading discussions"
    ],
    "keyMoments": [
      {
        "time": "2:15",
        "type": "strength",
        "description": "Excellent point about practical applications"
      },
      {
        "time": "4:30",
        "type": "improvement", 
        "description": "Missed opportunity to build on Sarah's argument"
      }
    ],
    "detailedFeedback": "Overall strong performance with clear communication and relevant contributions. Focus on more interactive engagement with other participants."
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    }
    
    // Fallback analysis
    return {
      overallScore: 75,
      metrics: {
        participation: 75,
        clarity: 80,
        relevance: 85,
        leadership: 70,
        criticalThinking: 78,
        activeListening: 72,
        confidence: 75
      },
      strengths: [
        "Active participation in discussion",
        "Clear communication style",
        "Relevant contributions to topic"
      ],
      improvements: [
        "Try to engage more with other participants",
        "Consider alternative viewpoints",
        "Take more leadership initiative"
      ],
      keyMoments: [
        {
          time: "2:00",
          type: "strength",
          description: "Made a strong opening statement"
        },
        {
          time: "5:30",
          type: "improvement",
          description: "Could have responded to mentor's question more directly"
        }
      ],
      detailedFeedback: "Good overall performance with room for improvement in interactive engagement and leadership skills."
    };
  } catch (error) {
    console.error('Error generating session analysis:', error);
    throw error;
  }
};

// Generate discussion starter for topic
export const generateDiscussionStarter = async (topic: string): Promise<string> => {
  if (!model) {
    throw new Error('Gemini API not initialized');
  }

  const prompt = `Generate an engaging opening statement for a group discussion on "${topic}". 
  
  The statement should:
  - Be thought-provoking and encourage participation
  - Present a clear perspective or question
  - Be 1-2 sentences long
  - Sound natural and conversational
  
  Generate only the opening statement, no labels:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating discussion starter:', error);
    return `Let's explore the various aspects of ${topic} and share our different perspectives on this important issue.`;
  }
};

// Generate random student participants
export const generateParticipants = async (): Promise<Array<{
  name: string;
  type: 'student' | 'mentor';
  avatar: string;
  personality: string;
}>> => {
  const studentNames = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Avery',
    'Quinn', 'Blake', 'Sage', 'River', 'Skylar', 'Rowan', 'Phoenix'
  ];
  
  const mentorNames = [
    'Dr. Smith', 'Prof. Johnson', 'Ms. Williams', 'Mr. Brown', 'Dr. Davis'
  ];

  const avatars = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💼', '👩‍💼'];
  const mentorAvatars = ['👨‍🏫', '👩‍🏫', '🧑‍🏫'];

  // Select 2 random students
  const selectedStudents = studentNames
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((name, index) => ({
      name,
      type: 'student' as const,
      avatar: avatars[index % avatars.length],
      personality: 'curious and engaged'
    }));

  // Select 1 mentor
  const selectedMentor = {
    name: mentorNames[Math.floor(Math.random() * mentorNames.length)],
    type: 'mentor' as const,
    avatar: mentorAvatars[Math.floor(Math.random() * mentorAvatars.length)],
    personality: 'supportive and guiding'
  };

  return [...selectedStudents, selectedMentor];
};