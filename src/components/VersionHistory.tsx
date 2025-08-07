// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Download, Package, Lock } from 'lucide-react';
import { Project } from '@/types/project';
import { X } from 'lucide-react';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: any[];
  project: Project;
  onDownloadVersion: (version: any) => void;
  loading: boolean;
  isPaidUser: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  project,
  onDownloadVersion,
  loading,
  isPaidUser
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isPaidUser) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl text-white max-w-md w-full p-6">
          <div className="text-center py-6">
            <Lock className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Upgrade Required</h3>
            <p className="text-gray-400 mb-6">Version history is a premium feature available with Pro and Team plans.</p>
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => {
                  onClose();
                  // Navigate to pricing/upgrade page
                  // window.location.href = '/pricing';
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Upgrade to Pro
              </Button>
              <Button 
                onClick={onClose}
                variant="outline"
                className="w-full text-gray-300 border-gray-700 hover:bg-gray-900/50"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-purple-900 shadow-2xl rounded-2xl text-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-0 [&>button]:hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-purple-900/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-800/70">
        {/* Animated background blob */}
        <div className="absolute -top-8 -left-8 w-32 h-32 sm:-top-16 sm:-left-16 sm:w-48 sm:h-48 bg-purple-900 opacity-20 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="relative z-10 px-6 pt-4 pb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Version History - {project.name}
          </DialogTitle>

          <DialogClose asChild>
            <Button variant="ghost" className="absolute top-4 right-4 p-2 rounded-full hover:bg-purple-800/20 transition">
              <X className="h-5 w-5 text-white" />
            </Button>
          </DialogClose>

        </DialogHeader>

        <div className="relative z-10 space-y-3 px-6 pb-4 pt-2">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border-purple-800 animate-pulse rounded-xl shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-4 bg-purple-900/30 rounded w-20"></div>
                        <div className="h-3 bg-blue-900/20 rounded w-32"></div>
                      </div>
                      <div className="h-8 bg-purple-900/30 rounded w-24"></div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No versions yet</h3>
              <p className="text-gray-400">Create your first environment variables to see version history.</p>
            </div>
          ) : (
            versions.map((version) => (
              <Card key={version.id} className="bg-black/80 border border-purple-900 hover:scale-[1.01] hover:border-blue-700 transition-all duration-200 rounded-xl shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-sm font-mono">
                        v{version.version_number}
                      </CardTitle>
                      <div className="flex items-center text-gray-400 text-xs mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(version.created_at)}
                      </div>
                    </div>
                    <Button
                      onClick={() => onDownloadVersion(version)}
                      size="sm"
                      variant="outline"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 border-none text-white hover:from-purple-700 hover:to-blue-700 font-semibold shadow rounded-lg transition"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      .env
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-300">
                    {version.variable_count || 0} environment variables
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {versions.length > 0 && (
          <div className="relative z-10 mt-4 mx-6 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-800 mb-6">
            <p className="text-xs text-gray-400">
              📁 Downloaded files are encrypted (.env) and require the original project password to decrypt.
              Use a CLI tool or decrypt manually to view the plaintext values.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};