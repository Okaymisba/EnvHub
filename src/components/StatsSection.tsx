
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsSectionProps {
  onGetStarted: () => void;
}

const leakStats = [
  {
    value: "3.25M",
    label: "secrets leaked/month on GitHub",
    sublabel: "(2024)",
    icon: AlertTriangle,
    color: "text-red-400"
  },
  {
    value: "1.07M",
    label: "auth keys/month detected",
    sublabel: "by GitGuardian (2023)",
    icon: TrendingUp,
    color: "text-orange-400"
  },
  {
    value: "46K+",
    label: "OpenAI API keys exposed monthly",
    sublabel: "a 1,212× spike",
    icon: Lock,
    color: "text-yellow-400"
  }
];

export const StatsSection: React.FC<StatsSectionProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Stats Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
          <span>The Secret Crisis</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-100">
          Every month, millions of secrets like API keys, passwords, and tokens are accidentally exposed — putting entire systems at risk.
        </p>
      </div>

      {/* Alert Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {leakStats.map((stat, index) => (
          <Card key={index}
            className="bg-black border border-slate-800 hover:border-purple-500/50 transition-all duration-300
                          animate-fade-in-up group backdrop-blur-sm"
            style={{ animationDelay: `${index * 100 + 200}ms` }}>
            <CardContent className="p-6">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
              <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm font-medium">
                {stat.label}
              </div>
              <div className="text-gray-500 text-xs">
                {stat.sublabel}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <blockquote className="text-lg text-gray-300 text-center italic max-w-3xl mx-auto border-l-4 border-purple-500/50 pl-4 animate-fade-in-up delay-300 mb-16">
        "90% of secrets remain valid for at least 5 days — and 70% are still live after 2 years."
        <footer className="text-gray-500 text-sm mt-2">— HelpNetSecurity</footer>
      </blockquote>

      {/* Main Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Stop Being the Next Statistic
          </span>
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
          EnvHub provides military-grade encryption and real-time monitoring to protect your secrets before they become part of these statistics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                       text-white px-8 py-6 text-lg sm:text-xl font-bold shadow-xl
                       transition-all duration-300 hover:scale-105"
          >
            Secure Your Secrets Now
            <Shield className="ml-2 w-5 h-5" />
          </Button>
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            size="lg"
            className="border-gray-700 text-gray-900 hover:gray px-8 py-6 text-lg sm:text-xl hover:scale-105 group duration-300 transition-all"
          >
            Pricing
          </Button>
        </div>
      </div>
    </div>
  );
};
