
import { supabase } from '@/integrations/supabase/client';
import { Project, EnvVersion, EncryptedPayload } from '@/types/project';

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
        env_versions(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(project => ({
      ...project,
      version_count: project.env_versions?.[0]?.count || 0
    }));
  }

  static async createProject(name: string): Promise<Project> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, version_count: 0 };
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

  static async createVersion(projectId: string, encryptedData: EncryptedPayload): Promise<EnvVersion> {
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

    const { data, error } = await supabase
      .from('env_versions')
      .insert({
        project_id: projectId,
        version_number: nextVersionNumber,
        encrypted_data: encryptedData.ciphertext,
        salt: encryptedData.salt,
        nonce: encryptedData.nonce,
        tag: encryptedData.tag
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
