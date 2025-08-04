// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Trash2, AlertTriangle, Copy, Key, RefreshCw } from 'lucide-react';
import { Project } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {supabase} from "@/integrations/supabase/client.ts";

interface ProjectSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onProjectDeleted: () => void;
  currentUserRole?: 'owner' | 'admin' | 'user';
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  isOpen,
  onClose,
  project,
  onProjectDeleted,
  currentUserRole = 'user' // Default to most restrictive role if not provided
}) => {
  const [deletePassword, setDeletePassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (project?.api_key) {
      setApiKey(project.api_key);
    }
  }, [project]);

  const generateApiKey = async () => {
    setIsGenerating(true);
    try {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      const randomPart = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

      const timestamp = Date.now().toString(36);
      const newApiKey = `envhub_${randomPart.substring(0, 24)}_${randomPart.substring(24)}_${timestamp}`;
      
      const { data, error } = await supabase
        .from('projects')
        .update({ api_key: newApiKey })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      
      setApiKey(data.api_key);
      toast({
        title: 'API Key Updated',
        description: 'Your API key has been regenerated successfully',
      });
    } catch (error: any) {
      console.error('Error generating API key:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate API key',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    });
  };

  const deleteApiKey = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ api_key: null })
        .eq('id', project.id);

      if (error) throw error;
      
      setApiKey('');
      toast({
        title: 'API Key Deleted',
        description: 'Your API key has been removed',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

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

  // Check if current user can manage API keys
  const canManageApiKeys = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canGenerateApiKeys = currentUserRole === 'owner';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-black/90 border border-purple-900 w-full max-w-md mx-4 shadow-2xl rounded-2xl relative flex flex-col max-h-[90vh]">
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
        <div className="overflow-y-auto px-1 scrollbar-custom">
          <style jsx global>{`
            .scrollbar-custom::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 10px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: rgba(168, 85, 247, 0.5);
              border-radius: 10px;
              transition: all 0.3s ease;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: rgba(192, 132, 252, 0.7);
            }
            .scrollbar-custom {
              scrollbar-width: thin;
              scrollbar-color: rgba(168, 85, 247, 0.5) rgba(0, 0, 0, 0.1);
            }
          `}</style>
          <CardContent className="space-y-6">
            {/* Project Info */}
            <div className="space-y-2">
              <Label className="text-gray-300">Project Name</Label>
              <div className="bg-black/70 border border-purple-800 rounded-lg px-3 py-2">
                <span className="text-white font-mono">{project.name}</span>
              </div>
            </div>

            {/* API Key Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-300">API Key</Label>
                {canGenerateApiKeys ? (
                  <Button
                    onClick={apiKey ? generateApiKey : generateApiKey}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-black/40 hover:underline flex items-center gap-1"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" />
                        Generating...
                      </>
                    ) : apiKey ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Key className="h-3.5 w-3.5 mr-1" />
                        Generate API Key
                      </>
                    )}
                  </Button>
                ) : (
                  <span className="text-xs text-gray-400">
                    {currentUserRole === 'user' 
                      ? 'Contact project admin' 
                      : 'Only project owner can manage API keys'}
                  </span>
                )}
              </div>
              
              {apiKey ? (
                <div className="relative">
                  <textarea
                    readOnly
                    value={canManageApiKeys ? apiKey : '••••••••••••••••••••••••••••••••'}
                    className={`w-full bg-black/70 border border-purple-800 text-gray-300 font-mono p-2 pr-10 rounded-md ${
                      !canManageApiKeys ? 'text-opacity-50' : ''
                    } min-h-[40px] max-h-32 overflow-y-auto resize-none`}
                    style={{
                      fontFamily: 'monospace',
                      lineHeight: '1.25',
                    }}
                    rows={3}
                    wrap="soft"
                  />
                  {canManageApiKeys && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-white"
                              onClick={copyToClipboard}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {canGenerateApiKeys && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-400 hover:text-red-300"
                                onClick={deleteApiKey}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete API key</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-black/70 border border-dashed border-purple-800 rounded-lg p-4 text-center">
                  <Key className="h-5 w-5 mx-auto text-purple-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    {canGenerateApiKeys 
                      ? 'No API key generated yet' 
                      : 'API key not available for your role'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {canGenerateApiKeys 
                      ? 'Generate an API key to use with the EnvHub API'
                      : currentUserRole === 'admin' 
                        ? 'Only the project owner can manage API keys' 
                        : 'Contact a project admin to manage API keys'}
                  </p>
                </div>
              )}
              {apiKey && canManageApiKeys && (
                <p className="text-xs text-gray-400 mt-1">
                  This key provides full access to your project's environment variables. Keep it secret.
                </p>
              )}
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
        </div>
      </Card>
    </div>
  );
};
