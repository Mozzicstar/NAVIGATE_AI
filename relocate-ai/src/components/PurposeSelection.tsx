import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Purpose } from '../types';
import { purposeIcons } from '../constants';

interface PurposeSelectionProps {
  onPurposeSelect: (purpose: Purpose) => void;
}

const PurposeSelection: React.FC<PurposeSelectionProps> = ({ onPurposeSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">What brings you abroad?</h2>
          <p className="text-gray-600 text-lg">Select your purpose to get personalized guidance</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(purposeIcons).map(([key, { icon: Icon, label, color }]) => (
            <button
              key={key}
              onClick={() => onPurposeSelect(key as Purpose)}
              className={`group relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-${color}-500 hover:shadow-xl transition-all duration-300 text-left transform hover:scale-105`}
            >
              <div className={`w-16 h-16 bg-${color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${color}-500 transition-colors`}>
                <Icon className={`w-8 h-8 text-${color}-600 group-hover:text-white transition-colors`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
              <p className="text-sm text-gray-600">
                {key === 'tourism' && 'Vacation, sightseeing, leisure travel'}
                {key === 'work' && 'Employment, business, professional'}
                {key === 'education' && 'University, college, courses'}
                {key === 'health' && 'Medical treatment, wellness'}
                {key === 'relocation' && 'Permanent move, immigration'}
              </p>
              <ChevronRight className={`absolute top-8 right-8 w-6 h-6 text-gray-400 group-hover:text-${color}-500`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurposeSelection;