
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Download, Package } from 'lucide-react';
import { EnvVersion, Project } from '@/types/project';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: EnvVersion[];
  project: Project;
  onDownloadVersion: (version: EnvVersion) => void;
  loading: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  project,
  onDownloadVersion,
  loading
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Version History - {project.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-20"></div>
                        <div className="h-3 bg-gray-700 rounded w-32"></div>
                      </div>
                      <div className="h-8 bg-gray-700 rounded w-24"></div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No versions yet</h3>
              <p className="text-gray-400">Create your first environment variables to see version history.</p>
            </div>
          ) : (
            versions.map((version) => (
              <Card key={version.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
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
                      className="bg-gray-900 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      .env
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500">
                    {version.variable_count || 0} environment variables
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {versions.length > 0 && (
          <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400">
              📁 Downloaded files are encrypted (.env.enc) and require the original project password to decrypt.
              Use a CLI tool or decrypt manually to view the plaintext values.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
