import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Users, Globe, Database, Settings } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const featureImages = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Shield,
      title: "Ironclad Security",
      description: "Your secrets are protected with zero-knowledge encryption. Only you and your team can access them.",
      image: featureImages[0]
    },
    {
      icon: Zap,
      title: "Instant Collaboration",
      description: "Invite teammates and share secrets in seconds. No more copy-paste or risky emails.",
      image: featureImages[1]
    },
    {
      icon: Database,
      title: "CI/CD Ready",
      description: "Integrate with GitHub Actions, Vercel, and more. Secure automation, zero hassle.",
      image: featureImages[2]
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your secrets securely from anywhere, on any device.",
      image: featureImages[3]
    },
    {
      icon: Settings,
      title: "Developer Focused",
      description: "CLI, API, and dashboard. Versioning, audit logs, and no vendor lock-in.",
      image: featureImages[4]
    },
    {
      icon: Users,
      title: "Start in Seconds",
      description: "No setup. No credit card. Sign in and secure your first project instantly.",
      image: featureImages[5]
    }
  ];

  return (
    <div className="w-full bg-black relative overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            {/* SVG Lock Logo */}
            <div className="mx-auto w-24 h-24 flex items-center justify-center mb-8 shadow-2xl animate-fade-in-up bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto">
                <rect width="56" height="56" rx="16" fill="url(#paint0_linear)" />
                <path d="M18 26V20C18 15.58 21.58 12 26 12C30.42 12 34 15.58 34 20V26" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="14" y="26" width="28" height="18" rx="6" stroke="#fff" strokeWidth="2.5" />
                <circle cx="28" cy="35" r="3" fill="#fff" />
                <defs>
                  <linearGradient id="paint0_linear" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up bg-gradient-to-r from-purple-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-xl">
              EnvHub
            </h1>
            <p className="text-2xl md:text-3xl text-gray-200 mb-6 max-w-2xl mx-auto animate-fade-in-up font-semibold">
              Secure, Share, and Automate Your Secrets — Instantly.
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up">
              The all-in-one platform for environment variables and secrets. Trusted by fast-moving teams and solo devs. No leaks. No friction. Just speed and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-5 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
              >
                🚀 Try EnvHub Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-900 px-10 py-5 text-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                See Live Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4 animate-fade-in-up">
            Why Developers Love EnvHub
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up">
            Effortless security. Blazing speed. Built for modern teams.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-900/80 border-slate-800 hover:bg-slate-900/90 transition-all duration-300 hover:scale-105 animate-fade-in-up group shadow-xl"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <CardContent className="p-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-7">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-base">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-white mb-6 animate-fade-in-up">
            Ready to Secure Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Join thousands of developers who trust EnvHub. Start free — no credit card required.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-14 py-6 text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
          >
            Get Started — It’s Free!
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
             © 2025 EnvHub by Misbah. All rights reserved.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s forwards;
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3;}
          50% { opacity: 0.6;}
        }
      `}</style>
    </div>
  );
};
