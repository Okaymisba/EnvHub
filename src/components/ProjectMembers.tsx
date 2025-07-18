// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, UserPlus, Crown, Shield, User } from 'lucide-react';
import { ProjectMember, Project, ProjectRole } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

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
  const [loading, setLoading] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectRole>('user');
  const [accessPassword, setAccessPassword] = useState('');
  const [projectPassword, setProjectPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadMembers();
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

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !accessPassword.trim() || !projectPassword.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
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
      
      setShowInviteForm(false);
      setInviteEmail('');
      setAccessPassword('');
      setProjectPassword('');
      setInviteRole('user');
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/60 border-none text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-blue-900/60 hover:text-white"
        >
          <Users className="mr-2 h-4 w-4 " />
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
              {!showInviteForm ? (
                <Button
                  onClick={() => setShowInviteForm(true)}
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow rounded-lg transition"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              ) : (
                <div className="space-y-3 relative">
                  <div>
                    <Label className="text-gray-300 text-xs">Email</Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-black/70 border border-purple-800 text-white text-sm h-8 rounded-lg"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-1 relative">
                    <Label className="text-gray-300 text-xs">Role</Label>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">
                        {inviteRole === 'admin' 
                          ? 'Can manage environment variables and project settings, but cannot delete the project' 
                          : 'Read-only access to environment variables, cannot make any modifications'}
                      </p>
                      <Select 
                        value={inviteRole} 
                        onValueChange={(value) => setInviteRole(value as ProjectRole)}
                      >
                        <SelectTrigger className="w-full bg-black/70 border border-purple-800 text-white text-sm h-8 hover:bg-black/80 hover:border-purple-600 transition-colors">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border border-purple-800 z-[9999] text-white">
                          <SelectItem 
                            value="user"
                            className="hover:bg-purple-900/70 focus:bg-purple-900/70 cursor-pointer text-white hover:text-white focus:text-white"
                          >
                            User
                          </SelectItem>
                          <SelectItem 
                            value="admin"
                            className="hover:bg-purple-900/70 focus:bg-purple-900/70 cursor-pointer text-white hover:text-white focus:text-white"
                          >
                            Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Access Password</Label>
                    <Input
                      type="password"
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      placeholder="Password for invited user"
                      className="bg-black/70 border border-purple-800 text-white text-sm h-8 rounded-lg"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Project Password</Label>
                    <Input
                      type="password"
                      value={projectPassword}
                      onChange={(e) => setProjectPassword(e.target.value)}
                      placeholder="Your project password"
                      className="bg-black/70 border border-purple-800 text-white text-sm h-8 rounded-lg"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleInvite}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold h-8 text-xs rounded-lg transition"
                    >
                      Send
                    </Button>
                    <Button
                      onClick={() => setShowInviteForm(false)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-gray-400 hover:text-white h-8 text-xs rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <style>{`
          .animate-fade-scale {
            animation: fadeScaleIn 0.25s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeScaleIn {
            from { opacity: 0; transform: scale(0.96);}
            to { opacity: 1; transform: none;}
          }
        `}</style>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
