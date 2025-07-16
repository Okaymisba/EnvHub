import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black flex-shrink-0">
        <div className="p-4">
          {/* Documentation Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Documentation</h2>
          </div>

          <nav className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-1 animate-fade-in-up delay-100">
                <div className="flex items-center text-gray-400 mb-2">
                  <section.icon className="mr-2 h-4 w-4" />
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                </div>
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left text-sm text-gray-400",
                      "hover:bg-gray-700 hover:text-white",
                      "transition-all duration-200",
                      "rounded-lg",
                      "px-3 py-2",
                      currentPath === item.path ? "bg-gray-800 text-white" : ""
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
      <div className="h-auto min-h-full w-px bg-gray-700 flex-shrink-0" />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DocsLayout;
