// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          }
        }
      }
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    // Get subscription ID from request body
    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return new Response('Missing subscription ID', { status: 400, headers: corsHeaders });
    }

    // Convert to string to ensure consistent type comparison
    const subscriptionIdStr = String(subscriptionId);

    // Verify the subscription belongs to the authenticated user
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('user_id, lemon_squeezy_id, status')
      .eq('lemon_squeezy_id', subscriptionIdStr)
      .single();

    if (subscriptionError || !subscription) {
      return new Response('Subscription not found', { status: 404, headers: corsHeaders });
    }

    if (subscription && subscription.user_id !== user.id) {
      return new Response('Forbidden: You do not have permission to cancel this subscription', { 
        status: 403, 
        headers: corsHeaders 
      });
    }

    // Get API key from environment
    const apiKey = Deno.env.get('LEMON_SQUEEZY_API_KEY');
    if (!apiKey) {
      return new Response('Missing API configuration', { status: 500, headers: corsHeaders });
    }

    // Call Lemon Squeezy API to cancel the subscription
    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response('Failed to cancel subscription', {
        status: response.status,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'An unexpected error occurred',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
