
import { supabase } from '@/integrations/supabase/client';
import { Project, EnvVersion, EnvVariable, EncryptedPayload, EnvEntry } from '@/types/project';
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
    a.download = `${projectName}-v${version.version_number}.env.enc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
