
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Shield, GitBranch, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "End-to-end encryption with zero-trust architecture ensures your secrets are never exposed, even to us.",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    icon: GitBranch,
    title: "CLI Integration",
    description: "Seamlessly sync with your GitHub, GitLab, or Bitbucket repositories with EnvHub CLI.",
    gradient: "from-purple-600 to-pink-500"
  },
  {
    icon: Lock,
    title: "Fine-Grained Access Control",
    description: "Define who can access what with role-based permissions and just-in-time access approvals.",
    gradient: "from-emerald-600 to-teal-500"
  }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Enterprise-Grade Secret Management
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to secure your application's sensitive data
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r rounded-xl opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 blur" />
              <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 group-hover:border-transparent transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${feature.gradient} text-white`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
