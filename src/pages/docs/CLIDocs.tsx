import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, Shield, Users, Terminal, Key, Box, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocsLayout from '@/components/DocsLayout';

interface CLIDocsProps {
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

const commandSections = [
  {
    id: 'installation',
    title: 'Installation',
    icon: Cpu,
    description: 'Get started by installing the EnvHub CLI on your system.',
    commands: [
      {
        name: 'Install via pip',
        usage: 'pip install envhub-cli',
        description: 'Install the EnvHub CLI using pip package manager.'
      },
      {
        name: 'Install via pipx',
        usage: 'pipx install envhub-cli',
        description: 'For isolated Python environments, use pipx.'
      },
      {
        name: 'Verify installation',
        usage: 'envhub --version',
        description: 'Check if the installation was successful.'
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    icon: Key,
    description: 'Authenticate with the EnvHub service to manage your environment variables.',
    commands: [
      {
        name: 'Login',
        usage: 'envhub login',
        description: 'Authenticate with your EnvHub account using your email and password. If you created your account with Google, first set up a CLI password by selecting "CLI Setup" from the profile dropdown menu.'
      },
      {
        name: 'Logout',
        usage: 'envhub logout',
        description: 'Sign out from your current session.'
      },
      {
        name: 'Whoami',
        usage: 'envhub whoami',
        description: 'Display the currently logged-in user.'
      }
    ]
  },
  {
    id: 'project-management',
    title: 'Project Management',
    icon: Box,
    description: 'Manage your existing projects after creating them in the web interface.',
    commands: [
      {
        name: 'Project creation',
        usage: 'envhub clone <project-name>',
        description: 'You can create a new project from the web interface. Then, you can clone it to your local machine using the following command.'
      },
      {
        name: 'Pull latest changes',
        usage: 'envhub pull',
        description: 'After cloning a project, you can pull the latest changes from the web interface using the following command.'
      },
      {
        name: 'Delete a remote project',
        usage: 'envhub reset',
        description: 'You can delete the remote project form your local machine using the following command. This will reset that folder by deleting all the configurations of that project.'
      }
    ]
  },
  {
    id: 'environment-variables',
    title: 'Environment Variables',
    icon: Terminal,
    description: 'Manage environment variables for your projects.',
    commands: [
      {
        name: 'Add variable',
        usage: 'envhub add',
        description: 'You can add a new environment variable using the following command. You will be prompted to enter a key and value.'
      },
      {
        name: 'List variables',
        usage: 'envhub list',
        description: 'You can list all the environment variables for a project using the following command.'
      },
      {
        name: 'Remove variable',
        usage: 'envhub pull',
        description: 'Unfortunately, you can only remove a variable using the web interface. after after removing it from the web interface, you can pull the latest changes from the web interface using the following command.'
      },
      {
        name: 'Decrypt and Run',
        usage: 'envhub decrypt -- <command-to-run>',
        description: 'To decrypt and run your environment variables, use the following command. This will securely decrypt your environment variables at runtime, making them available to your Node.js application while keeping them protected in your codebase. '
      }
    ]
  }
];

export const CLIDocs: React.FC<CLIDocsProps> = ({ initialSection }) => {
  const navigate = useNavigate();
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
          <title>CLI Documentation - EnvHub</title>
          <meta
            name="description"
            content="Complete CLI documentation for EnvHub - Learn how to use the EnvHub command line interface to manage environment variables securely."
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
              <h1 className="text-4xl font-bold text-white mb-4">
                EnvHub CLI Documentation
              </h1>
              <p className="text-gray-400 text-lg">
                Comprehensive guide to using the EnvHub Command Line Interface for managing your environment variables.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Table of Contents</h2>
              <div className="space-y-4">
                {commandSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start p-4 rounded-lg hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-4 group-hover:bg-blue-500/20 transition-colors">
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
              {commandSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                      <section.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8">{section.description}</p>
                  
                  <div className="space-y-6">
                    {section.commands.map((command, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">{command.name}</h3>
                        <div className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto">
                          <code className="text-gray-300 font-mono">{command.usage}</code>
                        </div>
                        <p className="text-gray-400">{command.description}</p>
                      </div>
                    ))}
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
