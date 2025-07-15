import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import {ArrowLeft, Book, Shield, Users} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocsLayout from '@/components/DocsLayout';
import { Terminal } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { label: 'Quick Start Guide', path: '/docs/getting-started' },
      { label: 'Installation', path: '/docs/getting-started' },
      { label: 'Your First Project', path: '/docs/getting-started' },
      { label: 'Environment Setup', path: '/docs/getting-started' }
    ]
  },
  {
    title: 'CLI Documentation',
    icon: Terminal,
    items: [
      { label: 'Installation & Setup', path: '/docs/cli-documentation' },
      { label: 'Authentication', path: '/docs/cli-documentation' },
      { label: 'Project Management', path: '/docs/cli-documentation' },
      { label: 'Environment Variables', path: '/docs/cli-documentation' },
      { label: 'Advanced Commands', path: '/docs/cli-documentation' }
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

export const CLIDocs = () => {
  const navigate = useNavigate();

  const commands = [
    {
      name: 'login',
      description: 'Authenticate with EnvHub',
      usage: 'envhub login',
    },
    {
      name: 'project',
      description: 'Project management commands',
      subcommands: [
        {
          name: 'create',
          description: 'Create a new project',
          usage: 'envhub project create "Project Name"',
        },
        {
          name: 'list',
          description: 'List all projects',
          usage: 'envhub project list',
        },
      ],
    },
    {
      name: 'var',
      description: 'Environment variable management',
      subcommands: [
        {
          name: 'set',
          description: 'Set an environment variable',
          usage: 'envhub var set KEY "VALUE"',
        },
        {
          name: 'get',
          description: 'Get an environment variable',
          usage: 'envhub var get KEY',
        },
        {
          name: 'list',
          description: 'List all variables',
          usage: 'envhub var list',
        },
      ],
    },
    {
      name: 'team',
      description: 'Team management commands',
      subcommands: [
        {
          name: 'invite',
          description: 'Invite a team member',
          usage: 'envhub team invite email@example.com',
        },
        {
          name: 'list',
          description: 'List team members',
          usage: 'envhub team list',
        },
      ],
    },
  ];

  return (
    <DocsLayout sections={sections}>
      <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content */}
            <div className="space-y-12">
              {/* Introduction */}
              <div className="animate-fade-in-up">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Command Line Interface Documentation
                </h1>
                <p className="text-gray-400 mb-8">
                  The EnvHub CLI allows you to manage your environment variables securely from the command line. This documentation covers all available commands and their usage.
                </p>
              </div>

              {/* Command Reference */}
              <div className="animate-fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-white mb-6">Command Reference</h2>
                <div className="space-y-8">
                  {commands.map((command) => (
                    <div key={command.name} className="space-y-4 animate-fade-in-up delay-200">
                      <h3 className="text-xl font-semibold text-white mb-2">{command.name}</h3>
                      <p className="text-gray-400 mb-4">{command.description}</p>

                      {command.subcommands ? (
                        <div className="space-y-4">
                          {command.subcommands.map((subcommand) => (
                            <div key={subcommand.name} className="space-y-2 animate-fade-in-up delay-300">
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {subcommand.name}
                              </h4>
                              <p className="text-gray-400 mb-2">{subcommand.description}</p>
                              <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                                <code>{`
${subcommand.usage}
`}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                          <code>{`
${command.usage}
`}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Usage */}
              <div className="animate-fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-white mb-6">Advanced Usage</h2>
                <div className="space-y-6">
                  {/* Environment Management */}
                  <div className="animate-fade-in-up delay-200">
                    <h3 className="text-xl font-semibold text-white mb-2">Environment Management</h3>
                    <p className="text-gray-400 mb-4">
                      Manage different environments using the --env flag:
                    </p>
                    <pre className="bg-gray-900 p-4 rounded-lg text-gray-300">
                      <code>{`
envhub var set DATABASE_URL "dev-url" --env development
envhub var set DATABASE_URL "prod-url" --env production
`}</code>
                    </pre>
                  </div>

                  {/* Variable Export */}
                  <div className="animate-fade-in-up delay-200">
                    <h3 className="text-xl font-semibold text-white mb-2">Variable Export</h3>
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
