// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, X, Clock, Trash2, User, Shield, Crown } from 'lucide-react';
import {ProjectInvitation, ProjectMember, ProjectRole} from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface ProjectMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentUserRole: ProjectRole;
  onMemberRemoved?: () => void;
  onInvitationCancelled?: () => void;
}

export const ProjectMembersDialog: React.FC<ProjectMembersDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  currentUserRole,
  onMemberRemoved,
  onInvitationCancelled,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'pending'>('members');
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isOwner = currentUserRole === 'owner';

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, invitationsData] = await Promise.all([
        SupabaseService.getProjectMembers(projectId),
        SupabaseService.getPendingInvitations(projectId)
      ]);
      setMembers(membersData);
      setPendingInvitations(invitationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members and invitations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isOwner) return;

    try {
      await SupabaseService.removeProjectMember(projectId, memberId);
      setMembers(members.filter(m => m.id !== memberId));
      onMemberRemoved?.();
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive'
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!isOwner) return;

    try {
      await SupabaseService.cancelProjectInvitation(projectId, invitationId);
      setPendingInvitations(pendingInvitations.filter(i => i.id !== invitationId));
      onInvitationCancelled?.();
      toast({
        title: 'Success',
        description: 'Invitation cancelled successfully',
      });
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel invitation',
        variant: 'destructive'
      });
    }
  };

  const getRoleIcon = (role: ProjectRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'user':
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border border-purple-900 rounded-xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Project Members Management
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-purple-900/50 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('members')}
          >
            Members ({members.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Invitations ({pendingInvitations.length})
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gradient-to-r from-purple-900/10 to-blue-900/10 rounded animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === 'members' ? (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-blue-900/10 transition"
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(member.role)}
                    <div>
                      <p className="text-sm font-medium text-white">{member.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                    </div>
                  </div>
                  {isOwner && member.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-900/20 h-8 w-8"
                      onClick={() => handleRemoveMember(member.user_id)}
                      title="Remove member"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {members.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No members found
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-blue-900/10 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{invitation.invited_email}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-amber-400">Pending</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400 capitalize">{invitation.role}</span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-900/20 h-8 w-8"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      title="Cancel invitation"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {pendingInvitations.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No pending invitations
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
