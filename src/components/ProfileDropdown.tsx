
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, LogOut } from 'lucide-react';
import { Notification } from '@/types/notification';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Inbox } from '@/components/Inbox';

interface ProfileDropdownProps {
  user: any;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [showInbox, setShowInbox] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const notificationsData = await SupabaseService.getNotifications();
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const getUserInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  const handleInboxClick = () => {
    setShowInbox(true);
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await SupabaseService.acceptInvitation(invitationId);
      toast({
        title: 'Invitation Accepted',
        description: 'You have been added to the project'
      });
      await loadNotifications();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to accept invitation',
        variant: 'destructive'
      });
    }
  };

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await SupabaseService.rejectInvitation(invitationId);
      toast({
        title: 'Invitation Rejected',
        description: 'The invitation has been declined'
      });
      await loadNotifications();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject invitation',
        variant: 'destructive'
      });
    }
  };

  if (showInbox) {
    return (
      <Inbox
        notifications={notifications}
        onClose={() => setShowInbox(false)}
        onAcceptInvitation={handleAcceptInvitation}
        onRejectInvitation={handleRejectInvitation}
        onMarkAsRead={loadNotifications}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-blue-600 text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="text-sm font-medium text-white">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleInboxClick}
          className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          Inbox
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
