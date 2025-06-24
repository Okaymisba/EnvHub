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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div>
          <div className="flex justify-between items-center h-16 p-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-mono text-sm">E</span>
                </div>
                <h1 className="text-xl font-semibold text-white">{project.name}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {currentUserRole && (
                <ProjectMembers
                  project={project}
                  currentUserRole={currentUserRole}
                />
              )}
              <Button
                onClick={() => setIsVersionHistoryOpen(true)}
                variant="outline"
                size="sm"
                className="bg-gray-900 border-none text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <History className="mr-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsSettingsOpen(true)}
                variant="outline"
                size="sm"
                className=" bg-gray-900 border-none text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Variables - Left Side */}
          <div>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  Environment Variables
                  <span className="ml-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                    {envVariables.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : envVariables.length === 0 ? (
                  <div className="text-center py-8">
                    <Plus className="mx-auto h-8 w-8 text-gray-600 mb-3" />
                    <p className="text-gray-400">No environment variables yet</p>
                    <p className="text-gray-500 text-sm">Add your first variables using the form on the right</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {envVariables.map((envVar) => (
                      <div key={envVar.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-green-400 font-medium">
                            {envVar.env_name}
                          </span>
                          <div className="flex items-center space-x-2">
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
                        <div className="font-mono text-xs">
                          {revealedValues[envVar.id] ? (
                            <span className="text-white bg-gray-900 px-2 py-1 rounded">
                              {revealedValues[envVar.id]}
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Encrypted: {envVar.env_value_encrypted.substring(0, 32)}...
                            </span>
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
              <Card className="bg-gray-900 border-gray-700">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-900 border-gray-700 w-96">
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
                    className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-blue-600 hover:bg-blue-700"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-900 border-gray-700 w-96">
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
                    className="bg-gray-800 border-gray-600 text-white"
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
                      className="bg-red-600 hover:bg-red-700"
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
    </div>
  );
};
