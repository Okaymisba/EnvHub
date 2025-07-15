import React from 'react';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '@/components/DocsLayout';
import { Book, Terminal, Shield, Users, Zap, GitBranch } from 'lucide-react';

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
      { label: 'Installation & Setup', path: '/docs/cli/installation' },
      { label: 'Authentication', path: '/docs/cli/authentication' },
      { label: 'Project Management', path: '/docs/cli/project-management' },
      { label: 'Environment Variables', path: '/docs/cli/variables' },
      { label: 'Advanced Commands', path: '/docs/cli/advanced' }
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

export const QuickStart = () => {
  return (
    <DocsLayout sections={sections}>
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
        <Helmet>
          <title>Quick Start - EnvHub</title>
          <meta
            name="description"
            content="Get started with EnvHub - Secure environment variable management made easy."
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
            {/* Content */}
            <div className="space-y-12">
              {/* Introduction */}
              <div className="animate-fade-in-up">
                <h1 className="text-4xl font-bold text-white mb-4">Quick Start Guide</h1>
                <p className="text-gray-400 mb-8">
                  Get started with EnvHub in minutes. This guide will walk you through the essential steps to set up and use EnvHub effectively.
                </p>
              </div>

              {/* Installation */}
              <div className="animate-fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-white mb-4">Installation</h2>
                <p className="text-gray-400 mb-4">
                  Install EnvHub using npm:
                </p>
                <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                  <code>{`
npm install -g @envhub/cli
`}</code>
                </pre>
              </div>

              {/* Configuration */}
              <div className="animate-fade-in-up delay-200">
                <h2 className="text-2xl font-semibold text-white mb-4">Configuration</h2>
                <p className="text-gray-400 mb-4">
                  Create a .envhub.json file in your project root:
                </p>
                <pre className="bg-gray-900 p-4 rounded-lg">
                  <code>{`
{
  "version": "1.0",
  "projects": {
    "default": {
      "envFile": ".env",
      "encryptionKey": "your-secret-key"
    }
  }
}
`}</code>
                </pre>
              </div>

              {/* Usage */}
              <div className="animate-fade-in-up delay-300">
                <h2 className="text-2xl font-semibold text-white mb-4">Usage</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Set Variables</h3>
                    <p className="text-gray-400 mb-4">
                      Set environment variables using the CLI:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>{`
envhub var set DATABASE_URL "postgres://user:pass@localhost/db"
`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Export Variables</h3>
                    <p className="text-gray-400 mb-4">
                      Export variables to a .env file:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>{`
envhub var export > .env
`}</code>
                    </pre>
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
