-- Migration: Add eCommerce credits column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS ecommerce_credits INTEGER DEFAULT 10;

-- Update existing users to have 10 credits
UPDATE public.users 
SET ecommerce_credits = 10 
WHERE ecommerce_credits IS NULL;
