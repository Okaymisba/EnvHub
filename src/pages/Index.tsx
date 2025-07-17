// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dashboard } from '@/components/Dashboard';
import { LandingPage } from '@/components/LandingPage';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import { SupabaseService } from '@/services/supabaseService';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sharedProjects, setSharedProjects] = useState<(Project & { owner_email: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const [projectsData, sharedProjectsData] = await Promise.all([
        SupabaseService.getProjects(),
        SupabaseService.getSharedProjects()
      ]);
      setProjects(projectsData);
      setSharedProjects(sharedProjectsData);
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

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      setProjects([]);
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

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`);
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

  return (
    <>
      <Helmet>
        <title>EnvHub - Secure Environment Variables Manager</title>
        <meta 
          name="description" 
          content="EnvHub is a secure and simple environment variables manager for developers. Keep your environment variables safe and accessible across your team."
        />
        <meta name="keywords" content="environment variables, .env, secrets management, secure config, devops, developer tools, share environment variables, share env"/>
        <meta name="robots" content="index, follow"/>
        <meta name="author" content="EnvHub Team"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://envhub.net/"/>
        <meta property="og:title" content="EnvHub - Secure Environment Variables Manager"/>
        <meta 
          property="og:description" 
          content="Secure and simple environment variables management for developers and teams."
        />
        <meta property="og:image" content="https://envhub.net/opengraph-image.png"/>

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content="https://envhub.net/"/>
        <meta property="twitter:title" content="EnvHub - Secure Environment Variables Manager"/>
        <meta 
          property="twitter:description" 
          content="Secure and simple environment variables management for developers and teams."
        />
        <meta property="twitter:image" content="https://envhub.net/opengraph-image.png"/>

      </Helmet>
      
      {!user ? (
        <LandingPage onGetStarted={() => navigate('/login')} />
      ) : (
        <Dashboard
          projects={projects}
          sharedProjects={sharedProjects}
          onCreateProject={handleCreateProject}
          onProjectClick={handleProjectClick}
          onLogout={handleLogout}
          loading={loading}
          user={user}
        />
      )}
    </>
  );
};

export default Index;
