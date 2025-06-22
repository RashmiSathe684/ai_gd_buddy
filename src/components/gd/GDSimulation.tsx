import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Clock, 
  Users, 
  Volume2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Brain,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addSession } from '../../services/userDataService';
import { 
  generateParticipants, 
  generateSessionAnalysis, 
  isGeminiInitialized 
} from '../../services/geminiService';
import ChatInterface from './ChatInterface';
import toast from 'react-hot-toast';

interface LiveFeedback {
  clarity: number;
  relevance: number;
  confidence: number;
  participation: number;
  feedback: string;
}

const GDSimulation: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionPhase, setSessionPhase] = useState<'waiting' | 'introduction' | 'discussion' | 'conclusion'>('waiting');
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback>({
    clarity: 0,
    relevance: 0,
    confidence: 0,
    participation: 0,
    feedback: 'Start contributing to see live feedback!'
  });
  const [aiParticipants, setAiParticipants] = useState<Array<{
    name: string;
    type: 'student' | 'mentor';
    avatar: string;
    personality: string;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const topic = {
    id: parseInt(topicId || '1'),
    title: 'Artificial Intelligence in Healthcare',
    description: 'Discuss the impact of AI on modern healthcare systems and patient care.',
    difficulty: 'Advanced',
    duration: '8-10 mins',
    keyPoints: [
      'AI diagnostic accuracy vs human expertise',
      'Privacy and security concerns',
      'Cost implications and accessibility',
      'Ethical considerations in AI decision-making'
    ]
  };

  // Generate AI participants on component mount
  useEffect(() => {
    const initializeParticipants = async () => {
      try {
        const participants = await generateParticipants();
        setAiParticipants(participants);
      } catch (error) {
        console.error('Error generating participants:', error);
        // Fallback participants
        setAiParticipants([
          { name: 'Alex', type: 'student', avatar: '👨‍🎓', personality: 'curious' },
          { name: 'Sam', type: 'student', avatar: '👩‍🎓', personality: 'analytical' },
          { name: 'Dr. Smith', type: 'mentor', avatar: '👨‍🏫', personality: 'guiding' }
        ]);
      }
    };

    initializeParticipants();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    if (!isGeminiInitialized()) {
      toast.error('Please configure Gemini API first');
      return;
    }
    
    setSessionStarted(true);
    setSessionPhase('introduction');
    setTimeout(() => setSessionPhase('discussion'), 30000);
    toast.success('Session started! AI participants are ready.');
  };

  const endSession = async () => {
    if (!currentUser) return;
    
    setIsAnalyzing(true);
    setSessionStarted(false);
    setSessionPhase('conclusion');

    try {
      if (!isGeminiInitialized()) {
        throw new Error('Gemini API not initialized');
      }

      // Generate comprehensive analysis using Gemini
      const analysis = await generateSessionAnalysis(
        topic.title,
        userMessages,
        Math.round(timeElapsed / 60),
        conversationHistory
      );

      // Save session with AI-generated analysis
      await addSession(currentUser.uid, {
        topicId: topicId || '1',
        topicTitle: topic.title,
        metrics: analysis.metrics,
        overallScore: analysis.overallScore,
        duration: Math.round(timeElapsed / 60),
        difficulty: topic.difficulty,
        participants: aiParticipants.length + 1,
        timestamp: new Date()
      });

      toast.success('Session analyzed and saved!');
      
      // Store analysis for feedback page
      sessionStorage.setItem('sessionAnalysis', JSON.stringify(analysis));
      
      setTimeout(() => {
        navigate(`/feedback/${topicId}`);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing session:', error);
      toast.error('Failed to analyze session');
      setIsAnalyzing(false);
    }
  };

  const handleChatMessage = (message: string) => {
    if (message.trim()) {
      setUserMessages(prev => [...prev, message]);
      setConversationHistory(prev => [...prev, `You: ${message}`]);
    }
  };

  const handleFeedbackUpdate = (feedback: LiveFeedback) => {
    setLiveFeedback(feedback);
  };

  const getPhaseTitle = () => {
    switch (sessionPhase) {
      case 'introduction': return 'Introduction Phase';
      case 'discussion': return 'Active Discussion';
      case 'conclusion': return 'Analyzing Session';
      default: return 'Ready to Start';
    }
  };

  const getPhaseColor = () => {
    switch (sessionPhase) {
      case 'introduction': return 'from-blue-500 to-cyan-500';
      case 'discussion': return 'from-green-500 to-emerald-500';
      case 'conclusion': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getPhaseColor()} text-white font-medium mb-4`}>
            <Clock className="h-4 w-4 mr-2" />
            {getPhaseTitle()} {sessionStarted && `• ${formatTime(timeElapsed)}`}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{topic.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Discussion Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Panel */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">AI-Powered Discussion</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Brain className="h-5 w-5" />
                  <span>{aiParticipants.length + 1} participants</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                {!sessionStarted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSession}
                    className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                  >
                    <Play className="h-6 w-6" />
                    <span>Start AI Discussion</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={endSession}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
                  >
                    <Square className="h-5 w-5" />
                    <span>{isAnalyzing ? 'Analyzing...' : 'End Session'}</span>
                  </motion.button>
                )}
              </div>

              {sessionStarted && (
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{userMessages.length}</p>
                    <p className="text-sm text-gray-600">Your Messages</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">{liveFeedback.participation}%</p>
                    <p className="text-sm text-gray-600">Engagement</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Chat Interface */}
            <ChatInterface 
              isActive={sessionStarted}
              onMessageSent={handleChatMessage}
              onFeedbackUpdate={handleFeedbackUpdate}
              aiParticipants={aiParticipants}
              topic={topic.title}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Participants */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                AI Participants
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border-2 border-blue-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    You
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">You</p>
                    <p className="text-sm text-gray-600">Human Participant</p>
                  </div>
                </div>

                {aiParticipants.map((participant, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      participant.type === 'mentor' 
                        ? 'bg-purple-50 border border-purple-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      participant.type === 'mentor' ? 'bg-purple-500' : 'bg-green-500'
                    }`}>
                      {participant.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-600">
                        {participant.type === 'mentor' ? 'AI Mentor' : 'AI Student'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Discussion Points */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Points to Cover</h3>
              
              <div className="space-y-3">
                {topic.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-800 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live AI Feedback */}
            {sessionStarted && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Live AI Feedback
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span className="font-medium">{liveFeedback.clarity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${liveFeedback.clarity}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Relevance</span>
                      <span className="font-medium">{liveFeedback.relevance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${liveFeedback.relevance}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span className="font-medium">{liveFeedback.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${liveFeedback.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">AI Insight:</p>
                    <p className="text-sm text-blue-700 mt-1">{liveFeedback.feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Complete Modal */}
        <AnimatePresence>
          {sessionPhase === 'conclusion' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {isAnalyzing ? (
                    <Brain className="h-8 w-8 text-white animate-pulse" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {isAnalyzing ? 'AI Analyzing Session...' : 'Session Complete!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isAnalyzing 
                    ? 'Our AI is analyzing your performance and generating personalized feedback...'
                    : 'Great job! Your discussion session has been analyzed. Redirecting to your detailed AI feedback...'
                  }
                </p>
                
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GDSimulation;