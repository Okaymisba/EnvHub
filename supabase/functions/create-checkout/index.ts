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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { variantId, productName } = await req.json();

    const apiKey = Deno.env.get('LEMON_SQUEEZY_TEST_API_KEY');
    const storeId = Deno.env.get('LEMON_SQUEEZY_STORE_ID');

    if (!apiKey || !storeId) {
      return new Response('Missing API configuration', { status: 500, headers: corsHeaders });
    }

    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: user.email,
            name: user.user_metadata?.full_name || user.email,
          },
          product_options: {
            name: productName,
            description: `${productName} subscription for ${user.email}`,
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          expires_at: null,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId.toString(),
            },
          },
        },
      },
    };

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lemon Squeezy API error:', errorText);
      return new Response('Failed to create checkout', { status: 500, headers: corsHeaders });
    }

    const checkout = await response.json();
    console.log('Checkout created:', checkout);

    return new Response(JSON.stringify({ 
      checkoutUrl: checkout.data.attributes.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    return new Response('Internal server error', { status: 500, headers: corsHeaders });
  }
});
