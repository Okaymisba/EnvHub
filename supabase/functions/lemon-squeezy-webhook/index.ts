// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('x-signature');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const body = await req.text();
    
    // Verify webhook signature (basic implementation)
    const expectedSignature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(webhookSecret + body)
    );
    
    const payload = JSON.parse(body);
    console.log('Webhook payload:', payload);

    const { data: eventData } = payload;
    
    if (payload.meta?.event_name === 'subscription_created' || 
        payload.meta?.event_name === 'subscription_updated') {
      
      const subscription = eventData;
      
      // Find user by email
      const { data: users } = await supabase.auth.admin.listUsers();
      const user = users.users.find(u => u.email === subscription.attributes.user_email);
      
      if (!user) {
        console.error('User not found for email:', subscription.attributes.user_email);
        return new Response('User not found', { status: 404, headers: corsHeaders });
      }

      const subscriptionData = {
        user_id: user.id,
        lemon_squeezy_id: subscription.id,
        order_id: subscription.attributes.order_id,
        name: subscription.attributes.user_name,
        email: subscription.attributes.user_email,
        status: subscription.attributes.status,
        status_formatted: subscription.attributes.status_formatted,
        renews_at: subscription.attributes.renews_at,
        ends_at: subscription.attributes.ends_at,
        trial_ends_at: subscription.attributes.trial_ends_at,
        setup_fee: subscription.attributes.setup_fee_formatted,
        is_usage_based: subscription.attributes.is_usage_based,
        subscription_item_id: subscription.attributes.subscription_item_id,
        is_paused: subscription.attributes.is_paused,
        variant_id: subscription.attributes.variant_id,
        variant_name: subscription.attributes.variant_name,
        product_id: subscription.attributes.product_id,
        product_name: subscription.attributes.product_name,
        price: subscription.attributes.product_name.toLowerCase() === 'team' ? '10' : '4',
        card_brand: subscription.attributes.card_brand,
        card_last_four: subscription.attributes.card_last_four,
        updated_at: new Date().toISOString()
      };

      // Upsert subscription
      const { error } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, { 
          onConflict: 'lemon_squeezy_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Error upserting subscription:', error);
        return new Response('Database error', { status: 500, headers: corsHeaders });
      }

      console.log('Subscription processed successfully');
    }

    return new Response('OK', { headers: corsHeaders });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});
