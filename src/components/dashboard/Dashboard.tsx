import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Play, 
  Users,
  Target,
  Calendar
} from 'lucide-react';
import ProgressCharts from './ProgressCharts';
import SessionHistory from './SessionHistory';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Sessions Completed',
      value: '24',
      change: '+3 this week',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Average Score',
      value: '85%',
      change: '+12% improvement',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Topics Mastered',
      value: '8',
      change: '+2 this month',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Speaking Time',
      value: '4.2 mins',
      change: 'Average per session',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentTopics = [
    { name: 'Climate Change Solutions', difficulty: 'Advanced', score: 92 },
    { name: 'Digital Privacy Rights', difficulty: 'Intermediate', score: 88 },
    { name: 'Future of Work', difficulty: 'Advanced', score: 85 },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back! Ready to practice?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your progress and continue improving your group discussion skills
          </p>
          
          <Link to="/topics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Play className="h-6 w-6" />
              <span>Start New Session</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white text-sm font-medium`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Charts */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ProgressCharts />
          </motion.div>

          {/* Recent Topics */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Topics</h3>
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            
            <div className="space-y-4">
              {recentTopics.map((topic, index) => (
                <div key={index} className="p-4 bg-white/50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{topic.name}</h4>
                    <span className="text-xl font-bold text-blue-600">{topic.score}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topic.difficulty === 'Advanced' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {topic.difficulty}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              to="/topics"
              className="block w-full mt-4 text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
            >
              Explore More Topics
            </Link>
          </motion.div>
        </div>

        {/* Session History */}
        <motion.div variants={itemVariants}>
          <SessionHistory />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;