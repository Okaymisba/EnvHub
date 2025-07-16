import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';

interface DocsLayoutProps {
  children: React.ReactNode;
  sections: {
    title: string;
    icon: React.ComponentType<any>;
    items: Array<{
      label: string;
      path: string;
    }>;
  }[];
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children, sections }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleGetStarted = () => {
    navigate('/docs/getting-started');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar onGetStarted={handleGetStarted} />
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-black/80 backdrop-blur-sm flex-shrink-0 fixed top-16 left-0 bottom-0 overflow-y-auto">
          <div className="p-4">
            {/* Documentation Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Documentation</h2>
            </div>

            <nav className="space-y-4 pr-2">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-1 animate-fade-in-up delay-100">
                  <div className="flex items-center text-gray-400 mb-2">
                    <section.icon className="mr-2 h-4 w-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-gray-300">{section.title}</h3>
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left text-sm text-gray-400",
                        "hover:bg-gray-800/50 hover:text-purple-300",
                        "transition-all duration-200",
                        "rounded-lg",
                        "px-3 py-2",
                        currentPath === item.path ? "bg-gradient-to-r from-purple-900/30 to-blue-900/20 text-purple-300 border-l-2 border-purple-400" : ""
                      )}
                      onClick={() => window.location.href = item.path}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Vertical Divider */}
        <div className="w-64 flex-shrink-0" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global styles for scrollbars */}
      <style jsx global>{`
        /* For Webkit browsers (Chrome, Safari, etc.) */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(96, 165, 250, 0.7));
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.9), rgba(96, 165, 250, 0.9));
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.7) rgba(0, 0, 0, 0.2);
        }

        /* Custom scrollbar for sidebar */
        aside {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.7) rgba(0, 0, 0, 0.1);
        }

        aside::-webkit-scrollbar {
          width: 6px;
        }

        aside::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        aside::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(96, 165, 250, 0.7));
          border-radius: 3px;
        }

        aside:hover::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.9), rgba(96, 165, 250, 0.9));
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DocsLayout;
