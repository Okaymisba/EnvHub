// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { Project } from '@/types/project';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { ProjectCard } from '@/components/ProjectCard';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Footer } from '@/components/Footer';

interface DashboardProps {
  projects: Project[];
  sharedProjects: (Project & { owner_email: string })[];
  onCreateProject: (name: string, password: string) => void;
  onProjectClick: (project: Project) => void;
  onLogout: () => void;
  loading: boolean;
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  sharedProjects,
  onCreateProject,
  onProjectClick,
  onLogout,
  loading,
  user
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // <-- default is now 'list'

  return (
      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header and Main Content */}
      <div className="flex-1">
        <header className="border-b border-gray-800 bg-black/70 backdrop-blur-sm sticky top-0 z-40">
          <div>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                {/* SVG Lock Logo */}
                <div className="w-8 h-8 bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
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
                <h1 className="text-xl font-semibold">EnvHub</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
                <ProfileDropdown
                  user={user}
                  onLogout={onLogout}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8 relative z-10 flex-grow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400'} transition`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400'} transition`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          ) : projects.length === 0 && sharedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-6">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md">Get started by creating your first project to manage your environment variables securely.</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectClick={onProjectClick}
                  viewMode={viewMode}
                />
              ))}
              {sharedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectClick={onProjectClick}
                  ownerEmail={project.owner_email}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer - This will be at the bottom */}
        <footer className="w-full mt-auto">
          <Footer />
        </footer>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateProject={onCreateProject}
      />

      {/* Animations */}
      <style>{`
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3;}
          50% { opacity: 0.6;}
        }
      `}</style>
    </div>
  );
};