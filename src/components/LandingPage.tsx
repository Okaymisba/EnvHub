
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { OpenSourceSection } from '@/components/OpenSourceSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="w-full min-h-screen bg-black relative overflow-x-hidden font-sans">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow delay-200"></div>
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-fuchsia-900/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-16">
        <HeroSection onGetStarted={onGetStarted} />
        <StatsSection onGetStarted={onGetStarted} />
          {/* Demo Video Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                      See It In Action
                  </h2>
                  <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
                      Watch our quick demo to see how EnvHub can streamline your environment variable management.
                  </p>
              </div>
              <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black">
                  <div className="relative pt-[56.25%] w-full h-0">
                      <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src="https://www.youtube.com/embed/q3cveL8kY1k"
                          title="EnvHub Demo Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                  </div>
              </div>
          </section>
        <FeaturesSection />
        <OpenSourceSection />
        <CTASection onGetStarted={onGetStarted} />
        <Footer />
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s forwards;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2;}
          50% { opacity: 0.4;}
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
};
