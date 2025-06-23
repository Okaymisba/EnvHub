
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
import { Users, UserPlus, Crown, Shield, User } from 'lucide-react';
import { ProjectMember, Project, ProjectRole } from '@/types/project';
import { SupabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface ProjectMembersProps {
  project: Project;
  currentUserRole: ProjectRole;
}

export const ProjectMembers: React.FC<ProjectMembersProps> = ({ 
  project, 
  currentUserRole 
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
          className="bg-gray-900 border-none text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          Members
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 bg-gray-900 border-gray-700 max-h-96 overflow-y-auto"
        align="end"
      >
        <div className="p-3">
          <h3 className="text-white font-medium mb-3">Project Members</h3>
          
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(member.role)}
                    <span className="text-gray-300 text-sm">{member.email}</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}

          {canInvite && (
            <>
              <DropdownMenuSeparator className="bg-gray-700 my-3" />
              
              {!showInviteForm ? (
                <Button
                  onClick={() => setShowInviteForm(true)}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-3 w-3" />
                  Invite Member
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300 text-xs">Email</Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-gray-800 border-gray-600 text-white text-sm h-8"
                      autoComplete='off'
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-xs">Role</Label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as ProjectRole)}
                      className="w-full bg-gray-800 border border-gray-600 text-white text-sm h-8 rounded px-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-xs">Access Password</Label>
                    <Input
                      type="password"
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      placeholder="Password for invited user"
                      className="bg-gray-800 border-gray-600 text-white text-sm h-8"
                      autoComplete='new-password'
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 text-xs">Project Password</Label>
                    <Input
                      type="password"
                      value={projectPassword}
                      onChange={(e) => setProjectPassword(e.target.value)}
                      placeholder="Your project password"
                      className="bg-gray-800 border-gray-600 text-white text-sm h-8"
                      autoComplete='new-password'
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleInvite}
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                    >
                      Send
                    </Button>
                    <Button
                      onClick={() => setShowInviteForm(false)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-gray-400 hover:text-white h-8 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
