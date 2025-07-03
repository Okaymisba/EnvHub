
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
    // This would typically call Lemon Squeezy API to cancel subscription
    // For now, we'll just update the local status
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('lemon_squeezy_id', lemonSqueezyId);

    if (error) throw error;
  }

  static getSubscriptionLimits(subscription: Subscription | null) {
    if (!subscription || subscription.status !== 'active') {
      return {
        plan: 'Free',
        projects: 2,
        envVarsPerProject: 20,
        teamMembers: 0,
        hasCliAccess: false,
        cliEnvLimit: 5,
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
      teamMembers: 0,
      hasCliAccess: false,
      cliEnvLimit: 5,
      hasAds: true
    };
  }
}
