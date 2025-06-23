
-- Update env_versions table to store individual environment variables instead of full file content
-- First, let's add new columns for the new structure
ALTER TABLE public.env_versions ADD COLUMN IF NOT EXISTS env_name TEXT;
ALTER TABLE public.env_versions ADD COLUMN IF NOT EXISTS env_value_encrypted TEXT;

-- Create a new table for individual environment variables
CREATE TABLE IF NOT EXISTS public.env_variables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  version_id UUID REFERENCES public.env_versions(id) ON DELETE CASCADE NOT NULL,
  env_name TEXT NOT NULL,
  env_value_encrypted TEXT NOT NULL,
  salt TEXT NOT NULL,
  nonce TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for env_variables
ALTER TABLE public.env_variables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for env_variables table
CREATE POLICY "Users can view env variables of their own projects" 
  ON public.env_variables 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = env_variables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create env variables for their own projects" 
  ON public.env_variables 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = env_variables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update env variables of their own projects" 
  ON public.env_variables 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = env_variables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete env variables of their own projects" 
  ON public.env_variables 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = env_variables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Add project password hash column to projects table for validation
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update the env_versions table structure to support the new workflow
-- We'll keep the existing columns for backward compatibility but modify usage
ALTER TABLE public.env_versions DROP COLUMN IF EXISTS encrypted_data;
ALTER TABLE public.env_versions ADD COLUMN IF NOT EXISTS variable_count INTEGER DEFAULT 0;
