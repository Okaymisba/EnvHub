
-- Create function to get user's subscription limits
CREATE OR REPLACE FUNCTION public.get_user_subscription_limits(user_uuid UUID)
RETURNS TABLE (
  plan TEXT,
  max_projects INTEGER,
  max_env_vars_per_project INTEGER,
  max_team_members INTEGER,
  has_cli_access BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_subscription RECORD;
BEGIN
  -- Get user's active subscription
  SELECT * INTO user_subscription
  FROM public.subscriptions
  WHERE user_id = user_uuid AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  -- If no active subscription, return free plan limits
  IF user_subscription IS NULL THEN
    RETURN QUERY SELECT 
      'Free'::TEXT,
      2::INTEGER,
      20::INTEGER,
      0::INTEGER,
      FALSE::BOOLEAN;
    RETURN;
  END IF;

  -- Return limits based on subscription plan
  IF user_subscription.variant_name ILIKE '%pro%' THEN
    RETURN QUERY SELECT 
      'Pro'::TEXT,
      10::INTEGER,
      50::INTEGER,
      5::INTEGER,
      TRUE::BOOLEAN;
  ELSIF user_subscription.variant_name ILIKE '%team%' THEN
    RETURN QUERY SELECT 
      'Team'::TEXT,
      50::INTEGER,
      200::INTEGER,
      25::INTEGER,
      TRUE::BOOLEAN;
  ELSE
    -- Default to free plan if variant not recognized
    RETURN QUERY SELECT 
      'Free'::TEXT,
      2::INTEGER,
      20::INTEGER,
      0::INTEGER,
      FALSE::BOOLEAN;
  END IF;
END;
$$;

-- Create function to check if user can create a project
CREATE OR REPLACE FUNCTION public.can_user_create_project(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_limits RECORD;
  current_project_count INTEGER;
BEGIN
  -- Get user's subscription limits
  SELECT * INTO user_limits
  FROM public.get_user_subscription_limits(user_uuid);

  -- Count user's current projects (only owned projects, not shared ones)
  SELECT COUNT(*) INTO current_project_count
  FROM public.projects
  WHERE user_id = user_uuid;

  -- Check if user can create more projects
  RETURN current_project_count < user_limits.max_projects;
END;
$$;

-- Create function to check if user can add env variables to a project
CREATE OR REPLACE FUNCTION public.can_user_add_env_vars(user_uuid UUID, project_uuid UUID, new_var_count INTEGER DEFAULT 1)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_limits RECORD;
  current_env_count INTEGER;
BEGIN
  -- Get user's subscription limits
  SELECT * INTO user_limits
  FROM public.get_user_subscription_limits(user_uuid);

  -- Count current env variables in the latest version of the project
  SELECT COALESCE(ev.variable_count, 0) INTO current_env_count
  FROM public.env_versions ev
  WHERE ev.project_id = project_uuid
  ORDER BY ev.version_number DESC
  LIMIT 1;

  -- If no versions exist, count is 0
  IF current_env_count IS NULL THEN
    current_env_count := 0;
  END IF;

  -- Check if user can add more env variables
  RETURN (current_env_count + new_var_count) <= user_limits.max_env_vars_per_project;
END;
$$;

-- Update projects table to add constraint for project creation
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS check_user_can_create_project;
ALTER TABLE public.projects ADD CONSTRAINT check_user_can_create_project 
  CHECK (public.can_user_create_project(user_id));

-- Update env_versions table to add constraint for env variable limits
ALTER TABLE public.env_versions DROP CONSTRAINT IF EXISTS check_user_can_add_env_vars;
ALTER TABLE public.env_versions ADD CONSTRAINT check_user_can_add_env_vars
  CHECK (public.can_user_add_env_vars(
    (SELECT user_id FROM public.projects WHERE id = project_id), 
    project_id, 
    variable_count
  ));

-- Create RLS policy to prevent exceeding project limits
DROP POLICY IF EXISTS "Enforce project creation limits" ON public.projects;
CREATE POLICY "Enforce project creation limits" 
  ON public.projects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.can_user_create_project(auth.uid()));

-- Create RLS policy to prevent exceeding env variable limits  
DROP POLICY IF EXISTS "Enforce env variable limits" ON public.env_versions;
CREATE POLICY "Enforce env variable limits"
  ON public.env_versions
  FOR INSERT
  TO authenticated  
  WITH CHECK (public.can_user_add_env_vars(
    (SELECT user_id FROM public.projects WHERE id = project_id),
    project_id,
    variable_count
  ));
