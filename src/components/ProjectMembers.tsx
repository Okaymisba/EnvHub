// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, UserPlus, Crown, Shield, User, Info, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { ProjectMember, Project, ProjectRole } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { SubscriptionLimitService } from '@/services/subscriptionLimitService';
import { useToast } from '@/hooks/use-toast';

interface ProjectMembersProps {
  project: Project;
  currentUserRole: ProjectRole;
  iconOnly?: boolean;
}

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: ProjectRole;
  setInviteRole: (role: ProjectRole) => void;
  accessPassword: string;
  setAccessPassword: (password: string) => void;
  confirmAccessPassword: string;
  setConfirmAccessPassword: (password: string) => void;
  projectPassword: string;
  setProjectPassword: (password: string) => void;
  showAccessPassword: boolean;
  setShowAccessPassword: (show: boolean) => void;
  showConfirmAccessPassword: boolean;
  setShowConfirmAccessPassword: (show: boolean) => void;
  showProjectPassword: boolean;
  setShowProjectPassword: (show: boolean) => void;
  passwordError: string;
  isPasswordValid: boolean;
  canInviteMore: boolean;
  onInvite: () => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onOpenChange,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  accessPassword,
  setAccessPassword,
  confirmAccessPassword,
  setConfirmAccessPassword,
  projectPassword,
  setProjectPassword,
  showAccessPassword,
  setShowAccessPassword,
  showConfirmAccessPassword,
  setShowConfirmAccessPassword,
  showProjectPassword,
  setShowProjectPassword,
  passwordError,
  isPasswordValid,
  canInviteMore,
  onInvite,
}) => {
  const [emailError, setEmailError] = useState('');

  const PasswordRequirement = ({ label, isValid }: { label: string; isValid: boolean }) => (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-xs ${isValid ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInviteEmail(value);
    if (emailError) {
      validateEmail(value);
    }
  };

  const handleInvite = () => {
    if (!validateEmail(inviteEmail)) {
      return;
    }
    onInvite();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={!canInviteMore}
          size="sm"
          className={`w-full font-semibold shadow rounded-lg transition ${
            canInviteMore 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {canInviteMore ? 'Invite Member' : 'Member Limit Reached'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-black border border-purple-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Invite Team Member</DialogTitle>
          <DialogDescription className="text-gray-400">
            Invite a new member to collaborate on this project
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              value={inviteEmail}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(inviteEmail)}
              placeholder="user@example.com"
              className={`bg-black/70 border-purple-800 text-white ${
                emailError ? 'border-red-500' : ''
              }`}
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <Select
              value={inviteRole}
              onValueChange={(value) => setInviteRole(value as ProjectRole)}
            >
              <SelectTrigger className="w-full bg-black/70 border border-purple-800 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-black/70 border border-purple-800 text-white">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-1">
              {inviteRole === 'admin'
                ? 'Admins can manage environment variables and project settings'
                : 'Users have read-only access to environment variables'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="accessPassword" className="text-gray-300">
                Access Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="accessPassword"
                type={showAccessPassword ? 'text' : 'password'}
                value={accessPassword}
                autoComplete="new-password"
                onChange={(e) => setAccessPassword(e.target.value)}
                placeholder="Set a password for the new member"
                className="bg-black/70 border border-purple-800 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAccessPassword(!showAccessPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showAccessPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <PasswordRequirement
                  label="8+ characters"
                  isValid={accessPassword.length >= 8}
                />
                <PasswordRequirement
                  label="Uppercase letter"
                  isValid={/[A-Z]/.test(accessPassword)}
                />
                <PasswordRequirement
                  label="Lowercase letter"
                  isValid={/[a-z]/.test(accessPassword)}
                />
                <PasswordRequirement
                  label="Number"
                  isValid={/\d/.test(accessPassword)}
                />
                <PasswordRequirement
                  label="Special character"
                  isValid={/[!@#$%^&*(),.?":{}|<>]/.test(accessPassword)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="confirmAccessPassword" className="text-gray-300">
                Confirm Access Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="confirmAccessPassword"
                type={showConfirmAccessPassword ? 'text' : 'password'}
                value={confirmAccessPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmAccessPassword(e.target.value)}
                placeholder="Confirm the password"
                className={`bg-black/70 border border-purple-800 text-white pr-10 ${
                  confirmAccessPassword && accessPassword !== confirmAccessPassword ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmAccessPassword(!showConfirmAccessPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showConfirmAccessPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmAccessPassword && accessPassword !== confirmAccessPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
            {confirmAccessPassword && accessPassword === confirmAccessPassword && accessPassword && (
              <div className="flex items-center text-xs text-green-500 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Passwords match
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="projectPassword" className="text-gray-300">
                Project Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="projectPassword"
                type={showProjectPassword ? 'text' : 'password'}
                value={projectPassword}
                autoComplete="off"
                onChange={(e) => setProjectPassword(e.target.value)}
                placeholder="Enter your project password"
                className="bg-black/70 border border-purple-800 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowProjectPassword(!showProjectPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showProjectPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            className="border-gray-700 text-gray hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={!isPasswordValid || !projectPassword.trim() || !!emailError}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:pointer-events-none"
          >
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ProjectMembers: React.FC<ProjectMembersProps> = ({ 
  project, 
  currentUserRole, 
  iconOnly 
}) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
    if (accessPassword || confirmAccessPassword) {
      const error = validatePassword(accessPassword);
      setPasswordError(error);
    }
  }, [accessPassword, confirmAccessPassword]);

  useEffect(() => {
    loadMembers();
    loadSubscriptionLimits();
  }, [project.id]);

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
      loadMembers(); // Reload to update the count
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

  return (
    <DropdownMenu>
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
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" />
            Project Members
          </h3>

          {/* Subscription Usage Info */}
          {subscriptionLimits && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Member Usage</span>
                </div>
                <span className="text-xs text-gray-300 bg-black/40 px-2 py-1 rounded">
                  {subscriptionLimits.plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {memberCount} / {memberLimit} members
                </span>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        memberCount >= memberLimit 
                          ? 'bg-red-500' 
                          : memberCount / memberLimit > 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((memberCount / memberLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {memberLimit - memberCount} left
                </span>
              </div>
              {!canInviteMore && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Member limit reached. Upgrade to invite more members.
                </p>
              )}
            </div>
          )}

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
    </DropdownMenu>
  );
};
