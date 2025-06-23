import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Award, 
  Play, 
  CheckCircle,
  ArrowRight,
  BookOpen,
  BarChart3,
  Target,
  Clock,
  Globe,
  Brain,
  Zap,
  FileText
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Discussions',
      description: 'Practice with intelligent AI participants that simulate real group discussion scenarios',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Advanced Text Analysis',
      description: 'Get real-time feedback on your chat contributions with detailed analysis and improvement suggestions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics and personalized improvement suggestions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Skill Development',
      description: 'Focus on specific skills like leadership, critical thinking, and active listening',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    'Practice anytime, anywhere with AI participants',
    'Receive instant feedback on your performance',
    'Track progress with detailed analytics',
    'Access 100+ curated discussion topics',
    'Improve confidence and communication skills',
    'Prepare for interviews and assessments'
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI GD Helper Buddy</span>
            </div>

            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Login / Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24"
      >
        {/* Hero Section */}
        <section className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Master Group
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {' '}Discussions
                    </span>
                    <br />with AI
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Master your interview skills through realistic group discussions - Perfect for campus placement preparation
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                    >
                      <Play className="h-6 w-6" />
                      <span>Practice GD Now</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                {/* Interactive Group Discussion Visualization */}
                <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Live Group Discussion</h3>
                        <p className="text-gray-600 text-sm">Real-time Text Interactions</p>
                      </div>
                    </div>

                    {/* Dynamic Chat Simulation */}
                    <div className="relative h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 overflow-hidden">
                      <div className="space-y-3">
                        {/* Animated Chat Messages */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                            A
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-xs">
                            <p className="text-xs text-gray-800">AI has revolutionized healthcare...</p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1, duration: 0.8 }}
                          className="flex items-start space-x-2 justify-end"
                        >
                          <div className="bg-blue-500 text-white rounded-lg px-3 py-2 shadow-sm max-w-xs">
                            <p className="text-xs">I agree, but we must consider ethics...</p>
                          </div>
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            You
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5, duration: 0.8 }}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                            M
                          </div>
                          <div className="bg-purple-100 rounded-lg px-3 py-2 shadow-sm max-w-xs">
                            <p className="text-xs text-purple-800">Great points! Let's explore...</p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2, duration: 0.8 }}
                          className="flex items-start space-x-2 justify-end"
                        >
                          <div className="bg-green-100 rounded-lg px-3 py-2 shadow-sm max-w-xs">
                            <p className="text-xs text-green-800">What about data privacy?</p>
                          </div>
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                            S
                          </div>
                        </motion.div>
                      </div>

                      {/* Typing Indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-2 left-4 flex items-center space-x-1"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="text-xs text-gray-500 ml-2">AI typing...</span>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">Live</p>
                        <p className="text-xs text-gray-600">Session</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">4</p>
                        <p className="text-xs text-gray-600">Participants</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">AI</p>
                        <p className="text-xs text-gray-600">Powered</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -left-6 top-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <TrendingUp className="h-8 w-8 text-white" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -right-8 bottom-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Clock className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose AI GD Helper Buddy?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of group discussion practice with our cutting-edge AI technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-gray-900 to-blue-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-4xl font-bold text-white">
                Ready to Master Group Discussions?
              </h2>
              <p className="text-xl text-gray-300">
                Elevate your group discussion performance with AI-powered practice sessions tailored for interview success
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                  >
                    <Play className="h-6 w-6" />
                    <span>Start Free Practice</span>
                    <ArrowRight className="h-6 w-6" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">AI GD Helper Buddy</span>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2025 AI GD Helper Buddy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;