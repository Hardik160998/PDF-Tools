-- =============================================================
-- PDF-TOOL: Single-Table Credit System Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- 1. Modify the email column to allow NULLs (for guests)
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;

-- 2. Add the new guest and credit columns
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS guest_session_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS account_type varchar(20) DEFAULT 'guest',
  ADD COLUMN IF NOT EXISTS remaining_credits integer DEFAULT 10,
  ADD COLUMN IF NOT EXISTS used_credits integer DEFAULT 0;

-- 3. If you have existing users who had ecommerce_credits, migrate them:
UPDATE public.users 
  SET remaining_credits = ecommerce_credits
  WHERE remaining_credits = 10 AND ecommerce_credits IS NOT NULL;
