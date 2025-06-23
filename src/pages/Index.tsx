
import React, { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/components/Dashboard';
import { ProjectDetails } from '@/components/ProjectDetails';
import { Project, EnvVersion } from '@/types/project';
import { CryptoUtils } from '@/utils/crypto';
import { useToast } from '@/hooks/use-toast';
import { SupabaseService } from '@/services/supabaseService';

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
    const initAuth = async () => {
      try {
        const currentUser = await SupabaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadProjects();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await SupabaseService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Load projects error:', error);
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
      const versionsData = await SupabaseService.getVersions(projectId);
      setVersions(versionsData);
    } catch (error) {
      console.error('Load versions error:', error);
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
      const result = await SupabaseService.signIn(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setUser(result.user);
      await loadProjects();
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in'
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await SupabaseService.signUp(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast({
        title: 'Check your email',
        description: 'Please verify your email to complete registration'
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await SupabaseService.signInWithGoogle();
      if (result.error) {
        throw new Error(result.error.message);
      }
      // Google auth will redirect, so we don't need to handle success here
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      setProjects([]);
      setCurrentProject(null);
      setVersions([]);
      toast({
        title: 'Signed out',
        description: 'Come back soon!'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateProject = async (name: string, password: string) => {
    try {
      const newProject = await SupabaseService.createProject(name, password);
      await loadProjects();
      toast({
        title: 'Project created!',
        description: `${name} is ready for your environment variables`
      });
    } catch (error: any) {
      console.error('Create project error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive'
      });
    }
  };

  const handleProjectClick = async (project: Project) => {
    setCurrentProject(project);
    await loadVersions(project.id);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading EnvHub...</p>
        </div>
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
        onBack={() => setCurrentProject(null)}
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
