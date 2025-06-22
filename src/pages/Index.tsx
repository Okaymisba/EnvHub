
import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/components/Dashboard';
import { ProjectDetails } from '@/components/ProjectDetails';
import { Project, EnvVersion } from '@/types/project';
import { CryptoUtils } from '@/utils/crypto';
import { useToast } from '@/hooks/use-toast';

// Mock Supabase functionality - replace with actual Supabase integration
const mockSupabase = {
  currentUser: null as any,
  
  async signIn(email: string, password: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser = { id: '1', email };
    localStorage.setItem('envhub_user', JSON.stringify(this.currentUser));
    return { user: this.currentUser, error: null };
  },

  async signUp(email: string, password: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser = { id: '1', email };
    localStorage.setItem('envhub_user', JSON.stringify(this.currentUser));
    return { user: this.currentUser, error: null };
  },

  async signInWithGoogle() {
    // Simulate OAuth
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser = { id: '1', email: 'user@gmail.com' };
    localStorage.setItem('envhub_user', JSON.stringify(this.currentUser));
    return { user: this.currentUser, error: null };
  },

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('envhub_user');
    localStorage.removeItem('envhub_projects');
    localStorage.removeItem('envhub_versions');
  },

  getCurrentUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem('envhub_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  },

  async getProjects() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('envhub_projects');
    return stored ? JSON.parse(stored) : [];
  },

  async createProject(name: string) {
    const projects = await this.getProjects();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
      user_id: this.currentUser?.id || '1',
      version_count: 0
    };
    projects.push(newProject);
    localStorage.setItem('envhub_projects', JSON.stringify(projects));
    return newProject;
  },

  async getVersions(projectId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('envhub_versions');
    const versions = stored ? JSON.parse(stored) : [];
    return versions.filter((v: EnvVersion) => v.project_id === projectId);
  },

  async createVersion(projectId: string, encryptedData: any) {
    const versions = await this.getVersions(projectId);
    const newVersion: EnvVersion = {
      id: Date.now().toString(),
      project_id: projectId,
      version_number: versions.length + 1,
      encrypted_data: encryptedData.ciphertext,
      salt: encryptedData.salt,
      nonce: encryptedData.nonce,
      tag: encryptedData.tag,
      created_at: new Date().toISOString()
    };
    
    const allVersions = localStorage.getItem('envhub_versions');
    const allVersionsArray = allVersions ? JSON.parse(allVersions) : [];
    allVersionsArray.push(newVersion);
    localStorage.setItem('envhub_versions', JSON.stringify(allVersionsArray));
    
    // Update project version count
    const projects = await this.getProjects();
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].version_count = (projects[projectIndex].version_count || 0) + 1;
      localStorage.setItem('envhub_projects', JSON.stringify(projects));
    }
    
    return newVersion;
  }
};

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [versions, setVersions] = useState<EnvVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = mockSupabase.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadProjects();
    }
    setInitialLoading(false);
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await mockSupabase.getProjects();
      setProjects(projectsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async (projectId: string) => {
    setLoading(true);
    try {
      const versionsData = await mockSupabase.getVersions(projectId);
      setVersions(versionsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load versions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, error } = await mockSupabase.signIn(email, password);
      if (error) throw error;
      setUser(user);
      await loadProjects();
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to EnvHub'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, error } = await mockSupabase.signUp(email, password);
      if (error) throw error;
      setUser(user);
      await loadProjects();
      toast({
        title: 'Welcome to EnvHub!',
        description: 'Account created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { user, error } = await mockSupabase.signInWithGoogle();
      if (error) throw error;
      setUser(user);
      await loadProjects();
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await mockSupabase.signOut();
    setUser(null);
    setProjects([]);
    setCurrentProject(null);
    setVersions([]);
    toast({
      title: 'Signed out',
      description: 'Come back soon!'
    });
  };

  const handleCreateProject = async (name: string, password: string) => {
    try {
      await mockSupabase.createProject(name);
      await loadProjects();
      toast({
        title: 'Project created!',
        description: `${name} is ready for your environment variables`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      });
    }
  };

  const handleProjectClick = async (project: Project) => {
    setCurrentProject(project);
    await loadVersions(project.id);
  };

  const handleUploadVersion = async (file: File, password: string) => {
    try {
      const content = await file.text();
      const encryptedData = await CryptoUtils.encrypt(content, password);
      await mockSupabase.createVersion(currentProject!.id, encryptedData);
      await loadVersions(currentProject!.id);
      await loadProjects(); // Refresh project counts
      toast({
        title: 'Version uploaded!',
        description: 'Your .env file has been encrypted and stored securely'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload version. Check your password.',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadVersion = async (version: EnvVersion, password: string) => {
    try {
      const encryptedData = {
        ciphertext: version.encrypted_data,
        salt: version.salt,
        nonce: version.nonce,
        tag: version.tag
      };
      const decryptedContent = await CryptoUtils.decrypt(encryptedData, password);
      
      // Create and download file
      const blob = new Blob([decryptedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject!.name}-v${version.version_number}.env`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Downloaded!',
        description: `Version ${version.version_number} decrypted and downloaded`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to decrypt version. Check your password.',
        variant: 'destructive'
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleAuth={handleGoogleAuth}
        loading={loading}
      />
    );
  }

  if (currentProject) {
    return (
      <ProjectDetails
        project={currentProject}
        versions={versions}
        onBack={() => setCurrentProject(null)}
        onUploadVersion={handleUploadVersion}
        onDownloadVersion={handleDownloadVersion}
        loading={loading}
      />
    );
  }

  return (
    <Dashboard
      projects={projects}
      onCreateProject={handleCreateProject}
      onProjectClick={handleProjectClick}
      onLogout={handleLogout}
      loading={loading}
    />
  );
};

export default Index;
