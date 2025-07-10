-- Add Stripe-related fields to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing')),
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id ON public.companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON public.companies(subscription_status);