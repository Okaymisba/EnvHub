// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionLimits {
  plan: string;
  max_projects: number;
  max_env_vars_per_project: number;
  max_team_members: number;
  has_cli_access: boolean;
}

export class SubscriptionLimitService {
  static async getUserSubscriptionLimits(): Promise<SubscriptionLimits> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('get_user_subscription_limits', {
      user_uuid: user.id
    });
    console.log(data);

    if (error) throw error;

    return data[0] as SubscriptionLimits;
  }

  static async getSubscriptionLimitsForProject(projectId: string): Promise<SubscriptionLimits> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (projectError || !projectData) {
      throw new Error('Project not found or access denied');
    }

    const { data, error } = await supabase.rpc('get_user_subscription_limits', {
      user_uuid: projectData.user_id
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Failed to fetch subscription limits');
    }

    return data[0] as SubscriptionLimits;
  }

  static async canUserCreateProject(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('can_user_create_project', {
      user_uuid: user.id
    });

    if (error) throw error;
    return data;
  }

  static async canUserAddEnvVars(projectId: string, newVarCount: number = 1): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('can_user_add_env_vars', {
      new_var_count: newVarCount,
      project_uuid: projectId,
      user_uuid: user.id,
    });

    if (error) throw error;
    return data;
  }

  static async getCurrentProjectCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);

    if (error) throw error;
    return data?.length || 0;
  }
}
