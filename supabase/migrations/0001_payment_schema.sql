-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  monthly_price_inr INTEGER NOT NULL,
  yearly_price_inr INTEGER NOT NULL,
  monthly_price_usd INTEGER NOT NULL,
  yearly_price_usd INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default tiers based on PRD
INSERT INTO subscription_tiers (id, name, monthly_price_inr, yearly_price_inr, monthly_price_usd, yearly_price_usd)
VALUES
  ('free', 'Free', 0, 0, 0, 0),
  ('starter', 'Starter', 199, 1999, 3, 30),
  ('pro', 'Pro', 499, 4999, 7, 70),
  ('pro_plus', 'Pro Plus', 999, 9999, 15, 150),
  ('enterprise', 'Enterprise', -1, -1, -1, -1)
ON CONFLICT (id) DO NOTHING;

-- Create tier_limits table
CREATE TABLE IF NOT EXISTS tier_limits (
  tier_id VARCHAR(50) REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  ai_requests_per_day INTEGER NOT NULL, -- -1 for unlimited
  storage_limit_mb INTEGER NOT NULL,    -- -1 for unlimited
  batch_limit INTEGER NOT NULL,
  PRIMARY KEY (tier_id)
);

-- Insert tier limits based on PRD
INSERT INTO tier_limits (tier_id, ai_requests_per_day, storage_limit_mb, batch_limit)
VALUES
  ('free', 1, 100, 1),
  ('starter', 5, 1024, 3),
  ('pro', 10, 10240, 15),
  ('pro_plus', -1, 51200, 100),
  ('enterprise', -1, -1, -1)
ON CONFLICT (tier_id) DO NOTHING;

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Assuming Supabase Auth is used and user_id references auth.users
  tier_id VARCHAR(50) REFERENCES subscription_tiers(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, past_due, canceled, trialing
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  gateway VARCHAR(50), -- razorpay, stripe
  gateway_subscription_id VARCHAR(255),
  gateway_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Create daily_usage table for tracking daily AI/tool limits
CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  ai_requests_used INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount_paid INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(50) NOT NULL, -- success, failed, pending
  gateway VARCHAR(50) NOT NULL,
  gateway_payment_id VARCHAR(255),
  gateway_order_id VARCHAR(255),
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
