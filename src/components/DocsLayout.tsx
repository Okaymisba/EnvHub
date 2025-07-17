import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleGetStarted = () => {
    navigate('/docs/getting-started');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <div className="flex flex-1 pt-16 relative">
        {/* Mobile menu button - Moved below navbar with new design */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden fixed top-16 left-0 right-0 z-40 py-3 px-4 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm text-white border-b border-gray-800 flex items-center justify-center gap-2 transition-all duration-300 hover:from-purple-800/80 hover:to-blue-800/80"
          aria-label="Toggle documentation menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          )}
          <span className="font-medium">Documentation Menu</span>
        </button>

        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 bg-black/90 backdrop-blur-sm flex-shrink-0 fixed top-16 left-0 bottom-0 overflow-y-auto transition-transform duration-300 z-40",
            "transform md:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4">
            <div className="mb-8 pt-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Documentation</h2>
            </div>

            <nav className="space-y-4 pr-2">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-1 animate-fade-in-up delay-100">
                  <div className="flex items-center text-gray-400 mb-2">
                    <section.icon className="mr-2 h-4 w-4 text-purple-400 flex-shrink-0" />
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
                        "rounded-lg py-3 px-3 my-1",
                        "min-h-[44px]", // Better touch target
                        currentPath.startsWith(item.path.split('#')[0])
                          ? "bg-gradient-to-r from-purple-900/30 to-blue-900/20 text-purple-300 border-l-2 border-purple-400"
                          : ""
                      )}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Vertical spacer for sidebar */}
        <div className="w-0 md:w-64 flex-shrink-0" />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        /* Base styles */
        html {
          scroll-behavior: smooth;
          -webkit-text-size-adjust: 100%;
        }

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

        @media (max-width: 767px) {
          aside {
            width: 280px;
            max-width: 100%;
          }
        }

        @media (min-width: 768px) {
          /* Hide mobile menu button on desktop */
          .md\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DocsLayout;
