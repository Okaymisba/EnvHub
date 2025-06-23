
-- Create enum for user roles in projects
CREATE TYPE public.project_role AS ENUM ('owner', 'admin', 'user');

-- Create project_members table to store who has access to which projects
CREATE TABLE public.project_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.project_role NOT NULL DEFAULT 'user',
  encrypted_project_password TEXT, -- Project password encrypted with user's access password
  access_password_hash TEXT, -- Hash of the password the admin sets for this user
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create project_invitations table for pending invitations
CREATE TABLE public.project_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  role public.project_role NOT NULL DEFAULT 'user',
  encrypted_project_password TEXT NOT NULL,
  access_password_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, invited_email)
);

-- Add RLS policies for project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of projects they belong to
CREATE POLICY "Users can view project members of their projects" 
  ON public.project_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid()
    )
  );

-- Users can insert themselves as members when accepting invitations
CREATE POLICY "Users can accept invitations" 
  ON public.project_members 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Only owners and admins can update member roles
CREATE POLICY "Owners and admins can update member roles" 
  ON public.project_members 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid() 
      AND pm.role IN ('owner', 'admin')
    )
  );

-- Only owners and admins can delete members
CREATE POLICY "Owners and admins can remove members" 
  ON public.project_members 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = project_members.project_id 
      AND pm.user_id = auth.uid() 
      AND pm.role IN ('owner', 'admin')
    )
  );

-- Add RLS policies for project_invitations
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations for projects they have admin/owner access to
CREATE POLICY "Admins can view project invitations" 
  ON public.project_invitations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid() 
      AND pm.role IN ('owner', 'admin')
    )
  );

-- Admins and owners can create invitations
CREATE POLICY "Admins can create invitations" 
  ON public.project_invitations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_members pm 
      WHERE pm.project_id = project_invitations.project_id 
      AND pm.user_id = auth.uid() 
      AND pm.role IN ('owner', 'admin')
    )
  );

-- Create a function to automatically add project owner as member
CREATE OR REPLACE FUNCTION public.add_project_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.project_members (project_id, user_id, role, accepted_at)
  VALUES (NEW.id, NEW.user_id, 'owner', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically add project creator as owner
CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.add_project_owner();

-- Create a function to get user email by ID (for displaying member emails)
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid uuid)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
