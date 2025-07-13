
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Card className="bg-black/50 border-purple-500/20 p-8 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't Wait Until Your Secrets Are Exposed
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who trust EnvHub to protect their sensitive data.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                text-white px-8 py-6 text-lg sm:text-xl font-bold shadow-xl
                transition-all duration-300 hover:scale-105 flex items-center"
            >
              Start Protecting Your Secrets
              <Lock className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-400 mt-4">No credit card required • Set up in 2 minutes</p>
        </div>
      </Card>
    </div>
  );
};
