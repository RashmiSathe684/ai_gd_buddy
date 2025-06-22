import React, { useState, useEffect } from 'react';
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
  Calendar,
  Zap,
  Brain
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  subscribeToUserData, 
  initializeUserData, 
  UserData 
} from '../../services/userDataService';
import ProgressCharts from './ProgressCharts';
import SessionHistory from './SessionHistory';
import Loading from '../shared/Loading';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const initializeAndSubscribe = async () => {
      try {
        // Initialize user data if it doesn't exist
        await initializeUserData(currentUser);
        
        // Subscribe to real-time updates
        const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
          setUserData(data);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing user data:', error);
        setLoading(false);
      }
    };

    const unsubscribePromise = initializeAndSubscribe();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Sessions Completed',
      value: userData.sessionStats.completedSessions.toString(),
      change: `+${Math.max(0, userData.sessionStats.completedSessions - 20)} this week`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Average Score',
      value: `${userData.sessionStats.averageScore}%`,
      change: `${userData.sessionStats.improvementPercentage >= 0 ? '+' : ''}${userData.sessionStats.improvementPercentage}% improvement`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Speaking Time',
      value: `${Math.round(userData.sessionStats.totalSpeakingTime / Math.max(1, userData.sessionStats.completedSessions))} mins`,
      change: 'Average per session',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
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
            Welcome back, {currentUser?.displayName || 'User'}!
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

        {/* Stats Grid - Removed Topics Mastered */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
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
            <ProgressCharts userData={userData} />
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
              {userData.recentSessions.length > 0 ? (
                userData.recentSessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="p-4 bg-white/50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{session.topicTitle}</h4>
                      <span className="text-xl font-bold text-blue-600">{session.performance}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.difficulty === 'Advanced' 
                          ? 'bg-red-100 text-red-800'
                          : session.difficulty === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {session.difficulty}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Recent</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No sessions yet</p>
                  <Link 
                    to="/topics"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Start your first session →
                  </Link>
                </div>
              )}
            </div>
            
            {userData.recentSessions.length > 0 && (
              <Link 
                to="/topics"
                className="block w-full mt-4 text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
              >
                Explore More Topics
              </Link>
            )}
          </motion.div>
        </div>

        {/* Session History */}
        <motion.div variants={itemVariants}>
          <SessionHistory userData={userData} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready for Your Next Challenge?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {userData.sessionStats.completedSessions === 0 
                ? "Start your first group discussion session and begin your journey to mastering communication skills."
                : `Based on your ${userData.sessionStats.averageScore}% average score, we recommend continuing with ${userData.sessionStats.averageScore >= 80 ? 'advanced' : 'intermediate'}-level topics.`
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/topics"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Explore Topics</span>
                <BookOpen className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;