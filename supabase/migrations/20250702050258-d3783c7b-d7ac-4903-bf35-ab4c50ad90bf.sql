
-- Create subscriptions table to track user subscription status
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lemon_squeezy_id TEXT UNIQUE NOT NULL,
  order_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  status_formatted TEXT NOT NULL,
  renews_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  price TEXT NOT NULL,
  setup_fee TEXT,
  is_usage_based BOOLEAN DEFAULT FALSE,
  subscription_item_id INTEGER,
  is_paused BOOLEAN DEFAULT FALSE,
  variant_id INTEGER NOT NULL,
  variant_name TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  card_brand TEXT,
  card_last_four TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- System can insert subscriptions (for webhook)
CREATE POLICY "System can insert subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- System can update subscriptions (for webhook)
CREATE POLICY "System can update subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_lemon_squeezy_id ON public.subscriptions(lemon_squeezy_id);
