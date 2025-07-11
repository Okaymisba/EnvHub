// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Database, Lock, AlertTriangle, TrendingUp, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "End-to-end encryption with zero-trust architecture ensures your secrets are never exposed, even to us.",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    icon: GitBranch,
    title: "CLI Integration",
    description: "Seamlessly sync with your GitHub, GitLab, or Bitbucket repositories with EnvHub CLI.",
    gradient: "from-purple-600 to-pink-500"
  },
  {
    icon: Lock,
    title: "Fine-Grained Access Control",
    description: "Define who can access what with role-based permissions and just-in-time access approvals.",
    gradient: "from-emerald-600 to-teal-500"
  }
];

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

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
      {/* Background Effects - keep the same */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-900/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      {/* New Hero Section */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 pt-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
              <GitBranch className="w-8 h-8 text-purple-400" />
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

          {/* Stats Section - modified to be more impactful */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
              <span>The Secret Crisis</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up delay-100">
              Every month, millions of secrets like API keys, passwords, and tokens are accidentally exposed — putting entire systems at risk.
            </p>
          </div>

          {/* Alert Section - Now with consistent background */}
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
        </div>

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

        {/* Features Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Enterprise-Grade Secret Management
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to secure your application's sensitive data
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="relative group"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r rounded-xl opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 blur" />
                  <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 group-hover:border-transparent transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${feature.gradient} text-white`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400"> 2025 EnvHub</p>
            <div className="flex gap-8">
              <button onClick={() => navigate('/pricing')} className="text-gray-400 hover:text-purple-400 transition-colors">
                Pricing
              </button>
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy
              </button>
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms
              </button>
              <button onClick={() => navigate('/about')} className="text-gray-400 hover:text-purple-400 transition-colors">
                About us
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s forwards;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2;}
          50% { opacity: 0.4;}
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
};