// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetails } from '@/components/ProjectDetails';
import { Project } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initPage = async () => {
      try {
        const currentUser = await SupabaseService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
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
    <div>
      <Helmet>
        <title>{project ? `${project.name} - EnvHub` : 'Project - EnvHub'}</title>
        <meta 
          name="description" 
          content={project 
            ? `Manage environment variables for ${project.name} on EnvHub. Securely store and share your configuration.`
            : 'Securely manage your environment variables with EnvHub.'
          }
        />
        <meta name="robots" content="noindex, nofollow"/>
        <meta name="author" content="EnvHub Team"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="url" content={`https://envhub.net/project/${projectId}`}/>

        {/* Open Graph */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={`https://envhub.net/project/${projectId}`}/>
        <meta property="og:title" content={project ? `${project.name} - EnvHub` : 'Project - EnvHub'}/>
        <meta 
          property="og:description" 
          content={project
            ? `Manage environment variables for ${project.name} on EnvHub.`
            : 'Securely manage your environment variables with EnvHub.'
          }
        />
        <meta property="og:image" content="https://envhub.net/opengraph-project.png"/>

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:url" content={`https://envhub.net/project/${projectId}`}/>
        <meta property="twitter:title" content={project ? `${project.name} - EnvHub` : 'Project - EnvHub'}/>
        <meta 
          property="twitter:description" 
          content={project
            ? `Manage environment variables for ${project.name} on EnvHub.`
            : 'Securely manage your environment variables with EnvHub.'
          }
        />
        <meta property="twitter:image" content="https://envhub.net/opengraph-project.png"/>

      </Helmet>

      {!loading && project && (
        <ProjectDetails 
          project={project} 
          onBack={handleBack}
          loading={loading}
        />
      )}
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ProjectPage;
