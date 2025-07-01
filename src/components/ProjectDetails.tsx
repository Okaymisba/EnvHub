import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, History, Eye, EyeOff, Copy, Plus, Settings, Trash2 } from 'lucide-react';
import { Project, EnvVariable, ProjectRole } from '@/types/project';
import { EnvVariableForm } from './EnvVariableForm';
import { VersionHistory } from './VersionHistory';
import { ProjectSettings } from './ProjectSettings';
import { ProjectMembers } from './ProjectMembers';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { PasswordUtils } from '@/utils/passwordUtils';
import { CryptoUtils } from '@/utils/crypto';

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
  loading: boolean;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onBack,
  loading: initialLoading
}) => {
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<ProjectRole | null>(null);
  const [revealedValues, setRevealedValues] = useState<Record<string, string>>({});
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState<{ variableId: string; isOpen: boolean }>({ variableId: '', isOpen: false });
  const [deletePrompt, setDeletePrompt] = useState<{ variableId: string; isOpen: boolean }>({ variableId: '', isOpen: false });
  const [tempPassword, setTempPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProjectData();
    loadUserRole();
  }, [project.id]);

  const loadUserRole = async () => {
    try {
      const role = await SupabaseService.getCurrentUserRole(project.id);
      setCurrentUserRole(role);
    } catch (error) {
      console.error('Failed to load user role:', error);
    }
  };

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [envVars, versionHistory] = await Promise.all([
        SupabaseService.getCurrentEnvVariables(project.id),
        SupabaseService.getVersions(project.id)
      ]);
      setEnvVariables(envVars);
      setVersions(versionHistory);
    } catch (error) {
      console.error('Load project data error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnvVariables = async (entries: any[], password: string) => {
    try {
      if (currentUserRole === 'user') {
        toast({
          title: 'Permission Denied',
          description: 'Users can only view and decrypt variables, not modify them',
          variant: 'destructive'
        });
        return;
      }
      if (currentUserRole === 'admin') {
        const currentUser = await SupabaseService.getCurrentUser();
        const encryptedPassword = await SupabaseService.getEncryptedProjectPassword(project.id, currentUser.id);

        if (!encryptedPassword) {
          toast({
            title: 'Error',
            description: 'No encrypted project password found for your account.',
            variant: 'destructive'
          });
          return;
        }

        const decryptedPassword = await CryptoUtils.decrypt(encryptedPassword, password);

        if (!decryptedPassword) {
          toast({
            title: 'Invalid Password',
            description: 'The provided password is incorrect',
            variant: 'destructive'
          });
          return;
        }

        await SupabaseService.verifyProjectPassword(project.id, decryptedPassword);
        await SupabaseService.createEnvVersion(project.id, entries, decryptedPassword);
        await loadProjectData();
        toast({
          title: 'Success!',
          description: `Added ${entries.length} new environment variables securely`
        });
      }

      if (currentUserRole == 'owner') {

        await SupabaseService.createEnvVersion(project.id, entries, password);
        await loadProjectData();
        toast({
          title: 'Success!',
          description: `Added ${entries.length} new environment variables securely`
        });
      }
    } catch (error: any) {
      console.error('Save environment variables error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save environment variables',
        variant: 'destructive'
      });
    }
  };

  const handleRevealValue = async (variableId: string) => {
    if (!tempPassword.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your project password to decrypt the value',
        variant: 'destructive'
      });
      return;
    }

    try {
      const variable = envVariables.find(v => v.id === variableId);
      if (!variable) return;

      const decryptedValue = await SupabaseService.decryptEnvValue(variable, tempPassword);
      setRevealedValues(prev => ({ ...prev, [variableId]: decryptedValue }));
      setPasswordPrompt({ variableId: '', isOpen: false });
      setTempPassword('');

      toast({
        title: 'Value decrypted',
        description: 'Environment variable value revealed successfully'
      });
    } catch (error) {
      toast({
        title: 'Decryption failed',
        description: 'Invalid password or corrupted data',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteVariable = async (variableId: string) => {
    if (!tempPassword.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your project password to delete the variable',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Verify password first
      const isValidPassword = await SupabaseService.verifyProjectPassword(project.id, tempPassword);
      if (!isValidPassword) {
        throw new Error('Invalid project password');
      }

      await SupabaseService.deleteEnvVariable(variableId);
      await loadProjectData();
      setDeletePrompt({ variableId: '', isOpen: false });
      setTempPassword('');

      toast({
        title: 'Variable deleted',
        description: 'Environment variable has been removed successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete variable',
        variant: 'destructive'
      });
    }
  };

  const hideValue = (variableId: string) => {
    setRevealedValues(prev => {
      const updated = { ...prev };
      delete updated[variableId];
      return updated;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Value copied to clipboard'
    });
  };

  const handleDownloadVersion = async (version: any) => {
    try {
      await SupabaseService.downloadVersionAsEncryptedFile(version, project.id, project.name);
      toast({
        title: 'Downloaded!',
        description: `Version ${version.version_number} downloaded as encrypted file`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download version',
        variant: 'destructive'
      });
    }
  };

  const canModify = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[220px] h-[220px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[180px] h-[180px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 border-b border-purple-900/60 shadow-lg">
        <div className="flex justify-between items-center h-16 px-4 sm:px-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-blue-800 rounded-full flex items-center justify-center shadow">
                <span className="text-white font-mono text-sm">E</span>
              </div>
              <h1 className="text-xl font-bold text-white drop-shadow">{project.name}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {currentUserRole && (
              <div>
                {/* Icon only on mobile, icon+text on sm+ */}
                <div className="sm:hidden">
                  <ProjectMembers
                    project={project}
                    currentUserRole={currentUserRole}
                    iconOnly
                  />
                </div>
                <div className="hidden sm:block">
                  <ProjectMembers
                    project={project}
                    currentUserRole={currentUserRole}
                  />
                </div>
              </div>
            )}
            <Button
              onClick={() => setIsVersionHistoryOpen(true)}
              variant="outline"
              size="sm"
              className="bg-black/60 border-none text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 hover:text-white"
            >
              <History className="mr-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="outline"
              size="sm"
              className="bg-black/60 border-none text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 hover:text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Variables - Left Side */}
          <div>
            <Card className="bg-black/80 border border-purple-900 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  Environment Variables
                  <span className="ml-2 px-2 py-1 bg-gradient-to-r from-purple-700 to-blue-700 text-gray-100 text-xs rounded-full">
                    {envVariables.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : envVariables.length === 0 ? (
                  <div className="text-center py-8">
                    <Plus className="mx-auto h-8 w-8 text-purple-600 mb-3" />
                    <p className="text-gray-300">No environment variables yet</p>
                    <p className="text-gray-500 text-sm">Add your first variables using the form on the right</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {envVariables.map((envVar) => (
                      <div key={envVar.id} className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-xl p-4 border border-purple-800 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <span className="font-mono text-sm text-green-400 font-medium">
                            {envVar.env_name}
                          </span>
                          <div className="font-mono text-xs mt-2">
                            {revealedValues[envVar.id] ? (
                              <span className="text-white bg-black/60 px-2 py-1 rounded break-all whitespace-pre-wrap block w-full">
                                {revealedValues[envVar.id]}
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                Encrypted: {envVar.env_value_encrypted.substring(0, 32)}...
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          {revealedValues[envVar.id] ? (
                            <>
                              <Button
                                onClick={() => copyToClipboard(revealedValues[envVar.id])}
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => hideValue(envVar.id)}
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white h-6 w-6 p-0"
                              >
                                <EyeOff className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => setPasswordPrompt({ variableId: envVar.id, isOpen: true })}
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white h-6 w-6 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          {canModify && (
                            <Button
                              onClick={() => setDeletePrompt({ variableId: envVar.id, isOpen: true })}
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add Variables Form - Right Side */}
          <div>
            {canModify ? (
              <EnvVariableForm onSave={handleSaveEnvVariables} loading={loading} />
            ) : (
              <Card className="bg-black/80 border border-purple-900 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Environment Variables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-3">
                      <Eye className="mx-auto h-8 w-8 mb-2" />
                      <p>Read-Only Access</p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      You have read-only access to this project. You can view and decrypt variables but cannot modify them.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Password Prompt Modal */}
        {passwordPrompt.isOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <Card className="bg-black/90 border border-purple-900 w-full max-w-md shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Enter Project Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Project password"
                    className="bg-black/70 border border-purple-800 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleRevealValue(passwordPrompt.variableId)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPasswordPrompt({ variableId: '', isOpen: false });
                        setTempPassword('');
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleRevealValue(passwordPrompt.variableId)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      disabled={!tempPassword.trim()}
                    >
                      Reveal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletePrompt.isOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <Card className="bg-black/90 border border-purple-900 w-full max-w-md shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Delete Environment Variable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    Enter your project password to confirm deletion of this environment variable.
                  </p>
                  <Input
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Project password"
                    className="bg-black/70 border border-purple-800 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleDeleteVariable(deletePrompt.variableId)}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setDeletePrompt({ variableId: '', isOpen: false });
                        setTempPassword('');
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDeleteVariable(deletePrompt.variableId)}
                      className="bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 text-white"
                      disabled={!tempPassword.trim()}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Version History Modal */}
        <VersionHistory
          isOpen={isVersionHistoryOpen}
          onClose={() => setIsVersionHistoryOpen(false)}
          versions={versions}
          project={project}
          onDownloadVersion={handleDownloadVersion}
          loading={loading}
        />

        {/* Settings Modal */}
        <ProjectSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          project={project}
          onProjectDeleted={onBack}
        />
      </main>

      {/* Animations for blobs */}
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
