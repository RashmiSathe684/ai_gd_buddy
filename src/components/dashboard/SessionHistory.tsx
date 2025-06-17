import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Award, Eye } from 'lucide-react';

const SessionHistory: React.FC = () => {
  const sessions = [
    {
      id: 1,
      topic: 'Artificial Intelligence in Healthcare',
      date: '2024-01-15',
      duration: '8 mins',
      score: 92,
      participants: 4,
      difficulty: 'Advanced',
      status: 'completed'
    },
    {
      id: 2,
      topic: 'Sustainable Energy Solutions',
      date: '2024-01-12',
      duration: '6 mins',
      score: 88,
      participants: 3,
      difficulty: 'Intermediate',
      status: 'completed'
    },
    {
      id: 3,
      topic: 'Future of Remote Work',
      date: '2024-01-10',
      duration: '7 mins',
      score: 85,
      participants: 5,
      difficulty: 'Advanced',
      status: 'completed'
    },
    {
      id: 4,
      topic: 'Digital Privacy Rights',
      date: '2024-01-08',
      duration: '5 mins',
      score: 90,
      participants: 3,
      difficulty: 'Intermediate',
      status: 'completed'
    },
    {
      id: 5,
      topic: 'Climate Change Impact',
      date: '2024-01-05',
      duration: '9 mins',
      score: 87,
      participants: 6,
      difficulty: 'Advanced',
      status: 'completed'
    }
  ];

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

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Session History</h3>
        <Calendar className="h-6 w-6 text-blue-600" />
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/50 rounded-xl border border-gray-100 hover:bg-white/70 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{session.topic}</h4>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration}</span>
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
                  <p className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                    {session.score}%
                  </p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>

                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
          View All Sessions →
        </button>
      </div>
    </div>
  );
};

export default SessionHistory;