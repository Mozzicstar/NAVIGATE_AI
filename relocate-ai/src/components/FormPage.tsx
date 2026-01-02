import React from 'react';
import { MapPin, Calendar, Clock, Plane, Loader2 } from 'lucide-react';
import type { UserContext, Destination } from '../types';

interface FormPageProps {
  userContext: UserContext;
  onUserContextChange: (context: UserContext) => void;
  onDestinationSelect: (destination: Destination) => void;
  loading: boolean;
}

const FormPage: React.FC<FormPageProps> = ({
  userContext,
  onUserContextChange,
  onDestinationSelect,
  loading
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Plan Your Relocation</h2>
          <p className="text-gray-600 mb-8">Tell us about your journey for accurate, personalized guidance</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Where are you traveling from?
              </label>
              <input
                type="text"
                value={userContext.origin}
                onChange={(e) => onUserContextChange({ ...userContext, origin: e.target.value })}
                placeholder="e.g., Lagos, Nigeria"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Planned departure date (optional)
              </label>
              <input
                type="date"
                value={userContext.departureDate}
                onChange={(e) => onUserContextChange({ ...userContext, departureDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Duration of stay (days)
              </label>
              <input
                type="number"
                value={userContext.duration}
                onChange={(e) => onUserContextChange({ ...userContext, duration: e.target.value })}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Plane className="inline w-4 h-4 mr-1" />
                Select your destination
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onDestinationSelect('UAE')}
                  className="group p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left transform hover:scale-105"
                >
                  <div className="text-4xl mb-2">🇦🇪</div>
                  <div className="font-bold text-gray-900 mb-1">Dubai, UAE</div>
                  <div className="text-sm text-gray-600">Visa on Arrival</div>
                  <div className="mt-2 text-xs text-blue-600 font-semibold">→ Generate Plan</div>
                </button>
                <button
                  onClick={() => onDestinationSelect('USA')}
                  className="group p-6 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left transform hover:scale-105"
                >
                  <div className="text-4xl mb-2">🇺🇸</div>
                  <div className="font-bold text-gray-900 mb-1">United States</div>
                  <div className="text-sm text-gray-600">Visa Required</div>
                  <div className="mt-2 text-xs text-purple-600 font-semibold">→ Generate Plan</div>
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <span className="text-gray-700 font-semibold text-lg">Generating your personalized plan...</span>
              <span className="text-gray-500 text-sm mt-2">Analyzing requirements, calculating risks, creating timeline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;