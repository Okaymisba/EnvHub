import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '@/components/DocsLayout';
import {Book, Terminal, Shield, Users, Zap, GitBranch, CloudUpload} from 'lucide-react';

interface QuickStartProps {
  initialSection?: string;
}

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { label: 'Introduction', path: '/docs/getting-started/introduction#introduction' },
      { label: 'Installation', path: '/docs/getting-started/installation#installation' },
      { label: 'Usage', path: '/docs/getting-started/usage#usage' }
    ]
  },
  {
    title: 'CLI Documentation',
    icon: Terminal,
    items: [
      { label: 'Installation', path: '/docs/cli/installation#installation' },
      { label: 'Authentication', path: '/docs/cli/authentication#authentication' },
      { label: 'Project Management', path: '/docs/cli/project-management#project-management' },
      { label: 'Environment Variables', path: '/docs/cli/variables#environment-variables' }
    ]
  },
  {
    title: 'Deployment',
    icon: CloudUpload,
    items: [
      { label: 'Overview', path: '/docs/deployment/overview#overview' },
      { label: 'Deployment Guide', path: '/docs/deployment/deployment-guide#deployment-guide' }
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { label: 'Encryption Overview', path: '/docs/security/encryption#encryption' },
      { label: 'Access Control', path: '/docs/security/access-control#access-control' },
      { label: 'Best Practices', path: '/docs/security/best-practices#best-practices' },
      { label: 'Security Measures', path: '/docs/security/security-measures#security-measures' }
    ]
  },
  {
    title: 'Team Collaboration',
    icon: Users,
    items: [
      { label: 'Getting Started', path: '/docs/team/getting-started#introduction' },
      { label: 'Managing Team Members', path: '/docs/team/members#members' },
      { label: 'Access Control', path: '/docs/team/access-control#access-control' },
      { label: 'Best Practices', path: '/docs/team/best-practices#best-practices' }
    ]
  }
];

const quickStartSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: Zap,
    description: 'Get started with EnvHub in minutes. This guide will walk you through the essential steps to set up and use EnvHub effectively.',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400">
          EnvHub makes it easy to manage your environment variables securely across different environments and team members.
        </p>
      </div>
    )
  },
  {
    id: 'installation',
    title: 'Installation',
    icon: Terminal,
    description: 'Install EnvHub CLI on your system to get started.',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400">Install EnvHub using pip:</p>
        <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 overflow-x-auto">
          <code>pip install envhub-cli</code>
        </pre>
        <p className="text-gray-400">If your environment is externally managed, use pipx:</p>
        <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 overflow-x-auto">
          <code>pipx install envhub-cli</code>
        </pre>
      </div>
    )
  },
  {
    id: 'usage',
    title: 'Basic Usage',
    icon: GitBranch,
    description: 'Learn how to use EnvHub for your projects.',
    content: (
      <div className="space-y-6">
        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Clone a Project</h3>
          <p className="text-gray-400 mb-4">First, create a project in the web interface, then clone it to your local environment:</p>
          <div className="bg-black/50 p-4 rounded-lg overflow-x-auto">
            <code className="text-purple-300 font-mono text-sm">envhub clone {'<project-name>'}</code>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Add Variables</h3>
          <p className="text-gray-400 mb-4">Add environment variables using the CLI:</p>
          <div className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-purple-300 font-mono text-sm">envhub add</code>
          </div>
          <p className="text-gray-400">You'll be prompted to enter the variable name and value.</p>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-2">Run with Environment Variables</h3>
          <p className="text-gray-400 mb-4">Securely run your application with environment variables:</p>
          <div className="bg-black/50 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-purple-300 font-mono text-sm">envhub decrypt -- node app.js</code>
          </div>
          <p className="text-gray-400">
            This will decrypt your environment variables at runtime, making them available to your application while keeping them secure in your codebase.
          </p>
        </div>
      </div>
    )
  }
];

export const QuickStart: React.FC<QuickStartProps> = ({ initialSection }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection && containerRef.current) {
      const section = document.getElementById(initialSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);

  return (
    <DocsLayout sections={sections}>
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans" ref={containerRef}>
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <div className="animate-fade-in-up mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Quick Start Guide</h1>
              <p className="text-gray-400 text-lg">
                Get up and running with EnvHub in minutes. Follow this guide to set up and start using EnvHub effectively.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Table of Contents</h2>
              <div className="space-y-4">
                {quickStartSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start p-4 rounded-lg hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10 mr-4 group-hover:bg-purple-500/20 transition-colors">
                      <section.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{section.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-16 pb-20">
              {quickStartSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/10 mr-4">
                      <section.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8">{section.description}</p>
                  
                  <div className="space-y-8">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
};
