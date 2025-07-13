// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Terminal, Shield, Users, Zap, GitBranch } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-950 text-white">
      <Helmet>
        <title>Documentation - EnvHub</title>
        <meta
          name="description"
          content="Complete documentation for EnvHub - Learn how to manage your environment variables securely with our comprehensive guides and API reference."
        />
      </Helmet>

      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold">EnvHub Docs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about using EnvHub to manage your environment variables securely and efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Quick Start</h3>
              <p className="text-gray-400 mb-4">Get up and running with EnvHub in minutes</p>
              <Button variant="outline" className="border-gray-700 text-gray hover:bg-gray-800">
                Start Here
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Terminal className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">CLI Guide</h3>
              <p className="text-gray-400 mb-4">Learn to use the EnvHub command line interface</p>
              <Button variant="outline" className="border-gray-700 text-gray hover:bg-gray-800">
                CLI Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
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

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-400">
                  <section.icon className="w-6 h-6 text-purple-300" />
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

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center">
          <Card className="bg-yellow-500/10 border-yellow-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Documentation Coming Soon</h3>
              <p className="text-gray-300 mb-6">
                We're working hard to create comprehensive documentation for EnvHub.
                In the meantime, feel free to explore the platform and reach out if you have any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/contact')}
                  className="bg-yellow-500 text-black hover:bg-yellow-400 font-medium"
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Try EnvHub Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Docs;