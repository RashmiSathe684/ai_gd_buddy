import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const ProgressCharts: React.FC = () => {
  const progressData = [
    { week: 'Week 1', score: 72, sessions: 3 },
    { week: 'Week 2', score: 76, sessions: 4 },
    { week: 'Week 3', score: 81, sessions: 5 },
    { week: 'Week 4', score: 85, sessions: 6 },
    { week: 'Week 5', score: 88, sessions: 4 },
    { week: 'Week 6', score: 92, sessions: 5 },
  ];

  const skillData = [
    { skill: 'Communication', score: 85 },
    { skill: 'Leadership', score: 78 },
    { skill: 'Analysis', score: 92 },
    { skill: 'Listening', score: 88 },
    { skill: 'Confidence', score: 82 },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Progress Analytics</h3>
        <TrendingUp className="h-6 w-6 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Progress */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            Score Progression
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  domain={[60, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
            Skill Breakdown
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <YAxis 
                  type="category" 
                  dataKey="skill" 
                  stroke="#666"
                  fontSize={12}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="url(#skillGradient)"
                  radius={[0, 6, 6, 0]}
                />
                <defs>
                  <linearGradient id="skillGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">+18%</p>
          <p className="text-sm text-gray-600">Improvement</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">92%</p>
          <p className="text-sm text-gray-600">Best Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <p className="text-2xl font-bold text-purple-600">27</p>
          <p className="text-sm text-gray-600">Total Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;