// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, ShieldCheck, Users, Book, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocsLayout from '@/components/DocsLayout';

interface SecurityDocsProps {
  initialSection?: string;
}

interface SecurityFeature {
  title: string;
  description: string;
  details?: string[];
  technicalDetails?: {
    algorithm: string;
    keyDerivation: string;
    keySize: string;
    nonceSize: string;
    saltSize: string;
    authenticationTag: string;
  };
}

interface SecuritySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: SecurityFeature[];
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

const securitySections: SecuritySection[] = [
  {
    id: 'encryption',
    title: 'Encryption Overview',
    icon: Lock,
    description: 'Learn how EnvHub secures your environment variables with end-to-end encryption.',
    features: [
      {
        title: 'End-to-End Encryption',
        description: 'All environment variables are encrypted using AES-256-GCM before they leave your device with military-grade security measures.',
        details: [
          'Zero-Knowledge Architecture: We never see your unencrypted data - encryption/decryption happens entirely in your browser',
          'Client-Side Encryption: Data is encrypted using AES-256-GCM before reaching our servers',
          'Secure Key Derivation: Uses PBKDF2 with 100,000 iterations and SHA-256 for key strengthening',
          'Cryptographic Best Practices: Implements proper nonce and salt generation for each encryption operation',
          'Authenticated Encryption: Uses AES-GCM which provides both confidentiality and authenticity',
        ],
        technicalDetails: {
          algorithm: 'AES-256-GCM (Galois/Counter Mode)',
          keyDerivation: 'PBKDF2 with 100,000 iterations and SHA-256',
          keySize: '256 bits',
          nonceSize: '96 bits (12 bytes)',
          saltSize: '128 bits (16 bytes)',
          authenticationTag: '128 bits (16 bytes)'
        }
      }
    ]
  },
  {
    id: 'access-control',
    title: 'Access Control',
    icon: Shield,
    description: 'Manage who can access your environment variables with fine-grained permissions.',
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
    icon: ShieldCheck,
    description: 'Follow these guidelines to ensure your environment variables remain secure.',
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
  },
  {
    id: 'security-measures',
    title: 'Security Measures',
    icon: ShieldCheck,
    description: 'Learn about our security practices and data protection measures.',
    features: [
      {
        title: 'Security & Data Protection',
        description: 'We implement industry-standard security measures to protect your environment variables.',
        details: [
          'End-to-end encryption for all sensitive data',
          'Secure access controls with role-based permissions',
          'Regular security updates and best practices implementation',
          'Data minimization principles in place',
          'Secure development lifecycle practices'
        ]
      }
    ]
  }
];

const SecurityDocs: React.FC<SecurityDocsProps> = ({ initialSection }) => {
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
          <title>Security Documentation - EnvHub</title>
          <meta
            name="description"
            content="Security documentation for EnvHub - Learn about our security measures, encryption, and compliance."
          />
        </Helmet>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 pt-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="animate-fade-in-up mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Security Documentation
              </h1>
              <p className="text-gray-400 text-lg">
                Learn how EnvHub keeps your environment variables secure with enterprise-grade security features.
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-white mb-6">Table of Contents</h2>
              <div className="space-y-4">
                {securitySections.map((section) => (
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
              {securitySections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                      <section.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8">{section.description}</p>
                  
                  <div className="space-y-8">
                    {section.features.map((feature, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
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
                        {feature.technicalDetails && (
                          <div className="space-y-4">
                            <h4 className="text-xl font-medium text-white">Technical Details</h4>
                            <ul className="space-y-2 text-gray-400">
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Algorithm: {feature.technicalDetails.algorithm}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Key Derivation: {feature.technicalDetails.keyDerivation}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Key Size: {feature.technicalDetails.keySize}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Nonce Size: {feature.technicalDetails.nonceSize}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Salt Size: {feature.technicalDetails.saltSize}</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                <span>Authentication Tag: {feature.technicalDetails.authenticationTag}</span>
                              </li>
                            </ul>
                          </div>
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

export default SecurityDocs;
