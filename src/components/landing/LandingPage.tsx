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
  Mic,
  BarChart3,
  Target,
  Clock,
  Globe,
  Brain,
  Zap
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
      icon: Mic,
      title: 'Voice Analysis',
      description: 'Get real-time feedback on your speaking pace, clarity, and communication effectiveness',
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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'MBA Student',
      content: 'This platform helped me ace my group discussion rounds. The AI feedback is incredibly accurate!',
      rating: 5,
      avatar: '👩‍🎓'
    },
    {
      name: 'Rahul Sharma',
      role: 'Job Seeker',
      content: 'Improved my confidence significantly. The practice sessions feel so real and engaging.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Priya Patel',
      role: 'Corporate Trainer',
      content: 'Excellent tool for developing communication skills. My team loves using this platform.',
      rating: 5,
      avatar: '👩‍💻'
    }
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

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
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
        className="space-y-20"
      >
        {/* Hero Section */}
        <section className="pt-20 pb-16">
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
                    Practice group discussions with intelligent AI participants, get real-time feedback, 
                    and boost your confidence for interviews, MBA admissions, and professional success.
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
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-3"
                  >
                    <BookOpen className="h-6 w-6" />
                    <span>Learn More</span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                {/* Dynamic Virtual Discussion Space Visualization */}
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
                        <h3 className="font-semibold text-gray-900">Virtual Discussion Space</h3>
                        <p className="text-gray-600 text-sm">AI-Powered Group Discussion</p>
                      </div>
                    </div>

                    {/* Interconnected Participants Visualization */}
                    <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Central Hub */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                        >
                          <Zap className="h-4 w-4 text-white" />
                        </motion.div>
                        
                        {/* Participant Nodes */}
                        {[0, 1, 2, 3].map((index) => {
                          const angle = (index * 90) * (Math.PI / 180);
                          const radius = 40;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          
                          return (
                            <motion.div
                              key={index}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                delay: index * 0.5 
                              }}
                              className="absolute w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                transform: `translate(${x}px, ${y}px)`
                              }}
                            >
                              {index === 0 ? 'You' : `AI${index}`}
                            </motion.div>
                          );
                        })}
                        
                        {/* Connection Lines */}
                        <svg className="absolute inset-0 w-full h-full">
                          {[0, 1, 2, 3].map((index) => {
                            const angle = (index * 90) * (Math.PI / 180);
                            const radius = 40;
                            const x = Math.cos(angle) * radius + 64;
                            const y = Math.sin(angle) * radius + 64;
                            
                            return (
                              <motion.line
                                key={index}
                                x1="64"
                                y1="64"
                                x2={x}
                                y2={y}
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ 
                                  duration: 1.5, 
                                  delay: index * 0.3,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                            );
                          })}
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
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
        <section id="features" className="py-20">
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

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Transform Your Communication Skills
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  Join thousands of successful professionals who have improved their group discussion skills with our platform.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-6 w-6 text-green-300" />
                      <span className="text-white">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Skill Development</h3>
                      <Globe className="h-6 w-6 text-white/70" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>Communication Skills</span>
                          <span>92%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '92%' }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>Leadership</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>Critical Thinking</span>
                          <span>88%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '88%' }}
                            transition={{ delay: 0.9, duration: 1 }}
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-4xl font-bold text-white">
                Ready to Master Group Discussions?
              </h2>
              <p className="text-xl text-gray-300">
                Start your journey today and join thousands of successful professionals
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">AI GD Helper Buddy</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Master group discussions with AI-powered practice sessions and real-time feedback.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Features</p>
                  <p>FAQ</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>About Us</p>
                  <p>Contact</p>
                  <p>Privacy Policy</p>
                  <p>Terms of Service</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Help Center</p>
                  <p>Community</p>
                  <p>Tutorials</p>
                  <p>Contact Support</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 AI GD Helper Buddy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;