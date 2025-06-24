
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, Database, LogOut, Shield, Users } from 'lucide-react';
import { Project } from '@/types/project';

interface DashboardProps {
  projects: Project[];
  sharedProjects: (Project & { owner_email: string })[];
  onCreateProject: (name: string, password: string) => Promise<void>;
  onProjectClick: (project: Project) => void;
  onLogout: () => void;
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  sharedProjects,
  onCreateProject,
  onProjectClick,
  onLogout,
  loading
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectPassword, setProjectPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectPassword.trim()) return;
    
    setCreating(true);
    try {
      await onCreateProject(projectName.trim(), projectPassword);
      setProjectName('');
      setProjectPassword('');
      setIsCreateModalOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderProjectCard = (project: Project, isShared = false, ownerEmail?: string) => (
    <Card
      key={project.id}
      className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all cursor-pointer hover:border-gray-600"
      onClick={() => onProjectClick(project)}
    >
      <CardHeader>
        <CardTitle className="text-white hover:text-blue-400 transition-colors flex items-center">
          <Database className="mr-2 h-4 w-4" />
          {project.name}
        </CardTitle>
        <CardDescription className="flex items-center text-gray-500">
          <Calendar className="mr-1 h-3 w-3" />
          Created {formatDate(project.created_at)}
        </CardDescription>
        {isShared && ownerEmail && (
          <CardDescription className="flex items-center text-blue-400 text-xs">
            <Users className="mr-1 h-3 w-3" />
            Owner: {ownerEmail}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {project.version_count || 0} versions
          </span>
          <div className="flex items-center text-green-500 text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Encrypted
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div>
          <div className="flex justify-between items-center h-16 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">EnvHub</h1>
            </div>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
            <p className="text-gray-400">Secure environment variable management</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Repository
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Project</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a secure repository for your environment variables
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name" className="text-white">Repository Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-password" className="text-white">Master Password</Label>
                  <Input
                    id="project-password"
                    type="password"
                    value={projectPassword}
                    onChange={(e) => setProjectPassword(e.target.value)}
                    placeholder="Secure password for encryption"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    🔒 This password encrypts all environment variables. Store it securely - it cannot be recovered!
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {creating ? 'Creating...' : 'Create Repository'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700 animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Owned Projects Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">My Repositories</h3>
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No repositories yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Create your first secure repository to start managing environment variables with end-to-end encryption.
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Repository
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => renderProjectCard(project))}
                </div>
              )}
            </div>

            {/* Shared Projects Section */}
            {sharedProjects.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Shared with me
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sharedProjects.map((project) => renderProjectCard(project, true, project.owner_email))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
