// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { supabase } from '@/integrations/supabase/client';
import { Project, EnvVersion, EnvVariable, EncryptedPayload, EnvEntry, ProjectMember, ProjectInvitation, ProjectRole } from '@/types/project';
import { Notification } from '@/types/notification';
import { PasswordUtils } from '@/utils/passwordUtils';
import { CryptoUtils } from '@/utils/crypto';

export class SupabaseService {
  // Auth methods
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { user: data.user, error };
  }

  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    return { user: data.user, error };
  }

  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Notification methods
  static async getNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match our Notification interface
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      type: item.type,
      title: item.title,
      message: item.message,
      data: item.data as {
        invitation_id?: string;
        project_id?: string;
        project_name?: string;
        inviter_email?: string;
        role?: string;
        accepted?: boolean;
        rejected?: boolean;
      },
      read: item.read,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }

  static async insertFeedback(name: string, email: string, rating: number, message: string): Promise<void> {
    const { error } = await supabase
      .from('feedback')
      .insert({ name, email, rating, message });

    if (error) throw error;
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  }

  static async insertMessageForContact(name: string, email: string, message: string): Promise<void> {
    const { error } = await supabase
      .from('contact')
      .insert({ name, email, message });

    if (error) throw error;
  }

  static async getPendingInvitations(projectId?: string): Promise<ProjectInvitation[]> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('project_invitations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProjectInvitation[];
  }

  static async removeProjectMember(projectId: string, userId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async cancelProjectInvitation(projectId: string, invitationId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('project_invitations')
      .delete()
      .eq('project_id', projectId)
      .eq('id', invitationId);

    if (error) throw error;
  }

  static async acceptInvitation(invitationId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get invitation details - simplified query
    const { data: invitation, error: inviteError } = await supabase
      .from('project_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (inviteError || !invitation) throw new Error('Invitation not found');

    // Check if invitation is still valid
    if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
      throw new Error('Invitation has expired');
    }

    // Check if user is already a member - simplified query
    const { data: existingMember } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', invitation.project_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingMember) {
      throw new Error('You are already a member of this project');
    }

    // Add user to project members
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: invitation.project_id,
        user_id: user.id,
        role: invitation.role,
        encrypted_project_password: invitation.encrypted_project_password,
        access_password_hash: invitation.access_password_hash,
        invited_by: invitation.inviter_id,
        accepted_at: new Date().toISOString()
      });

    if (memberError) throw memberError;

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from('project_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitationId);

    if (updateError) throw updateError;

    // 1. Fetch the notification
    const { data: notification } = await supabase
      .from('notifications')
      .select('data')
      .eq('data->>invitation_id', invitationId)
      .single();

    if (!notification) throw new Error('Notification not found');

    // 2. Merge the accepted field
    const newData = { ...(typeof notification.data === 'object' && notification.data !== null ? notification.data : {}), accepted: true };

    // 3. Update only the accepted field
    await supabase
      .from('notifications')
      .update({ read: true, data: newData })
      .eq('data->>invitation_id', invitationId);
  }

  static async rejectInvitation(invitationId: string): Promise<void> {
    // Delete the invitation
    const { error: deleteError } = await supabase
      .from('project_invitations')
      .delete()
      .eq('id', invitationId);

    if (deleteError) throw deleteError;

    const { data: notification } = await supabase
      .from('notifications')
      .select('data')
      .eq('data->>invitation_id', invitationId)
      .single();

    if (!notification) throw new Error('Notification not found');

    // 2. Merge the accepted field
    const newData = { ...(typeof notification.data === 'object' && notification.data !== null ? notification.data : {}), rejected: true };

    // Mark related notification as read
    const { error: notifyError } = await supabase
      .from('notifications')
      .update({ read: true, data: newData })
      .eq('data->>invitation_id', invitationId);

    if (notifyError) console.error('Failed to mark notification as read:', notifyError);
  }

  // Project methods
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        created_at,
        user_id,
        password_hash,
        api_key,
        env_versions(count)
      `)
      .eq('user_id', (await this.getCurrentUser())?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(project => ({
      ...project,
      version_count: project.env_versions?.[0]?.count || 0
    }));
  }

  static async getSharedProjects(): Promise<(Project & { owner_email: string })[]> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get projects where the user is a member but not the owner
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        project_id,
        projects!inner(
          id,
          name,
          created_at,
          user_id,
          api_key,
          env_versions(count)
        )
      `)
      .eq('user_id', user.id)
      .neq('role', 'owner');

    if (error) throw error;

    // Get owner emails for each project
    const sharedProjects = await Promise.all(
      (data || []).map(async (member) => {
        const project = member.projects;
        const { data: ownerEmail } = await supabase.rpc('get_user_email', {
          user_uuid: project.user_id
        });

        return {
          id: project.id,
          name: project.name,
          created_at: project.created_at,
          user_id: project.user_id,
          version_count: project.env_versions?.[0]?.count || 0,
          owner_email: ownerEmail || 'Unknown',
          api_key: project.api_key
        };
      })
    );

    return sharedProjects;
  }

  static async createProject(name: string, password: string): Promise<Project> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const passwordHash = await PasswordUtils.hashPassword(password);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        user_id: user.id,
        password_hash: passwordHash
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, version_count: 0 };
  }

  static async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  static async verifyProjectPassword(projectId: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('projects')
      .select('password_hash')
      .eq('id', projectId)
      .single();

    if (error || !data?.password_hash) throw new Error('Project not found or password not set');

    return await PasswordUtils.verifyPassword(password, data.password_hash);
  }

  static async getEncryptedProjectPassword(projectId: string, userId: string): Promise<EncryptedPayload | null> {
    const { data, error } = await supabase
      .from('project_members')
      .select('encrypted_project_password, access_password_hash')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        // No member found, return null
        return null;
      }
      throw error;
    }
    if (!data) return null;
    if (!data.encrypted_project_password || !data.access_password_hash) {
      return null;
    }
    const parts = data.encrypted_project_password.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted project password format');
    }
    return {
      ciphertext: parts[0],
      salt: parts[1],
      nonce: parts[2],
      tag: parts[3],
    };
  }

  // Project Members methods
  static async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .order('role', { ascending: true }); // owners first, then admins, then users

    if (error) throw error;

    // Get emails for each member
    const membersWithEmails = await Promise.all(
      (data || []).map(async (member) => {
        const { data: emailData } = await supabase.rpc('get_user_email', {
          user_uuid: member.user_id
        });
        return {
          ...member,
          email: emailData || 'Unknown'
        };
      })
    );

    return membersWithEmails;
  }

  static async getCurrentUserRole(projectId: string): Promise<ProjectRole | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) return null;
    return data?.role || null;
  }

  static async inviteUserToProject(
    projectId: string,
    email: string,
    role: ProjectRole,
    accessPassword: string,
    projectPassword: string
  ): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Verify project password
    const isValidPassword = await this.verifyProjectPassword(projectId, projectPassword);
    if (!isValidPassword) {
      throw new Error('Invalid project password');
    }

    // Check if user is already a member or has pending invitation
    const { data: memberCheck, error: checkError } = await supabase
      .rpc('check_member_and_invitation', {
        p_project_id: projectId,
        p_email: email
      })
      .single();

    if (checkError) throw checkError;

    if (memberCheck.is_member) {
      throw new Error('This user is already a member of the project');
    }

    if (memberCheck.has_invitation) {
      throw new Error('An invitation has already been sent to this email address');
    }

    if (!memberCheck.user_exists) {
      throw new Error('User does not exist');
    }

    // Encrypt project password with the access password
    const encryptedProjectPassword = await CryptoUtils.encrypt(projectPassword, accessPassword);
    const accessPasswordHash = await PasswordUtils.hashPassword(accessPassword);

    // Create invitation
    const { data: invitationData, error: inviteError } = await supabase
      .from('project_invitations')
      .insert({
        project_id: projectId,
        inviter_id: user.id,
        invited_email: email,
        role: role,
        encrypted_project_password: `${encryptedProjectPassword.ciphertext}:${encryptedProjectPassword.salt}:${encryptedProjectPassword.nonce}:${encryptedProjectPassword.tag}`,
        access_password_hash: accessPasswordHash
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    if (projectError) throw projectError;

    const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke('send-project-invite', {
      body: {
        projectName: projectData.name,
        project_id: projectId,
        inviter_id: user.id,
        invited_email: email,
        role: role,
        password: accessPassword
      }
    });

    if (edgeFunctionError) {
      console.error('Error sending invitation email:', edgeFunctionError);
      console.log('Invitation error' + JSON.stringify(edgeFunctionError));
    }
  }

  static async verifyUserAccess(
    projectId: string,
    accessPassword: string
  ): Promise<{ success: boolean; projectPassword?: string }> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check if user is a member
    const { data: member, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error || !member) {
      return { success: false };
    }

    // If user has encrypted project password, verify access password and decrypt
    if (member.encrypted_project_password && member.access_password_hash) {
      const isValidAccess = await PasswordUtils.verifyPassword(accessPassword, member.access_password_hash);
      if (!isValidAccess) {
        return { success: false };
      }

      // Decrypt project password
      const parts = member.encrypted_project_password.split(':');
      const encryptedData = {
        ciphertext: parts[0],
        salt: parts[1],
        nonce: parts[2],
        tag: parts[3]
      };

      try {
        const projectPassword = await CryptoUtils.decrypt(encryptedData, accessPassword);
        return { success: true, projectPassword };
      } catch (error) {
        return { success: false };
      }
    }

    // Owner can use project password directly
    if (member.role === 'owner') {
      return { success: true };
    }

    return { success: false };
  }

  // Version methods
  static async getVersions(projectId: string): Promise<EnvVersion[]> {
    const { data, error } = await supabase
      .from('env_versions')
      .select('*')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Environment variables methods
  static async getEnvVariables(projectId: string, versionId?: string): Promise<EnvVariable[]> {
    let query = supabase
      .from('env_variables')
      .select('*')
      .eq('project_id', projectId);

    if (versionId) {
      query = query.eq('version_id', versionId);
    }

    const { data, error } = await query.order('env_name');

    if (error) throw error;
    return data || [];
  }

  static async getCurrentEnvVariables(projectId: string): Promise<EnvVariable[]> {
    // Get the latest version
    const { data: latestVersion, error: versionError } = await supabase
      .from('env_versions')
      .select('id')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    if (versionError || !latestVersion) {
      return [];
    }

    return this.getEnvVariables(projectId, latestVersion.id);
  }

  static async deleteEnvVariable(variableId: string, password: string): Promise<void> {
    // First get the variable details
    const { data: variable, error: varError } = await supabase
      .from('env_variables')
      .select('*')
      .eq('id', variableId)
      .single();

    if (varError) throw varError;

    // Get current variables except the one being deleted
    const currentVariables = await this.getCurrentEnvVariables(variable.project_id);
    const remainingVariables = currentVariables.filter(v => v.id !== variableId);

    // Get the next version number
    const { data: existingVersions, error: countError } = await supabase
      .from('env_versions')
      .select('version_number')
      .eq('project_id', variable.project_id)
      .order('version_number', { ascending: false })
      .limit(1);

    if (countError) throw countError;

    const nextVersionNumber = existingVersions?.length > 0
      ? existingVersions[0].version_number + 1
      : 1;

    // Create version metadata
    const dummyEncryption = await CryptoUtils.encrypt('version_metadata', password);

    const { data: version, error: versionError } = await supabase
      .from('env_versions')
      .insert({
        project_id: variable.project_id,
        version_number: nextVersionNumber,
        variable_count: remainingVariables.length,
        salt: dummyEncryption.salt,
        nonce: dummyEncryption.nonce,
        tag: dummyEncryption.tag
      })
      .select()
      .single();

    if (versionError) throw versionError;

    // Create individual encrypted environment variables
    const envVariables = await Promise.all(
      remainingVariables.map(async (v) => {
        const decryptedValue = await this.decryptEnvValue(v, password);
        const encryptedValue = await CryptoUtils.encrypt(decryptedValue, password);
        const user = await this.getCurrentUser();
        return {
          user_id: user?.id,
          project_id: variable.project_id,
          version_id: version.id,
          env_name: v.env_name,
          env_value_encrypted: encryptedValue.ciphertext,
          salt: encryptedValue.salt,
          nonce: encryptedValue.nonce,
          tag: encryptedValue.tag
        };
      })
    );

    // Insert new version's variables
    const { error: variablesError } = await supabase
      .from('env_variables')
      .insert(envVariables);

    if (variablesError) throw variablesError;

    // Delete the variable from the previous version
    const { error } = await supabase
      .from('env_variables')
      .delete()
      .eq('id', variableId);

    if (error) throw error;
}

  static async createEnvVersion(
    projectId: string,
    envEntries: EnvEntry[],
    password: string
  ): Promise<EnvVersion> {
    // Verify project password first
    const isValidPassword = await this.verifyProjectPassword(projectId, password);
    if (!isValidPassword) {
      throw new Error('Invalid project password');
    }

    // Get existing variables to combine with new ones
    const existingVariables = await this.getCurrentEnvVariables(projectId);

    // Get the next version number
    const { data: existingVersions, error: countError } = await supabase
      .from('env_versions')
      .select('version_number')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (countError) throw countError;

    const nextVersionNumber = existingVersions?.length > 0
      ? existingVersions[0].version_number + 1
      : 1;

    // Create version metadata with dummy encryption data (we'll store individual vars)
    const dummyEncryption = await CryptoUtils.encrypt('version_metadata', password);

    const { data: version, error: versionError } = await supabase
      .from('env_versions')
      .insert({
        project_id: projectId,
        version_number: nextVersionNumber,
        variable_count: existingVariables.length + envEntries.length,
        salt: dummyEncryption.salt,
        nonce: dummyEncryption.nonce,
        tag: dummyEncryption.tag
      })
      .select()
      .single();

    if (versionError) throw versionError;

    // Decrypt existing variables and combine with new ones
    const allEntries = [];

    // Add existing variables (decrypt and re-encrypt with new version)
    for (const existingVar of existingVariables) {
      try {
        const decryptedValue = await this.decryptEnvValue(existingVar, password);
        allEntries.push({
          name: existingVar.env_name,
          value: decryptedValue
        });
      } catch (error) {
        console.error(`Failed to decrypt existing variable ${existingVar.env_name}:`, error);
        // Skip this variable if it can't be decrypted
      }
    }

    // Add new entries
    allEntries.push(...envEntries);

    // Create individual encrypted environment variables
    const envVariables = await Promise.all(
      allEntries.map(async (entry) => {
        const encryptedValue = await CryptoUtils.encrypt(entry.value, password);
        return {
          project_id: projectId,
          version_id: version.id,
          env_name: entry.name,
          env_value_encrypted: encryptedValue.ciphertext,
          salt: encryptedValue.salt,
          nonce: encryptedValue.nonce,
          tag: encryptedValue.tag
        };
      })
    );

    const { error: variablesError } = await supabase
      .from('env_variables')
      .insert(envVariables);

    if (variablesError) throw variablesError;

    return version;
  }

  static async decryptEnvValue(envVariable: EnvVariable, password: string): Promise<string> {
    const encryptedData = {
      ciphertext: envVariable.env_value_encrypted,
      salt: envVariable.salt,
      nonce: envVariable.nonce,
      tag: envVariable.tag
    };

    return await CryptoUtils.decrypt(encryptedData, password);
  }

  static async downloadVersionAsEncryptedFile(version: EnvVersion, projectId: string, projectName: string): Promise<void> {
    // Get all environment variables for this version
    const envVariables = await this.getEnvVariables(projectId, version.id);

    // Create encrypted env file content
    const encryptedContent = envVariables.map(envVar => {
      return `${envVar.env_name}=${envVar.env_value_encrypted}:${envVar.salt}:${envVar.nonce}:${envVar.tag}`;
    }).join('\n');

    // Add metadata header
    const fileContent = `# EnvHub Encrypted File - Version ${version.version_number}\n# Project: ${projectName}\n# Created: ${version.created_at}\n# Variables: ${envVariables.length}\n\n${encryptedContent}`;

    // Create and download file
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-v${version.version_number}.env`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}