import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Users, 
  MessageSquare,
  Volume2,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addSession } from '../../services/userDataService';
import VoiceInput from './VoiceInput';
import toast from 'react-hot-toast';

const GDSimulation: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [sessionPhase, setSessionPhase] = useState<'waiting' | 'introduction' | 'discussion' | 'conclusion'>('waiting');
  const [userContributions, setUserContributions] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState({
    participation: 85,
    clarity: 90,
    relevance: 88,
    leadership: 75,
    criticalThinking: 92,
    activeListening: 87,
    confidence: 83
  });

  const aiParticipants = [
    { name: 'Alex Chen', role: 'Technology Advocate', avatar: '👨‍💻' },
    { name: 'Sarah Johnson', role: 'Policy Expert', avatar: '👩‍💼' },
    { name: 'Dr. Mike Rodriguez', role: 'Research Specialist', avatar: '👨‍🔬' },
  ];

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

  // Simulate session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  // Simulate AI participant interactions
  useEffect(() => {
    if (sessionStarted && sessionPhase === 'discussion') {
      const speakingInterval = setInterval(() => {
        setCurrentSpeaker(prev => (prev + 1) % (aiParticipants.length + 1));
      }, 8000);
      return () => clearInterval(speakingInterval);
    }
  }, [sessionStarted, sessionPhase, aiParticipants.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setSessionStarted(true);
    setSessionPhase('introduction');
    setTimeout(() => setSessionPhase('discussion'), 30000); // Move to discussion after 30s
  };

  const endSession = async () => {
    if (!currentUser) return;

    setSessionStarted(false);
    setSessionPhase('conclusion');

    try {
      // Calculate overall score
      const overallScore = Math.round(
        (sessionData.participation + 
         sessionData.clarity + 
         sessionData.relevance + 
         sessionData.leadership + 
         sessionData.criticalThinking + 
         sessionData.activeListening + 
         sessionData.confidence) / 7
      );

      // Save session to database
      await addSession(currentUser.uid, {
        topicId: topicId || '1',
        topicTitle: topic.title,
        metrics: {
          participation: sessionData.participation,
          clarity: sessionData.clarity,
          relevance: sessionData.relevance,
          leadership: sessionData.leadership,
          criticalThinking: sessionData.criticalThinking,
          activeListening: sessionData.activeListening,
          confidence: sessionData.confidence
        },
        overallScore,
        duration: Math.round(timeElapsed / 60),
        difficulty: topic.difficulty,
        participants: aiParticipants.length + 1
      });

      toast.success('Session completed and saved!');
      
      // Navigate to feedback page after a short delay
      setTimeout(() => {
        navigate(`/feedback/${topicId}`);
      }, 2000);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session data');
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      setUserContributions(prev => [...prev, transcript]);
      
      // Simulate real-time feedback updates
      setSessionData(prev => ({
        ...prev,
        participation: Math.min(100, prev.participation + 2),
        clarity: Math.min(100, prev.clarity + 1),
        confidence: Math.min(100, prev.confidence + 1)
      }));
    }
  };

  const getPhaseTitle = () => {
    switch (sessionPhase) {
      case 'introduction':
        return 'Introduction Phase';
      case 'discussion':
        return 'Active Discussion';
      case 'conclusion':
        return 'Conclusion Phase';
      default:
        return 'Ready to Start';
    }
  };

  const getPhaseColor = () => {
    switch (sessionPhase) {
      case 'introduction':
        return 'from-blue-500 to-cyan-500';
      case 'discussion':
        return 'from-green-500 to-emerald-500';
      case 'conclusion':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Discussion Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Control Panel */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Discussion Controls</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5" />
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
                    <span>Start Discussion</span>
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isRecording
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      <span>{isRecording ? 'Stop Speaking' : 'Start Speaking'}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={endSession}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200"
                    >
                      <Square className="h-5 w-5" />
                      <span>End Session</span>
                    </motion.button>
                  </>
                )}
              </div>

              {sessionStarted && (
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">{userContributions.length}</p>
                    <p className="text-sm text-gray-600">Your Points</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">{sessionData.participation}%</p>
                    <p className="text-sm text-gray-600">Engagement</p>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Component */}
            {sessionStarted && (
              <VoiceInput 
                isRecording={isRecording}
                onTranscript={handleVoiceInput}
              />
            )}

            {/* Live Transcript */}
            {sessionStarted && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Live Discussion</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {userContributions.map((contribution, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          You
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{contribution}</p>
                          <p className="text-xs text-gray-500 mt-1">Just now</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* AI Participant Messages (Simulated) */}
                  {sessionPhase === 'discussion' && (
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          👨‍💻
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Alex Chen</p>
                          <p className="text-gray-800">AI has shown remarkable accuracy in diagnostic imaging, particularly in radiology. Studies show AI can detect certain conditions faster than human radiologists.</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Participants</h3>
              
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  currentSpeaker === 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50'
                }`}>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    You
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">You</p>
                    <p className="text-sm text-gray-600">Participant</p>
                  </div>
                  {currentSpeaker === 0 && <Volume2 className="h-5 w-5 text-blue-600 animate-pulse" />}
                </div>

                {aiParticipants.map((participant, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      currentSpeaker === index + 1 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-lg">
                      {participant.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-600">{participant.role}</p>
                    </div>
                    {currentSpeaker === index + 1 && <Volume2 className="h-5 w-5 text-green-600 animate-pulse" />}
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

            {/* Real-time Performance */}
            {sessionStarted && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Live Performance</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Clarity: {sessionData.clarity}%</p>
                      <p className="text-xs text-gray-600">Excellent articulation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Participation: {sessionData.participation}%</p>
                      <p className="text-xs text-gray-600">Great engagement level</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Leadership: {sessionData.leadership}%</p>
                      <p className="text-xs text-gray-600">Try taking more initiative</p>
                    </div>
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
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Great job! Your discussion session has been recorded and analyzed. 
                  Redirecting to your detailed feedback...
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