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
                  Install EnvHub using pip:
                </p>
                <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                  <code>pip install envhub-cli</code>
                </pre>
                <p className="text-gray-400 mb-4 mt-4">
                    If your environment is externally managed, use the following command:
                </p>
                <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                  <code>pipx install envhub-cli</code>
                </pre>
              </div>

              {/* Usage */}
              <div className="animate-fade-in-up delay-300">
                <h2 className="text-2xl font-semibold text-white mb-4">Usage</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Create a Project</h3>
                    <p className="text-gray-400 mb-4">
                      First create a project in the web interface, then you can clone that project in development environment using the following command:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>envhub clone {'<project-name>'}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Add Variables</h3>
                    <p className="text-gray-400 mb-4">
                      Now after cloning the project, you can add variables using both the web interface and the CLI.
                    </p>
                    <p className="text-gray-400 mb-4">
                      To add a variable using the cli, use the following command:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>envhub add</code>
                    </pre>
                    <p className="text-gray-400 mb-4 mt-4">
                        Then you will be prompted to enter the variable name and value.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Decrypt and Run</h3>
                    <p className="text-gray-400 mb-4">
                      To decrypt and run your environment variables, use the following command:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>{`
envhub decrypt -- <command-to-run>
`}</code>
                    </pre>
                    <p className="text-gray-400 mb-4 mt-4">
                        For example, if you want to run a Node.js app, you can use the following command:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>envhub decrypt -- node app.js</code>
                    </pre>
                    <p className="text-gray-400 mb-4 mt-4">
                      This will securely decrypt your environment variables at runtime, making them available to your Node.js application while keeping them protected in your codebase.
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
