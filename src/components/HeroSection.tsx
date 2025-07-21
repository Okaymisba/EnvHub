// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
          <span className="text-lg text-gray-400 font-medium">Introducing EnvHub</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          The{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            GitHub for Secrets
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
          Just like GitHub revolutionized code collaboration, 
          EnvHub is transforming how teams manage and secure their secrets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up delay-200">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                     text-white px-8 py-6 text-xl font-bold shadow-xl hover:shadow-purple-500/20 
                     transition-all duration-300 hover:scale-105 group"
          >
            Start Securing Now
            <Shield className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
              onClick={() => window.location.href = 'pricing'}
              variant="outline"
              size="lg"
              className="border-gray-700 text-gray-900 hover:gray px-8 py-6 text-lg sm:text-xl hover:scale-105 group duration-300 transition-all"
          >
            Pricing
          </Button>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Military-grade encryption
          </div>
          <div className="h-1 w-1 bg-gray-700 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            Secure Storage
          </div>
          <div className="h-1 w-1 bg-gray-700 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Instant Setup
          </div>
        </div>
      </div>
    </div>
  );
};
