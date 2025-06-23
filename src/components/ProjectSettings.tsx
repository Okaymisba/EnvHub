
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Project } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface ProjectSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onProjectDeleted: () => void;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  isOpen,
  onClose,
  project,
  onProjectDeleted
}) => {
  const [deletePassword, setDeletePassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteProject = async () => {
    if (!deletePassword.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your project password to delete the project',
        variant: 'destructive'
      });
      return;
    }

    if (confirmText !== project.name) {
      toast({
        title: 'Confirmation Required',
        description: `Please type "${project.name}" to confirm deletion`,
        variant: 'destructive'
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Verify password first
      const isValidPassword = await SupabaseService.verifyProjectPassword(project.id, deletePassword);
      if (!isValidPassword) {
        throw new Error('Invalid project password');
      }

      await SupabaseService.deleteProject(project.id);
      
      toast({
        title: 'Project deleted',
        description: 'Your project and all its data have been permanently deleted'
      });
      
      onProjectDeleted();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete project',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetDeleteForm = () => {
    setDeletePassword('');
    setConfirmText('');
    setShowDeleteConfirm(false);
  };

  const handleClose = () => {
    resetDeleteForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Project Settings</CardTitle>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="space-y-2">
            <Label className="text-gray-300">Project Name</Label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2">
              <span className="text-white font-mono">{project.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Created</Label>
            <div className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2">
              <span className="text-gray-400 text-sm">
                {new Date(project.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            </div>
            
            <div className="bg-red-950 border border-red-800 rounded-lg p-4 space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Delete Project</h4>
                <p className="text-red-200 text-sm mb-4">
                  This action cannot be undone. This will permanently delete the project,
                  all environment variables, and version history.
                </p>
                
                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-red-200 text-sm">
                        Type <strong>{project.name}</strong> to confirm:
                      </Label>
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={project.name}
                        className="bg-gray-800 border-red-600 text-white mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-200 text-sm">Project password:</Label>
                      <Input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter project password"
                        className="bg-gray-800 border-red-600 text-white mt-1"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleDeleteProject}
                        disabled={isDeleting || !deletePassword.trim() || confirmText !== project.name}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                      </Button>
                      <Button
                        onClick={resetDeleteForm}
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
