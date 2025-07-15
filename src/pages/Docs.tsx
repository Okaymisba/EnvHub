// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Terminal, Shield, Users, Zap, GitBranch } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const Docs = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        'Quick Start Guide',
        'Installation',
        'Your First Project',
        'Environment Setup'
      ]
    },
    {
      title: 'CLI Documentation',
      icon: Terminal,
      items: [
        'Installation & Setup',
        'Authentication',
        'Project Management',
        'Environment Variables',
        'Advanced Commands'
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        'Encryption Overview',
        'Access Control',
        'Best Practices',
        'Compliance'
      ]
    },
    {
      title: 'Team Collaboration',
      icon: Users,
      items: [
        'Inviting Team Members',
        'Role Management',
        'Sharing Projects',
        'Access Permissions'
      ]
    },
    {
      title: 'API Reference',
      icon: Zap,
      items: [
        'Authentication API',
        'Projects API',
        'Environment Variables API',
        'Webhooks'
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-900/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-16">
        <Helmet>
          <title>Documentation - EnvHub</title>
          <meta
            name="description"
            content="Complete documentation for EnvHub - Learn how to manage your environment variables securely with our comprehensive guides and API reference."
          />
        </Helmet>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-24 animate-fade-in-up delay-200">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about using EnvHub to manage your environment variables securely and efficiently.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white mb-8 animate-fade-in-up delay-300">
              Quick Links
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up delay-400">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Quick Start</h3>
                  <p className="text-gray-400 mb-4">Get up and running with EnvHub in minutes</p>
                  <Button variant="outline" className="border-gray-700 text-gray hover:bg-gray-800">
                    Start Here
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up delay-500">
                <CardContent className="p-6 text-center">
                  <Terminal className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">CLI Guide</h3>
                  <p className="text-gray-400 mb-4">Learn to use the EnvHub command line interface</p>
                  <Button variant="outline" className="border-gray-700 text-gray hover:bg-gray-800">
                    CLI Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up delay-600">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Security</h3>
                  <p className="text-gray-400 mb-4">Understand our security measures and best practices</p>
                  <Button variant="outline" className="border-gray-700 text-gray hover:bg-gray-800">
                    Security Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white mb-8 animate-fade-in-up delay-700">
              Documentation Sections
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <Card
                  key={index}
                  className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up delay-800"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-400">
                      <section.icon className="w-6 h-6 text-purple-400" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <button className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-left">
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="text-center">
            <Card className="bg-gray-800/50 border-gray-800 animate-fade-in-up delay-900">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Documentation Coming Soon</h3>
                <p className="text-gray-400 mb-6">
                  We're working hard to create comprehensive documentation for EnvHub.
                  In the meantime, feel free to explore the platform and reach out if you have any questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/contact')}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium animate-fade-in-up delay-1000"
                  >
                    Contact Support
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-gray-700 text-gray hover:bg-gray-800 animate-fade-in-up delay-1100"
                  >
                    Try EnvHub Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1100 { animation-delay: 1100ms; }
      `}</style>
    </div>
  );
};

export default Docs;