import React from 'react';
import { Plane, CheckCircle2, Shield, Zap, Info, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl mb-6 animate-bounce">
            <Plane className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            RelocateAI
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto font-light mb-8">
            Your AI-Powered Relocation Command Center
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Verified data. Zero hallucination. Complete peace of mind.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Sources Only</h3>
            <p className="text-white/80">Every requirement backed by official government data with source attribution</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-red-400 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Safety First</h3>
            <p className="text-white/80">Real-time risk assessment, scam warnings, and legal compliance guidance</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div className="w-14 h-14 bg-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Automation</h3>
            <p className="text-white/80">AI-generated timelines, budget breakdowns, and personalized checklists</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-white/80">Verified Checks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-white/80">Source Attribution</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-white/80">AI Assistant</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-1">Zero</div>
            <div className="text-sm text-white/80">Hallucination</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center px-10 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105"
          >
            Start Your Journey
            <ChevronRight className="ml-2 w-6 h-6" />
          </button>
          <p className="mt-6 text-white/70 text-sm">No signup required • Free to use • Instant results</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/90">
              <strong>Disclaimer:</strong> RelocateAI provides informational guidance based on official sources. Always verify requirements with relevant embassies and authorities. This is not legal or immigration advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;