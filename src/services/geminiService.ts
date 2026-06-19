import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiConfig } from '../config/apiConfig';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini with API key
export const initializeGemini = (apiKey?: string): void => {
  const keyToUse = apiKey || apiConfig.getGeminiApiKey();
  
  if (!keyToUse || keyToUse === 'your-gemini-api-key-here') {
    throw new Error('No API key available for Gemini initialization');
  }

  try {
    genAI = new GoogleGenerativeAI(keyToUse);
    console.log('✅ Gemini API initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini API:', error);
    throw error;
  }
};

// Auto-initialize with configured API key
export const autoInitializeGemini = (): boolean => {
  try {
    initializeGemini(apiConfig.getGeminiApiKey());
    return true;
  } catch (error) {
    console.error('Auto-initialization failed:', error);
    return false;
  }
};

// Check if Gemini is initialized
export const isGeminiInitialized = (): boolean => {
  return genAI !== null;
};

// Generate AI participant response
export const generateParticipantResponse = async (
  participantName: string,
  participantType: 'student' | 'mentor',
  topic: string,
  conversationHistory: string[],
  userMessage?: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API not initialized');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const context = conversationHistory.slice(-5).join('\n');
    const recentUserInput = userMessage ? `\nUser just said: "${userMessage}"` : '';
    
    const prompt = participantType === 'mentor' 
      ? `You are ${participantName}, an experienced mentor facilitating a group discussion on "${topic}". 
         Recent conversation: ${context}${recentUserInput}
         
         Provide guidance, ask thought-provoking questions, or summarize key points. Keep response under 100 words and maintain a supportive, professional tone.`
      : `You are ${participantName}, a student participating in a group discussion on "${topic}".
         Recent conversation: ${context}${recentUserInput}
         
         Share your perspective, ask questions, or build on others' ideas. Keep response under 80 words and sound natural and engaging.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating participant response:', error);
    throw error;
  }
};

// Generate live feedback
export const generateLiveFeedback = async (
  userMessage: string,
  topic: string,
  recentContext: string
): Promise<{
  clarity: number;
  relevance: number;
  confidence: number;
  participation: number;
  feedback: string;
}> => {
  if (!genAI) {
    throw new Error('Gemini API not initialized');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Analyze this group discussion contribution:
    Topic: "${topic}"
    User message: "${userMessage}"
    Recent context: ${recentContext}
    
    Provide scores (0-100) and brief feedback:
    - Clarity: How clear and well-structured is the message?
    - Relevance: How relevant is it to the topic?
    - Confidence: How confident does the participant sound?
    - Participation: How well does it engage with the discussion?
    
    Format: Clarity:X,Relevance:Y,Confidence:Z,Participation:W,Feedback:Brief constructive feedback`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response
    const clarityMatch = text.match(/Clarity:(\d+)/);
    const relevanceMatch = text.match(/Relevance:(\d+)/);
    const confidenceMatch = text.match(/Confidence:(\d+)/);
    const participationMatch = text.match(/Participation:(\d+)/);
    const feedbackMatch = text.match(/Feedback:(.+)/);
    
    return {
      clarity: clarityMatch ? parseInt(clarityMatch[1]) : 75,
      relevance: relevanceMatch ? parseInt(relevanceMatch[1]) : 75,
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 75,
      participation: participationMatch ? parseInt(participationMatch[1]) : 75,
      feedback: feedbackMatch ? feedbackMatch[1].trim() : 'Good contribution to the discussion!'
    };
  } catch (error) {
    console.error('Error generating live feedback:', error);
    throw error;
  }
};

