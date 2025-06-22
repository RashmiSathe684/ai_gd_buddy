import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  Target,
  Edit3,
  Save,
  X,
  Trophy,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserData, UserData } from '../../services/userDataService';
import Loading from '../shared/Loading';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;
      
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        setEditedName(currentUser.displayName || '');
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleSaveProfile = () => {
    // In a real app, you would update the user's profile here
    setIsEditing(false);
  };

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

  if (loading) {
    return <Loading />;
  }

  if (!currentUser || !userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load profile</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Sessions',
      value: userData.sessionStats.completedSessions,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Average Score',
      value: `${userData.sessionStats.averageScore}%`,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Best Score',
      value: `${userData.sessionStats.bestScore}%`,
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Total Speaking Time',
      value: `${userData.sessionStats.totalSpeakingTime} mins`,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-xl font-semibold text-gray-900">{currentUser.displayName || 'User'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSaveProfile}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                <Save className="h-5 w-5" />
                <span>Save</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Overview */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Skills Overview</h3>
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.skillBreakdown.map((skill, index) => {
                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
                const color = colors[index % colors.length];
                
                return (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <span className="font-bold text-gray-700">{skill.score}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${skill.score}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <Target className="h-6 w-6 text-green-600" />
            </div>
            
            <div className="space-y-4">
              {userData.recentSessions.length > 0 ? (
                userData.recentSessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900">{session.topicTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {session.difficulty} • {session.duration} mins • {session.participants} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">{session.performance}%</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-900">
                  {currentUser.metadata.creationTime 
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'
                  }
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Sign In</label>
                <p className="text-gray-900">
                  {currentUser.metadata.lastSignInTime 
                    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;