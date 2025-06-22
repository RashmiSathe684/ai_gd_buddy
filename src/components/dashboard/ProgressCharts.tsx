import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { UserData } from '../../services/userDataService';

interface ProgressChartsProps {
  userData: UserData;
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ userData }) => {
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
              <LineChart data={userData.progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="week" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  domain={[0, 100]}
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

        {/* Enhanced Skill Breakdown with proper visualization */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
            Skill Breakdown
          </h4>
          <div className="space-y-4">
            {userData.skillBreakdown.map((skill, index) => {
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
              const color = colors[index % colors.length];
              
              return (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 text-sm">{skill.skill}</span>
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
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">
            {userData.sessionStats.improvementPercentage >= 0 ? '+' : ''}{userData.sessionStats.improvementPercentage}%
          </p>
          <p className="text-sm text-gray-600">Improvement</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">{userData.sessionStats.bestScore}%</p>
          <p className="text-sm text-gray-600">Best Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <p className="text-2xl font-bold text-purple-600">{userData.sessionStats.completedSessions}</p>
          <p className="text-sm text-gray-600">Total Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;