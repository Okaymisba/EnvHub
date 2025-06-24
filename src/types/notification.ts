
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: {
    invitation_id?: string;
    project_id?: string;
    project_name?: string;
    inviter_email?: string;
    role?: string;
    accepted?: boolean;
    rejected?: boolean;
  };
  read: boolean;
  created_at: string;
  updated_at: string;
}
