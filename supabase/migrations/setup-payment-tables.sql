-- SQL Migration: Setup Payment and Subscription Tables

-- 1. Add subscription columns to the existing users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS current_plan VARCHAR(50) DEFAULT 'Basic Plan',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS razorpay_customer_id VARCHAR(100);

-- 2. Create the payments table to track transactions
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(256),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL, -- created, captured, failed
    error_code VARCHAR(100),
    error_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the subscriptions table to track user membership logs
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id VARCHAR(100) NOT NULL,
    razorpay_subscription_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL, -- active, canceled, expired, pending
    current_start TIMESTAMPTZ NOT NULL,
    current_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes for quick queries
CREATE INDEX IF NOT EXISTS idx_users_razorpay_customer ON public.users(razorpay_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(razorpay_order_id);
