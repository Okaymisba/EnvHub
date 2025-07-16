// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Helmet } from 'react-helmet-async';
import DocsLayout  from '@/components/DocsLayout';
import { Book, Terminal, Shield, Users, Zap, GitBranch } from 'lucide-react';

const Docs = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        { label: 'Quick Start Guide', path: '/docs/getting-started' },
        { label: 'Installation', path: '/docs/installation' },
        { label: 'Your First Project', path: '/docs/first-project' },
        { label: 'Environment Setup', path: '/docs/environment-setup' }
      ]
    },
    {
      title: 'CLI Documentation',
      icon: Terminal,
      items: [
        { label: 'Installation', path: '/docs/cli/installation#installation' },
        { label: 'Authentication', path: '/docs/cli/installation#authentication' },
        { label: 'Project Management', path: '/docs/cli/installation#project-management' },
        { label: 'Environment Variables', path: '/docs/cli/installation#environment-variables' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Encryption Overview', path: '/docs/security/encryption' },
        { label: 'Access Control', path: '/docs/security/access-control' },
        { label: 'Best Practices', path: '/docs/security/best-practices' },
        { label: 'Compliance', path: '/docs/security/compliance' }
      ]
    },
    {
      title: 'Team Collaboration',
      icon: Users,
      items: [
        { label: 'Getting Started', path: '/docs/team/getting-started' },
        { label: 'Managing Team Members', path: '/docs/team/members' },
        { label: 'Access Control', path: '/docs/team/access-control' },
        { label: 'Best Practices', path: '/docs/team/best-practices' }
      ]
    }
  ];

  return (
    <DocsLayout sections={sections}>
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
        <Helmet>
          <title>Documentation - EnvHub</title>
          <meta
            name="description"
            content="Complete documentation for EnvHub - Learn how to manage your environment variables securely with our comprehensive guides and API reference."
          />
        </Helmet>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to EnvHub Documentation</h1>
                <p className="text-gray-400 mb-8">
                  Everything you need to know about using EnvHub to manage your environment variables securely and efficiently.
                </p>
              </div>

              {/* Getting Started Section */}
              <div className="animate-fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-white mb-6">Getting Started</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Quick Start Guide</h3>
                    <p className="text-gray-400 mb-4">
                      Get up and running with EnvHub in minutes with our comprehensive quick start guide.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Installation</h3>
                    <p className="text-gray-400 mb-4">
                      Learn how to install EnvHub on your system and set up your first project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="animate-fade-in-up delay-200">
                <h2 className="text-2xl font-semibold text-white mb-6">Key Features</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Secure Environment Management</h3>
                    <p className="text-gray-400 mb-4">
                      Manage your environment variables securely with encryption and access control.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
                    <p className="text-gray-400 mb-4">
                      Work with your team seamlessly with role-based access control and collaboration features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentation Sections */}
              <div className="animate-fade-in-up delay-300">
                <h2 className="text-2xl font-semibold text-white mb-6">Documentation Sections</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">CLI Documentation</h3>
                    <p className="text-gray-400 mb-4">
                      Comprehensive guide to using the EnvHub command line interface.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Security</h3>
                    <p className="text-gray-400 mb-4">
                      Learn about our security features and best practices for secure environment management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
};

export default Docs;