import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '@/components/DocsLayout';
import {Users, UserPlus, UserCog, Lock, Shield, Book, Terminal, CloudUpload} from 'lucide-react';

interface TeamDocsProps {
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
      { label: 'Deployment Guide', path: '/docs/deployment/deployment-guide#deployment-guide' },
      { label: 'CI/CD Integration', path: '/docs/deployment/ci-cd-integration#ci-cd-integration' }
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

const teamSections = [
  {
    id: 'introduction',
    title: 'Introduction to Team Collaboration',
    icon: Users,
    description: 'Learn how to effectively collaborate with your team using EnvHub.',
    content: (
      <div className="space-y-4">
        <p className="text-gray-400">
          EnvHub's team collaboration features allow you to securely share environment variables with your team members while maintaining strict access controls.
        </p>
      </div>
    )
  },
  {
    id: 'members',
    title: 'Managing Team Members',
    icon: UserPlus,
    description: 'Add, remove, and manage team members with different permission levels.',
    features: [
      {
        title: 'Adding Team Members',
        description: 'Invite new members to collaborate on your project.',
        details: [
          'Navigate to your project page',
          'Click "Members" at the top right',
          'Enter the email address, select a role (Admin/User), set the access password (This password will be used by the member to access the secrets) and then the project password (Just for the verification)',
          'Click "Send"',
          'The member will receive an invitation email in their inbox of the EnvHub'
        ]
      }
      // {
      //   title: 'Managing Permissions',
      //   description: 'Update roles and permissions for team members.',
      //   details: [
      //     'Go to Team Settings',
      //     'Find the team member',
      //     'Click on the role dropdown',
      //     'Select the new role (Owner/Admin/User)'
      //   ]
      // }
    ]
  },
  {
    id: 'access-control',
    title: 'Access Control',
    icon: Lock,
    description: 'Control what each team member can access and modify.',
    features: [
      {
        title: 'Role-Based Access Control',
        description: 'Control exactly who can view, edit, or manage your environment variables with three distinct permission levels.',
        details: [
          'Owner: Full control over all project settings, team management, and project deletion',
          'Admin: Can manage environment variables and project settings, but cannot delete the project',
          'User: Read-only access to environment variables, cannot make any modifications'
        ]
      }
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    icon: UserCog,
    description: 'Recommended practices for effective team collaboration.',
    features: [
      {
        title: 'Security Best Practices',
        description: 'Recommended practices for managing environment variables securely.',
        details: [
          'Use the principle of least privilege when assigning roles to team members',
          'Keep your master password secure and never share it',
          'Use strong, unique passwords for all service accounts',
          'Regularly review and clean up unused environment variables',
          'Limit the number of users with Owner and Admin privileges',
          'Use environment-specific variables to separate development, staging, and production values'
        ]
      }
    ]
  }
];

const TeamDocs: React.FC<TeamDocsProps> = ({ initialSection }) => {
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
          <title>Team Collaboration - EnvHub</title>
          <meta
            name="description"
            content="Learn how to collaborate with your team using EnvHub's secure environment variable management."
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
            {/* Header */}
            <div className="animate-fade-in-up mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">Team Collaboration</h1>
              <p className="text-gray-400 text-lg">
                Securely collaborate with your team by managing access to environment variables and project settings.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Table of Contents</h2>
              <div className="space-y-4">
                {teamSections.map((section) => (
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
              {teamSections.map((section) => (
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
                    {section.features?.map((feature, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                        {feature.details && (
                          <ul className="space-y-2 text-gray-400">
                            {feature.details.map((detail, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
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

export default TeamDocs;
