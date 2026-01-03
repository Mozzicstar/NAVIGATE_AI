import React from 'react';
import { TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { ChecklistCategory } from '../types';

interface ProgressChartProps {
  checklist: ChecklistCategory[];
  totalCount: number;
  completedCount: number;
  progress: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  checklist,
  totalCount,
  completedCount,
  progress
}) => {
  // Calculate category progress
  const categoryProgress = checklist.map(cat => {
    const completed = cat.items.filter(item => item.checked).length;
    const total = cat.items.length;
    return {
      name: cat.category,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      priority: cat.priority
    };
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Clock className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle2 className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Progress Visualization</h3>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
          <span>{completedCount} completed</span>
          <span>{totalCount - completedCount} remaining</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Category Breakdown</h4>
        {categoryProgress.map((cat, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
              {getPriorityIcon(cat.priority)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                <span className="text-xs text-gray-600">{cat.completed}/{cat.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${getPriorityColor(cat.priority)}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-700 w-12 text-right">
              {cat.percentage}%
            </div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Milestones</h4>
        <div className="space-y-2">
          <div className={`flex items-center space-x-2 ${progress >= 25 ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">25% - Initial planning complete</span>
          </div>
          <div className={`flex items-center space-x-2 ${progress >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">50% - Halfway there!</span>
          </div>
          <div className={`flex items-center space-x-2 ${progress >= 75 ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">75% - Almost ready</span>
          </div>
          <div className={`flex items-center space-x-2 ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">100% - Ready to relocate!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;