import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Project } from '@/types/project';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { ProjectCard } from '@/components/ProjectCard';
import { ProfileDropdown } from '@/components/ProfileDropdown';

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-xl font-semibold">EnvHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectClick={onProjectClick}
              />
            ))}
            {sharedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectClick={onProjectClick}
                ownerEmail={project.owner_email}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateProject={onCreateProject}
      />
    </div>
  );
};
