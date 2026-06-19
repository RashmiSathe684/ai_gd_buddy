import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Volume2, 
  Target,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  Star,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface SessionAnalysis {
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
  topicTitle?: string;
  duration?: string;
  participants?: number;
}

const FeedbackSummary: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get analysis from session storage (set by GDSimulation)
    const storedAnalysis = sessionStorage.getItem('sessionAnalysis');
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error('Error parsing session analysis:', error);
      }
    }
    setLoading(false);
  }, []);

  const sessionData = {
    topic: analysis?.topicTitle || 'Generative AI & Deepfakes: The Death of Digital Trust?',
    duration: analysis?.duration || '6:45',
    date: new Date().toLocaleDateString(),
    participants: analysis?.participants || 3
  };

  // Convert metrics to skill breakdown format
  const skillBreakdown = analysis ? [
    { skill: 'Communication', score: analysis.metrics.clarity, maxScore: 100, color: '#3B82F6' },
    { skill: 'Critical Thinking', score: analysis.metrics.criticalThinking, maxScore: 100, color: '#10B981' },
    { skill: 'Leadership', score: analysis.metrics.leadership, maxScore: 100, color: '#F59E0B' },
    { skill: 'Active Listening', score: analysis.metrics.activeListening, maxScore: 100, color: '#8B5CF6' },
    { skill: 'Confidence', score: analysis.metrics.confidence, maxScore: 100, color: '#EF4444' }
  ] : [];

  const participationData = analysis ? [
    { name: 'Your Participation', value: analysis.metrics.participation, color: '#3B82F6' },
    { name: 'Others', value: 100 - analysis.metrics.participation, color: '#E5E7EB' }
  ] : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 80) return 'from-blue-500 to-cyan-600';
    if (score >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading AI Analysis...</h2>
          <p className="text-gray-600">Processing your session feedback</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Not Available</h2>
          <p className="text-gray-600 mb-4">Unable to load session analysis</p>
          <Link to="/topics" className="text-blue-600 hover:text-blue-700 font-medium">
            Start a new session →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.overallScore)} text-white font-semibold text-lg mb-4`}>
            <Brain className="h-6 w-6 mr-2" />
            AI Analysis Score: {analysis.overallScore}%
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI-Powered Session Analysis
          </h1>
          <p className="text-xl text-gray-600">{sessionData.topic}</p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{sessionData.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>{sessionData.participants} participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>AI Powered</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-200">
            <Download className="h-5 w-5" />
            <span>Download AI Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-all duration-200">
            <Share2 className="h-5 w-5" />
            <span>Share Results</span>
          </button>
          <Link 
            to="/topics"
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-all duration-200"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Practice Again</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Skill Analysis */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                AI Skill Analysis
              </h3>
              
              <div className="space-y-6">
                {skillBreakdown.map((skill, index) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <span className={`font-bold text-lg ${getScoreColor(skill.score)}`}>
                        {skill.score}%
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.score}%` }}
                        transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Participation Overview */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Participation Analysis</h3>
              
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {participationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Detailed Feedback */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-blue-600" />
              AI Detailed Feedback
            </h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-blue-500">
              <p className="text-gray-800 leading-relaxed">{analysis.detailedFeedback}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI-Identified Strengths */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI-Identified Strengths</h3>
              </div>
              
              <div className="space-y-4">
                {analysis.strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <Star className="h-5 w-5 text-green-600 mt-0.5" />
                    <p className="text-gray-800">{strength}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Improvement Suggestions */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Improvement Suggestions</h3>
              </div>
              
              <div className="space-y-4">
                {analysis.improvements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                  >
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-gray-800">{improvement}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Key Moments Analysis */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-purple-600" />
              AI Key Moments Analysis
            </h3>
            
            <div className="space-y-4">
              {analysis.keyMoments.map((moment, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    moment.type === 'strength' 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{moment.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      moment.type === 'strength'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {moment.type === 'strength' ? 'AI Strength' : 'AI Opportunity'}
                    </span>
                  </div>
                  <p className="text-gray-800">{moment.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <Brain className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready for Your Next AI-Powered Challenge?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Based on your AI analysis, we recommend continuing with similar topics to strengthen your 
              {analysis.overallScore >= 80 ? ' advanced' : ' intermediate'}-level discussion skills.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topics"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Explore AI Topics</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 border border-white/20"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FeedbackSummary;