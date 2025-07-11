// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

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
      <Card className="bg-black/90 border border-purple-900 w-full max-w-md mx-4 shadow-2xl rounded-2xl relative">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Project Settings</CardTitle>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-8 w-8 p-0 rounded-full bg-black/40"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="space-y-2">
            <Label className="text-gray-300">Project Name</Label>
            <div className="bg-black/70 border border-purple-800 rounded-lg px-3 py-2">
              <span className="text-white font-mono">{project.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Created</Label>
            <div className="bg-black/70 border border-purple-800 rounded-lg px-3 py-2">
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
          <div className="border-t border-purple-900 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            </div>

            <div className="bg-gradient-to-br from-red-900/80 to-purple-900/60 border border-red-800 rounded-xl p-4 space-y-4 shadow-lg">
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
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-lg"
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
                        className="bg-black/70 border border-red-600 text-white mt-1 rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-red-200 text-sm">Project password:</Label>
                      <Input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter project password"
                        className="bg-black/70 border border-red-600 text-white mt-1 rounded-lg"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleDeleteProject}
                        disabled={isDeleting || !deletePassword.trim() || confirmText !== project.name}
                        className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white rounded-lg"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                      </Button>
                      <Button
                        onClick={resetDeleteForm}
                        variant="ghost"
                        className="text-gray-400 hover:text-white rounded-lg"
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
