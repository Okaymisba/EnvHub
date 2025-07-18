// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  user_id: string;
  lemon_squeezy_id: string;
  status: string;
  status_formatted: string;
  product_name: string;
  variant_name: string;
  price: string;
  renews_at: string | null;
  ends_at: string | null;
  card_brand: string | null;
  card_last_four: string | null;
}

export class SubscriptionService {
  static async getCurrentSubscription(): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No subscription found
      }
      throw error;
    }

    return data;
  }

  static async createCheckout(variantId: number, productName: string): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        variantId,
        productName
      },
    });

    if (error) throw error;
    return data.checkoutUrl;
  }

  static async cancelSubscription(lemonSqueezyId: string): Promise<void> {
    try {
      console.log('Cancelling subscription...' + lemonSqueezyId);
      const { error: cancelError } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: lemonSqueezyId }
      });

      if (cancelError) {
        throw new Error('Failed to cancel subscription. Please try again or contact support.');
      }

      const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('lemon_squeezy_id', lemonSqueezyId);

      if (updateError) {
        throw new Error('Subscription was cancelled, but there was an error updating your account. Please contact support.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error(error.message || 'An unexpected error occurred while cancelling your subscription.');
    }
  }

  static getSubscriptionLimits(subscription: Subscription | null) {
    if (!subscription || subscription.status !== 'active') {
      return {
        plan: 'Free',
        projects: 2,
        envVarsPerProject: 20,
        teamMembers: 1,
        hasCliAccess: true,
        cliEnvLimit: null,
        hasAds: true
      };
    }

    // Pro plan
    if (subscription.product_name.toLowerCase().includes('pro')) {
      return {
        plan: 'Pro',
        projects: 10,
        envVarsPerProject: 50,
        teamMembers: 5,
        hasCliAccess: true,
        cliEnvLimit: null,
        hasAds: false
      };
    }

    // Team plan
    if (subscription.product_name.toLowerCase().includes('team')) {
      return {
        plan: 'Team',
        projects: 50,
        envVarsPerProject: 200,
        teamMembers: 25,
        hasCliAccess: true,
        cliEnvLimit: null,
        hasAds: false
      };
    }

    return {
      plan: 'Free',
      projects: 2,
      envVarsPerProject: 20,
      teamMembers: 1,
      hasCliAccess: true,
      cliEnvLimit: null,
      hasAds: true
    };
  }
}
