import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  participantName?: string;
  participantAvatar?: string;
}

interface ChatInterfaceProps {
  isActive: boolean;
  onMessageSent: (message: string) => void;
  aiParticipants: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isActive, 
  onMessageSent, 
  aiParticipants 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentAISpeaker, setCurrentAISpeaker] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI responses
  useEffect(() => {
    if (isActive && messages.length === 0) {
      // Add initial AI message
      setTimeout(() => {
        addAIMessage(
          "Welcome everyone! Today we're discussing AI in healthcare. I believe AI can significantly improve diagnostic accuracy. What are your thoughts?",
          aiParticipants[0]
        );
      }, 2000);
    }
  }, [isActive, aiParticipants]);

  // Simulate AI conversation flow
  useEffect(() => {
    if (isActive && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'user') {
        // AI responds after user message
        setTimeout(() => {
          const responses = [
            "That's an excellent point! However, we should also consider the ethical implications of AI decision-making in healthcare.",
            "I agree with your perspective. But what about the privacy concerns when AI systems handle sensitive patient data?",
            "Interesting viewpoint! The cost-effectiveness of implementing AI in healthcare systems is definitely worth discussing.",
            "You raise a valid concern. The balance between AI efficiency and human oversight is crucial in medical settings.",
            "Great insight! The training data quality for AI systems is indeed a critical factor for reliable healthcare outcomes."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          const nextSpeaker = aiParticipants[(currentAISpeaker + 1) % aiParticipants.length];
          
          addAIMessage(randomResponse, nextSpeaker);
          setCurrentAISpeaker((prev) => (prev + 1) % aiParticipants.length);
        }, 3000 + Math.random() * 2000);
      }
    }
  }, [messages, isActive, aiParticipants, currentAISpeaker]);

  const addAIMessage = (content: string, participant: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      content,
      timestamp: new Date(),
      participantName: participant.name,
      participantAvatar: participant.avatar
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isActive) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    onMessageSent(inputMessage.trim());
    setInputMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Discussion Chat</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isActive ? (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-sm font-medium">Waiting</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-green-500'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <span>{message.participantAvatar}</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.sender === 'ai' && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.participantName}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isActive ? "Type your message..." : "Session not started"}
            disabled={!isActive}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!inputMessage.trim() || !isActive}
            className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>
      </form>

      {/* Typing Indicator */}
      {isActive && (
        <div className="px-4 pb-2">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <Bot className="h-4 w-4" />
            <span>AI participants are thinking...</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;