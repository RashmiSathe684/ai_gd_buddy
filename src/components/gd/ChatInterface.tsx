import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Bot, User as UserIcon } from 'lucide-react';
import { 
  generateParticipantResponse, 
  generateLiveFeedback, 
  isGeminiInitialized,
  autoInitializeGemini
} from '../../services/geminiService';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  participantName?: string;
  participantAvatar?: string;
  participantType?: 'student' | 'mentor';
}

interface LiveFeedback {
  clarity: number;
  relevance: number;
  confidence: number;
  participation: number;
  feedback: string;
}

interface ChatInterfaceProps {
  isActive: boolean;
  onMessageSent: (message: string) => void;
  onFeedbackUpdate: (feedback: LiveFeedback) => void;
  aiParticipants: Array<{
    name: string;
    type: 'student' | 'mentor';
    avatar: string;
    personality: string;
  }>;
  topic: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isActive, 
  onMessageSent, 
  onFeedbackUpdate,
  aiParticipants,
  topic
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextSpeakerRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-initialize Gemini on component mount
  useEffect(() => {
    const initialized = autoInitializeGemini();
    if (!initialized) {
      toast.error('Failed to initialize AI service');
    }
  }, []);

  // Initialize discussion when session starts
  useEffect(() => {
    if (isActive && messages.length === 0 && isGeminiInitialized()) {
      startDiscussion();
    }
  }, [isActive, isGeminiInitialized()]);

  const startDiscussion = async () => {
    if (!isGeminiInitialized() || aiParticipants.length === 0) return;

    try {
      // First mentor introduces the topic
      const mentor = aiParticipants.find(p => p.type === 'mentor');
      if (mentor) {
        const introMessage = `Welcome everyone! Today we're discussing "${topic}". This is an important topic with many different perspectives. Let's start by sharing our initial thoughts. Who would like to begin?`;
        
        addAIMessage(introMessage, mentor);
        setConversationHistory([`${mentor.name}: ${introMessage}`]);
      }
    } catch (error) {
      console.error('Error starting discussion:', error);
      toast.error('Failed to start discussion');
    }
  };

  const addAIMessage = (content: string, participant: any) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      sender: 'ai',
      content,
      timestamp: new Date(),
      participantName: participant.name,
      participantAvatar: participant.avatar,
      participantType: participant.type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateNextAIResponse = async (userMessage?: string) => {
    if (!isGeminiInitialized() || aiParticipants.length === 0) return;

    setIsTyping(true);
    
    try {
      // Determine next speaker (rotate between participants, with mentor speaking less frequently)
      const students = aiParticipants.filter(p => p.type === 'student');
      const mentor = aiParticipants.find(p => p.type === 'mentor');
      
      let nextParticipant;
      
      // Mentor speaks every 4-5 messages, students alternate
      const messageCount = messages.length;
      if (messageCount > 0 && messageCount % 5 === 0 && mentor) {
        nextParticipant = mentor;
      } else {
        nextParticipant = students[nextSpeakerRef.current % students.length];
        nextSpeakerRef.current++;
      }

      if (!nextParticipant) return;

      const response = await generateParticipantResponse(
        nextParticipant.name,
        nextParticipant.type,
        topic,
        conversationHistory,
        userMessage
      );

      // Add AI response
      addAIMessage(response, nextParticipant);
      
      // Update conversation history
      const newHistoryEntry = `${nextParticipant.name}: ${response}`;
      setConversationHistory(prev => [...prev, newHistoryEntry].slice(-10)); // Keep last 10 messages

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to generate AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isActive || !isGeminiInitialized()) return;

    const userMessage = inputMessage.trim();
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    onMessageSent(userMessage);
    setInputMessage('');

    // Update conversation history
    const userHistoryEntry = `You: ${userMessage}`;
    setConversationHistory(prev => [...prev, userHistoryEntry].slice(-10));

    // Generate live feedback
    try {
      const feedback = await generateLiveFeedback(
        userMessage, 
        topic, 
        conversationHistory.slice(-3).join('\n')
      );
      onFeedbackUpdate(feedback);
    } catch (error) {
      console.error('Error generating live feedback:', error);
    }

    // Generate AI response after a short delay
    setTimeout(() => {
      generateNextAIResponse(userMessage);
    }, 1500 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Live Discussion</h3>
        </div>
        <div className="flex items-center space-x-4">
          {isActive && isGeminiInitialized() ? (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live AI</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-sm font-medium">Waiting</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages - Expanded area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md xl:max-w-lg ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : message.participantType === 'mentor'
                    ? 'bg-purple-500'
                    : 'bg-green-500'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <span>{message.participantAvatar}</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 max-w-full ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.participantType === 'mentor'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.sender === 'ai' && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.participantName}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-blue-100' 
                      : message.participantType === 'mentor'
                      ? 'text-purple-600'
                      : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              !isGeminiInitialized() 
                ? "AI service initializing..." 
                : isActive 
                ? "Share your thoughts..." 
                : "Session not started"
            }
            disabled={!isActive || !isGeminiInitialized()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputMessage.trim() || !isActive || !isGeminiInitialized()}
            className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;