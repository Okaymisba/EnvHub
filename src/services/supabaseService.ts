import { supabase } from '@/integrations/supabase/client';
import { Project, EnvVersion, EnvVariable, EncryptedPayload, EnvEntry, ProjectMember, ProjectInvitation, ProjectRole } from '@/types/project';
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
        env_versions(count)
      `)
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
          owner_email: ownerEmail || 'Unknown'
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

    // Check if user exists by email
    const { data: existingUsers, error: userError } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId);

    if (userError) throw userError;

    // Encrypt project password with the access password
    const encryptedProjectPassword = await CryptoUtils.encrypt(projectPassword, accessPassword);
    const accessPasswordHash = await PasswordUtils.hashPassword(accessPassword);

    // Create invitation
    const { error: inviteError } = await supabase
      .from('project_invitations')
      .insert({
        project_id: projectId,
        inviter_id: user.id,
        invited_email: email,
        role: role,
        encrypted_project_password: `${encryptedProjectPassword.ciphertext}:${encryptedProjectPassword.salt}:${encryptedProjectPassword.nonce}:${encryptedProjectPassword.tag}`,
        access_password_hash: accessPasswordHash
      });

    if (inviteError) throw inviteError;
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

  static async deleteEnvVariable(variableId: string): Promise<void> {
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
