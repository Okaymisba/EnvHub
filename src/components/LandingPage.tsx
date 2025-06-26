
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Users, Globe, Database, Settings } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your secrets stay yours. We never see your environment variables. Data is encrypted before it leaves your device — only you (and your team) can decrypt it."
    },
    {
      icon: Zap,
      title: "Designed for Speed, Built for Teams",
      description: "Share secrets securely across projects and teams. Invite collaborators and manage roles. Never lose track of who has access again."
    },
    {
      icon: Database,
      title: "Sync with CI/CD, Instantly",
      description: "Export secrets to your pipeline with a single command. Integrate easily with tools like GitHub Actions, Supabase CLI, or your own scripts."
    },
    {
      icon: Globe,
      title: "Access Anywhere, Anytime",
      description: "Whether you're deploying from your laptop or a remote server — EnvHub keeps your secrets just a secure fetch away."
    },
    {
      icon: Settings,
      title: "Developer-First by Design",
      description: "Built-in version history, access logs, secrets grouped by project & environment, JSON & dotenv support, CLI, API & Dashboard access."
    },
    {
      icon: Users,
      title: "Start Using EnvHub in Seconds",
      description: "No backend setup. No vendor lock-in. Just secure, fast, and easy secret management for modern development teams."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 animate-scale-in">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              🧪 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">EnvHub</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
              The GitHub for Environment Variables & Secrets
            </p>
            
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in">
              💡 Stop emailing .env files or sharing secrets over Slack. 
              EnvHub lets you securely store, manage, and share your environment variables — built for modern teams and solo developers alike.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                🔗 Create your first project →
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose EnvHub?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for developers who value security, speed, and simplicity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            🚀 Ready to Secure Your Secrets?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust EnvHub with their environment variables. 
            Start your secure journey today — no credit card required.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-4 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
          >
            Get Started Free →
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            © 2024 EnvHub. Built with ❤️ for developers, by developers.
          </p>
        </div>
      </div>
    </div>
  );
};
