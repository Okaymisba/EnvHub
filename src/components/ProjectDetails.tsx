
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Download, Calendar, File } from 'lucide-react';
import { Project, EnvVersion } from '@/types/project';

interface ProjectDetailsProps {
  project: Project;
  versions: EnvVersion[];
  onBack: () => void;
  onUploadVersion: (file: File, password: string) => Promise<void>;
  onDownloadVersion: (version: EnvVersion, password: string) => Promise<void>;
  loading: boolean;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  versions,
  onBack,
  onUploadVersion,
  onDownloadVersion,
  loading
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !password.trim()) return;

    setUploading(true);
    try {
      await onUploadVersion(selectedFile, password);
      setSelectedFile(null);
      setPassword('');
      setIsUploadModalOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Environment Versions</h2>
            <p className="text-slate-400">Manage encrypted .env file versions</p>
          </div>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Upload New .env Version</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Upload a new .env file. It will be encrypted before storage.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="env-file" className="text-white">.env File</Label>
                  <Input
                    id="env-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".env,.txt"
                    onChange={handleFileSelect}
                    required
                    className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upload-password" className="text-white">Project Password</Label>
                  <Input
                    id="upload-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter project password"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {uploading ? 'Uploading...' : 'Upload & Encrypt'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Versions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-slate-700 rounded w-24"></div>
                      <div className="h-4 bg-slate-700 rounded w-32"></div>
                    </div>
                    <div className="h-9 bg-slate-700 rounded w-20"></div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-12">
            <File className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No versions yet</h3>
            <p className="text-slate-400 mb-6">Upload your first .env file to get started.</p>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload First Version
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <Card
                key={version.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center">
                        <File className="mr-2 h-4 w-4" />
                        Version {version.version_number}
                      </CardTitle>
                      <CardDescription className="flex items-center text-slate-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(version.created_at)}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        const password = prompt('Enter project password to decrypt:');
                        if (password) {
                          onDownloadVersion(version, password);
                        }
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
