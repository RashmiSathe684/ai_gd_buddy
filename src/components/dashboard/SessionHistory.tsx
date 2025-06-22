import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Award } from 'lucide-react';
import { UserData } from '../../services/userDataService';

interface SessionHistoryProps {
  userData: UserData;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ userData }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recent';
    
    // Handle Firestore timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle regular date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    
    return 'Recent';
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Session History</h3>
        <Calendar className="h-6 w-6 text-blue-600" />
      </div>

      <div className="space-y-4">
        {userData.sessionHistory.length > 0 ? (
          userData.sessionHistory.slice(0, 5).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/50 rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{session.topicTitle}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.duration} mins</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{session.participants} participants</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                  
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${getScoreColor(session.overallScore)}`}>
                      {session.overallScore}%
                    </p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h4>
            <p className="text-gray-600 mb-4">Start your first group discussion to see your history here</p>
          </div>
        )}
      </div>

      {userData.sessionHistory.length > 5 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            View All Sessions →
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;