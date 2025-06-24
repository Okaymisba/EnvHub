
-- Create notifications table for inbox system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'project_invitation',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Store invitation details like project_id, invitation_id
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- System can insert notifications for users
CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to create notification when invitation is sent
CREATE OR REPLACE FUNCTION public.create_invitation_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_name TEXT;
  inviter_email TEXT;
  invited_user_id UUID;
BEGIN
  -- Get project name
  SELECT name INTO project_name FROM public.projects WHERE id = NEW.project_id;
  
  -- Get inviter email
  SELECT email INTO inviter_email FROM auth.users WHERE id = NEW.inviter_id;
  
  -- Get invited user ID by email
  SELECT id INTO invited_user_id FROM auth.users WHERE email = NEW.invited_email;
  
  -- Only create notification if user exists
  IF invited_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      invited_user_id,
      'project_invitation',
      'Project Invitation',
      inviter_email || ' invited you to join the project "' || project_name || '"',
      jsonb_build_object(
        'invitation_id', NEW.id,
        'project_id', NEW.project_id,
        'project_name', project_name,
        'inviter_email', inviter_email,
        'role', NEW.role
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when invitation is sent
CREATE TRIGGER on_invitation_created
  AFTER INSERT ON public.project_invitations
  FOR EACH ROW EXECUTE FUNCTION public.create_invitation_notification();
