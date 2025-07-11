import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEY } from '../config/apiConfig';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini with hardcoded API key
export const initializeGemini = (apiKey?: string): void => {
  const keyToUse = apiKey || API_KEY;
  
  if (!keyToUse) {
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

// Auto-initialize with hardcoded API key
export const autoInitializeGemini = (): boolean => {
  try {
    initializeGemini(API_KEY);
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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