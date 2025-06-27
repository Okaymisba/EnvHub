
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetails } from '@/components/ProjectDetails';
import { AuthForm } from '@/components/AuthForm';
import { Project } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initPage = async () => {
      try {
        const currentUser = await SupabaseService.getCurrentUser();
        if (!currentUser) {
          setShowAuth(true);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        if (projectId) {
          // Try to get the project - this will check if user has access
          const [userProjects, sharedProjects] = await Promise.all([
            SupabaseService.getProjects(),
            SupabaseService.getSharedProjects()
          ]);

          const foundProject = [...userProjects, ...sharedProjects].find(p => p.id === projectId);
          
          if (!foundProject) {
            toast({
              title: 'Project not found',
              description: 'You do not have access to this project',
              variant: 'destructive'
            });
            navigate('/');
            return;
          }

          setProject(foundProject);
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive'
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [projectId, navigate, toast]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await SupabaseService.signIn(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
      setUser(result.user);
      setShowAuth(false);
      
      // Reload the page to fetch project data
      window.location.reload();
      
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

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!user && showAuth) {
    return (
      <div className="relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 text-gray-400 hover:text-white transition-colors duration-300"
        >
          ← Back to Home
        </button>
        <AuthForm
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGoogleAuth={handleGoogleAuth}
          loading={loading}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400">Project not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectDetails
      project={project}
      onBack={handleBack}
      loading={loading}
    />
  );
};

export default ProjectPage;
