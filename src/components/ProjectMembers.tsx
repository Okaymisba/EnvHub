// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Users, Crown, Shield, User, Settings } from 'lucide-react';
import { ProjectMember, Project, ProjectRole } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { SubscriptionLimitService } from '@/services/subscriptionLimitService';
import { useToast } from '@/hooks/use-toast';
import { ProjectMembersDialog } from './ProjectMembersDialog';
import {InviteMemberModal} from './InviteMemberModal';

interface ProjectMembersProps {
  project: Project;
  currentUserRole: ProjectRole;
  iconOnly?: boolean;
}

export const ProjectMembers: React.FC<ProjectMembersProps> = ({
                                                                project,
                                                                currentUserRole,
                                                                iconOnly
                                                              }) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('user');
  const [accessPassword, setAccessPassword] = useState('');
  const [confirmAccessPassword, setConfirmAccessPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showAccessPassword, setShowAccessPassword] = useState(false);
  const [showConfirmAccessPassword, setShowConfirmAccessPassword] = useState(false);
  const [showProjectPassword, setShowProjectPassword] = useState(false);
  const [projectPassword, setProjectPassword] = useState('');
  const [subscriptionLimits, setSubscriptionLimits] = useState<any>(null);
  const { toast } = useToast();

  const loadMembers = async () => {
    setLoading(true);
    try {
      const projectMembers = await SupabaseService.getProjectMembers(project.id);
      setMembers(projectMembers);
    } catch (error) {
      console.error('Failed to load members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project members',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMemberRemoved = () => {
    loadMembers();
  };

  const handleInvitationCancelled = () => {
    loadMembers();
  };

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isMatching = confirmAccessPassword === pass;

    const isValid = minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isMatching;
    setIsPasswordValid(isValid);

    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    if (!isMatching) return 'Passwords do not match';

    return '';
  };

  useEffect(() => {
    loadMembers();
    loadSubscriptionLimits();
  }, [project.id]);

  useEffect(() => {
    if (accessPassword || confirmAccessPassword) {
      const error = validatePassword(accessPassword);
      setPasswordError(error);
    }
  }, [accessPassword, confirmAccessPassword]);

  const loadSubscriptionLimits = async () => {
    try {
      const limits = await SubscriptionLimitService.getSubscriptionLimitsForProject(project.id);
      setSubscriptionLimits(limits);
    } catch (error) {
      console.error('Failed to load subscription limits:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !accessPassword.trim() || !projectPassword.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (passwordError) {
      toast({
        title: 'Invalid Password',
        description: passwordError,
        variant: 'destructive'
      });
      return;
    }

    try {
      await SupabaseService.inviteUserToProject(
          project.id,
          inviteEmail,
          inviteRole,
          accessPassword,
          projectPassword
      );

      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${inviteEmail}`
      });

      setIsInviteModalOpen(false);
      setInviteEmail('');
      setAccessPassword('');
      setConfirmAccessPassword('');
      setPasswordError('');
      setProjectPassword('');
      setInviteRole('user');
      loadMembers();
    } catch (error: any) {
      toast({
        title: 'Invitation Failed',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive'
      });
    }
  };

  const getRoleIcon = (role: ProjectRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-3 w-3 text-blue-500" />;
      case 'user':
        return <User className="h-3 w-3 text-gray-500" />;
    }
  };

  const canInvite = currentUserRole === 'owner' || currentUserRole === 'admin';
  const memberCount = members.length;
  const memberLimit = subscriptionLimits?.max_team_members || 0;
  const canInviteMore = memberCount < memberLimit;

  const handleOpenMembersDialog = () => {
    setIsDropdownOpen(false);
    setIsMembersDialogOpen(true);
  };

  return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
              variant="outline"
              size="sm"
              className="bg-black/60 border-none text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 hover:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            {!iconOnly && <span className="ml-2">Members</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="
          w-80 max-w-xs bg-black/90 border border-purple-900 shadow-2xl rounded-xl
          backdrop-blur-md animate-fade-scale z-[9999] p-0
        "
            align="end"
        >
          <div className="p-4 overflow-visible">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                Project Members
              </h3>
              {currentUserRole === 'owner' && (
                  <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-purple-900/30"
                      onClick={handleOpenMembersDialog}
                      title="Manage members"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
              )}
            </div>

            {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded animate-pulse"></div>
                  ))}
                </div>
            ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between py-2 px-2 rounded-lg bg-black/40 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-blue-900/20 transition">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(member.role)}
                          <span className="text-gray-200 text-sm font-mono">{member.email}</span>
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{member.role}</span>
                      </div>
                  ))}
                </div>
            )}

            {canInvite && (
                <>
                  <DropdownMenuSeparator className="bg-purple-900/40 my-4" />
                  <InviteMemberModal
                      open={isInviteModalOpen}
                      onOpenChange={setIsInviteModalOpen}
                      inviteEmail={inviteEmail}
                      setInviteEmail={setInviteEmail}
                      inviteRole={inviteRole}
                      setInviteRole={setInviteRole}
                      accessPassword={accessPassword}
                      setAccessPassword={setAccessPassword}
                      confirmAccessPassword={confirmAccessPassword}
                      setConfirmAccessPassword={setConfirmAccessPassword}
                      projectPassword={projectPassword}
                      setProjectPassword={setProjectPassword}
                      showAccessPassword={showAccessPassword}
                      setShowAccessPassword={setShowAccessPassword}
                      showConfirmAccessPassword={showConfirmAccessPassword}
                      setShowConfirmAccessPassword={setShowConfirmAccessPassword}
                      showProjectPassword={showProjectPassword}
                      setShowProjectPassword={setShowProjectPassword}
                      passwordError={passwordError}
                      isPasswordValid={isPasswordValid}
                      canInviteMore={canInviteMore}
                      onInvite={handleInvite}
                  />
                </>
            )}
          </div>
        </DropdownMenuContent>

        <ProjectMembersDialog
            open={isMembersDialogOpen}
            onOpenChange={setIsMembersDialogOpen}
            projectId={project.id}
            currentUserRole={currentUserRole}
            onMemberRemoved={loadMembers}
            onInvitationCancelled={loadMembers}
        />
      </DropdownMenu>
  );
};