// Generate AI participants for group discussion
export const generateParticipants = async (
  topic: string,
  participantCount: number = 2
): Promise<Array<{
  id: string;
  name: string;
  type: 'student' | 'mentor';
  avatar: string;
  personality: string;
}>> => {
  if (!genAI) {
    console.warn('Gemini API not initialized, using fallback participants');
    return getFallbackParticipants(participantCount);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Generate ${participantCount} diverse AI participants for a group discussion on "${topic}".
    Include a mix of students and 1 mentor. Return ONLY a JSON array with this exact format:
    [
      {
        "id": "unique_id",
        "name": "First Name",
        "type": "student",
        "avatar": "👤",
        "personality": "brief personality description"
      }
    ]
    
    Requirements:
    - Use names: Riley, Alex, Jordan, Prof. Smith
    - 1 mentor (Prof. Smith) if participantCount >= 2, rest students
    - Diverse personalities (analytical, creative, practical, etc.)
    - Use simple emoji avatars like 👤, 👨, 👩, 🧑, 👨‍🏫`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const participants = JSON.parse(text);
      if (Array.isArray(participants) && participants.length > 0) {
        return participants;
      }
    } catch (parseError) {
      console.warn('Failed to parse AI-generated participants, using fallback');
    }
    
    return getFallbackParticipants(participantCount);
  } catch (error) {
    console.error('Error generating participants:', error);
    return getFallbackParticipants(participantCount);
  }
};

// Fallback participants when AI generation fails (mixed structure)
const getFallbackParticipants = (count: number = 2) => {
  const all = [
    {
      id: 'participant-1',
      name: 'Riley',
      type: 'student' as const,
      avatar: '👤',
      personality: 'Analytical thinker who likes to break down complex problems'
    },
    {
      id: 'mentor-1',
      name: 'Prof. Smith',
      type: 'mentor' as const,
      avatar: '👨‍🏫',
      personality: 'Experienced mentor who guides discussions and provides insights'
    },
    {
      id: 'participant-2',
      name: 'Alex',
      type: 'student' as const,
      avatar: '👨',
      personality: 'Creative and innovative, always brings fresh perspectives'
    },
    {
      id: 'participant-3',
      name: 'Jordan',
      type: 'student' as const,
      avatar: '👩',
      personality: 'Practical and solution-oriented, focuses on real-world applications'
    }
  ];
  return all.slice(0, count);
};

// Generate comprehensive session analysis using Gemini
export const generateSessionAnalysis = async (
  topicTitle: string,
  userMessages: string[],
  durationMinutes: number,
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
  if (!genAI) {
    console.warn('Gemini API not initialized, using fallback analysis');
    return getFallbackAnalysis(userMessages.length);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Analyze this group discussion session for the user based on the following details:
    Topic: "${topicTitle}"
    Duration: ${durationMinutes} minutes
    User's contributions: ${JSON.stringify(userMessages)}
    Full Conversation History: ${JSON.stringify(conversationHistory)}
    
    Evaluate the user's performance and provide detailed feedback.
    You MUST respond with a valid JSON object matching this schema (do not wrap in markdown code blocks, just raw JSON):
    {
      "overallScore": number (0-100),
      "metrics": {
        "participation": number (0-100),
        "clarity": number (0-100),
        "relevance": number (0-100),
        "leadership": number (0-100),
        "criticalThinking": number (0-100),
        "activeListening": number (0-100),
        "confidence": number (0-100)
      },
      "strengths": string[] (at least 3 strengths),
      "improvements": string[] (at least 3 improvements),
      "keyMoments": [
        {
          "time": "MM:SS",
          "type": "strength" or "improvement",
          "description": "brief description of what user said/did and why it was a strength or area to improve"
        }
      ],
      "detailedFeedback": "a paragraph of comprehensive analysis and constructive feedback"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean potential markdown formatting
    let cleanText = text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    }
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    
    try {
      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse AI session analysis JSON:', text, parseError);
      return getFallbackAnalysis(userMessages.length);
    }
  } catch (error) {
    console.error('Error generating session analysis:', error);
    return getFallbackAnalysis(userMessages.length);
  }
};

const getFallbackAnalysis = (messageCount: number) => {
  const participationScore = Math.min(100, Math.max(10, messageCount * 20));
  return {
    overallScore: 75,
    metrics: {
      participation: participationScore,
      clarity: 80,
      relevance: 85,
      leadership: 60,
      criticalThinking: 70,
      activeListening: 75,
      confidence: 80
    },
    strengths: [
      'Made clear points that were relevant to the topic.',
      'Active participant in the conversation.',
      'Constructive communication style.'
    ],
    improvements: [
      'Try to take more of a leadership role to guide the discussion.',
      'Bring in more real-world examples or external facts to support arguments.',
      'Engage more directly with other participants\' ideas (active listening).'
    ],
    keyMoments: [
      {
        time: '01:15',
        type: 'strength' as const,
        description: 'Introduced a valid perspective to kick off the main discussion.'
      },
      {
        time: '02:40',
        type: 'improvement' as const,
        description: 'Opportunity to challenge another participant\'s viewpoint more critically.'
      }
    ],
    detailedFeedback: 'You did a solid job participating in the discussion. You followed the topic well and stated your arguments clearly. To improve, try referencing what others say to build a more interactive discussion flow, and take the initiative to summarize key points when the conversation stalls.'
  };
};