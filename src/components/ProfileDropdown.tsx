// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

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
import { User, Mail, LogOut, CreditCard, BookOpen } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Notification } from '@/types/notification';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Inbox } from '@/components/Inbox';
import { SubscriptionManager } from '@/components/SubscriptionManager';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  user: any;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const [showInbox, setShowInbox] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSubscriptionClick = () => {
    setShowSubscription(true);
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

  if (showSubscription) {
    return <SubscriptionManager onClose={() => setShowSubscription(false)} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:ring-2 hover:ring-purple-600 transition-all duration-200">
          <Avatar className="h-10 w-10 transition-all duration-200 ring-2 ring-transparent hover:ring-purple-600">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1.5 h-5 min-w-[20px] flex items-center justify-center border-2 border-black z-10 transition-all duration-200">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[90vw] max-w-xs sm:w-60 bg-black/80 border border-purple-900 rounded-xl shadow-2xl backdrop-blur-md animate-dropdown-fade z-[9999] p-0 pb-3"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-800">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-purple-700 to-blue-700 text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{user?.user_metadata?.full_name || user?.email}</span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
        </div>
        <DropdownMenuItem 
          onClick={handleInboxClick}
          className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 cursor-pointer transition-all duration-200"
        >
          <Mail className="mr-2 h-4 w-4" />
          Inbox
          {unreadCount > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSubscriptionClick}
          className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 cursor-pointer transition-all duration-200"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate('/docs')}
          className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 cursor-pointer transition-all duration-200"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Documentation
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open('https://github.com/Okaymisba/EnvHub', '_blank', 'noopener,noreferrer')}
          className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 cursor-pointer transition-all duration-200"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 cursor-pointer transition-all duration-200 pt-2"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
        <style>{`
          .animate-dropdown-fade {
            animation: dropdownFadeIn 0.25s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes dropdownFadeIn {
            from { opacity: 0; transform: translateY(-10px) scale(0.98);}
            to { opacity: 1; transform: none;}
          }
        `}</style>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
